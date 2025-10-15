import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);

    if (req.body.semester && req.body.subject) {
      const semester = req.body.semester;
      const subject = req.body.subject.replace(/\s+/g, '_');
      const pracNo = req.body.practicalNo || '';
      const quesNo = req.body.questionNo || '';

      const fileName = `SEM${semester}_${subject}_PRACTICAL${pracNo}_Q${quesNo}${ext}`;
      cb(null, fileName);
    } else {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

export default upload;
