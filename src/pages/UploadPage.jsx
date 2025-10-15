import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileCode, Check, AlertCircle, BookOpen, Hash, FileText } from 'lucide-react';
import { fileAPI } from '../services/api';

const UploadPage = () => {
  const navigate = useNavigate();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    semester: '',
    subject: '',
    practicalNo: '',
    questionNo: '',
    question: '',
    description: '',
    file: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploadLoading(true);

    const data = new FormData();
    data.append('semester', formData.semester);
    data.append('subject', formData.subject);
    data.append('practicalNo', formData.practicalNo);
    data.append('questionNo', formData.questionNo);
    data.append('questionText', formData.question);
    data.append('description', formData.description);
    data.append('file', formData.file);

    try {
      await fileAPI.uploadFile(data);
      setSuccess('File uploaded successfully! 🎉');
      setFormData({
        semester: '',
        subject: '',
        practicalNo: '',
        questionNo: '',
        question: '',
        description: '',
        file: null,
      });
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
      // Show success, then auto-redirect to main page after short delay
      setTimeout(() => {
        navigate('/');
      }, 1200); // 1.2 seconds for user to see success
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
              <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">
                Upload Code
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">Share your practical code files</p>
            </div>
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <p className="text-green-800 font-medium text-sm sm:text-base">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-lg shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <p className="text-red-800 font-medium text-sm sm:text-base">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-5">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 sm:w-6 sm:h-6" />
              File Details
            </h2>
          </div>

          <div className="p-6 sm:p-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Hash className="w-4 h-4 text-cyan-500" />
                    Semester <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm sm:text-base"
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Data Structures"
                    className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FileCode className="w-4 h-4 text-purple-500" />
                    Practical No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="practicalNo"
                    value={formData.practicalNo}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 1"
                    min="1"
                    className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Hash className="w-4 h-4 text-orange-500" />
                    Question No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="questionNo"
                    value={formData.questionNo}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 1"
                    min="1"
                    className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Question Text
                </label>
                <textarea
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  placeholder="Enter the question statement (optional)"
                  rows="3"
                  className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all resize-none text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="w-4 h-4 text-green-500" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description or notes about the code (optional)"
                  rows="2"
                  className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all resize-none text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Upload className="w-4 h-4 text-cyan-500" />
                  Code File <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="file-input"
                    type="file"
                    onChange={handleFileChange}
                    required
                    className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm sm:text-base"
                  />
                </div>
                {formData.file && (
                  <p className="mt-2 text-xs sm:text-sm text-gray-600 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Selected: <span className="font-medium">{formData.file.name}</span>
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={uploadLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 sm:py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl text-sm sm:text-base flex items-center justify-center gap-2"
              >
                {uploadLoading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload File
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 sm:p-6 border border-blue-100">
          <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base flex items-center gap-2">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            Platform Guidelines & Info
          </h3>
          <ul className="space-y-1 text-xs sm:text-sm text-gray-600 mb-3">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>All fields marked with <span className="text-red-500">*</span> are required</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Supported file formats: .c, .cpp, .java, .py, .js, .txt, etc.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Question text and description are optional but recommended</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Upload and access practical code files organized by semester, subject, and practical number. Each code card shows the question, description, and download/view options.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Instantly filter by semester, subject, or search by question text, description, or subject.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Open access for all students. No authentication required to view or upload files.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Responsive, clean, and easy-to-use interface for a professional experience.</span>
            </li>
          </ul>
          <div className="border-t pt-4 mt-4">
            <p className="text-xs sm:text-sm text-gray-600 text-center">
              <b>Licensing:</b> All code in this project is licensed under the <a href="https://opensource.org/licenses/MIT" className="text-cyan-600 underline hover:text-cyan-800" target="_blank" rel="noopener noreferrer">MIT License</a>.<br/>
              <b>Ownership:</b> Made &amp; maintained by SYCS students.<br/>
              Uploaded files remain the property of their respective uploaders. Please use this platform responsibly and follow academic and professional guidelines when sharing code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;