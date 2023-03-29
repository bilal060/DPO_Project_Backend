import { Request, Response } from 'express';
import Users from '../../models/User';
import logger from '../../logger';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
		const { pageNumber, pageSize, email } = req.body;
		const limit = isNaN(pageSize) ? 25 : Number(pageSize)
		const skip = pageNumber > 0 ? limit * pageNumber : 0
		const aggregatedMatch = [];
		email && aggregatedMatch.push({ "$match": { "email": { $regex: `.*${email}.*`, $options: 'i' } } });
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


		const users = await Users.aggregate(query);
		  logger.log({
			level: 'debug',
			message: "Getting users list",
			consoleLoggerOptions: { label: 'API' }
		  });
		  return res.status(200).json({
			success: true,
			users: users[0].data,
			totalCount: users[0].total ?? 0
		  });
	} catch (e) {
		logger.log({
			level: 'debug',
			message: `Error while Getting users list , ${e}`,
			consoleLoggerOptions: { label: 'API' }
		});
		return res.status(500).json({
			success: false,
			message: 'Error while Getting users list'
		});
	}
};

