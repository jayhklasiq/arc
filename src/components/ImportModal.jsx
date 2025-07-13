import { useState, useRef } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export default function ImportModal({ isOpen, onClose, onImport, type }) {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
      setError('Please select a CSV or Excel file');
      return;
    }

    setFile(selectedFile);
    setError('');
    generatePreview(selectedFile);
  };

  const generatePreview = (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (fileExtension === 'csv') {
      Papa.parse(file, {
        header: true,
        preview: 5,
        complete: (results) => {
          setPreview(results.data);
        },
        error: (error) => {
          setError('Error reading CSV file: ' + error.message);
        }
      });
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length > 0) {
            const headers = jsonData[0];
            const previewData = jsonData.slice(1, 6).map(row => {
              const obj = {};
              headers.forEach((header, index) => {
                obj[header] = row[index] || '';
              });
              return obj;
            });
            setPreview(previewData);
          }
        } catch (error) {
          setError('Error reading Excel file: ' + error.message);
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const processFile = () => {
    return new Promise((resolve, reject) => {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      if (fileExtension === 'csv') {
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            resolve(results.data);
          },
          error: (error) => {
            reject(error);
          }
        });
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const workbook = XLSX.read(e.target.result, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            resolve(jsonData);
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsBinaryString(file);
      }
    });
  };

  const handleImport = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await processFile();
      
      if (data.length === 0) {
        setError('The file appears to be empty');
        return;
      }

      // Validate required columns based on type
      const requiredColumns = type === 'students' 
        ? ['student_first_name', 'student_last_name', 'date_of_birth', 'class', 'date_joined']
        : ['teacher_first_name', 'teacher_last_name', 'age', 'phone_number', 'work_email'];

      const firstRow = data[0];
      const missingColumns = requiredColumns.filter(col => !(col in firstRow));
      
      if (missingColumns.length > 0) {
        setError(`Missing required columns: ${missingColumns.join(', ')}`);
        return;
      }

      onImport(data);
      handleClose();
    } catch (error) {
      setError('Error processing file: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setError('');
    setIsLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const getExpectedFormat = () => {
    if (type === 'students') {
      return [
        'student_first_name', 'student_middle_name', 'student_last_name',
        'date_of_birth', 'class', 'date_joined',
        'primary_guardian_first_name', 'primary_guardian_middle_name', 'primary_guardian_last_name',
        'primary_guardian_phone', 'primary_guardian_email', 'primary_guardian_address',
        'secondary_guardian_first_name', 'secondary_guardian_middle_name', 'secondary_guardian_last_name',
        'secondary_guardian_phone', 'secondary_guardian_email', 'secondary_guardian_address'
      ];
    } else {
      return [
        'teacher_first_name', 'teacher_middle_name', 'teacher_last_name',
        'age', 'phone_number', 'work_email', 'personal_email',
        'qualifications', 'hire_date', 'assigned_class', 'subjects_taught'
      ];
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-600 px-6 py-4 rounded-t-lg">
          <h2 className="text-xl font-bold text-white">
            Import {type === 'students' ? 'Students' : 'Teachers'}
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            Upload a CSV or Excel file with {type} data
          </p>
        </div>

        <div className="p-6">
          {/* Expected Format */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Expected File Format:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium">Required columns (in any order):</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {getExpectedFormat().map((column, index) => (
                  <span key={index} className="bg-white px-2 py-1 rounded border text-xs">
                    {column}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Preview */}
          {preview && preview.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Preview (first 5 rows):</h3>
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(preview[0]).map((header) => (
                        <th key={header} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {preview.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, cellIndex) => (
                          <td key={cellIndex} className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {String(value).substring(0, 50)}{String(value).length > 50 ? '...' : ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={!file || isLoading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                (!file || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Importing...' : 'Import Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}