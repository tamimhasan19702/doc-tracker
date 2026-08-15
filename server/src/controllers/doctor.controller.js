import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination, paginateResponse, toRegex } from "../utils/paginate.js";
import { assertId } from "../utils/validateId.js";

/** Builds a { createdAt: { $gte, $lte } } filter from ?from= and ?to=. */
const dateFilter = (from, to) => {
  if (!from && !to) return {};
  const range = {};
  if (from) range.$gte = new Date(from);
  if (to) range.$lte = new Date(to);
  return { createdAt: range };
};

/** Keys whose "" / undefined value should remove the stored field on update. */
const CLEARABLE_FIELDS = ["specialization", "hospital", "phone", "email"];

/** GET /api/doctors — search, filter and paginate doctors. */
export const listDoctors = asyncHandler(async (req, res) => {
  const { search, specialization, hospital, from, to } = req.query;
  const { page, limit, skip } = getPagination(req.query);

  const filter = {};
  const searchRx = toRegex(search);
  if (searchRx) {
    filter.$or = [
      { name: searchRx },
      { specialization: searchRx },
      { hospital: searchRx },
      { email: searchRx },
      { phone: searchRx },
    ];
  }
  const specializationRx = toRegex(specialization);
  if (specializationRx) filter.specialization = specializationRx;
  const hospitalRx = toRegex(hospital);
  if (hospitalRx) filter.hospital = hospitalRx;
  Object.assign(filter, dateFilter(from, to));

  const [data, total] = await Promise.all([
    Doctor.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Doctor.countDocuments(filter),
  ]);

  res.json(paginateResponse(data, page, limit, total));
});

/** GET /api/doctors/:id — single doctor plus assigned patient count. */
export const getDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  assertId(id);

  const doctor = await Doctor.findById(id).lean();
  if (!doctor) throw new ApiError(404, "Doctor not found");

  const patientCount = await Patient.countDocuments({ doctor: id });
  res.json({ success: true, data: { ...doctor, patientCount } });
});

/** POST /api/doctors — create a doctor. */
export const createDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.create(req.body);
  res.status(201).json({ success: true, data: doctor });
});

/** PUT /api/doctors/:id — update a doctor. */
export const updateDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  assertId(id);

  const body = { ...req.body };
  const unset = {};
  for (const key of CLEARABLE_FIELDS) {
    if (body[key] === undefined) {
      unset[key] = 1;
      delete body[key];
    }
  }

  const update = {};
  if (Object.keys(body).length) update.$set = body;
  if (Object.keys(unset).length) update.$unset = unset;

  if (Object.keys(update).length === 0) {
    const current = await Doctor.findById(id).lean();
    if (!current) throw new ApiError(404, "Doctor not found");
    return res.json({ success: true, data: current });
  }

  const doctor = await Doctor.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  }).lean();
  if (!doctor) throw new ApiError(404, "Doctor not found");

  res.json({ success: true, data: doctor });
});

/** DELETE /api/doctors/:id — refuses deletion while patients are assigned. */
export const removeDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  assertId(id);

  const patientCount = await Patient.countDocuments({ doctor: id });
  if (patientCount > 0) {
    throw new ApiError(
      400,
      `Cannot delete doctor: ${patientCount} patient(s) still assigned. Reassign or remove them first.`
    );
  }

  const doctor = await Doctor.findByIdAndDelete(id).lean();
  if (!doctor) throw new ApiError(404, "Doctor not found");

  res.json({ success: true, data: doctor });
});

/** GET /api/doctors/:id/patients — paginated patients of one doctor. */
export const listDoctorPatients = asyncHandler(async (req, res) => {
  const { id } = req.params;
  assertId(id);
  const { page, limit, skip } = getPagination(req.query);

  const filter = { doctor: id };
  const [data, total] = await Promise.all([
    Patient.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Patient.countDocuments(filter),
  ]);

  res.json(paginateResponse(data, page, limit, total));
});

/** POST /api/doctors/:id/patients — create a patient under this doctor. */
export const addDoctorPatient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  assertId(id);

  const doctor = await Doctor.findById(id).lean();
  if (!doctor) throw new ApiError(404, "Doctor not found");

  const patient = await Patient.create({ ...req.body, doctor: id });
  res.status(201).json({ success: true, data: patient });
});
