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
      className={compact ? "w-12 h-12 rounded-md object-cover" : "w-20 h-20 rounded-md object-cover"}
    />
  );

  if (!to) {
    return <div>{content}</div>;
  }

  return (
    <Link to={to}>{content}</Link>
  );
}
