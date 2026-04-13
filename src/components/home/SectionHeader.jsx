export default function SectionHeader({ title }) {
  return (
    <div className="flex flex-col items-center mb-8">
      <h2 className="text-2xl xl:text-3xl font-black text-gray-900">{title}</h2>
      <div className="mt-2 w-16 h-1 rounded-full bg-[#FF6B00]" />
    </div>
  );
}