import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination, paginateResponse, toRegex } from "../utils/paginate.js";
import { assertId } from "../utils/validateId.js";

/** Keys whose "" / undefined value should remove the stored field on update. */
const CLEARABLE_FIELDS = ["age", "gender", "condition", "phone"];

/** search, filter, paginate; embeds doctor info. */
export const listPatients = asyncHandler(async (req, res) => {
  const { search, condition, doctor, from, to } = req.query;
  const { page, limit, skip } = getPagination(req.query);

  const filter = {};
  const searchRx = toRegex(search);
  if (searchRx) {
    filter.$or = [{ name: searchRx }, { phone: searchRx }];
  }
  const conditionRx = toRegex(condition);
  if (conditionRx) filter.condition = conditionRx;
  if (doctor) {
    assertId(doctor);
    filter.doctor = doctor;
  }
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  const [data, total] = await Promise.all([
    Patient.find(filter)
      .populate("doctor", "name specialization")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Patient.countDocuments(filter),
  ]);

  res.json(paginateResponse(data, page, limit, total));
});

/** single patient with doctor details. */
export const getPatient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  assertId(id);

  const patient = await Patient.findById(id)
    .populate("doctor", "name specialization hospital")
    .lean();
  if (!patient) throw new ApiError(404, "Patient not found");

  res.json({ success: true, data: patient });
});

/** update a patient. */
export const updatePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  assertId(id);

  const body = { ...req.body };
  const { doctor } = body;
  if (doctor) {
    assertId(doctor);
    const assigned = await Doctor.findById(doctor).lean();
    if (!assigned) throw new ApiError(400, "Assigned doctor not found");
  }

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
    const current = await Patient.findById(id)
      .populate("doctor", "name specialization")
      .lean();
    if (!current) throw new ApiError(404, "Patient not found");
    return res.json({ success: true, data: current });
  }

  const patient = await Patient.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  })
    .populate("doctor", "name specialization")
    .lean();
  if (!patient) throw new ApiError(404, "Patient not found");

  res.json({ success: true, data: patient });
});

/** remove a patient. */
export const removePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  assertId(id);

  const patient = await Patient.findByIdAndDelete(id).lean();
  if (!patient) throw new ApiError(404, "Patient not found");

  res.json({ success: true, data: patient });
});
