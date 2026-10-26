import type { z } from "zod";
import type { contactSchema } from "@/lib/schemas/contact";
export type ContactValues = z.infer<typeof contactSchema>;
export type Contact = ContactValues & { id: number; apiId?: number };
export type ApiContact = Pick<Contact, "id" | "name" | "username" | "email" | "phone" | "website" | "company" | "address">;
