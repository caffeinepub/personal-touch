import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Contact, MeetingNote } from "../backend";
import { useSummarizeText, useUpdateMeetingNote } from "../hooks/useQueries";

interface EditNoteModalProps {
  open: boolean;
  onClose: () => void;
  note: MeetingNote;
  contact: Contact | undefined;
}

export default function EditNoteModal({
  open,
  onClose,
  note,
  contact,
}: EditNoteModalProps) {
  const [date, setDate] = useState(note.date);
  const [summary, setSummary] = useState(note.summary);
  const updateNote = useUpdateMeetingNote();
  const summarize = useSummarizeText();

  useEffect(() => {
    if (open) {
      setDate(note.date);
      setSummary(note.summary);
    }
  }, [open, note.date, note.summary]);

  const handleSave = async () => {
    if (!summary.trim()) {
      toast.error("Summary cannot be empty");
      return;
    }
    try {
      await updateNote.mutateAsync({
        id: note.id,
        summary: summary.trim(),
        contactId: note.contactId,
      });
      toast.success("Note updated successfully");
      onClose();
    } catch {
      toast.error("Failed to update note");
    }
  };

  const handleSummarize = async () => {
    if (!summary.trim()) {
      toast.error("Please write something to summarize");
      return;
    }
    try {
      const result = await summarize.mutateAsync(summary.trim());
      setSummary(result);
      toast.success("Summarized with AI");
    } catch {
      toast.error("AI summarization failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="notes.dialog"
        className="sm:max-w-lg border-border"
        style={{ background: "oklch(0.14 0 0)" }}
      >
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Edit Note —{" "}
            <span style={{ color: "oklch(0.72 0.10 78)" }}>
              {contact?.name ?? "Contact"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-muted-foreground">Meeting Date</Label>
            <Input
              data-ocid="notes.input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground">Meeting Summary</Label>
              <button
                type="button"
                data-ocid="notes.secondary_button"
                onClick={handleSummarize}
                disabled={summarize.isPending || !summary.trim()}
                className="flex items-center gap-1.5 text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: "oklch(0.72 0.10 78)" }}
              >
                {summarize.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Wand2 className="h-3 w-3" />
                )}
                Summarize with AI
              </button>
            </div>
            <Textarea
              data-ocid="notes.textarea"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="bg-input border-border min-h-[150px] resize-none"
              placeholder="Meeting notes and key discussion points..."
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            data-ocid="notes.cancel_button"
            variant="ghost"
            onClick={onClose}
            className="text-muted-foreground"
          >
            Cancel
          </Button>
          <Button
            type="button"
            data-ocid="notes.save_button"
            onClick={handleSave}
            disabled={updateNote.isPending}
            style={{
              background: "oklch(0.72 0.10 78)",
              color: "oklch(0.10 0 0)",
            }}
          >
            {updateNote.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
