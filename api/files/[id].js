import { connectToDatabase } from '../_db.js';
import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  semester: Number,
  subject: String,
  practicalNo: Number,
  questionNo: Number,
  questionText: String,
  description: String,
  fileName: String,
  fileUrl: String,
  uploadedAt: { type: Date, default: Date.now }
});
const File = mongoose.models.File || mongoose.model('File', fileSchema);

export default async function handler(req, res) {
  await connectToDatabase();
  const { id } = req.query;

  if (req.method === 'GET') {
    const file = await File.findById(id);
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });
    return res.status(200).json({ success: true, data: file });
  }

  if (req.method === 'DELETE') {
    const file = await File.findByIdAndDelete(id);
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });
    return res.status(200).json({ success: true, message: 'File deleted' });
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
