import mongoose from "mongoose";
import Patient from "../models/Patient.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination, paginateResponse, toRegex } from "../utils/paginate.js";

/** Throws 400 if id is not a valid ObjectId */
const assertId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid id format");
  }
};

/** search, filter, paginate; embeds doctor info. */
export const listPatients = asyncHandler(async (req, res) => {
  const { search, condition, doctor, from, to } = req.query;
  const { page, limit, skip } = getPagination(req.query);

  const filter = {};
  const searchRx = toRegex(search);
  if (searchRx) {
    filter.$or = [{ name: searchRx }, { phone: searchRx }];
  }
  if (condition) filter.condition = condition;
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

  const patient = await Patient.findByIdAndUpdate(id, req.body, {
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
