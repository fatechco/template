// @ts-nocheck
import AccountMenuItem from "./AccountMenuItem";

export default function AccountMenuSection({ title, items }) {
  return (
    <div className="mb-4">
      <p className="px-4 text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-2">
        {title}
      </p>
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden divide-y divide-[#F3F4F6]">
        {items.map((item, i) => (
          <AccountMenuItem key={i} {...item} />
        ))}
      </div>
    </div>
  );
}