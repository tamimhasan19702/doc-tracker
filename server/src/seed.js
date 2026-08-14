import mongoose from "mongoose";
import env from "./config/env.js";
import User from "./models/User.js";
import Doctor from "./models/Doctor.js";
import Patient from "./models/Patient.js";

// Sample data pools for realistic seed records.
const SPECIALIZATIONS = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Dermatology",
  "Orthopedics",
  "Oncology",
  "General Medicine",
  "Ophthalmology",
  "Psychiatry",
  "Gynecology",
];

const HOSPITALS = [
  "City General Hospital",
  "St. Mary's Medical Center",
  "Green Valley Clinic",
  "Lakeside Health Center",
  "Sunrise Hospital",
];

const CONDITIONS = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Migraine",
  "Arthritis",
  "Heart Disease",
  "Flu",
  "Anemia",
  "Allergy",
  "Fracture",
];

const FIRST_NAMES = [
  "James",
  "Mary",
  "Robert",
  "Patricia",
  "John",
  "Jennifer",
  "Michael",
  "Linda",
  "David",
  "Elizabeth",
  "William",
  "Susan",
  "Richard",
  "Jessica",
  "Joseph",
  "Sarah",
  "Thomas",
  "Karen",
  "Charles",
  "Nancy",
];

const LAST_NAMES = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
];

/** Date n days ago at a random time. @param {number} n @returns {Date} */
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(rand(0, 23), rand(0, 59), 0, 0);
  return d;
}

/** Random int in [min, max]. */
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Random element of an array. */
function pick(arr) {
  return arr[rand(0, arr.length - 1)];
}

/** Wipes data, then inserts admin + doctors + patients. */
async function seed() {
  await mongoose.connect(env.mongodbUri);
  console.log("[seed] connected to", env.mongodbUri);

  await Promise.all([
    User.deleteMany({}),
    Doctor.deleteMany({}),
    Patient.deleteMany({}),
  ]);

  await User.create({
    name: "Admin",
    email: "admin@doctor.app",
    password: "admin123",
    role: "admin",
  });
  console.log("[seed] admin user -> admin@doctor.app / admin123");

  // Staggered createdAt dates give the trends chart meaningful spread.
  const doctors = [];
  for (let i = 0; i < 10; i++) {
    doctors.push(
      await Doctor.create({
        name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
        specialization: SPECIALIZATIONS[i],
        hospital: pick(HOSPITALS),
        phone: `+1-555-01${String(i).padStart(2, "0")}`,
        email: `doctor${i + 1}@clinic.example`,
        createdAt: daysAgo(rand(30, 180)),
      })
    );
  }

  const patients = [];
  for (let i = 0; i < 30; i++) {
    patients.push({
      name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
      age: rand(5, 85),
      gender: pick(["male", "female", "other"]),
      condition: pick(CONDITIONS),
      phone: `+1-555-02${String(i).padStart(2, "0")}`,
      doctor: doctors[rand(0, doctors.length - 1)]._id,
      createdAt: daysAgo(rand(0, 170)),
    });
  }
  await Patient.insertMany(patients);

  console.log(
    `[seed] done: 1 admin, ${doctors.length} doctors, ${patients.length} patients`
  );
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("[seed] failed", err);
  process.exit(1);
});
