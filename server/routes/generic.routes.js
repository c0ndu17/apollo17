import { Router } from 'express';
import * as GenericController from '../controllers/generic.controller';
const router = new Router();

// Get all Posts
router.route('/generic').get(GenericController.getGeneric);

export default router;
