import { Link } from "react-router";

type SchoolBrandProps = {
  to?: string;
  compact?: boolean;
};

export function SchoolBrand({ to = "/", compact = false }: SchoolBrandProps) {
  const content = (
    <img
      src="/logo-school.jpeg"
      alt="Vhembe Rising Star Academy logo"
      className={compact ? "size-9 rounded-md border border-red-200 bg-white object-cover" : "size-20 rounded-md border border-red-200 bg-white object-cover shadow-sm"}
    />
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
