import { verifyToken } from '../helpers/jwt.helper';
import { Request, Response } from 'express';
import HttpStatus from 'http-status';
import Users from '../models/User'


export async function isAuthorized(req: Request, res: Response, next: () => void) {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decodedToken: any = await verifyToken(token);
      if (decodedToken) {
        const user = await Users.findOne({ _id: decodedToken.uid });
        if (!user) {
          return res
            .status(HttpStatus.UNAUTHORIZED)
            .json({ authorization: [{ message: 'Unauthorized' }] });
        }
        res.locals.user = user;
        return next();
      } else {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ authorization: [{ message: 'Unauthorized' }] });
      }
    } catch (err) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ authorization: [{ message: err ? err : 'Unauthorized' }] });
    }
  } else {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ authorization: [{ message: 'Unauthorized' }] });
  }
}