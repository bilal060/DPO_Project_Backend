import { Request, Response } from 'express';
import ParkingSpace from '../../models/ParkingSpace';
import logger from '../../logger';
import { findMissingObjectValues } from '../../helpers/missingCredentials.helper';

export const addNewParkingSpace = async (req: Request, res: Response) => {
    const { name, location, noOfParkingSpaces, perDayCost, perMonthCost, description, longitude, latitude, owner } = req.body;
    const missingValue = await findMissingObjectValues ({ name, location, noOfParkingSpaces, perDayCost, perMonthCost, description })
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
        const images = [];
        if (files.length) {
            for(let i = 1; i< files.length ; i++) {
                images.push(files[i].path)
            }
        }
        const parkingSpace = new ParkingSpace({
            name, location, noOfParkingSpaces, perDayCost, perMonthCost, description, longitude, latitude, owner, images
        });
        await parkingSpace.save()
        if (!parkingSpace) {
            logger.log({
                level: 'debug',
                message: 'Error while creating Parking space.',
                consoleLoggerOptions: { label: 'API' }
            });
            return res.status(200).json({
                success: false,
                message: 'Error while creating Parking space.'
            });
        }
        logger.log({
            level: 'debug',
            message: 'Parking space is successfully created.',
            consoleLoggerOptions: { label: 'API' }
        });
        return res.status(200).json({
            success: true,
            company: parkingSpace,
            message: 'Parking space is successfully created.'
        });
      
    } catch (e) {
      logger.error({
        level: 'debug',
        message: `Internal Server Error occurred while creating parking space. , ${e}`,
        consoleLoggerOptions: { label: 'API' }
      });
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error occurred while creating parking space.'
      });
    }
};
