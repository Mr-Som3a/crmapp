import { z } from "zod";
export const contactSchema = z.object({
  name: z.string().trim().min(3, "Enter at least 3 characters"),
  username: z.string().min(1, "Username is required").regex(/^[a-zA-Z0-9]+$/, "Use only letters and numbers"),
  email: z.string().email("Enter a valid email"), phone: z.string().trim().min(1, "Phone is required"),
  website: z.union([z.literal(""), z.string().url("Include https:// in the URL")]),
  company: z.object({ name: z.string().trim().min(1, "Company is required"), catchPhrase: z.string(), bs: z.string() }),
  address: z.object({ street: z.string().trim().min(1, "Street is required"), suite: z.string(), city: z.string().trim().min(1, "City is required"), zipcode: z.string().trim().min(1, "Zipcode is required"), geo: z.object({ lat: z.string(), lng: z.string() }) }),
  jobTitle: z.string(), status: z.enum(["Lead", "Contact", "Customer"]), priority: z.enum(["Low", "Medium", "High"]),
  dealValue: z.number().finite().min(0, "Enter a positive amount"), source: z.enum(["Website", "Referral", "LinkedIn", "Email", "Other"])
});

export const contactPatchSchema = contactSchema.deepPartial().refine(
  values => Object.keys(values).length > 0,
  "Provide at least one contact field to update.",
);
