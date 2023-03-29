import { Request, Response } from 'express';
import Joi from '@hapi/joi';

export const CompanyPaymentInformation = async (req: Request, res: Response, next: () => void) => {
  const schema = Joi.object({
    bankName: Joi.string()
      .required()
      .label('bankName'),
    bankAddress: Joi.string().required().label('bankAddress'),
    routingNumber: Joi.string().required().label('routingNumber'),
    accountNumber: Joi.string().required().label('accountNumber'),
    profileCompletionStep: Joi.string().label('profileCompletionStep'),
    companyId: Joi.string().required().label('companyId'),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(422).json({ message: error.details[0].message });
  }
  return next();
}

// bankName, bankAddress, routingNumber, accountNumber, profileCompletionStep, companyId