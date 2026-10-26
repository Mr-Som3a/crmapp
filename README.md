# ApexCRM

Contact management dashboard built with React, Vite, TypeScript, MUI, React Hook Form, and Zod.

## Development

```sh
npm install
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

## Checks and production

```sh
npm run build
npm run lint
npm run preview
```

## Structure

- `src/components/contacts`: dashboard UI and dialogs
- `src/hooks/useContacts.ts`: contact state and CRUD coordination
- `src/lib/api/contacts.ts`: browser requests to JSONPlaceholder
- `src/lib/schemas`: Zod validation
- `src/lib/constants`: form configuration and defaults
- `src/types`: shared TypeScript models
- `src/Providers.tsx` and `src/lib/theme.ts`: MUI theme

JSONPlaceholder simulates writes; updates reset on refresh. Opportunity fields are demo data added to the API contacts.
