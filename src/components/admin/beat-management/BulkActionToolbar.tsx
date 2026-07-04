import { Button } from "@/components/ui/button";

interface BulkActionToolbarProps {
  selectedCount: number;
  onFeature?: () => void;
  onHide?: () => void;
  onArchive?: () => void;
  onExport?: () => void;
}

export function BulkActionToolbar({ selectedCount, onFeature, onHide, onArchive, onExport }: BulkActionToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="outline" onClick={onFeature} disabled={selectedCount === 0}>
        Feature
      </Button>
      <Button size="sm" variant="outline" onClick={onHide} disabled={selectedCount === 0}>
        Hide
      </Button>
      <Button size="sm" variant="outline" onClick={onArchive} disabled={selectedCount === 0}>
        Archive
      </Button>
      <Button size="sm" variant="ghost" onClick={onExport} disabled={selectedCount === 0}>
        Export
      </Button>
      <div className="ml-2 text-sm text-muted-foreground">{selectedCount} selected</div>
    </div>
  );
}
