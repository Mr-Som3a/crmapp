import type { z } from "zod";
import type { contactPatchSchema } from "@/lib/schemas/contact";
type ContactPatch = z.infer<typeof contactPatchSchema>;
import type { ApiContact, Contact, ContactValues } from "@/types/contact";
const endpoint = "https://jsonplaceholder.typicode.com/users";


async function requestContact<T>(path = "", options?: RequestInit): Promise<T> {
  const response = await fetch(`${endpoint}${path}`, {
    ...options,
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok)
    throw new Error(`Contact API request failed (${response.status}).`);
  return response.json() as Promise<T>;
}
export async function getContacts(): Promise<Contact[]> {
  const data = await requestContact<ApiContact[]>();
  const statuses: ContactValues["status"][] = [
    "Lead",
    "Contact",
    "Customer",
    "Lead",
    "Contact",
  ];
  const priorities: ContactValues["priority"][] = ["Low", "Medium", "High"];
  const values = [
    6064, 30943, 44971, 18400, 27600, 35900, 12800, 51600, 24162, 32800,
  ];
  return data.map((user, index) => ({
    ...user,
    username: user.username.replace(/[^a-zA-Z0-9]/g, ""),
    website:
      user.website && !/^https?:\/\//.test(user.website)
        ? `https://${user.website}`
        : user.website,
    apiId: user.id,
    jobTitle: [
      "CTO",
      "VP of Sales",
      "Product Manager",
      "Founder",
      "Operations Lead",
    ][index % 5],
    status: statuses[index % 5],
    priority: priorities[index % 3],
    dealValue: values[index % values.length],
    source: (["Website", "Referral", "LinkedIn", "Email"] as const)[index % 4],
  }));
}
export async function postContacts(values: ContactValues): Promise<Contact> {
  return requestContact<Contact>("", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
}

export async function updateContacts(
  id: number,
  values: ContactValues,
): Promise<Contact> {
  return requestContact<Contact>(`/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
}

export async function patchContacts(
  id: number,
  values: ContactPatch,
): Promise<Contact> {
  return requestContact<Contact>(`/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
}

export async function deleteContacts(id: number): Promise<void> {
  await requestContact(`/${id}`, { method: "DELETE" });
}

export async function saveContact(values: ContactValues, existing: Contact | null): Promise<Contact> {
  // JSONPlaceholder does not persist POSTs. Newly created rows stay local after creation.
  if (!existing) await postContacts(values);
  else if (existing.apiId) await updateContacts(existing.apiId, values);
  return { ...values, id: existing?.id ?? Date.now(), apiId: existing?.apiId };
}

export async function deleteContact(contact: Contact): Promise<void> {
  if (contact.apiId) await deleteContacts(contact.apiId);
}
