import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  semester: {
    type: Number,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  practicalNo: {
    type: Number,
    required: true
  },
  questionNo: {
    type: Number,
    required: true
  },
  questionText: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

fileSchema.index({ semester: 1, subject: 1, practicalNo: 1, questionNo: 1 }, { unique: true });

const File = mongoose.model('File', fileSchema);

export default File;
