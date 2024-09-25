// constants/index.ts

export const GenderOptions = ["Male", "Female", "Other"];

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

export const Locations = [
  {
    name: "Barber Shop A",
    address: "Main Street 1, Kaunas",
  },
  {
    name: "Barber Shop B",
    address: "Old Town 5, Kaunas",
  },
];

export const Barbers = [
  {
    name: "John",
    image: "/images/barbers/john.jpg",
    locations: ["Barber Shop A"],
    schedule: {
      "Barber Shop A": ["Monday", "Wednesday", "Friday"],
    },
    priceMap: {
      "Hair Cutting": 20,
      "Hair Coloring": 50,
    },
  },
  {
    name: "Mike",
    image: "/images/barbers/mike.jpg",
    locations: ["Barber Shop B"],
    schedule: {
      "Barber Shop B": ["Tuesday", "Thursday", "Saturday"],
    },
    priceMap: {
      "Hair Cutting": 22,
      "Hair Coloring": 55,
    },
  },
  {
    name: "Anna",
    image: "/images/barbers/anna.jpg",
    locations: ["Barber Shop A", "Barber Shop B"],
    schedule: {
      "Barber Shop A": ["Sunday"],
      "Barber Shop B": ["Sunday"],
    },
    priceMap: {
      "Hair Cutting": 25,
      "Hair Coloring": 60,
    },
  },
];

export const AppointmentOptions = ["Hair Cutting", "Hair Coloring"];

export const DaysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};
/Users/aadnostux / Desktop / autos -
  template -
  main / healthcare / constants / index.ts;
