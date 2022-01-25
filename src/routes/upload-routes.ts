import express from 'express'

import { requireAdmin } from "../middlewares/require-admin";
import uploadImage from '../controllers/upload/upload-image';

const router = express.Router()

router.post('/api/upload/image',  uploadImage )


export { router as uploadRoutes };