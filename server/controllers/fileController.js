
import File from '../models/File.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cloudinary from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadFile = async (req, res, next) => {
  try {
    const { semester, subject, practicalNo, questionNo, description, questionText } = req.body;

    if (!semester || !subject || !practicalNo || !questionNo) {
      return res.status(400).json({
        success: false,
        message: 'Semester, subject, practical number, and question number are required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const existingFile = await File.findOne({
      semester: parseInt(semester),
      subject,
      practicalNo: parseInt(practicalNo),
      questionNo: parseInt(questionNo)
    });

    if (existingFile) {
      fs.unlinkSync(req.file.path);
      return res.status(409).json({
        success: false,
        message: 'A file with the same semester, subject, practical, and question number already exists'
      });
    }

    // Upload file to Cloudinary
    let cloudinaryResult;
    try {
      cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'raw',
        folder: 'codeshub_uploads',
        use_filename: true,
        unique_filename: false
      });
    } catch (cloudErr) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(500).json({ success: false, message: 'Cloud upload failed', error: cloudErr.message });
    }

    // Remove local file after upload
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    const file = await File.create({
      semester: parseInt(semester),
      subject,
      practicalNo: parseInt(practicalNo),
      questionNo: parseInt(questionNo),
      questionText: questionText || '',
      description: description || '',
      fileName: req.file.originalname,
      fileUrl: cloudinaryResult.secure_url
    });

    res.status(201).json({
      success: true,
      data: file
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

export const getFiles = async (req, res, next) => {
  try {
    const { semester, subject, practicalNo, search } = req.query;

    let query = {};

    if (semester) {
      query.semester = parseInt(semester);
    }

    if (subject) {
      query.subject = { $regex: subject, $options: 'i' };
    }

    if (practicalNo) {
      query.practicalNo = parseInt(practicalNo);
    }

    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { questionText: { $regex: search, $options: 'i' } }
      ];
    }

    const files = await File.find(query).sort({ uploadedAt: -1 });

    res.status(200).json({
      success: true,
      count: files.length,
      data: files
    });
  } catch (error) {
    next(error);
  }
};

export const downloadFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const filePath = path.resolve(file.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File does not exist on server'
      });
    }

    res.download(filePath, file.fileName);
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    await File.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getFileContent = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Fetch file content from Cloudinary URL
    try {
      const response = await fetch(file.fileUrl);
      if (!response.ok) {
        return res.status(404).json({
          success: false,
          message: 'File does not exist on Cloudinary'
        });
      }
      const content = await response.text();
      res.status(200).json({
        success: true,
        data: {
          content,
          fileName: file.fileName
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to fetch file from Cloudinary', error: err.message });
    }
  } catch (error) {
    next(error);
  }
};
