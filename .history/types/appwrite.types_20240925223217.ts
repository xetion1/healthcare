// types/appwrite.types.ts

import { Models } from "node-appwrite";

export interface Patient extends Models.Document {
  userId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  gender: Gender;
  barber: string;
  allergies?: string;
  specificRequests?: string;
  identificationDocument?: FormData;
  privacyConsent: boolean;
}

export interface Appointment extends Models.Document {
  patient: string; // Patient ID
  schedule: Date;
  status: Status;
  location: string;
  barber: string;
  reason: string;
  note?: string;
  userId: string;
  cancellationReason?: string | null;
  price?: number; // Added price field
}
