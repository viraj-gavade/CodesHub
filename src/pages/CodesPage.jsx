import { useState, useEffect } from 'react';
import { Upload, Download, Eye, Search, Filter, Code2, BookOpen, FileCode } from 'lucide-react';
import { fileAPI } from '../services/api';
import CodeModal from '../components/CodeModal';

const CodesPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
 
  const [selectedCode, setSelectedCode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    semester: '',
    subject: '',
    practicalNo: '',
    search: '',
  });

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async (customFilters = {}) => {
    setLoading(true);
    try {
      // Only send practicalNo if present
      const params = { ...customFilters };
      if (!params.practicalNo) delete params.practicalNo;
      const response = await fileAPI.getFiles(params);
      setFiles(response.data);
    } catch (err) {
      setError('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    fetchFiles(newFilters);
  };

  const handleViewCode = async (file) => {
    try {
      const response = await fileAPI.getFileContent(file._id);
      setSelectedCode({ content: response.data.content, fileName: file.fileName });
      setIsModalOpen(true);
    } catch (err) {
      setError('Failed to load code');
    }
  };

  const handleDownload = async (file) => {
    try {
      await fileAPI.downloadFile(file._id, file.fileName);
    } catch (err) {
      setError('Failed to download file');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">Code Repository</h1>
          <p className="text-slate-600 text-sm sm:text-base">Upload and access practical code files</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm sm:text-base">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded text-sm sm:text-base">
            {success}
          </div>
        )}

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-4 flex items-center">
            <Filter className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-cyan-500" />
            Filter & Search
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <select
              name="semester"
              value={filters.semester}
              onChange={handleFilterChange}
              className="px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
              placeholder="Filter by subject"
              className="px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />

            <input
              type="number"
              name="practicalNo"
              value={filters.practicalNo}
              onChange={handleFilterChange}
              placeholder="Practical No"
              min="1"
              className="px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />

            <div className="relative sm:col-span-2 lg:col-span-1">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search..."
                className="w-full px-4 py-2 pl-10 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Cards Section */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500"></div>
            <p className="mt-4">Loading...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileCode className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No files found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {files.map((file) => (
              <div
                key={file._id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      <span className="text-white font-semibold text-sm sm:text-base">
                        Semester {file.semester}
                      </span>
                    </div>
                    <div className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs text-white">
                      P{file.practicalNo}
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-base sm:text-lg truncate">
                    {file.subject}
                  </h3>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="mb-3 sm:mb-4">
                    <div className="flex items-center text-gray-600 mb-2">
                      <BookOpen className="w-4 h-4 mr-2 text-cyan-500" />
                      <span className="text-xs sm:text-sm font-medium">Question {file.questionNo}</span>
                    </div>
                    {file.questionText && (
                      <div className="text-xs sm:text-sm text-gray-700 mb-1 font-semibold">
                        {file.questionText}
                      </div>
                    )}
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 min-h-12">
                      {file.description || 'No description available'}
                    </p>
                  </div>

                  <div className="flex space-x-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleViewCode(file)}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm sm:text-base"
                      title="View Code"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleDownload(file)}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm sm:text-base"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        code={selectedCode?.content}
        fileName={selectedCode?.fileName}
      />
    </div>
  );
};

export default CodesPage;