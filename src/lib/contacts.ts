import type { Contact } from "@/types/contact";
export function filterContacts(contacts: Contact[], search: string, status: string, priority: string) {
  const query = search.trim().toLowerCase();
  return contacts.filter(contact =>
    (status === "All" || contact.status === status) &&
    (priority === "All" || contact.priority === priority) &&
    [contact.name, contact.email, contact.company.name, contact.address.city].some(value => value.toLowerCase().includes(query))
  );
}
export function summarizeContacts(contacts: Contact[]) {
  return {
    count: contacts.length,
    customers: contacts.filter(contact => contact.status === "Customer").length,
    totalValue: contacts.reduce((sum, contact) => sum + contact.dealValue, 0),
    companies: new Set(contacts.map(contact => contact.company.name)).size,
    cities: new Set(contacts.map(contact => contact.address.city)).size,
  };
}
