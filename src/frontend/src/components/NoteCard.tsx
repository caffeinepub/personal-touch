import { Button } from "@/components/ui/button";
import { Calendar, Edit2 } from "lucide-react";
import { useState } from "react";
import type { Contact, MeetingNote } from "../backend";
import EditNoteModal from "./EditNoteModal";

const CATEGORY_COLORS: Record<string, string> = {
  personal: "oklch(0.70 0.15 145)",
  professional: "oklch(0.65 0.15 230)",
  natural: "oklch(0.70 0.15 160)",
  other: "oklch(0.65 0.10 290)",
};

const CATEGORY_LABELS: Record<string, string> = {
  personal: "Personal",
  professional: "Professional",
  natural: "Natural",
  other: "Other",
};

interface NoteCardProps {
  note: MeetingNote;
  contact: Contact | undefined;
  contacts: Contact[];
}

export default function NoteCard({ note, contact }: NoteCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  const categoryColor = contact
    ? CATEGORY_COLORS[contact.category]
    : "oklch(0.65 0.10 290)";
  const categoryLabel = contact ? CATEGORY_LABELS[contact.category] : "Other";

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="rounded-xl p-5 border border-border hover:border-primary/30 transition-all group"
      style={{
        background: "oklch(0.14 0 0)",
        boxShadow: "0 2px 8px oklch(0 0 0 / 0.3)",
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          {contact && (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border-2"
              style={{
                background: `${categoryColor}22`,
                borderColor: `${categoryColor}55`,
                color: categoryColor,
              }}
            >
              {contact.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-foreground text-sm">
              {contact?.name ?? "Unknown Contact"}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: `${categoryColor}22`,
                  color: categoryColor,
                }}
              >
                {categoryLabel}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground/60">
                <Calendar className="h-3 w-3" />
                {formatDate(note.date)}
              </span>
            </div>
          </div>
        </div>

        <Button
          data-ocid="notes.edit_button"
          variant="ghost"
          size="sm"
          onClick={() => setEditOpen(true)}
          className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-all"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
        {note.summary || (
          <span className="italic opacity-50">No summary yet.</span>
        )}
      </p>

      <div className="mt-3 pt-3 border-t border-border/50">
        <button
          type="button"
          data-ocid="notes.edit_button"
          onClick={() => setEditOpen(true)}
          className="text-xs font-medium transition-colors hover:opacity-80"
          style={{ color: "oklch(0.72 0.10 78)" }}
        >
          ✦ Edit & Summarize with AI
        </button>
      </div>

      <EditNoteModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        note={note}
        contact={contact}
      />
    </div>
  );
}
