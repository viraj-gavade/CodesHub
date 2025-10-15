import express from 'express';
import upload from '../config/multer.js';
import {
  uploadResource,
  getResources,
  downloadResource,
  deleteResource
} from '../controllers/resourceController.js';

const router = express.Router();

router.post('/upload', upload.single('file'), uploadResource);
router.get('/', getResources);
router.get('/:id/download', downloadResource);
router.delete('/:id', deleteResource);

export default router;
