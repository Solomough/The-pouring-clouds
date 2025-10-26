import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import BackgroundMotion from '../components/BackgroundMotion'

export default function Landing() {
  return (
    <div className="relative flex flex-col justify-center items-center text-center min-h-screen text-white px-6">
      <BackgroundMotion />

      <img src="/logo.png" alt="Logo" className="w-20 mb-3" />

      <motion.h1
        className="text-3xl font-bold mb-2"
        animate={{ opacity: [0, 1], y: [20, 0] }}
      >
        Prayer Cloud
      </motion.h1>

      <p className="text-sm max-w-md mb-4">
        A youth movement shaping mindset and birthing manifestations.  
        Founded by <strong>Solomon Moughkaa Zahemen</strong>
      </p>

      <img src="/founder.png" alt="Founder" className="w-32 rounded-full border border-arkgold mb-6" />

      <Link to="/timer">
        <button className="bg-arkgold text-black font-semibold px-8 py-3 rounded-full">
          Start Prayer
        </button>
      </Link>
    </div>
  )
}
