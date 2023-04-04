import { Request, Response } from 'express';
import Joi from '@hapi/joi';

export const addBooking = async (req: Request, res: Response, next: () => void) => {
    const schema = Joi.object({
      userId: Joi.string()
        .required()
        .label('userId'),
      parkingSpaceId: Joi.string()
        .required()
        .label('parkingSpaceId'),
      startDate: Joi.number().required().label('startDate'),
      endDate: Joi.number().required().label('endDate'),
      totalCost: Joi.number().required().label('totalCost'),
      parkingSpacesToBeConsumed: Joi.number().required().label('parkingSpacesToBeConsumed'),
      remainingParkingSpaces: Joi.number().required().label('remainingParkingSpaces'),
      bookingDays: Joi.number().required().label('bookingDays'),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(422).json({ message: error.details[0].message });
    }
    return next();
  }


  export const getAllBookings = async (req: Request, res: Response, next: () => void) => {
    const schema = Joi.object({
      startDate: Joi.number().label('startDate'),
      endDate: Joi.number().label('endDate'),
      pageNumber: Joi.number().required().label('pageNumber'),
      pageSize: Joi.number().required().label('pageSize'),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(422).json({ message: error.details[0].message });
    }
    return next();
  }


  export const parkingSpaceBookings = async (req: Request, res: Response, next: () => void) => {
    const schema = Joi.object({
      startDate: Joi.number().label('startDate'),
      endDate: Joi.number().label('endDate'),
      pageNumber: Joi.number().required().label('pageNumber'),
      pageSize: Joi.number().required().label('pageSize'),
      parkingSpaceId: Joi.string().label('parkingSpaceId'),
      bookingStatus: Joi.string().label('bookingStatus')
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(422).json({ message: error.details[0].message });
    }
    return next();
  }