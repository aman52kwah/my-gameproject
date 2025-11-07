import React, { useState, useRef } from 'react'
import { Star, Circle, Heart, Apple, Fish,Square } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function App() {
  const [currentNumber, setCurrentNumber] = useState(1)
  const [clickedCount, setClickedCount] = useState(0)
  const [celebrating, setCelebrating] = useState(false)
  const [clickedItems, setClickedItems] = useState<number[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)

  const shapes = [
    { icon: Star, color: 'text-yellow-400', name: 'star' },
    { icon: Heart, color: 'text-red-400', name: 'heart' },
    { icon: Circle, color: 'text-blue-400', name: 'circle' },
    { icon: Apple, color: 'text-green-400', name: 'apple' },
    { icon: Fish, color: 'text-purple-400', name: 'fish' },
    {icon: Square,color: 'text-orange-400', name:'square'}
  ]

  const currentShape = shapes[currentNumber - 1]
  const ShapeIcon = currentShape.icon

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.AudioContext)()
      audioContextRef.current.resume()
    }
  }

  const playSound = (freq: number, dur: number = 0.1) => {
    initAudio()
    const ctx = audioContextRef.current
    if (!ctx) return
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g)
    g.connect(ctx.destination)
    o.frequency.value = freq
    o.type = 'sine'
    g.gain.setValueAtTime(0.4, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur)
    o.start()
    o.stop(ctx.currentTime + dur)
  }

  const triggerConfetti = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
    confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } })
    confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } })
  }

  const handleClick = (i:any) => {
    if (clickedItems.includes(i)) return
    initAudio()
    playSound(400 + clickedCount * 150, 0.15)

    const newClicked = [...clickedItems, i]
    setClickedItems(newClicked)
    setClickedCount(newClicked.length)

    if (newClicked.length === currentNumber) {
      setTimeout(() => {
        playSound(523, 0.2); playSound(659, 0.2); playSound(784, 0.2); playSound(1047, 0.4)
        triggerConfetti()
      }, 100)
      setCelebrating(true)
      setTimeout(() => {
        setCelebrating(false)
        if (currentNumber < 5) {
          setCurrentNumber(n => n + 1)
          setClickedItems([])
          setClickedCount(0)
        } else {
          setTimeout(() => {
            triggerConfetti()
            setTimeout(() => {
              setCurrentNumber(1)
              setClickedItems([])
              setClickedCount(0)
            }, 1000)
          }, 1000)
        }
      }, 2500)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 flex items-center justify-center p-4"
         onTouchStart={initAudio}>
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-center text-6xl font-bold text-purple-600 mb-6">Let's Count!</h1>
        
        <div className="text-center mb-8">
          <div className="inline-block bg-yellow-200 rounded-3xl p-6 shadow-lg">
            <p className="text-9xl font-bold text-orange-500">{currentNumber}</p>
          </div>
        </div>

        {!celebrating ? (
          <p className="text-center text-4xl font-bold text-gray-800 mb-8">
            Tap {currentNumber} {currentShape.name}{currentNumber > 1 ? 's' : ''}!
          </p>
        ) : (
          <p className="text-center text-6xl font-bold text-green-500 animate-bounce mb-8">
            Great Job!
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-10">
          {Array.from({ length: currentNumber }, (_, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              className={`aspect-square rounded-3xl flex items-center justify-center text-8xl transition-all active:scale-90
                ${clickedItems.includes(i) 
                  ? 'bg-green-200' 
                  : 'bg-gray-100 shadow-2xl hover:shadow-xl'
                }`}
            >
              <ShapeIcon
              size={180} 
              className={`${currentShape.color} drop-shadow-2xl`} fill="currentColor" />
              {clickedItems.includes(i) && ''}
            </button>
          ))}
        </div>
            {/* Progress Dots */}
        <div className="flex justify-center gap-4">
          {[1,2,3,4,5].map(n => (
            <div key={n} className={`w-12 h-12 rounded-full transition-all
              ${n < currentNumber ? 'bg-green-500' : 
                n === currentNumber ? 'bg-purple-600 scale-125 animate-pulse' : 
                'bg-gray-300'}`} />
          ))}
        </div>

        <div className="text-center mt-10">
          <button onClick={() => { setCurrentNumber(1); setClickedItems([]); setClickedCount(0); setCelebrating(false) }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-6 rounded-full text-3xl font-bold shadow-2xl active:scale-95">
            Start Over
          </button>
        </div>
      </div>
    </div>
  )
}