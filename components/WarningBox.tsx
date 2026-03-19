import { AlertTriangle } from "lucide-react";

interface WarningBoxProps {
  children: string;
}

export default function WarningBox({ children }: WarningBoxProps) {
  return (
    <div className="flex items-start gap-3 bg-warning/5 border-l-2 border-warning rounded-r-lg p-4">
      <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
      <p className="text-sm text-text-primary">{children}</p>
    </div>
  );
}
