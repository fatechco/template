const MOCK_PROJECTS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
    name: "New Cairo Heights",
    developer: "Emaar Misr",
    builtArea: "120–300 sqm",
    totalArea: "25 acres",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    name: "Marina Bay Towers",
    developer: "SODIC",
    builtArea: "80–250 sqm",
    totalArea: "12 acres",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1577415124269-fc1140a69e91?w=600&q=80",
    name: "Green Valley Compound",
    developer: "Palm Hills",
    builtArea: "200–500 sqm",
    totalArea: "40 acres",
  },
];

function ProjectCard({ project }) {
  return (
    <div
      className="flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB]"
      style={{ width: "72vw", maxWidth: 280 }}
    >
      <img src={project.image} alt={project.name} className="w-full object-cover" style={{ height: 160 }} />
      <div className="p-3">
        <p className="text-[#1F2937] font-black text-sm">{project.name}</p>
        <p className="text-[#6B7280] text-xs mt-0.5">{project.developer}</p>
        <div className="flex gap-2 mt-2">
          <span className="text-[10px] font-semibold bg-orange-50 text-[#FF6B00] px-2 py-0.5 rounded-full border border-orange-100">
            Built: {project.builtArea}
          </span>
          <span className="text-[10px] font-semibold bg-gray-50 text-[#6B7280] px-2 py-0.5 rounded-full border border-[#E5E7EB]">
            {project.totalArea}
          </span>
        </div>
        <button
          className="w-full mt-3 bg-[#FF6B00] text-white font-black text-xs rounded-xl flex items-center justify-center"
          style={{ minHeight: 36 }}
        >
          DETAILS
        </button>
      </div>
    </div>
  );
}

export default function MobileFeaturedProjects() {
  return (
    <div className="mb-6">
      <div className="px-4 flex items-center justify-between mb-3">
        <span className="text-[#1F2937] font-black text-base">Featured Projects</span>
        <button className="text-[#FF6B00] text-sm font-semibold">View All →</button>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
        {MOCK_PROJECTS.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}