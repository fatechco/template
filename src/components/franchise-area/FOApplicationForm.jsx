const APPLY_URL = "https://kemodoo.com/register-franchise-owner-area";

export default function FOApplicationForm() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[700px] mx-auto px-4">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-10 text-center">
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Ready to Apply?</h2>
          <p className="text-gray-500 text-base mb-8 max-w-md mx-auto">
            Click the button below to go to our official franchise registration page and complete your application in minutes.
          </p>
          <a
            href={APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full bg-[#FF6B00] hover:bg-[#e55f00] text-white font-black py-4 rounded-xl text-base transition-all shadow-lg shadow-orange-200 hover:scale-[1.01] text-center"
          >
            Register as Franchise Owner →
          </a>
          <p className="text-xs text-gray-400 italic mt-4">
            You will be redirected to kemodoo.com — Kemedar's official franchise management portal.
          </p>
        </div>
      </div>
    </section>
  );
}