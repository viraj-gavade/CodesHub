# SYCS Code & Resource Sharing Hub

A full-stack web application for SYCS students to upload, share, and access practical code files and semester resources. Built with React (Vite), Tailwind CSS, Node.js, Express, and MongoDB.

## Features

- **Code Repository**: Upload and access practical code files organized by semester, subject, practical number, and question number
- **Resource Library**: Share and download study materials, software, notes, and other educational resources
- **No Authentication Required**: Simple, open access for all students
- **Smart Search & Filtering**: Filter by semester, subject, category, and search keywords
- **Code Viewer**: View code files directly in browser with syntax highlighting
- **File Download**: Download any uploaded file with one click
- **Duplicate Prevention**: Automatic checking to prevent duplicate code uploads

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Prism.js for syntax highlighting
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Multer for file uploads
- CORS enabled

## Project Structure

```
code-share-hub/
├── client/                 # React frontend (this directory)
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   └── App.tsx         # Main app component
│   └── package.json
│
└── server/                 # Node.js backend
    ├── config/             # Configuration files
    ├── controllers/        # Route controllers
    ├── models/             # MongoDB models
    ├── routes/             # API routes
    ├── middleware/         # Express middleware
    ├── uploads/            # Uploaded files storage
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `server` directory:
```bash
MONGO_URI=your_mongodb_connection_string_here
PORT=5000
```

Replace `your_mongodb_connection_string_here` with your actual MongoDB connection string from MongoDB Atlas or your local MongoDB instance.

4. Start the backend server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the project root directory (where package.json is):
```bash
cd ..
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Files (Code Files)
- `POST /api/files/upload` - Upload a code file
- `GET /api/files` - Get all files (supports filtering)
- `GET /api/files/:id/content` - Get file content for viewing
- `GET /api/files/:id/download` - Download a file
- `DELETE /api/files/:id` - Delete a file

### Resources
- `POST /api/resources/upload` - Upload a resource
- `GET /api/resources` - Get all resources (supports filtering)
- `GET /api/resources/:id/download` - Download a resource
- `DELETE /api/resources/:id` - Delete a resource

## Usage

### Uploading Code Files
1. Navigate to the "Codes" page
2. Fill in the upload form with:
   - Semester (1-6)
   - Subject name
   - Practical number
   - Question number
   - Description (optional)
   - Select your code file
3. Click "Upload File"

### Uploading Resources
1. Navigate to the "Resources" page
2. Fill in the upload form with:
   - Title
   - Category (VMware, Notes, Software, Books, Syllabus, Other)
   - Semester (optional)
   - Select your resource file
3. Click "Upload Resource"

### Searching & Filtering
- Use the filter dropdowns to narrow down by semester, subject, or category
- Use the search box to find specific content
- Filters update the results in real-time

### Viewing & Downloading
- Click the eye icon to view code files with syntax highlighting
- Click the download icon to download any file
- Downloaded files retain their original names

## File Naming Convention

Code files are automatically named using the pattern:
```
SEM<semester>_<subject>_PRACTICAL<pracNo>_Q<quesNo>.<ext>
```

Example: `SEM3_Data_Structures_PRACTICAL1_Q1.cpp`

## MongoDB Collections

### Files Collection
```javascript
{
  semester: Number,
  subject: String,
  practicalNo: Number,
  questionNo: Number,
  description: String,
  fileName: String,
  filePath: String,
  uploadedAt: Date
}
```

### Resources Collection
```javascript
{
  title: String,
  category: String,
  semester: Number,
  fileName: String,
  filePath: String,
  uploadedAt: Date
}
```

## Development

### Running Tests
```bash
npm run lint
```

### Building for Production

Frontend:
```bash
npm run build
```

Backend is production-ready as-is. Use:
```bash
npm start
```

## Troubleshooting

### Backend won't start
- Ensure MongoDB is running and the connection string is correct
- Check if port 5000 is available
- Verify all dependencies are installed

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check that CORS is enabled in the backend
- Verify the API base URL in `src/services/api.js`

### File upload fails
- Check file size (max 10MB)
- Ensure the `server/uploads` directory exists
- Verify write permissions on the uploads directory

## Contributing

Feel free to contribute by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please create an issue in the repository or contact the development team.
