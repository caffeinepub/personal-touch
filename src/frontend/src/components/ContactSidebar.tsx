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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, User } from "lucide-react";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Contact } from "../backend";
import { useAppContext } from "../context/AppContext";
import { ContactCategory, useCreateContact } from "../hooks/useQueries";

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

const QUICK_FILTERS: Array<{ id: ContactCategory | "all"; label: string }> = [
  { id: "all", label: "All Contacts" },
  { id: ContactCategory.personal, label: "Personal" },
  { id: ContactCategory.professional, label: "Professional" },
  { id: ContactCategory.natural, label: "Natural" },
  { id: ContactCategory.other, label: "Other" },
];

interface ContactSidebarProps {
  contacts: Contact[];
  isLoading: boolean;
  filterCategory: ContactCategory | "all";
  onFilterChange: (cat: ContactCategory | "all") => void;
}

export default function ContactSidebar({
  contacts,
  isLoading,
  filterCategory,
  onFilterChange,
}: ContactSidebarProps) {
  const { selectedContact, setSelectedContact } = useAppContext();
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<ContactCategory>(
    ContactCategory.personal,
  );
  const createContact = useCreateContact();

  const filteredContacts =
    filterCategory === "all"
      ? contacts
      : contacts.filter((c) => c.category === filterCategory);

  const handleAddContact = async () => {
    if (!newName.trim()) {
      toast.error("Please enter a contact name");
      return;
    }
    try {
      await createContact.mutateAsync({
        name: newName.trim(),
        category: newCategory,
      });
      toast.success(`${newName} added successfully`);
      setAddOpen(false);
      setNewName("");
      setNewCategory(ContactCategory.personal);
    } catch {
      toast.error("Failed to add contact");
    }
  };

  return (
    <aside
      className="w-72 shrink-0 border-r border-border flex flex-col"
      style={{
        background: "oklch(0.12 0 0)",
        minHeight: "calc(100vh - 4rem - 2.75rem)",
      }}
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground tracking-wide">
          Contacts
        </h2>
        <Button
          data-ocid="contacts.open_modal_button"
          size="sm"
          variant="ghost"
          onClick={() => setAddOpen(true)}
          className="h-7 w-7 p-0 text-primary hover:bg-primary/10"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            <div
              data-ocid="contacts.loading_state"
              className="flex justify-center py-8"
            >
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : filteredContacts.length === 0 ? (
            <div
              data-ocid="contacts.empty_state"
              className="text-center py-8 text-muted-foreground/50 text-sm"
            >
              <User className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p>No contacts yet</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredContacts.map((contact, index) => (
                <motion.button
                  type="button"
                  key={contact.id.toString()}
                  data-ocid={`contacts.item.${index + 1}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all mb-1 group ${
                    selectedContact?.id === contact.id
                      ? "bg-primary/15 border border-primary/30"
                      : "hover:bg-secondary/50 border border-transparent"
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border-2"
                    style={{
                      background: `${CATEGORY_COLORS[contact.category]}22`,
                      borderColor: `${CATEGORY_COLORS[contact.category]}55`,
                      color: CATEGORY_COLORS[contact.category],
                    }}
                  >
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        selectedContact?.id === contact.id
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {contact.name}
                    </p>
                    <p className="text-xs text-muted-foreground/60 capitalize">
                      {CATEGORY_LABELS[contact.category]}
                    </p>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <p className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-widest mb-2">
          Quick Filters
        </p>
        <div className="space-y-0.5">
          {QUICK_FILTERS.map((f) => (
            <button
              type="button"
              key={f.id}
              data-ocid={`contacts.${f.id}.tab`}
              onClick={() => onFilterChange(f.id)}
              className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                filterCategory === f.id
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent
          data-ocid="contacts.dialog"
          className="sm:max-w-sm border-border"
          style={{ background: "oklch(0.14 0 0)" }}
        >
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Add New Contact
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="contact-name" className="text-muted-foreground">
                Name
              </Label>
              <Input
                id="contact-name"
                data-ocid="contacts.input"
                placeholder="Full name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddContact()}
                className="bg-input border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="contact-category"
                className="text-muted-foreground"
              >
                Category
              </Label>
              <Select
                value={newCategory}
                onValueChange={(v) => setNewCategory(v as ContactCategory)}
              >
                <SelectTrigger
                  data-ocid="contacts.select"
                  className="bg-input border-border"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  style={{
                    background: "oklch(0.16 0 0)",
                    borderColor: "oklch(0.25 0 0)",
                  }}
                >
                  <SelectItem value={ContactCategory.personal}>
                    Personal
                  </SelectItem>
                  <SelectItem value={ContactCategory.professional}>
                    Professional
                  </SelectItem>
                  <SelectItem value={ContactCategory.natural}>
                    Natural
                  </SelectItem>
                  <SelectItem value={ContactCategory.other}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              data-ocid="contacts.cancel_button"
              variant="ghost"
              onClick={() => setAddOpen(false)}
              className="text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              type="button"
              data-ocid="contacts.submit_button"
              onClick={handleAddContact}
              disabled={createContact.isPending}
              style={{
                background: "oklch(0.72 0.10 78)",
                color: "oklch(0.10 0 0)",
              }}
            >
              {createContact.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Add Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
