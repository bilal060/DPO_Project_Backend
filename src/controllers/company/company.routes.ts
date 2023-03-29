import { Router } from 'express';
import * as CompanyController from './company.controller';
import * as CompanyValidator from '../../validators/companies.validator';

import { upload } from '../../middleware/filesUpload';

const router = Router();

router.route('/companyBasicInformation').post(upload.array('files'), CompanyController.CompanyBasicDetails);
router.route('/companyProfileInformation').post( upload.array('files'), CompanyController.CompanyProfileInformation);
router.route('/companyPaymentInformation').post( CompanyValidator.CompanyPaymentInformation, CompanyController.CompanyPaymentInformation);


export default router