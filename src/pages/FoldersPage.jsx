import { useState, useEffect } from 'react';
import { ChevronRight, Eye, Download, Folder, FileCode2, BookOpen, Hash } from 'lucide-react';
import { fileAPI } from '../services/api';
import CodeModal from '../components/CodeModal';

const FoldersPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [expandedPracticals, setExpandedPracticals] = useState({});
  const [selectedCode, setSelectedCode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fileAPI.getFiles();
      setFiles(response.data);
    } catch (err) {
      setError('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  // Group files by subject and practical
  const groupedFiles = files.reduce((acc, file) => {
    if (!file.subject) return acc;
    if (!acc[file.subject]) acc[file.subject] = {};
    const pracKey = file.practicalNo || 'Other';
    if (!acc[file.subject][pracKey]) acc[file.subject][pracKey] = [];
    acc[file.subject][pracKey].push(file);
    return acc;
  }, {});

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

  const toggleSubject = (subject) => {
    setExpandedSubjects((prev) => ({ ...prev, [subject]: !prev[subject] }));
  };

  const togglePractical = (key) => {
    setExpandedPracticals((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg">
              <Folder className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">
              Code Folders
            </h1>
          </div>
          <p className="text-slate-600 text-sm sm:text-base ml-14 sm:ml-16">Browse organized by subject and practical</p>
        </div>

        {error && (
          <div className="mb-4 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 sm:py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-200 border-t-cyan-500"></div>
            <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading folders...</p>
          </div>
        ) : Object.keys(groupedFiles).length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <Folder className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-base sm:text-lg">No files found</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {Object.keys(groupedFiles).sort().map((subject) => (
              <div key={subject} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                {/* Subject Header */}
                <button
                  className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 text-left bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all duration-200"
                  onClick={() => toggleSubject(subject)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <ChevronRight 
                      className={`w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0 transition-transform duration-200 ${
                        expandedSubjects[subject] ? 'rotate-90' : ''
                      }`} 
                    />
                    <span className="text-base sm:text-lg lg:text-xl font-bold text-white truncate">
                      {subject}
                    </span>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white bg-opacity-25 text-white">
                      {Object.keys(groupedFiles[subject]).length} Practicals
                    </span>
                  </div>
                </button>

                {/* Practicals List */}
                {expandedSubjects[subject] && (
                  <div className="bg-gradient-to-b from-gray-50 to-white">
                    {Object.keys(groupedFiles[subject]).sort((a, b) => a - b).map((prac) => {
                      const pracKey = `${subject}-${prac}`;
                      return (
                        <div key={prac} className="border-b border-gray-100 last:border-b-0">
                          {/* Practical Header */}
                          <button
                            className="w-full flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 text-left hover:bg-blue-50 transition-colors duration-150"
                            onClick={() => togglePractical(pracKey)}
                          >
                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                              <ChevronRight 
                                className={`w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0 transition-transform duration-200 ${
                                  expandedPracticals[pracKey] ? 'rotate-90' : ''
                                }`} 
                              />
                              <FileCode2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                              <span className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                                Practical {prac}
                              </span>
                            </div>
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 flex-shrink-0">
                              {groupedFiles[subject][prac].length}
                            </span>
                          </button>

                          {/* Code Files Grid */}
                          {expandedPracticals[pracKey] && (
                            <div className="px-4 sm:px-8 py-4 sm:py-6 bg-gray-50">
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                {groupedFiles[subject][prac].map((file) => (
                                  <div
                                    key={file._id}
                                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col"
                                  >
                                    {/* Card Header */}
                                    <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-3 sm:p-4">
                                      <div className="flex items-start gap-2">
                                        <FileCode2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                                        <h3 className="text-white font-semibold text-xs sm:text-sm break-words leading-tight">
                                          {file.fileName || file.filename}
                                        </h3>
                                      </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-3 sm:p-4 flex-1 flex flex-col">
                                      <div className="space-y-2 mb-3 sm:mb-4 flex-1">
                                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                                          <Hash className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-500 flex-shrink-0" />
                                          <span className="text-gray-600">Semester:</span>
                                          <span className="font-medium text-gray-800">{file.semester}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                                          <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                                          <span className="text-gray-600">Question:</span>
                                          <span className="font-medium text-gray-800">{file.questionNo}</span>
                                        </div>
                                        {file.question && (
                                          <p className="text-xs text-gray-700 font-medium line-clamp-2 mt-2">
                                            {file.question}
                                          </p>
                                        )}
                                        {file.description && (
                                          <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                                            {file.description}
                                          </p>
                                        )}
                                      </div>

                                      {/* Action Buttons */}
                                      <div className="flex gap-2">
                                        <button 
                                          onClick={() => handleViewCode(file)} 
                                          className="flex-1 flex items-center justify-center gap-1.5 bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium shadow-sm"
                                        >
                                          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                          <span>View</span>
                                        </button>
                                        <button 
                                          onClick={() => handleDownload(file)} 
                                          className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium shadow-sm"
                                        >
                                          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                          <span>Download</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
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

export default FoldersPage;