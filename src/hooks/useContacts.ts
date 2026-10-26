import { useCallback, useEffect, useState } from "react";
import { deleteContact, getContacts, saveContact } from "@/lib/api/contacts";
import type { Contact, ContactValues } from "@/types/contact";
export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try { setContacts(await getContacts()); }
    catch (error) { setLoadError(error instanceof Error ? error.message : "Unable to load contacts."); }
    finally { setLoading(false); }
  }, []);

  
  useEffect(() => {
    let active = true;
    getContacts()
      .then(data => { if (active) setContacts(data); })
      .catch(error => {
        if (active) setLoadError(error instanceof Error ? error.message : "Unable to load contacts.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function save(values: ContactValues, existing: Contact | null) {
    const saved = await saveContact(values, existing);
    setContacts(current => existing ? current.map(contact => contact.id === existing.id ? saved : contact) : [saved, ...current]);
  }
  async function remove(contact: Contact) {
    await deleteContact(contact);
    setContacts(current => current.filter(item => item.id !== contact.id));
  }
  return { contacts, loading, loadError, reload: load, save, remove };
}
