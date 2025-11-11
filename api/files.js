import formidable from 'formidable';
import fs from 'fs';
import mongoose from 'mongoose';
import { connectToDatabase } from '../_db.js';
import cloudinary from '../../server/config/cloudinary.js';

export const config = {
  api: {
    bodyParser: false, // required for formidable to parse multipart/form-data
  },
};

const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = formidable({
      keepExtensions: true,
    });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    const { fields, files } = await parseForm(req);

    // Required fields
    const { semester, subject, practicalNo, questionNo, questionText, description } = fields;

    if (!semester || !subject || !practicalNo || !questionNo) {
      return res.status(400).json({
        success: false,
        message: 'Semester, subject, practical number, and question number are required',
      });
    }

    const uploadedFile = files.file;
    if (!uploadedFile) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Support both formidable v1 (path) and v2 (filepath)
    const localFilePath = uploadedFile.filepath || uploadedFile.path;

    // Upload to Cloudinary (resource_type: auto will allow any kind of file)
    const uploaded = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });

    // Define the File model (same schema used in your other API files)
    const fileSchema = new mongoose.Schema({
      semester: Number,
      subject: String,
      practicalNo: Number,
      questionNo: Number,
      questionText: String,
      description: String,
      fileName: String,
      fileUrl: String,
      uploadedAt: { type: Date, default: Date.now },
    });
    const File = mongoose.models.File || mongoose.model('File', fileSchema);

    // Create DB entry
    const fileDoc = await File.create({
      semester: parseInt(semester),
      subject,
      practicalNo: parseInt(practicalNo),
      questionNo: parseInt(questionNo),
      questionText,
      description,
      fileName: uploaded.original_filename || uploadedFile.originalFilename || uploadedFile.name,
      fileUrl: uploaded.secure_url || uploaded.url,
    });

    // Remove temporary uploaded file
    try {
      if (localFilePath && fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (e) {
      // non-fatal
      console.warn('Failed to remove temp file', e);
    }

    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: fileDoc,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ success: false, message: 'File upload failed', error: err.message });
  }
}
