import React, { useState, useRef } from 'react'
import {
  Star,
  Circle,
  Heart,
  Apple,
  Fish,
  Square,
  Banana,
  Cat,
  Dog,
  Bird,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function App() {
  const [n, setN] = useState<number>(1);
  const [clicked, setClicked] = useState<number[]>([]);
  const [celebrate, setCelebrate] = useState<boolean>(false);
  const audio = useRef<AudioContext | null>(null);

  const shapes = [
    { icon: Star, color: "text-yellow-400", name: "star" },
    { icon: Heart, color: "text-red-400", name: "heart" },
    { icon: Circle, color: "text-blue-400", name: "circle" },
    { icon: Apple, color: "text-green-400", name: "apple" },
    { icon: Fish, color: "text-purple-400", name: "fish" },
    { icon: Square, color: "text-orange-400", name: "square" },
    { icon: Banana, color: "text-yellow-400", name: "banana" },
    { icon: Cat, color: "text-pink-400", name: "cat" },
    { icon: Dog, color: "text-white-400", name: "dog" },
    { icon: Bird, color: "text-blue-300", name: "bird" },
  ];

  const current = shapes[n - 1];
  const Icon = current.icon;

  const initAudio = () => {
    if (!audio.current) {
      audio.current = new (window.AudioContext || window.AudioContext)();
      audio.current.resume();
    }
  };

  const speak = (text: any) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      utterance.volume = 1;
      utterance.lang = "en-US";

      // Try to get a fun kid voice
      const voices = window.speechSynthesis.getVoices();
      const kidVoice = voices.find(
        (v) =>
          v.name.includes("Google") ||
          v.name.includes("Karen") ||
          v.name.includes("Moira")
      );
      if (kidVoice) utterance.voice = kidVoice;

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const beep = (freq = 600, dur = 0.1) => {
    initAudio();
    if (!audio.current) return;
    const o = audio.current.createOscillator();
    const g = audio.current.createGain();
    o.connect(g);
    g.connect(audio.current.destination);
    o.frequency.value = freq;
    o.type = "sine";
    g.gain.setValueAtTime(0.3, audio.current.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, audio.current.currentTime + dur);
    o.start();
    o.stop(audio.current.currentTime + dur);
  };

  const win = () => {
    [523, 659, 784, 1047].forEach((f, i) =>
      setTimeout(() => beep(f, 0.2), i * 100)
    );
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 } });

    // VOICE SAYS THE WIN!
    setTimeout(() => {
      speak(`Great job! You counted ${n} ${current.name}${n > 1 ? "s" : ""}!`);
    }, 500);
  };

  const tap = (i: any) => {
    if (clicked.includes(i)) return;
    beep(400 + clicked.length * 150);
    const newClicked = [...clicked, i];
    setClicked(newClicked);

    if (newClicked.length === n) {
      setTimeout(win, 200);
      setCelebrate(true);

      // VOICE SAYS THE NUMBER WHEN STARTING NEW LEVEL
      setTimeout(() => {
        setCelebrate(false);
        if (n < 10) {
          const next = n + 1;
          setN(next);
          setClicked([]);
          speak(`${next} ${shapes[next - 1].name}${next > 1 ? "s" : ""}`);
        } else {
          speak("You finished all levels! You're a counting superstar!");
          setTimeout(() => {
            confetti({ particleCount: 300, spread: 200 });
            setTimeout(() => {
              setN(1);
              setClicked([]);
              speak("Let's count again! One star!");
            }, 1500);
          }, 2000);
        }
      }, 3000);
    }
  };

  // Say the first number when app loads
  React.useEffect(() => {
    setTimeout(() => speak(`Let's count! Click one ${current.name}`), 1000);
  }, []);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 flex items-center justify-center p-4"
      onTouchStart={initAudio}
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-center text-6xl font-bold text-purple-600 mb-6">
          Let's Count!
        </h1>

        <div className="text-center mb-8">
          <div className="inline-block bg-yellow-200 rounded-3xl p-6 shadow-lg animate-pulse">
            <p className="text-9xl font-bold text-orange-500">{n}</p>
          </div>
        </div>

        {!celebrate ? (
          <p className="text-center text-4xl font-bold text-gray-800 mb-8">
            Tap {n} {current.name}
            {n > 1 ? "s" : ""}!
          </p>
        ) : (
          <p className="text-center text-6xl font-bold text-green-500 animate-bounce mb-8">
            Great Job!
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-10">
          {Array.from({ length: n }, (_, i) => (
            <button
              key={i}
              onClick={() => tap(i)}
              className={`aspect-square rounded-3xl flex items-center justify-center transition-all active:scale-90 relative
                ${
                  clicked.includes(i)
                    ? "bg-green-200"
                    : "bg-gray-100 shadow-2xl hover:shadow-xl"
                }`}
            >
              <Icon
                size={80}
                className={`${current.color} drop-shadow-2xl`}
                fill="currentColor"
              />
              {clicked.includes(i) && (
                <span className="absolute text-6xl text-green-600 font-bold"></span>
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((x) => (
            <div
              key={x}
              className={`w-12 h-12 rounded-full transition-all shadow-lg
              ${
                x < n
                  ? "bg-green-500"
                  : x === n
                  ? "bg-purple-600 scale-125 animate-pulse"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              setN(1);
              setClicked([]);
              setCelebrate(false);
              speak("Let's start again! One star!");
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-6 rounded-full text-3xl font-bold shadow-2xl active:scale-95 hover:shadow-xl"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}