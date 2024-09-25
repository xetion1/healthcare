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
    price: 20, // Price for Greta's services
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Dovilė",
    price: 25, // Price for Dovilė's services
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "Herkus",
    price: 22, // Price for Herkus' services
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Mindaugas",
    price: 18, // Price for Mindaugas' services
  },
];
export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};
