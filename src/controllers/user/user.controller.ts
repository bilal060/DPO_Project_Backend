import { Request, Response } from 'express';
import Users from '../../models/User';
import logger from '../../logger';
import { hashData } from '../../helpers/dataHashing.helper';


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

export const addNewUser = async (req: Request, res: Response) => {
    const { email, password, type } = req.body;
  
    const HASHED_PASSWORD = await hashData(password);
  
    try {
      const userCredential = await Users.findOne({ email: email });
      if (userCredential) {
        return res.status(200).json({
          success: false,
          message: 'Account Already Exist against this Email.'
        });
      } else {
        const createdUser = new Users({ email, password: HASHED_PASSWORD, type })
        await createdUser.save();
  
        logger.log({
          level: 'debug',
          message: 'User is successfully Added.',
          consoleLoggerOptions: { label: 'API' }
        });
        return res.status(200).json({
          success: true,
          userId: createdUser._id,
          message: 'User is successfully Added.'
        });
      }
    } catch (e) {
      logger.error({
        level: 'debug',
        message: `Internal Server Error occurred while adding a new user  , ${e}`,
        consoleLoggerOptions: { label: 'API' }
      });
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error occurred while adding a new user'
      });
    }
};


export const changeUserRole = async (req: Request, res: Response) => {
    const { id, type } = req.body;
    try {
      const updatedUser = await Users.findOneAndUpdate({ _id: id }, {
            type
        },
        { new: true });
      if (updatedUser) {
        logger.log({
          level: 'debug',
          message: 'User Role is successfully Updated.',
          consoleLoggerOptions: { label: 'API' }
        });
        return res.status(200).json({
          success: true,
          message: 'User Role is successfully Updated.'
        });
      }
    } catch (e) {
      logger.error({
        level: 'debug',
        message: `Internal Server Error occurred while updating user role  , ${e}`,
        consoleLoggerOptions: { label: 'API' }
      });
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error occurred while updating user role '
      });
    }
};
  
  


export const userActivation = async (req: Request, res: Response) => {
    const { id, isDeactivated } = req.body;
    try {
      const updatedUser = await Users.findOneAndUpdate({ _id: id }, {
        isDeactivated
        },
        { new: true });
      const message = isDeactivated ? 'User is successfully Deactivated' : 'User is successfully Activated';
      if (updatedUser) {
        logger.log({
          level: 'debug',
          message,
          consoleLoggerOptions: { label: 'API' }
        });
        return res.status(200).json({
          success: true,
          message
        });
      }
    } catch (e) {
      logger.error({
        level: 'debug',
        message: `Internal Server Error occurred while updating user activation status  , ${e}`,
        consoleLoggerOptions: { label: 'API' }
      });
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error occurred while updating user activation status  '
      });
    }
};
  



export const userDeletion = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const deletedUser = await Users.deleteOne({ _id: id });
      if (deletedUser) {
        logger.log({
          level: 'debug',
          message : 'User is successfully deleted.',
          consoleLoggerOptions: { label: 'API' }
        });
        return res.status(200).json({
          success: true,
          message : 'User is successfully deleted.',
        });
      }
    } catch (e) {
      logger.error({
        level: 'debug',
        message: `Internal Server Error occurred while deleting user  , ${e}`,
        consoleLoggerOptions: { label: 'API' }
      });
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error occurred while deleting user  '
      });
    }
};
  

