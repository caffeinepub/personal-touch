import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Plus, Search } from "lucide-react";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Contact } from "../backend";
import { useAppContext } from "../context/AppContext";
import { ContactCategory, useMeetingNotes } from "../hooks/useQueries";
import AddNoteModal from "./AddNoteModal";
import NoteCard from "./NoteCard";

interface NotesSectionProps {
  contacts: Contact[];
  filterCategory: ContactCategory | "all";
  onFilterChange: (cat: ContactCategory | "all") => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function NotesSection({
  contacts,
  filterCategory,
  onFilterChange,
  searchQuery,
  onSearchChange,
}: NotesSectionProps) {
  const { selectedContact } = useAppContext();
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const { data: notes = [], isLoading } = useMeetingNotes(
    selectedContact?.id ?? null,
  );

  const filteredNotes = notes.filter((n) => {
    const contact = contacts.find((c) => c.id === n.contactId);
    if (!contact) return false;
    if (filterCategory !== "all" && contact.category !== filterCategory)
      return false;
    if (
      searchQuery &&
      !n.summary.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const displayTitle = selectedContact
    ? `Notes for ${selectedContact.name}`
    : "Latest Relationship Notes";

  return (
    <div className="flex flex-col h-full">
      <div
        className="px-6 py-4 border-b border-border flex flex-wrap gap-3 items-center"
        style={{ background: "oklch(0.11 0 0)" }}
      >
        <Select
          value={filterCategory}
          onValueChange={(v) => onFilterChange(v as ContactCategory | "all")}
        >
          <SelectTrigger
            data-ocid="notes.select"
            className="w-44 bg-input border-border h-9 text-sm"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            style={{
              background: "oklch(0.16 0 0)",
              borderColor: "oklch(0.25 0 0)",
            }}
          >
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value={ContactCategory.personal}>Personal</SelectItem>
            <SelectItem value={ContactCategory.professional}>
              Professional
            </SelectItem>
            <SelectItem value={ContactCategory.natural}>Natural</SelectItem>
            <SelectItem value={ContactCategory.other}>Other</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
          <Input
            data-ocid="notes.search_input"
            placeholder="Search contacts…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 h-9 bg-input border-border text-sm"
          />
        </div>
      </div>

      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">{displayTitle}</h2>
          <p className="text-sm text-muted-foreground/60 mt-0.5">
            {selectedContact
              ? `${notes.length} note${notes.length !== 1 ? "s" : ""}`
              : `${contacts.length} contact${contacts.length !== 1 ? "s" : ""} tracked`}
          </p>
        </div>
        <Button
          data-ocid="notes.open_modal_button"
          onClick={() => setAddNoteOpen(true)}
          className="rounded-full px-5 h-9 text-sm font-semibold gap-1.5"
          style={{
            background: "oklch(0.72 0.10 78)",
            color: "oklch(0.10 0 0)",
          }}
        >
          <Plus className="h-4 w-4" />
          Add New Note
        </Button>
      </div>

      <div className="px-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
          <Input
            placeholder="Search notes by keyword…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 h-9 bg-input border-border text-sm"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-6">
        {isLoading ? (
          <div
            data-ocid="notes.loading_state"
            className="flex justify-center py-16"
          >
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !selectedContact ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            data-ocid="notes.empty_state"
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-primary/20"
              style={{ background: "oklch(0.16 0.02 78)" }}
            >
              <FileText className="h-7 w-7 text-primary/60" />
            </div>
            <h3 className="text-foreground font-semibold mb-1">
              Select a contact
            </h3>
            <p className="text-muted-foreground/60 text-sm max-w-xs">
              Choose a contact from the sidebar to view their relationship notes
              and meeting history.
            </p>
          </motion.div>
        ) : filteredNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            data-ocid="notes.empty_state"
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-primary/20"
              style={{ background: "oklch(0.16 0.02 78)" }}
            >
              <FileText className="h-7 w-7 text-primary/60" />
            </div>
            <h3 className="text-foreground font-semibold mb-1">No notes yet</h3>
            <p className="text-muted-foreground/60 text-sm max-w-xs">
              Start by adding your first meeting note for{" "}
              {selectedContact?.name}.
            </p>
            <Button
              onClick={() => setAddNoteOpen(true)}
              className="mt-4 rounded-full px-5 h-9 text-sm"
              style={{
                background: "oklch(0.72 0.10 78)",
                color: "oklch(0.10 0 0)",
              }}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add First Note
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-3 pb-6">
            <AnimatePresence>
              {filteredNotes.map((note, index) => {
                const contact = contacts.find((c) => c.id === note.contactId);
                return (
                  <motion.div
                    key={note.id.toString()}
                    data-ocid={`notes.item.${index + 1}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <NoteCard
                      note={note}
                      contact={contact}
                      contacts={contacts}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </ScrollArea>

      <AddNoteModal
        open={addNoteOpen}
        onClose={() => setAddNoteOpen(false)}
        contacts={contacts}
      />
    </div>
  );
}
