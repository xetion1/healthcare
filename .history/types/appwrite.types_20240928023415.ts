import { Models } from "node-appwrite";

export interface Patient extends Models.Document {
  userId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  gender: Gender;
  primaryPhysician: string;
  allergies?: string;
  pastMedicalHistory?: string;
  identificationDocument?: FormData;
  privacyConsent: boolean;
}

export interface Appointment extends Models.Document {
  patient: string; // Patient ID
  schedule: Date;
  status: Status;
  primaryPhysician: string;
  reason: string;
  note?: string;
  userId: string;
  cancellationReason?: string | null;
  price?: number; // Added price field
}
