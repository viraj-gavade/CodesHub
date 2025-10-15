import { useEffect, useState } from 'react';
import { X, Copy } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';

const CodeModal = ({ isOpen, onClose, code, fileName }) => {
  const [language, setLanguage] = useState('javascript');

  useEffect(() => {
    if (fileName) {
      const ext = fileName.split('.').pop().toLowerCase();
      const langMap = {
        'js': 'javascript',
        'py': 'python',
        'java': 'java',
        'c': 'c',
        'cpp': 'cpp',
        'cs': 'csharp',
        'html': 'markup',
        'css': 'css',
      };
      setLanguage(langMap[ext] || 'javascript');
    }
  }, [fileName]);

  useEffect(() => {
    if (isOpen && code) {
      Prism.highlightAll();
    }
  }, [isOpen, code, language]);

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (code) {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch (err) {
        setCopied(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">{fileName}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <div className="flex justify-end mb-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1 bg-cyan-500 hover:bg-cyan-600 text-white rounded text-xs transition-colors"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          <pre className="text-sm">
            <code className={`language-${language}`}>
              {code}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeModal;
