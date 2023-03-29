import { Request, Response } from 'express';
import Companies from '../../models/Company';
import logger from '../../logger';
import { findMissingObjectValues } from '../../helpers/missingCredentials.helper';

export const CompanyBasicDetails = async (req: Request, res: Response) => {
    const { companyName, legalAddress, fein, companyCredentials, profileCompletionStep } = req.body;
    const missingValue = await findMissingObjectValues ({ companyName, legalAddress, fein, companyCredentials, profileCompletionStep })
    if (missingValue) {
        logger.log({
            level: 'debug',
            message: missingValue,
            consoleLoggerOptions: { label: 'API' }
          });
          return res.status(422).json({
            success: false,
            message: missingValue
          });
    }
    const files: any = req?.files;
    const owndershipProof = files[0].path;
    const identificationProof = files[1].path;
    try {
      const companyDetails = await Companies.findOne({ companyName: companyName });
      if (companyDetails) {
        return res.status(200).json({
          success: false,
          message: 'Company Already Exist against this Name.'
        });
      } else {
        const createdUser = new Companies({ companyName, legalAddress, fein, companyCredentials, profileCompletionStep, owndershipProof, identificationProof })
        await createdUser.save();
  
        logger.log({
          level: 'debug',
          message: 'Company details are successfully Added.',
          consoleLoggerOptions: { label: 'API' }
        });
        return res.status(200).json({
          success: true,
          userId: createdUser._id,
          message: 'Company details are successfully Added'
        });
      }
    } catch (e) {
      logger.error({
        level: 'debug',
        message: `Internal Server Error occurred while adding company details  , ${e}`,
        consoleLoggerOptions: { label: 'API' }
      });
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error occurred while adding company details'
      });
    }
};
