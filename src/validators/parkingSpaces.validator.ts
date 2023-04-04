import { Request, Response } from 'express';
import Joi from '@hapi/joi';

export const getAllParkingSpaces = async (req: Request, res: Response, next: () => void) => {
	const schema = Joi.object({
		name: Joi.string().label('name'),
		pageNumber: Joi.number().required().label('pageNumber'),
		pageSize: Joi.number().required().label('pageSize'),
	});
	const { error } = schema.validate(req.body);
	if (error) {
		return res.status(422).json({ message: error.details[0].message });
	}
	return next();
}

export const getParkingSpaceDetails = async (req: Request, res: Response, next: () => void) => {
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

  
  

  export const assignUserToParkingSpace = async (req: Request, res: Response, next: () => void) => {
    const schema = Joi.object({
      id: Joi.string()
        .required()
        .label('id'),
        type: Joi.string().required().label('type'),
		    value: Joi.string().required().label('value'),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(422).json({ message: error.details[0].message });
    }
    return next();
  }
