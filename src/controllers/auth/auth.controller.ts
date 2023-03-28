import { Request, Response } from 'express';
import Users from '../../models/User';
import logger from '../../logger';
import { createToken } from '../../helpers/jwt.helper';
import { hashData, verifyHashedData } from '../../helpers/dataHashing.helper';
import cryptoJs from 'crypto';
import { sendEmailWithLink } from '../../helpers/emailGeneration.helper'

export const signup = async (req: Request, res: Response) => {
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
        message: 'Account is successfully Created.',
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


export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({ email: email });
    if (!user) {
      logger.log({
        level: 'debug',
        message: 'Account Does Not Exist',
        consoleLoggerOptions: { label: 'API' }
      });
      return res.status(200).json({
        success: false,
        message: 'Account Does Not Exist'
      });
    } else {
      const checkPassword = await verifyHashedData(password, user.password);
      if (!checkPassword) {
        logger.log({
          level: 'debug',
          message: "Password is Incorrect",
          consoleLoggerOptions: { label: 'API' }
        });
        return res.status(200).json({
          success: false,
          message: "Password is Incorrect"
        });
      } else {
        const tokenObj = {
          uid: user.id,
        };
        const jwtToken = await createToken(tokenObj);
        logger.log({
          level: 'debug',
          message: 'Successfully Created Token.',
          consoleLoggerOptions: { label: 'API' }
        });

        return res.status(200).json({
          success: true,
          user: { email: user.email, id: user._id, type: user.type},
          userAuthToken: jwtToken,
          message: 'Successfully Sign in.'
        });
      }
    }
  } catch (e) {
    logger.error({
      level: 'debug',
      message: `${'Signin Failure'} , ${e}`,
      consoleLoggerOptions: { label: 'API' }
    });
    return res.status(500).json({
      success: false,
      message: 'Signin Failure'
    });
  }
};



export const forgetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await Users.findOne({ email: email });
    if (!user) {
      logger.log({
        level: 'debug',
        message: 'User Does not exist.',
        consoleLoggerOptions: { label: 'API' }
      });
      return res.status(200).json({
        success: false,
        message: 'User Does not exist.'
      });
    } else {
      const resetPasswordToken = cryptoJs.randomBytes(48).toString('hex');
      const resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await Users.updateOne({ email: email }, { resetPasswordToken, resetPasswordExpires })
      const appName = process.env.APP_NAME;
      const resetPasswordLink = 'http://' + req.headers.host + '/reset-password?resetToken=' + resetPasswordToken + '\n\n'
      const response = await sendEmailWithLink({email, resetPasswordLink, appName, email_subject: 'Password Reset', emailTemplateLink: __dirname + "/views/email-template.ejs"});
      if (response && response.accepted.length) {
        logger.log({
          level: 'debug',
          message: "Reset Password Email successfully sent.",
          consoleLoggerOptions: { label: 'API' }
        });
        return res.status(200).json({
          success: true,
          message: "Reset Password Email successfully sent."
        });
      } else {
        logger.log({
          level: 'debug',
          message: "Error during Reset Password Email sent.",
          consoleLoggerOptions: { label: 'API' }
        });
        return res.status(500).json({
          success: true,
          message: "Error during Reset Password Email sent."
        });
      }
    }
  } catch (e) {
    logger.log({
      level: 'debug',
      message: `Internal Server Error occurred while sending email for password reset. , ${e}`,
      consoleLoggerOptions: { label: 'API' }
    });
    return res.status(500).json({
      success: false,
      message: "Internal Server Error occurred while sending email for password reset."
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { resetPasswordToken, password } = req.body;
  try {
    const user = await Users.findOne({ resetPasswordToken: resetPasswordToken, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
      logger.log({
        level: 'debug',
        message: "Sorry, Password reset token is invalid or has expired.",
        consoleLoggerOptions: { label: 'API' }
      });
      return res.status(200).json({
        success: false,
        message: "Sorry, Password reset token is invalid or has expired."
      });
    } else {
      const saltRounds = 10;
      const HASHED_PASSWORD = await hashData(password, saltRounds);
      await Users.updateOne({ resetPasswordToken: resetPasswordToken }, { resetPasswordToken: undefined, resetPasswordExpires: undefined, password: HASHED_PASSWORD })
      logger.log({
        level: 'debug',
        message: "Password is successfully reset",
        consoleLoggerOptions: { label: 'API' }
      });
      return res.status(200).json({
        success: true,
        message: "Password is successfully reset"
      });
    }
  } catch (e) {
    logger.log({
      level: 'debug',
      message: `Error while resetting password, ${e}`,
      consoleLoggerOptions: { label: 'API' }
    });
    return res.status(500).json({
      success: false,
      message: 'Error while resetting password'
    });
  }
};

