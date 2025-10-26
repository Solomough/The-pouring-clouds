import { motion } from 'framer-motion'

export default function BackgroundMotion() {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-950 via-black to-arkgold">
      <motion.div
        className="absolute w-[120%] h-[120%] bg-arkgold opacity-20 blur-3xl"
        animate={{
          x: [0, 200, -200, 0],
          y: [0, -200, 200, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  )
}
