import { Router } from 'express';
import * as CompanyController from './company.controller';
import { upload } from '../../middleware/filesUpload';

const router = Router();

router.route('/companyBasicInformation').post(upload.array('files'), CompanyController.CompanyBasicDetails);


export default router