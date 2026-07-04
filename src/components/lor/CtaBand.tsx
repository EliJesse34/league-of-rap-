import { UserPlus, DollarSign, UploadCloud, Banknote } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "CREATE ACCOUNT", body: "Sign up and join the League of Rap community" },
  { icon: DollarSign, title: "CHOOSE PLAN", body: "Select a plan that fits your needs" },
  { icon: UploadCloud, title: "UPLOAD VIDEOS", body: "Upload your videos and reach your audience" },
  { icon: Banknote, title: "GET PAID", body: "Monetize your content and earn from your views" },
];

export function CtaBand() {
  return (
    <section className="lor-card grid grid-cols-1 gap-px overflow-hidden bg-border sm:grid-cols-2 lg:grid-cols-4">
      {steps.map(({ icon: Icon, title, body }) => (
        <div key={title} className="flex items-start gap-3 bg-card p-5 transition-colors hover:bg-surface">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-primary/40 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="lor-display text-sm">{title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{body}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
