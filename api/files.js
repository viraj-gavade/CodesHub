import mongoose from 'mongoose';
import { connectToDatabase } from './_db.js';

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

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'GET') {
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
          { questionText: { $regex: search, $options: 'i' } },
        ];
      }

      const files = await File.find(query).sort({ uploadedAt: -1 });

      return res.status(200).json({
        success: true,
        count: files.length,
        data: files,
      });
    } catch (error) {
      console.error('Error fetching files:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch files', error: error.message });
    }
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
