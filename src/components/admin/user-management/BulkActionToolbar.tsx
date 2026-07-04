import { Button } from "@/components/ui/button";

interface BulkActionToolbarProps {
  selectedCount: number;
  onBan?: () => void;
  onSuspend?: () => void;
  onVerify?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
  verifyLabel?: string;
}

export function BulkActionToolbar({ selectedCount, onBan, onSuspend, onVerify, onDelete, onExport, verifyLabel = "Verify" }: BulkActionToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="outline" onClick={onBan} disabled={selectedCount === 0}>
        Ban
      </Button>
      <Button size="sm" variant="outline" onClick={onSuspend} disabled={selectedCount === 0}>
        Suspend
      </Button>
      <Button size="sm" variant="outline" onClick={onVerify} disabled={selectedCount === 0}>
        {verifyLabel}
      </Button>
      <Button size="sm" variant="outline" onClick={onDelete} disabled={selectedCount === 0}>
        Delete
      </Button>
      <Button size="sm" variant="ghost" onClick={onExport} disabled={selectedCount === 0}>
        Export
      </Button>
      <div className="ml-2 text-sm text-muted-foreground">{selectedCount} selected</div>
    </div>
  );
}
