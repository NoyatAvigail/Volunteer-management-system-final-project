import Joi from 'joi';

export const volunteerSchema = Joi.object({
  id: Joi.number().required(),
  fullName: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().required(),
  type: Joi.number().required(),
  gender: Joi.number().required(),
  sector: Joi.number().required(),
  address: Joi.string().required(),
  preferredDepartments: Joi.array().items(Joi.number()).required(),
  preferredHospitals: Joi.array().items(Joi.number()).required(),
  // שדות נוספים...
});
