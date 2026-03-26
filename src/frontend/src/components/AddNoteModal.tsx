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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Contact } from "../backend";
import { useAppContext } from "../context/AppContext";
import { useCreateMeetingNote, useSummarizeText } from "../hooks/useQueries";

interface AddNoteModalProps {
  open: boolean;
  onClose: () => void;
  contacts: Contact[];
}

export default function AddNoteModal({
  open,
  onClose,
  contacts,
}: AddNoteModalProps) {
  const { selectedContact } = useAppContext();
  const [contactId, setContactId] = useState<string>(
    selectedContact?.id.toString() ?? "",
  );
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [summary, setSummary] = useState("");
  const createNote = useCreateMeetingNote();
  const summarize = useSummarizeText();

  const handleSubmit = async () => {
    if (!contactId) {
      toast.error("Please select a contact");
      return;
    }
    if (!summary.trim()) {
      toast.error("Please enter a meeting summary");
      return;
    }
    try {
      await createNote.mutateAsync({
        contactId: BigInt(contactId),
        date,
        summary: summary.trim(),
      });
      toast.success("Meeting note added");
      setSummary("");
      setDate(new Date().toISOString().split("T")[0]);
      onClose();
    } catch {
      toast.error("Failed to save note");
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
            Add Meeting Note
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-muted-foreground">Contact</Label>
            <Select value={contactId} onValueChange={setContactId}>
              <SelectTrigger
                data-ocid="notes.select"
                className="bg-input border-border"
              >
                <SelectValue placeholder="Select a contact" />
              </SelectTrigger>
              <SelectContent
                style={{
                  background: "oklch(0.16 0 0)",
                  borderColor: "oklch(0.25 0 0)",
                }}
              >
                {contacts.map((c) => (
                  <SelectItem key={c.id.toString()} value={c.id.toString()}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
              placeholder="Write your meeting notes, key points discussed, action items..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="bg-input border-border min-h-[120px] resize-none"
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
            data-ocid="notes.submit_button"
            onClick={handleSubmit}
            disabled={createNote.isPending}
            style={{
              background: "oklch(0.72 0.10 78)",
              color: "oklch(0.10 0 0)",
            }}
          >
            {createNote.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
