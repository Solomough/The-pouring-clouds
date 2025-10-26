import BackgroundMotion from '../components/BackgroundMotion'

export default function Success() {
  const inviteLink = window.location.origin

  const handleInvite = () => {
    const msg = encodeURIComponent("Join me on Prayer Cloud. Let us pray and grow together: " + inviteLink)
    window.open(`https://wa.me/?text=${msg}`, "_blank")
  }

  return (
    <div className="flex flex-col justify-center items-center text-white min-h-screen text-center p-5">
      <BackgroundMotion />
      <h2 className="text-xl font-bold mb-4">Submission sent</h2>
      <p className="mb-6">You are part of the movement. Share the fire.</p>

      <button onClick={handleInvite}
        className="bg-arkgold text-black px-6 py-3 rounded-full">
        Invite Someone to Pray
      </button>
    </div>
  )
}
