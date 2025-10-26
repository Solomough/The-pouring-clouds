import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackgroundMotion from '../components/BackgroundMotion'

export default function InsightForm() {
  const navigate = useNavigate()
  const [input, setInput] = useState("")
  const [dream, setDream] = useState("")

  const phone = "2347076560169"

  const handleSend = () => {
    const message = encodeURIComponent(
      `Prayer Insight:\n${input}\n\nFuture Desire:\n${dream}\n\n#PrayerCloud`
    )
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank")
    navigate('/success')
  }

  return (
    <div className="min-h-screen p-6 text-white">
      <BackgroundMotion />
      <h2 className="font-bold text-lg mb-4">Write what you received</h2>

      <textarea className="w-full bg-black/40 border border-arkgold p-3 mb-4"
        rows="4" placeholder="Insight..."
        onChange={e => setInput(e.target.value)} />

      <textarea className="w-full bg-black/40 border border-arkgold p-3 mb-4"
        rows="3" placeholder="Where will you be in a few months..."
        onChange={e => setDream(e.target.value)} />

      <button onClick={handleSend}
        className="bg-arkgold text-black w-full py-3 rounded-full">
        Send to Founder
      </button>
    </div>
  )
}
