import type { FieldPath } from "react-hook-form";
import type { ContactValues } from "@/types/contact";
export const emptyContact: ContactValues = { name: "", username: "", email: "", phone: "", website: "", company: { name: "", catchPhrase: "", bs: "" }, address: { street: "", suite: "", city: "", zipcode: "", geo: { lat: "", lng: "" } }, jobTitle: "", status: "Lead", priority: "Medium", dealValue: 0, source: "Website" };
export const sections: { title: string; fields: [FieldPath<ContactValues>, string][] }[] = [
 { title: "Personal information", fields: [["name", "Full name"], ["username", "Username"], ["email", "Email address"], ["phone", "Phone number"], ["website", "Website"], ["jobTitle", "Job title"]] },
 { title: "Company", fields: [["company.name", "Company name"], ["company.catchPhrase", "Catchphrase"], ["company.bs", "Business strategy"]] },
 { title: "Address", fields: [["address.street", "Street"], ["address.suite", "Suite / apartment"], ["address.city", "City"], ["address.zipcode", "Zipcode"], ["address.geo.lat", "Latitude"], ["address.geo.lng", "Longitude"]] }
];
export const requiredFields = new Set(["name", "username", "email", "phone", "company.name", "address.street", "address.city", "address.zipcode"]);
