import { Link } from "react-router-dom";

const TRACK1_STEPS = [
  {
    num: 1,
    icon: "📋",
    title: "Post Your Task",
    desc: "Begin by detailing your task on Kemework. Provide a clear description of what you need, including specific requirements, your location, budget range and desired timeline. Upload images or documents to help professionals understand your needs better. The more detail you provide, the more accurate the offers you'll receive from qualified professionals.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=70",
  },
  {
    num: 2,
    icon: "📬",
    title: "Receive Offers from Professionals",
    desc: "Once your task is live, qualified professionals who specialize in your required service area will submit competitive bids. Each offer includes their proposed price, estimated timeline, approach to the task and their professional profile with portfolio and reviews.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=70",
  },
  {
    num: 3,
    icon: "✅",
    title: "Review and Select the Best Offer",
    desc: "Take your time to evaluate the offers received. Review each professional's profile, portfolio and client reviews. You can communicate directly with professionals to ask questions before making your final decision.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=70",
  },
  {
    num: 4,
    icon: "🤝",
    title: "Assign the Task to Your Professional",
    desc: "Once you've made your choice, officially assign the task to your selected professional. Agree on the final terms, timeline and payment method. All financial transactions occur directly between you and the professional — Kemedar does not interfere.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=70",
  },
  {
    num: 5,
    icon: "⭐",
    title: "Task Delivery and Client Review",
    desc: "After the professional completes the work, they deliver the task to you for review. Inspect the work, provide feedback and once satisfied, mark the task as complete. Share your experience by leaving a review to help the Kemework community.",
    image: "https://images.unsplash.com/photo-1560472355-536de3962603?w=600&q=70",
  },
];

const TRACK2_STEPS = [
  {
    num: 1,
    icon: "📝",
    title: "Initiation and Service Agreement",
    desc: "Contact Kemedar to initiate your task. Our specialist team reviews your requirements, conducts a site assessment if needed and prepares a detailed service proposal. All terms, timelines and costs are agreed upon before any work begins.",
  },
  {
    num: 2,
    icon: "👷",
    title: "Execution by Certified Experts",
    desc: "Kemedar assigns your task exclusively to certified professionals from our Preferred Professional network — professionals who have undergone rigorous screening, interviews and background verification.",
  },
  {
    num: 3,
    icon: "🔍",
    title: "Quality Supervision by Engineers",
    desc: "Kemedar's certified consulting engineers supervise and oversee all work at every stage of execution. Regular quality checkpoints ensure the work meets our high standards before delivery.",
  },
  {
    num: 4,
    icon: "💰",
    title: "Clear and Transparent Billing",
    desc: "All financial transactions occur directly between you and Kemedar. You receive detailed invoices, payment receipts and full transparency on all costs. No hidden fees, no surprises.",
  },
  {
    num: 5,
    icon: "✅",
    title: "Formal Delivery and Completion",
    desc: "Task is formally delivered according to the agreed supply contract. A Kemedar representative handles the official handover process and ensures your complete satisfaction before closing the order.",
  },
];

export default function KemeworkHowItWorks() {
  return (
    <div>
      {/* HERO */}
      <div
        className="w-full flex items-center justify-center text-center py-20 px-4"
        style={{ background: "linear-gradient(135deg, #C41230 0%, #8B0000 100%)" }}
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">How Kemework Works?</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto leading-relaxed">
            Simple, transparent and efficient — two ways to get your task done
          </p>
        </div>
      </div>

      {/* TRACK 1 */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-white mb-4" style={{ background: "#C41230" }}>Track 1</span>
            <h2 className="text-3xl font-black text-gray-900 mb-2">You Choose Your Professional</h2>
            <p className="text-gray-500 text-sm">Task Cycle: Customer → Task → Professional</p>
          </div>

          <div className="flex flex-col gap-16">
            {TRACK1_STEPS.map((step) => {
              const isOdd = step.num % 2 !== 0;
              return (
                <div
                  key={step.num}
                  className={`flex flex-col md:flex-row items-center gap-10 ${!isOdd ? "md:flex-row-reverse" : ""}`}
                >
                  {/* Image */}
                  <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-md aspect-video">
                    <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                  </div>
                  {/* Text */}
                  <div className="w-full md:w-1/2">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md flex-shrink-0" style={{ background: "#C41230" }}>
                        {step.icon}
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#C41230" }}>Step {step.num}</p>
                        <h3 className="text-xl font-black text-gray-900">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TRACK 2 */}
      <div className="py-16 px-4" style={{ background: "#F8F5F0" }}>
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4" style={{ background: "#D4A017", color: "#1a1a2e" }}>Track 2</span>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Let Kemedar Handle Everything</h2>
            <p className="text-gray-500 text-sm">Task Cycle: Customer → Task → Kemedar → Professional</p>
          </div>

          {/* Vertical timeline */}
          <div className="relative">
            <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-amber-200" />
            <div className="flex flex-col gap-10">
              {TRACK2_STEPS.map((step) => (
                <div key={step.num} className="relative flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md flex-shrink-0 z-10 border-4 border-white" style={{ background: "#D4A017" }}>
                    {step.icon}
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100 flex-1">
                    <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "#D4A017" }}>Step {step.num}</p>
                    <h3 className="text-base font-black text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="py-14 px-4" style={{ background: "#1a1a2e" }}>
        <div className="max-w-[700px] mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-8">Which track is right for you?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/kemework/post-task"
              className="px-8 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90"
              style={{ background: "#C41230" }}
            >
              Post a Task — Track 1
            </Link>
            <Link
              to="/kemework/contact"
              className="px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
              style={{ background: "#D4A017", color: "#1a1a2e" }}
            >
              Assign to Kemedar — Track 2
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}