import { Request, Response } from 'express';
import Joi from '@hapi/joi';

export const signup = async (req: Request, res: Response, next: () => void) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .label('email'),
    password: Joi.string().required().label('password'),
    type: Joi.string().required().label('type'),
    phone: Joi.string().label('phone')
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }
  return next();
}

export const login = async (req: Request, res: Response, next: () => void) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .label('email'),
    password: Joi.string().required().label('password')
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }
  return next();
}

export const forgetPassword = async (req: Request, res: Response, next: () => void) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .label('email')
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }
  return next();
}


export const resetPassword = async (req: Request, res: Response, next: () => void) => {
  const schema = Joi.object({
    resetPasswordToken: Joi.string()
      .required()
      .label('resetPasswordToken'),
    password: Joi.string().required().label('password')
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }
  return next();
}


export const getAllUsers = async (req: Request, res: Response, next: () => void) => {
	const schema = Joi.object({
		type: Joi.string().label('email'),
		pageNumber: Joi.number().required().label('pageNumber'),
		pageSize: Joi.number().required().label('pageSize'),
	});
	const { error } = schema.validate(req.body);
	if (error) {
		return res.status(422).json({ message: error.details[0].message });
	}
	return next();
}

export const changeUserRole = async (req: Request, res: Response, next: () => void) => {
  const schema = Joi.object({
    id: Joi.string()
      .required()
      .label('id'),
    type: Joi.string().required().label('type')
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }
  return next();
}


export const userActivation = async (req: Request, res: Response, next: () => void) => {
  const schema = Joi.object({
    id: Joi.string()
      .required()
      .label('id'),
      isDeactivated: Joi.boolean().required().label('isDeactivated')
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }
  return next();
}

export const userDeletion = async (req: Request, res: Response, next: () => void) => {
  const schema = Joi.object({
    id: Joi.string()
      .required()
      .label('id'),
  });
  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }
  return next();
}

