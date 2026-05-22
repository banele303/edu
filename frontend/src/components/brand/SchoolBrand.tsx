import { Link } from "react-router";

type SchoolBrandProps = {
  to?: string;
  compact?: boolean;
};

export function SchoolBrand({ to = "/", compact = false }: SchoolBrandProps) {
  const content = (
    <>
      <img
        src="/logo-school.jpeg"
        alt="Vhembe Rising Star Academy logo"
        className={compact ? "size-9 rounded-md border border-red-200 bg-white object-cover" : "size-11 rounded-md border border-red-200 bg-white object-cover shadow-sm"}
      />
      <span className={compact ? "font-bold text-gray-950" : "text-lg sm:text-xl font-black tracking-normal text-gray-950"}>
        Vhembe <span className="text-[#dc2626]">Rising Star</span> Academy
      </span>
    </>
  );

  if (!to) {
    return <div className="flex items-center gap-3">{content}</div>;
  }

  return (
    <Link to={to} className="flex items-center gap-3">
      {content}
    </Link>
  );
}
