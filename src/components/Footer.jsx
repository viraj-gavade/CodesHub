import { Code2 } from 'lucide-react';

const Footer = () => (
  <footer className="bg-slate-900 text-gray-300 py-6 mt-12 border-t border-slate-800">
    <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Code2 className="w-5 h-5 text-cyan-400" />
        <span className="font-semibold text-base">SYCS Code Hub</span>
      </div>
      <div className="text-xs sm:text-sm text-gray-400">
        &copy; {new Date().getFullYear()} SYCS students. All rights reserved.
      </div>
      <div className="flex gap-3 text-xs sm:text-sm">
<b>Licensing:</b> All code in this project is licensed under the <a href="https://opensource.org/licenses/MIT" className="text-cyan-600 underline hover:text-cyan-800" target="_blank" rel="noopener noreferrer">MIT License</a>.<br/>      </div>
      
    </div>
  </footer>
);

export default Footer;
