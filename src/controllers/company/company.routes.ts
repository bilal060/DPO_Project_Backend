import { Router } from 'express';
import * as CompanyController from './company.controller';
import { upload } from '../../middleware/filesUpload';

const router = Router();

router.route('/companyBasicInformation').post(upload.array('files'), CompanyController.CompanyBasicDetails);
router.route('/companyProfileInformation').post( upload.array('files'), CompanyController.CompanyProfileInformation);


export default router