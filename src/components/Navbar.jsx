import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 w-full flex justify-between items-center px-4 py-3 z-50 bg-transparent text-white">
      <Link to="/">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-10 opacity-80 hover:opacity-100 transition"
        />
      </Link>

      <nav className="flex gap-4 text-sm">
        <Link to="/" className="hover:text-arkgold transition">
          Home
        </Link>
        <Link to="/timer" className="hover:text-arkgold transition">
          Pray
        </Link>
      </nav>
    </div>
  );
}
