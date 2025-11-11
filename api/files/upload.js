import formidable from 'formidable';
import fs from 'fs';
import mongoose from 'mongoose';
import { connectToDatabase } from '../_db.js';
import cloudinary from '../../../server/config/cloudinary.js';

export const config = {
  api: {
    bodyParser: false, // required for formidable to parse multipart/form-data
  },
};

const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
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

    // Extract fields - handle both array and non-array values from formidable
    const semester = Array.isArray(fields.semester) ? fields.semester[0] : fields.semester;
    const subject = Array.isArray(fields.subject) ? fields.subject[0] : fields.subject;
    const practicalNo = Array.isArray(fields.practicalNo) ? fields.practicalNo[0] : fields.practicalNo;
    const questionNo = Array.isArray(fields.questionNo) ? fields.questionNo[0] : fields.questionNo;
    const questionText = Array.isArray(fields.questionText) ? fields.questionText[0] : fields.questionText;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;

    // Validate required fields
    if (!semester || !subject || !practicalNo || !questionNo) {
      return res.status(400).json({
        success: false,
        message: 'Semester, subject, practical number, and question number are required',
      });
    }

    // Check if file was uploaded
    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!uploadedFile) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Support both formidable v2 (filepath) and v3 (filepath)
    const localFilePath = uploadedFile.filepath || uploadedFile.path;

    // Upload to Cloudinary (resource_type: auto will allow any kind of file)
    const uploaded = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });

    // Define the File model (same schema used in other API files)
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
      questionText: questionText || '',
      description: description || '',
      fileName: uploaded.original_filename || uploadedFile.originalFilename || uploadedFile.name,
      fileUrl: uploaded.secure_url || uploaded.url,
    });

    // Remove temporary uploaded file
    try {
      if (localFilePath && fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (e) {
      // non-fatal - log but don't fail the request
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
