import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/lib/schemas/contact";
import {
  emptyContact,
  sections,
  requiredFields,
} from "@/lib/constants/contacts";
import type { Contact, ContactValues } from "@/types/contact";

const opportunityDetails = [
    ["status", ["Lead", "Contact", "Customer"]],
    ["priority", ["Low", "Medium", "High"]],
    ["source", ["Website", "Referral", "LinkedIn", "Email", "Other"]],
  ] as const;

type Props = {
  editing: Contact | null;
  busy: boolean;
  actionError: string;
  onClose: () => void;
  onSubmit: (values: ContactValues) => Promise<void>;
};

export default function ContactFormDialog({
  editing,
  busy,
  actionError,
  onClose,
  onSubmit,
}: Props) {
  const { control, handleSubmit } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: editing ?? structuredClone(emptyContact),
  });


  return (
    <Dialog
      open
      onClose={() => {
        if (!busy) onClose();
      }}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle className="dialog-heading">
        {editing ? "Edit contact" : "Add new lead"}
        <IconButton
          aria-label="Close form"
          disabled={busy}
          onClick={() => onClose()}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent dividers>
          {actionError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {actionError}
            </Alert>
          )}
          {sections.map((section) => (
            <section className="form-section" key={section.title}>
              <Typography variant="subtitle2" className="section-label">
                {section.title}
              </Typography>
              <div className="form-grid">
                {section.fields.map(([name, label]) => (
                  <Controller
                    key={name}
                    name={name}
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        value={
                          typeof field.value === "string" ? field.value : ""
                        }
                        label={label}
                        required={requiredFields.has(name)}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        disabled={busy}
                      />
                    )}
                  />
                ))}
              </div>
            </section>
          ))}
          <section className="form-section">
            <Typography variant="subtitle2" className="section-label">
              Opportunity details
            </Typography>
            <div className="form-grid">
              {opportunityDetails.map(([name, options]) => (
                <Controller
                  key={name}
                  name={name}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label={name[0].toUpperCase() + name.slice(1)}
                      disabled={busy}
                    >
                      {options.map((option) => (
                        <MenuItem value={option} key={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              ))}
              <Controller
                name="dealValue"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Deal value (USD)"
                    type="number"
                    onChange={(event) =>
                      field.onChange(
                        event.target.value === ""
                          ? ""
                          : Number(event.target.value),
                      )
                    }
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    disabled={busy}
                    slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                  />
                )}
              />
            </div>
          </section>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button disabled={busy} onClick={() => onClose()}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={busy}>
            {busy ? "Saving..." : editing ? "Save changes" : "Create lead"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
