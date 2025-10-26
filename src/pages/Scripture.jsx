import { Link } from 'react-router-dom'
import { scriptures } from '../data/scriptures'
import BackgroundMotion from '../components/BackgroundMotion'

export default function Scripture() {
  return (
    <div className="flex flex-col justify-center items-center px-5 text-white min-h-screen text-center">
      <BackgroundMotion />
      <h2 className="text-xl font-bold mb-6">Meditate on this</h2>

      <p className="mb-8 max-w-md text-arkgold">{scriptures[Math.floor(Math.random() * scriptures.length)]}</p>

      <Link to="/insight">
        <button className="bg-arkgold text-black px-6 py-3 rounded-full">Continue</button>
      </Link>
    </div>
  )
}
