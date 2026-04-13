import { Link } from "react-router-dom";

export default function KWBottomCTA() {
  return (
    <div className="w-full py-14 px-4" style={{ background: "#1a1a2e" }}>
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left */}
        <div>
          <h2 className="text-3xl font-black text-white mb-2">Ready to Get Started?</h2>
          <p className="text-gray-400 text-base">Post your task for free and receive offers from professionals</p>
        </div>
        {/* Right */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/kemework/post-task"
            className="px-7 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90"
            style={{ background: "#C41230" }}
          >
            Post a Task Free →
          </Link>
          <Link
            to="/kemework/register"
            className="px-7 py-3.5 rounded-xl font-bold text-sm border-2 border-white text-white transition-all hover:bg-white hover:text-gray-900"
          >
            Register as Professional
          </Link>
        </div>
      </div>
    </div>
  );
}