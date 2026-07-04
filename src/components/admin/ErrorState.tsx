import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  title?: string;
  description?: string;
}

export function ErrorState({ title = "Something went wrong", description = "The admin view could not be loaded." }: ErrorStateProps) {
  return (
    <Card className="border border-red-500/20 bg-red-500/10">
      <CardContent className="flex flex-col items-start gap-3 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 text-red-400">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
