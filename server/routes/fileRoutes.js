import express from 'express';
import upload from '../config/multer.js';
import {
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile,
  getFileContent
} from '../controllers/fileController.js';

const router = express.Router();

router.post('/upload', upload.single('file'), uploadFile);
router.get('/', getFiles);
router.get('/:id/download', downloadFile);
router.get('/:id/content', getFileContent);
router.delete('/:id', deleteFile);

export default router;
