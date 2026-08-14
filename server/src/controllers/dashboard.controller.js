import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/** GET /api/dashboard/summary — headline stats for dashboard cards. */
export const getSummary = asyncHandler(async (_req, res) => {
  const [totalDoctors, totalPatients] = await Promise.all([
    Doctor.countDocuments(),
    Patient.countDocuments(),
  ]);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const newPatientsThisMonth = await Patient.countDocuments({
    createdAt: { $gte: monthStart },
  });

  const avgPerDoctor = totalDoctors
    ? Math.round((totalPatients / totalDoctors) * 10) / 10
    : 0;

  res.json({
    success: true,
    data: { totalDoctors, totalPatients, newPatientsThisMonth, avgPerDoctor },
  });
});

/**
 * Top 10 doctors by number of patients — feeds a bar chart.
 */
export const getPatientsPerDoctor = asyncHandler(async (_req, res) => {
  const data = await Patient.aggregate([
    { $group: { _id: "$doctor", count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "doctors",
        localField: "_id",
        foreignField: "_id",
        as: "doctor",
      },
    },
    { $unwind: { path: "$doctor", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        doctorId: "$_id",
        name: "$doctor.name",
        specialization: "$doctor.specialization",
        count: 1,
      },
    },
  ]);

  res.json({ success: true, data });
});

/** patients vs doctors per bucket. */
export const getTrends = asyncHandler(async (req, res) => {
  const { from, to, period = "daily" } = req.query;

  const filter = {};
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  const format =
    period === "weekly" ? "%Y-W%V" : period === "monthly" ? "%Y-%m" : "%Y-%m-%d";

  /** Groups a collection into { bucketKey, count } rows. */
  const bucket = (collection) =>
    collection
      .aggregate([
        { $match: filter },
        {
          $group: {
            _id: { $dateToString: { format, date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .exec();

  const [patientRows, doctorRows] = await Promise.all([
    bucket(Patient),
    bucket(Doctor),
  ]);

  // Merge both series into one time-ordered array.
  const map = new Map();
  for (const row of patientRows) {
    map.set(row._id, { date: row._id, patients: row.count, doctors: 0 });
  }
  for (const row of doctorRows) {
    const entry = map.get(row._id) || { date: row._id, patients: 0, doctors: 0 };
    entry.doctors = row.count;
    map.set(row._id, entry);
  }

  res.json({ success: true, data: Array.from(map.values()) });
});

/** patient count per condition. */
export const getConditions = asyncHandler(async (_req, res) => {
  const data = await Patient.aggregate([
    {
      $group: {
        _id: { $ifNull: ["$condition", "Unknown"] },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1, _id: 1 } },
    { $project: { _id: 0, name: "$_id", value: "$count" } },
  ]);

  res.json({ success: true, data });
});
