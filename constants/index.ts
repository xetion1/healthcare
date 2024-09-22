export const GenderOptions = ["Male", "Female", "Other"];
export const AppointmentOptions = [
  "Hair cutting",
  "Hair coloring",
  "Beard cutting",
];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "Male" as Gender,
  primaryPhysician: "",
  allergies: "",
  pastMedicalHistory: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "Greta",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Dovilė",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "Herkus",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Mindaugas",
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};
