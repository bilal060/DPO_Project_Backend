import { Request, Response } from 'express';
import Companies from '../../models/Company';
import Users from '../../models/User';
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
    const owndershipProof = files && files[0]?.path;
    const identificationProof = files && files[1]?.path;
    try {
      const companyDetails = await Companies.findOne({ companyName: companyName });
      if (companyDetails) {
        return res.status(200).json({
          success: false,
          message: 'Company Already Exist against this Name.'
        });
      } else {
        const createdCompany = new Companies({ companyName, legalAddress, fein, companyCredentials, profileCompletionStep, owndershipProof, identificationProof })
        await createdCompany.save();
  
        logger.log({
          level: 'debug',
          message: 'Company details are successfully Added.',
          consoleLoggerOptions: { label: 'API' }
        });
        return res.status(200).json({
          success: true,
          company: createdCompany,
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


export const CompanyProfileInformation = async (req: Request, res: Response) => {
    const { companyDescription, companyLocation, availableSpace, companyId, profileCompletionStep } = req.body;
    const missingValue = await findMissingObjectValues ({ companyDescription, companyLocation, availableSpace, companyId, profileCompletionStep })
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
    try {
        const files: any = req?.files;
        const companyProfilePicture = files && files[0]?.path ? files[0].path : '';
        const propertyPhotos = [];
        if (files.length >= 2) {
            for(let i = 1; i< files.length ; i++) {
                propertyPhotos.push(files[i].path)
            }
        }
        const companyDetails = await Companies.findOneAndUpdate({ _id: companyId }, {
            companyDescription,
            companyLocation,
            availableSpace,
            profileCompletionStep,
            companyProfilePicture,
            propertyPhotos
        },
        { new: true });
        if (!companyDetails) {
            logger.log({
                level: 'debug',
                message: 'Error while updating company details.',
                consoleLoggerOptions: { label: 'API' }
            });
            return res.status(200).json({
                success: false,
                message: 'Error while updating company details.'
            });
        }
        logger.log({
            level: 'debug',
            message: 'Company details are successfully Updated.',
            consoleLoggerOptions: { label: 'API' }
        });
        return res.status(200).json({
            success: true,
            company: companyDetails,
            message: 'Company details are successfully Updated'
        });
      
    } catch (e) {
      logger.error({
        level: 'debug',
        message: `Internal Server Error occurred while updating company details  , ${e}`,
        consoleLoggerOptions: { label: 'API' }
      });
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error occurred while updating company details'
      });
    }
};

export const CompanyPaymentInformation = async (req: Request, res: Response) => {
    const { bankName, bankAddress, routingNumber, accountNumber, profileCompletionStep, companyId } = req.body;
    const missingValue = await findMissingObjectValues ({  bankName, bankAddress, routingNumber, accountNumber, profileCompletionStep, companyId })
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
    try {
        const companyDetails = await Companies.findOneAndUpdate({ _id: companyId }, {
            bankName, bankAddress, routingNumber, accountNumber, profileCompletionStep
        },
        { new: true });
        if (!companyDetails) {
            logger.log({
                level: 'debug',
                message: 'Error while updating company details.',
                consoleLoggerOptions: { label: 'API' }
            });
            return res.status(200).json({
                success: false,
                message: 'Error while updating company details.'
            });
        } else if (companyDetails) {
            const usersUpdation = await Users.findOneAndUpdate({ _id: companyDetails.companyCredentials }, {
                isProfileCompleted:  true
            },
            { new: true });
            if (!usersUpdation) {
                logger.log({
                    level: 'debug',
                    message: 'Error while updating company credentials details.',
                    consoleLoggerOptions: { label: 'API' }
                });
                return res.status(200).json({
                    success: false,
                    message: 'Error while updating company credentials details.'
                });
            }

        }
        logger.log({
            level: 'debug',
            message: 'Company Payment details are successfully Updated.',
            consoleLoggerOptions: { label: 'API' }
        });
        return res.status(200).json({
            success: true,
            company: companyDetails,
            message: 'Company Payment details are successfully Updated'
        });
      
    } catch (e) {
      logger.error({
        level: 'debug',
        message: `Internal Server Error occurred while updating company details  , ${e}`,
        consoleLoggerOptions: { label: 'API' }
      });
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error occurred while updating company details'
      });
    }
};
