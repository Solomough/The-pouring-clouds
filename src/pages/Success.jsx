import BackgroundMotion from "../components/BackgroundMotion";
import { copyToClipboard } from "../utils/clipboard";

export default function Success() {
  const inviteLink = window.location.origin;
  const inviteText = `Join me on The Ark Network Prayer Cloud — let us pray and grow together: ${inviteLink}`;

  const handleInvite = async () => {
    const ok = await copyToClipboard(inviteText);
    if (ok) {
      alert("Invite copied to clipboard. Paste wherever you want to share.");
    } else {
      alert("Copy failed. Please share this link: " + inviteLink);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center text-white min-h-screen text-center p-5">
      <BackgroundMotion />
      <h2 className="text-xl font-bold mb-4">Submission saved</h2>
      <p className="mb-6">Your insight was received. Thank you for praying with focus.</p>

      <button onClick={handleInvite} className="bg-arkgold text-black px-6 py-3 rounded-full mb-3">
        Copy Invite Link
      </button>

      <a href="/" className="text-sm underline mt-2">
        Back to Landing
      </a>
    </div>
  );
}
