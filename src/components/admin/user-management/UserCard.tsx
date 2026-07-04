import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserRound } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import type { UserRecord } from "./users-mock";

interface UserCardProps {
  user: UserRecord;
  onView: (user: UserRecord) => void;
  onEdit: (user: UserRecord) => void;
  onSuspend: (user: UserRecord) => void;
  onBan: (user: UserRecord) => void;
  onDelete: (user: UserRecord) => void;
}

export function UserCard({ user, onView, onEdit, onSuspend, onBan, onDelete }: UserCardProps) {
  return (
    <motion.div whileHover={{ y: -3, scale: 1.01 }} transition={{ duration: 0.2 }}>
      <Card className="border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(6,10,24,0.2)] backdrop-blur-xl">
        <CardContent className="space-y-4 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4AF37]/15 text-[#f6db84]">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-white">{user.username}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <StatusBadge status={user.status} />
          </div>

          <div className="flex flex-wrap gap-2">
            {user.verified ? <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-300">Verified</Badge> : <Badge variant="secondary">Pending review</Badge>}
            <Badge variant="outline">{user.role}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div>
              <p className="text-xs uppercase tracking-[0.2em]">Country</p>
              <p className="mt-1 font-medium text-white">{user.country}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em]">Followers</p>
              <p className="mt-1 font-medium text-white">{user.followers}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => onView(user)}>
              View
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onEdit(user)}>
              Edit
            </Button>
            <Button size="sm" variant="outline" onClick={() => onSuspend(user)}>
              Suspend
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="destructive" onClick={() => onBan(user)}>
              Ban
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(user)}>
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
