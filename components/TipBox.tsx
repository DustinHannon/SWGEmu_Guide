import { Lightbulb } from "lucide-react";

interface TipBoxProps {
  children: string;
}

export default function TipBox({ children }: TipBoxProps) {
  return (
    <div className="flex items-start gap-3 bg-success/5 border-l-2 border-success rounded-r-lg p-4">
      <Lightbulb className="w-5 h-5 text-success shrink-0 mt-0.5" />
      <p className="text-sm text-text-primary">{children}</p>
    </div>
  );
}
