import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BackgroundMotion from '../components/BackgroundMotion'

export default function Timer() {
  const [time, setTime] = useState(15 * 60)
  const navigate = useNavigate()

  useEffect(() => {
    if (time <= 0) {
      navigate('/scripture')
    }
    const interval = setInterval(() => setTime(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [time])

  const format = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="flex justify-center items-center text-white min-h-screen">
      <BackgroundMotion />
      <div className="text-6xl font-bold">{format(time)}</div>
    </div>
  )
}
