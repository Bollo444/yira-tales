import React, { useState } from 'react';
import useStoryStore from '../store/storyStore';

const ExportOptions = () => {
  const { generatedStory, storyParameters } = useStoryStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);
  const [exportSuccess, setExportSuccess] = useState(null);

  const handleExport = async (format) => {
    if (!generatedStory) {
      setExportError('No story content to export');
      return;
    }

    setIsExporting(true);
    setExportError(null);
    setExportSuccess(null);

    try {
      // Prepare the title from the prompt or use a default
      const title = storyParameters.prompt 
        ? storyParameters.prompt.split(' ').slice(0, 5).join(' ') + '...'
        : 'My Story';

      const response = await fetch('http://localhost:3000/api/story/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyContent: generatedStory,
          format: format,
          title: title,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to export story as ${format.toUpperCase()}`);
      }

      const data = await response.json();

      if (format === 'txt') {
        // For TXT, create a downloadable file
        downloadFile(data.content, data.filename, 'text/plain');
        setExportSuccess(`Story exported as ${data.filename}`);
      } else if (format === 'pdf') {
        // For PDF, we'll use client-side generation with jsPDF
        generatePDF(data.content, data.title);
        setExportSuccess(`Story exported as PDF`);
      }
    } catch (err) {
      console.error('Error exporting story:', err);
      setExportError(err.message || `An error occurred while exporting to ${format.toUpperCase()}`);
    } finally {
      setIsExporting(false);
    }
  };

  const downloadFile = (content, filename, contentType) => {
    // Create a blob with the content
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generatePDF = (content, title) => {
    // This function would use a library like jsPDF to generate a PDF
    // For simplicity, we'll just download as text for now with a .pdf extension
    // In a real implementation, you would include jsPDF and format the PDF properly
    downloadFile(content, `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`, 'application/pdf');
    
    // Note: In a production app, you would use:
    // import { jsPDF } from "jspdf";
    // const doc = new jsPDF();
    // doc.text(content, 10, 10);
    // doc.save(filename);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Export Your Story</h3>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleExport('txt')}
          disabled={isExporting || !generatedStory}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export as TXT
        </button>
        
        <button
          onClick={() => handleExport('pdf')}
          disabled={isExporting || !generatedStory}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export as PDF
        </button>
      </div>

      {/* Status messages */}
      {exportError && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
          {exportError}
        </div>
      )}
      
      {exportSuccess && (
        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg">
          {exportSuccess}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>Export your story to save it or share it with others.</p>
      </div>
    </div>
  );
};

export default ExportOptions;