import express from 'express';
import {
    getPets,
    getPetById,
    createPet,
    updatePet,
    deletePet
} from '../controllers/petController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(protect, getPets)
    .post(protect, createPet);

router.route('/:id')
    .get(protect, getPetById)
    .put(protect, updatePet)
    .delete(protect, deletePet);

export default router;
