import { Request, Response } from 'express';
import Bookings from '../../models/Booking';
import logger from '../../logger';
import { ObjectId } from 'bson';

export const addBooking = async (req: Request, res: Response) => {
    const { userId, parkingSpaceId, startDate, endDate, totalCost, parkingSpacesToBeConsumed, remainingParkingSpaces, bookingDays } = req.body;
    try {
        const booking = new Bookings({
            userId, parkingSpaceId, startDate, endDate, totalCost, parkingSpacesToBeConsumed, remainingParkingSpaces, bookingDays
        });
        await booking.save()
        if (!booking) {
            logger.log({
                level: 'debug',
                message: 'Error while booking a parking space.',
                consoleLoggerOptions: { label: 'API' }
            });
            return res.status(200).json({
                success: false,
                message: 'Error while booking a parking space.'
            });
        }
        logger.log({
            level: 'debug',
            message: 'Booking is successfully created.',
            consoleLoggerOptions: { label: 'API' }
        });
        return res.status(200).json({
            success: true,
            booking,
            message: 'Booking is successfully created.'
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


export const getAllBookings = async (req: Request, res: Response) => {
    try {
		const { pageNumber, pageSize, startDate, endDate } = req.body;
		const limit = isNaN(pageSize) ? 25 : Number(pageSize)
		const skip = pageNumber > 0 ? limit * pageNumber : 0
		const aggregatedMatch = [];
        startDate && aggregatedMatch.push({ "$match": { "startDate": { $gte: startDate} } })
        endDate && aggregatedMatch.push({ "$match": { "endDate": { $lte: endDate} } })
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


		const bookings = await Bookings.aggregate(query);
		  logger.log({
			level: 'debug',
			message: "Getting Bookings list",
			consoleLoggerOptions: { label: 'API' }
		  });
		  return res.status(200).json({
			success: true,
			bookings: bookings[0].data,
			totalCount: bookings[0].total ?? 0
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


 export const parkingSpaceBookings = async (req: Request, res: Response) => {
    try {
		const { parkingSpaceId, pageNumber, pageSize, startDate, endDate, bookingStatus } = req.body;
		const aggregatedMatch = [];
        const limit = isNaN(pageSize) ? 25 : Number(pageSize)
		const skip = pageNumber > 0 ? limit * pageNumber : 0;
        aggregatedMatch.push({ "$match": { "parkingSpaceId": new ObjectId(parkingSpaceId) } });
        startDate && aggregatedMatch.push({ "$match": { "startDate": { $gte: startDate} } });
        endDate && aggregatedMatch.push({ "$match": { "endDate": { $lte: endDate} } });
        bookingStatus && aggregatedMatch.push({ "$match": { "bookingStatus": bookingStatus }});
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


		const bookings = await Bookings.aggregate(query);
		  logger.log({
			level: 'debug',
			message: "Getting Bookings list against a parking Space.",
			consoleLoggerOptions: { label: 'API' }
		  });
		  return res.status(200).json({
			success: true,
			bookings: bookings[0].data,
			totalCount: bookings[0].total ?? 0
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

