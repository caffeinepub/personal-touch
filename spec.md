# Personal Touch

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- Login page with name-only login (no password), dark/black background theme
- Dashboard with meeting category dropdown: Personal, Professional, Natural, Other
- Within each category, a contacts list (dropdown to select a person by name)
- Ability to add new contacts per category
- Per-contact meeting log: each entry has a date, a summary/crux text, and a category tag
- Create, read, update meeting notes for each contact
- AI-assisted summarization: user can paste long notes and get a condensed AI summary via HTTP outcall to an LLM API (fallback: basic text compression hint)
- Full communication history view per contact, sorted by date

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend (Motoko):
   - User identity stored by name (simple name-based login, stored in stable map)
   - Contact data model: id, name, category (Personal | Professional | Natural | Other), createdBy (user)
   - Meeting note model: id, contactId, date (text), summary (text), createdAt, updatedAt
   - CRUD for contacts and meeting notes
   - HTTP outcall to summarize text (POST to a public LLM summarization endpoint)
2. Frontend:
   - Login screen: name input, black background, elegant branding
   - Dashboard: category dropdown + contact dropdown, filtered per logged-in user
   - Contact detail page: chronological meeting log, add/edit entries
   - AI summarize button on note editor
   - Fully dark themed (black/gray palette)
