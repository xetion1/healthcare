// lib/validation.ts

import { z } from "zod";

export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
});

export const PatientFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
  birthDate: z.coerce.date(),
  gender: z.enum(["Male", "Female", "Other"]),

  barber: z.string().nonempty("Please select a barber"),
  allergies: z.string().optional(),
  specificRequests: z.string().optional(),
  identificationDocument: z.custom<File[]>().optional(),
  serviceConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to receive services",
    }),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must agree to the privacy policy",
    }),
});

export const CreateAppointmentSchema = z.object({
  barber: z.string().nonempty("Please select a barber"),
  schedule: z.coerce.date(),
  reason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const getAppointmentSchema = (type: string) => {
  if (type === "cancel") {
    return z.object({
      cancellationReason: z.string().nonempty("Please provide a reason"),
    });
  } else {
    return z.object({
      location: z.string().nonempty("Please select a location"),
      barber: z.string().nonempty("Please select a barber"),
      schedule: z.date({
        required_error: "Please select a date",
        invalid_type_error: "Invalid date format",
      }),
      reason: z.string().nonempty("Please select a service"),
      note: z.string().optional(),
    });
  }
};
