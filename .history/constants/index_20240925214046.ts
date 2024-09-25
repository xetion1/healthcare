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
    priceMap: {
      "Hair cutting": 20,
      "Hair coloring": 40,
      "Beard cutting": 15,
    },
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Dovilė",
    priceMap: {
      "Hair cutting": 25,
      "Hair coloring": 50,
      "Beard cutting": 18,
    },
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "Herkus",
    priceMap: {
      "Hair cutting": 22,
      "Hair coloring": 45,
      "Beard cutting": 20,
    },
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Mindaugas",
    priceMap: {
      "Hair cutting": 18,
      "Hair coloring": 35,
      "Beard cutting": 12,
    },
  },
];
export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};
