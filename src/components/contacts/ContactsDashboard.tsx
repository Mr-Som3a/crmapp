import { useMemo, useState } from "react";
import { Alert, Button, Snackbar } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { useContacts } from "@/hooks/useContacts";
import { filterContacts, summarizeContacts } from "@/lib/contacts";
import type { Contact, ContactValues } from "@/types/contact";
import DashboardHeader from "./DashboardHeader";
import ContactMetrics from "./ContactMetrics";
import ContactFilters from "./ContactFilters";
import ContactsTable from "./ContactsTable";
import ContactFormDialog from "./ContactFormDialog";
import ContactDetailsDialog from "./ContactDetailsDialog";
import DeleteContactDialog from "./DeleteContactDialog";

export default function ContactsDashboard() {
  const {
    contacts,
    loading,
    loadError,
    reload,
    save: saveContact,
    remove: removeContact,
  } = useContacts();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(5);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [viewing, setViewing] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState<Contact | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");

  const filtered = useMemo(
    () => filterContacts(contacts, search, status, priority),
    [contacts, search, status, priority],
  );
  const summary = summarizeContacts(contacts);
  const safePage = Math.min(
    page,
    Math.max(0, Math.ceil(filtered.length / rows) - 1),
  );
  
  function openForm(contact: Contact | null = null) {
    setEditing(contact);
    setActionError("");
    setFormOpen(true);
  }

  async function save(values: ContactValues) {
    setBusy(true);
    setActionError("");
    try {
      await saveContact(values, editing);
      setFormOpen(false);
      setPage(0);
      setNotice(editing ? "Contact updated" : "Contact added");
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Could not save contact.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!deleting) return;
    setBusy(true);
    setActionError("");
    try {
      await removeContact(deleting);
      setDeleting(null);
      setNotice("Contact deleted");
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Could not delete contact.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <DashboardHeader
        loading={loading}
        loadError={loadError}
        onAdd={() => openForm()}
      />

      <main className="dashboard">
        <ContactMetrics {...summary} loading={loading} />
        <ContactFilters
          search={search}
          status={status}
          priority={priority}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(0);
          }}
          onStatusChange={(value) => {
            setStatus(value);
            setPage(0);
          }}
          onPriorityChange={(value) => {
            setPriority(value);
            setPage(0);
          }}
        />
        {loadError && (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                onClick={() => void reload()}
                startIcon={<Refresh />}
              >
                Retry
              </Button>
            }
          >
            {loadError}
          </Alert>
        )}
        <ContactsTable
          contacts={filtered}
          loading={loading}
          page={safePage}
          rows={rows}
          onPageChange={setPage}
          onRowsChange={(value) => {
            setRows(value);
            setPage(0);
          }}
          onView={setViewing}
          onEdit={openForm}
          onDelete={(contact) => {
            setActionError("");
            setDeleting(contact);
          }}
          onClearFilters={() => {
            setSearch("");
            setStatus("All");
            setPriority("All");
            setPage(0);
          }}
        />
        <footer className="dashboard-footer">
          <span>
            {summary.count} contacts <b>&middot;</b> {summary.companies}{" "}
            companies <b>&middot;</b> {summary.cities} active cities
          </span>
          <span>Assessment demo &middot; API changes reset on refresh</span>
        </footer>
      </main>

      {formOpen && (
        <ContactFormDialog
          editing={editing}
          busy={busy}
          actionError={actionError}
          onClose={() => setFormOpen(false)}
          onSubmit={save}
        />
      )}

      <DeleteContactDialog
        contact={deleting}
        busy={busy}
        actionError={actionError}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
      />

      <ContactDetailsDialog
        viewing={viewing}
        onClose={() => setViewing(null)}
        onEdit={openForm}
      />

      <Snackbar
        open={!!notice}
        autoHideDuration={4000}
        onClose={() => setNotice("")}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setNotice("")}
        >
          {notice}
        </Alert>
      </Snackbar>
    </>
  );
}
