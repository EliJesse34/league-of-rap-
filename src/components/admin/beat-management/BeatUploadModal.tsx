import { useEffect, useState, type ChangeEvent, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud } from "lucide-react";

interface BeatUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: Record<string, string>) => void;
}

export function BeatUploadModal({ open, onOpenChange, onSubmit }: BeatUploadModalProps) {
  const [progress, setProgress] = useState(0);
  const [coverName, setCoverName] = useState("");
  const [beatName, setBeatName] = useState("");
  const [payload, setPayload] = useState({
    title: "",
    producer: "",
    description: "",
    genre: "Boom Bap",
    mood: "Energetic",
    bpm: "95",
    key: "Am",
    tags: "",
    license: "Exclusive",
    price: "24",
    priceType: "Premium",
  });

  useEffect(() => {
    if (!open) return;
    const interval = window.setInterval(() => {
      setProgress((value) => (value >= 100 ? 100 : value + 14));
    }, 140);
    return () => window.clearInterval(interval);
  }, [open]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, type: "cover" | "beat") => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (type === "cover") setCoverName(file.name);
    else setBeatName(file.name);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, type: "cover" | "beat") => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    if (type === "cover") setCoverName(file.name);
    else setBeatName(file.name);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-white/10 bg-[#050816]/95 text-white backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Upload a new beat</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Beat title</Label>
              <Input value={payload.title} onChange={(event) => setPayload((current) => ({ ...current, title: event.target.value }))} placeholder="Golden Hour" />
            </div>
            <div className="space-y-2">
              <Label>Producer</Label>
              <Input value={payload.producer} onChange={(event) => setPayload((current) => ({ ...current, producer: event.target.value }))} placeholder="Mina Kade" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={payload.description} onChange={(event) => setPayload((current) => ({ ...current, description: event.target.value }))} placeholder="Describe the beat, the intent, and any special production notes." />
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Genre</Label>
              <Select value={payload.genre} onValueChange={(value) => setPayload((current) => ({ ...current, genre: value }))}>
                <SelectTrigger className="border-white/10 bg-white/5 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Boom Bap">Boom Bap</SelectItem>
                  <SelectItem value="Trap">Trap</SelectItem>
                  <SelectItem value="Plugg">Plugg</SelectItem>
                  <SelectItem value="Lofi">Lofi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Mood</Label>
              <Input value={payload.mood} onChange={(event) => setPayload((current) => ({ ...current, mood: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>BPM</Label>
              <Input value={payload.bpm} onChange={(event) => setPayload((current) => ({ ...current, bpm: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Key</Label>
              <Input value={payload.key} onChange={(event) => setPayload((current) => ({ ...current, key: event.target.value }))} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Tags</Label>
              <Input value={payload.tags} onChange={(event) => setPayload((current) => ({ ...current, tags: event.target.value }))} placeholder="dark, rap, loop" />
            </div>
            <div className="space-y-2">
              <Label>License</Label>
              <Input value={payload.license} onChange={(event) => setPayload((current) => ({ ...current, license: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Price</Label>
              <Input value={payload.price} onChange={(event) => setPayload((current) => ({ ...current, price: event.target.value }))} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Cover image</Label>
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-3" onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, "cover")}>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UploadCloud className="h-4 w-4 text-[#f6db84]" />
                  Drag and drop or select a cover image
                </div>
                <Input type="file" className="mt-3" accept="image/*" onChange={(event) => handleFileChange(event, "cover")} />
                {coverName ? <p className="mt-2 text-sm text-white">Selected: {coverName}</p> : null}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Preview audio / full beat</Label>
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-3" onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, "beat")}>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UploadCloud className="h-4 w-4 text-[#f6db84]" />
                  Drag and drop or select uploaded audio
                </div>
                <Input type="file" className="mt-3" accept="audio/*" onChange={(event) => handleFileChange(event, "beat")} />
                {beatName ? <p className="mt-2 text-sm text-white">Selected: {beatName}</p> : null}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Upload progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => { onSubmit(payload); onOpenChange(false); }}>
            Publish beat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
