import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/lor/Header";
import { SecondaryNav } from "@/components/lor/SecondaryNav";
import { Footer } from "@/components/lor/Footer";
import { MobileBottomNav } from "@/components/lor/MobileBottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { isAdminEmail } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  Trash2,
  Mail,
  Eye,
  EyeOff,
  Download,
  Search,
} from "lucide-react";

export const Route = createFileRoute("/producer/contact-submissions")({
  component: ContactSubmissionsPage,
});

interface ContactSubmission {
  id: string;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  is_spam: boolean;
  replied_at: string | null;
  reply_message: string | null;
  created_at: string;
}

function ContactSubmissionsPage() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();

  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Check if user is admin
  const isAdmin = isAdminEmail(user?.email);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      nav({ to: "/login" });
      return;
    }

    const fetchSubmissions = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("contact_submissions")
          .select("*")
          .eq("is_spam", false)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setSubmissions(data || []);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [authLoading, user, nav, isAdmin]);

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ is_read: !isRead })
        .eq("id", id);

      if (error) throw error;

      setSubmissions(
        submissions.map(sub =>
          sub.id === id ? { ...sub, is_read: !isRead } : sub
        )
      );

      if (selectedSubmission?.id === id) {
        setSelectedSubmission({ ...selectedSubmission, is_read: !isRead });
      }
    } catch (error) {
      console.error("Error updating submission:", error);
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    try {
      setDeletingId(id);
      const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSubmissions(submissions.filter(sub => sub.id !== id));
      setShowDeleteConfirm(false);
      if (selectedSubmission?.id === id) {
        setShowDetailsDialog(false);
        setSelectedSubmission(null);
      }
    } catch (error) {
      console.error("Error deleting submission:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportSubmissions = () => {
    const csv = [
      ["Date", "Name", "Email", "Subject", "Message", "Status"],
      ...submissions.map(sub => [
        new Date(sub.created_at).toLocaleString(),
        sub.full_name,
        sub.email,
        sub.subject,
        sub.message,
        sub.is_read ? "Read" : "Unread",
      ]),
    ]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contact_submissions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredSubmissions = submissions.filter(sub =>
    sub.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-20">
      <Header />
      <SecondaryNav />

      <main className="mx-auto max-w-[1280px] space-y-8 px-4 pt-6 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Admin Panel</p>
            <h1 className="text-3xl font-black text-foreground">Contact Submissions</h1>
            <p className="text-sm text-muted-foreground mt-1">{submissions.length} total messages</p>
          </div>

          <Button
            onClick={handleExportSubmissions}
            disabled={submissions.length === 0}
            variant="outline"
            className="w-full md:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Search */}
        <div className="lor-card p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card/50"
            />
          </div>
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="lor-card p-10 text-center">
            <Mail className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 font-bold">No messages yet</p>
            <p className="text-sm text-muted-foreground">Contact submissions will appear here.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Subject</th>
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-center font-semibold">Status</th>
                  <th className="px-4 py-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-foreground">{submission.full_name}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`mailto:${submission.email}`}
                        className="text-primary hover:underline"
                      >
                        {submission.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 line-clamp-1 text-muted-foreground">{submission.subject}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {new Date(submission.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          submission.is_read
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/20 text-primary"
                        }`}
                      >
                        {submission.is_read ? "Read" : "Unread"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowDetailsDialog(true);
                          }}
                          className="h-8 w-8 p-0"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMarkAsRead(submission.id, submission.is_read)}
                          className="h-8 w-8 p-0"
                          title={submission.is_read ? "Mark as unread" : "Mark as read"}
                        >
                          {submission.is_read ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowDeleteConfirm(true);
                          }}
                          className="h-8 w-8 p-0 hover:text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              Received {new Date(selectedSubmission?.created_at || "").toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-xs font-bold uppercase">Name</Label>
                  <p className="mt-1 text-foreground">{selectedSubmission.full_name}</p>
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase">Email</Label>
                  <a
                    href={`mailto:${selectedSubmission.email}`}
                    className="mt-1 text-primary hover:underline block"
                  >
                    {selectedSubmission.email}
                  </a>
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold uppercase">Subject</Label>
                <p className="mt-1 text-foreground">{selectedSubmission.subject}</p>
              </div>

              <div>
                <Label className="text-xs font-bold uppercase">Message</Label>
                <p className="mt-1 text-foreground whitespace-pre-wrap break-words">
                  {selectedSubmission.message}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => handleMarkAsRead(selectedSubmission.id, selectedSubmission.is_read)}
                  variant="outline"
                  className="flex-1"
                >
                  {selectedSubmission.is_read ? "Mark as Unread" : "Mark as Read"}
                </Button>

                <Button
                  onClick={() => window.open(`mailto:${selectedSubmission.email}`, "_blank")}
                  className="flex-1"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Reply via Email
                </Button>

                <Button
                  onClick={() => {
                    setShowDetailsDialog(false);
                    setShowDeleteConfirm(true);
                  }}
                  variant="destructive"
                  size="sm"
                  className="h-10 w-10 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The message from{" "}
              <strong>{selectedSubmission?.full_name}</strong> will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedSubmission && handleDeleteSubmission(selectedSubmission.id)
              }
              disabled={deletingId !== null}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingId ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
