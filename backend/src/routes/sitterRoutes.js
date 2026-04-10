import express from 'express';
import { searchSitters, getSitterProfile } from '../controllers/sitterController.js';

const router = express.Router();

router.get('/', searchSitters);
router.get('/:id', getSitterProfile);

export default router;
