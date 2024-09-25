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
    name: "Stylist 1",
    image: "/path/to/image1.jpg",
    priceMap: {
      "Hair Cutting": 50,
      "Hair Coloring": 100,
      // Add other services and their prices
    },
  },
  {
    name: "Stylist 2",
    image: "/path/to/image2.jpg",
    priceMap: {
      "Hair Cutting": 60,
      "Hair Coloring": 110,
      // Add other services and their prices
    },
  },
  // Add more stylists as needed
];

export const AppointmentOptions = [
  "Hair Cutting",
  "Hair Coloring",
  // Add more appointment reasons as needed
];
export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};
