import React, { useState } from 'react';

interface ExcelDownloadProps {
  collegeId: number;
  collegeName: string;
}

const ExcelDownload: React.FC<ExcelDownloadProps> = ({ collegeId, collegeName }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      console.log('🔍 DEBUG: Attempting to download Excel for college ID:', collegeId);
      const response = await fetch(`http://localhost:3048/api/excel/college-bookings/${collegeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📊 DEBUG: Response status:', response.status);
      console.log('📊 DEBUG: Response headers:', response.headers);

      if (response.ok) {
        console.log('✅ DEBUG: Response is OK, getting blob...');
        const blob = await response.blob();
        console.log('📦 DEBUG: Blob size:', blob.size, 'bytes');
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `college_bookings_${collegeId}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        console.log('✅ DEBUG: Download completed successfully');
      } else {
        console.error('❌ DEBUG: Failed to download Excel file. Status:', response.status);
        const errorText = await response.text();
        console.error('❌ DEBUG: Error response:', errorText);
        alert('Failed to download Excel file. Please try again.');
      }
    } catch (error) {
      console.error('Error downloading Excel file:', error);
      alert('Error downloading Excel file. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">📊</span>
        Download Student Bookings Report
      </h3>
      
      <p className="text-sm text-gray-600 mb-4">
        Generate a comprehensive Excel report containing all student bookings for {collegeName}'s programs.
      </p>
      
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200 ${
          isDownloading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:bg-blue-800'
        }`}
      >
        {isDownloading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Report...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Excel Report
          </>
        )}
      </button>
      
      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium mb-2 text-gray-700">�� Report includes:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li>�� Summary sheet with program statistics</li>
          <li>📄 Individual sheets for each program</li>
          <li>👥 Student booking details</li>
          <li>💳 Payment information</li>
          <li>👨‍👩‍👧‍👦 Group booking details</li>
          <li>💰 Revenue calculations</li>
        </ul>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-xs text-blue-700">
          <strong>Note:</strong> The report will be automatically downloaded as an Excel (.xlsx) file with a timestamp.
        </p>
      </div>
    </div>
  );
};

export default ExcelDownload;