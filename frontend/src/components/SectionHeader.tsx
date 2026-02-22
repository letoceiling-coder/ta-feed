import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  highlight?: string;
  actions?: React.ReactNode;
}

const SectionHeader = ({ title, highlight, actions }: SectionHeaderProps) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-bold text-foreground flex items-center gap-1.5">
      {title}
      {highlight && (
        <>
          {" "}
          <span className="text-primary">{highlight}</span>
          <ChevronRight size={20} className="text-primary" />
        </>
      )}
    </h2>
    {actions && <div className="flex items-center gap-3">{actions}</div>}
  </div>
);

export default SectionHeader;
