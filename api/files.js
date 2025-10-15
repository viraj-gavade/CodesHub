import { connectToDatabase } from './_db.js';
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

  if (req.method === 'GET') {
    const { semester, subject, practicalNo, search } = req.query;
    let query = {};
    if (semester) query.semester = parseInt(semester);
    if (subject) query.subject = { $regex: subject, $options: 'i' };
    if (practicalNo) query.practicalNo = parseInt(practicalNo);
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { questionText: { $regex: search, $options: 'i' } }
      ];
    }
    const files = await File.find(query).sort({ uploadedAt: -1 });
    return res.status(200).json({ success: true, count: files.length, data: files });
  }

  if (req.method === 'POST') {
    const { semester, subject, practicalNo, questionNo, questionText, description, fileName, fileUrl } = req.body;
    const file = await File.create({
      semester, subject, practicalNo, questionNo, questionText, description, fileName, fileUrl
    });
    return res.status(201).json({ success: true, data: file });
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
