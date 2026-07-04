import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Ban, Eye, PencilLine, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { UserCard } from "./UserCard";
import { UserProfileDrawer } from "./UserProfileDrawer";
import type { UserRecord } from "./users-mock";

interface UserTableProps {
  items: UserRecord[];
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onSelectAll: (checked: boolean) => void;
  onViewUser: (user: UserRecord) => void;
  onEditUser: (user: UserRecord) => void;
  onSuspendUser: (user: UserRecord) => void;
  onBanUser: (user: UserRecord) => void;
  onVerifyUser: (user: UserRecord) => void;
  onResetPassword: (user: UserRecord) => void;
  onDeleteUser: (user: UserRecord) => void;
}

export function UserTable({ items, selectedIds, onToggleSelect, onSelectAll, onViewUser, onEditUser, onSuspendUser, onBanUser, onVerifyUser, onResetPassword, onDeleteUser }: UserTableProps) {
  const [drawerUser, setDrawerUser] = useState<UserRecord | null>(null);

  return (
    <>
      <div className="hidden lg:block">
        <Card className="border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(6,10,24,0.2)] backdrop-blur-xl">
          <CardContent className="overflow-auto p-0">
            <table className="w-full min-w-[1100px] table-auto">
              <thead className="sticky top-0 bg-[#050816]/90 backdrop-blur-xl">
                <tr className="text-left text-sm text-muted-foreground">
                  <th className="p-3">
                    <Checkbox checked={items.length > 0 && items.every((item) => selectedIds.includes(item.id))} onCheckedChange={(checked) => onSelectAll(Boolean(checked))} />
                  </th>
                  <th className="p-3">Avatar</th>
                  <th className="p-3">Username</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Country</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Joined</th>
                  <th className="p-3">Uploads</th>
                  <th className="p-3">Followers</th>
                  <th className="p-3">Verification</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Last Active</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((user) => (
                  <tr key={user.id} className="border-t border-white/10 bg-white/[0.01]">
                    <td className="p-3">
                      <Checkbox checked={selectedIds.includes(user.id)} onCheckedChange={() => onToggleSelect(user.id)} />
                    </td>
                    <td className="p-3">
                      <Avatar className="h-10 w-10 border border-white/10">
                        <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-white">{user.username}</div>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{user.email}</td>
                    <td className="p-3 text-sm">{user.country}</td>
                    <td className="p-3 text-sm">{user.role}</td>
                    <td className="p-3 text-sm">{user.joined}</td>
                    <td className="p-3 text-sm">{user.uploads}</td>
                    <td className="p-3 text-sm">{user.followers}</td>
                    <td className="p-3">
                      {user.verified ? <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-300">Verified</Badge> : <Badge variant="secondary">Pending</Badge>}
                    </td>
                    <td className="p-3"><StatusBadge status={user.status} /></td>
                    <td className="p-3 text-sm text-muted-foreground">{user.lastActive}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setDrawerUser(user)}>
                          <Eye className="mr-1 h-3.5 w-3.5" /> View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onEditUser(user)}>
                          <PencilLine className="mr-1 h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onSuspendUser(user)}>
                          <ShieldAlert className="mr-1 h-3.5 w-3.5" /> Suspend
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onBanUser(user)}>
                          <Ban className="mr-1 h-3.5 w-3.5" /> Ban
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onVerifyUser(user)}>
                          <ShieldCheck className="mr-1 h-3.5 w-3.5" /> {user.verified ? "Unverify" : "Verify"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onResetPassword(user)}>
                          Reset
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => onDeleteUser(user)}>
                          <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3 lg:hidden">
        {items.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onView={() => setDrawerUser(user)}
            onEdit={onEditUser}
            onSuspend={onSuspendUser}
            onBan={onBanUser}
            onDelete={onDeleteUser}
          />
        ))}
      </div>

      <UserProfileDrawer open={Boolean(drawerUser)} onClose={() => setDrawerUser(null)} user={drawerUser} />
    </>
  );
}
