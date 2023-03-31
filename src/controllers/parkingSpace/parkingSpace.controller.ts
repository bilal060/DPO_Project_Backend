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

export const getAllParkingSpaces = async (req: Request, res: Response) => {
    try {
		const { pageNumber, pageSize, name } = req.body;
		const limit = isNaN(pageSize) ? 25 : Number(pageSize)
		const skip = pageNumber > 0 ? limit * pageNumber : 0
		const aggregatedMatch = [];
		name && aggregatedMatch.push({ "$match": { "type": { $regex: `.*${name}.*`, $options: 'i' } } });
		const query = [
			...aggregatedMatch,
			{
			  $facet: {
				data: [
				  { $skip: skip },
				  { $limit: limit }
				],
                metadata: [
                    { $count: "total" }
				],
			  }
			},
			// organise the output data
			{
			  $project: {
				data: 1,
				// Get total from the first element of the metadata array
				total: { $arrayElemAt: ['$metadata.total', 0] }
			  }
			}
		  ];


		const parkingSpaces = await ParkingSpace.aggregate(query);
		  logger.log({
			level: 'debug',
			message: "Getting Parking Spaces list",
			consoleLoggerOptions: { label: 'API' }
		  });
		  return res.status(200).json({
			success: true,
			parkingSpaces: parkingSpaces[0].data,
			totalCount: parkingSpaces[0].total ?? 0
		  });
	} catch (e) {
		logger.log({
			level: 'debug',
			message: `Error while Getting Parking Spaces list , ${e}`,
			consoleLoggerOptions: { label: 'API' }
		});
		return res.status(500).json({
			success: false,
			message: 'Error while Getting Parking spaces list'
		});
	}
};

export const getParkingSpaceDetails = async (req: Request, res: Response) => {
    try {
		const { id } = req.params;
		const parkingSpaceDetails = await ParkingSpace.findById(id);
		  logger.log({
			level: 'debug',
			message: "Getting Parking Space Details",
			consoleLoggerOptions: { label: 'API' }
		  });
		  return res.status(200).json({
			success: true,
			parkingSpaceDetails
		  });
	} catch (e) {
		logger.log({
			level: 'debug',
			message: `Error while Getting Parking Space Details , ${e}`,
			consoleLoggerOptions: { label: 'API' }
		});
		return res.status(500).json({
			success: false,
			message: 'Error while Getting Parking space Details'
		});
	}
};

export const updateParkingDetails = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, location, noOfParkingSpaces, perDayCost, perMonthCost, description, longitude, latitude, owner, manager } = req.body;
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
        let images: any = [];
        if (files.length) {
            const parkingSpaceDetails = await ParkingSpace.findById(id);
            if (!parkingSpaceDetails) {
                logger.log({
                    level: 'debug',
                    message: 'Error while updating parking details.',
                    consoleLoggerOptions: { label: 'API' }
                });
                return res.status(200).json({
                    success: true,
                    message: 'Error while updating parking details.'
                });
            } else {
                images = [...parkingSpaceDetails.images]
                for(let i = 1; i< files.length ; i++) {
                    images.push(files[i].path)
                }
            }
            
        }
		const updatedParkingSpace = await ParkingSpace.findOneAndUpdate({ _id: id }, {
            name, location, noOfParkingSpaces, perDayCost, perMonthCost, description, longitude, latitude, owner, manager, images
        },
        { new: true });
        if (updatedParkingSpace) {
            logger.log({
                level: 'debug',
                message: 'Parking Space is successfully Updated.',
                consoleLoggerOptions: { label: 'API' }
            });
            return res.status(200).json({
                success: true,
                message: 'Parking Space is successfully Updated.'
            });
        }
	} catch (e) {
		logger.log({
			level: 'debug',
			message: `Error while updating Parking Space Details , ${e}`,
			consoleLoggerOptions: { label: 'API' }
		});
		return res.status(500).json({
			success: false,
			message: 'Error while updating Parking space Details'
		});
	}
};

export const assignUserToParkingSpace =  async (req: Request, res: Response) => {
    const { type, value, id } = req.body;
    console.log({ type, value, id })
    const missingValue = await findMissingObjectValues ({ type, value })
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
		const updatedParkingSpace = await ParkingSpace.findOneAndUpdate({ _id: id }, {
            [type]: value
        },
        { new: true });
        if (updatedParkingSpace) {
            logger.log({
                level: 'debug',
                message: 'User is successfully Attached to Parking Space.',
                consoleLoggerOptions: { label: 'API' }
            });
            return res.status(200).json({
                success: true,
                message: 'User is successfully Attached to Parking Space.'
            });
        }
	} catch (e) {
		logger.log({
			level: 'debug',
			message: `Error while updating Parking Space Details , ${e}`,
			consoleLoggerOptions: { label: 'API' }
		});
		return res.status(500).json({
			success: false,
			message: 'Error while updating Parking space Details'
		});
	}
};
