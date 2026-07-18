import React, { useEffect, useState } from 'react';
import { recordService, aiService } from '../services/api';
import Loader from '../components/Loader';
import { 
  FileText, 
  UploadCloud, 
  Trash2, 
  Sparkles, 
  AlertCircle, 
  CheckCircle,
  FileCheck,
  ChevronLeft,
  BookOpen
} from 'lucide-react';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Upload inputs
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('blood_test');
  const [file, setFile] = useState(null);
  
  // AI summary states
  const [selectedRecordForAI, setSelectedRecordForAI] = useState(null);
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const [notification, setNotification] = useState({ type: '', msg: '' });
  const [uploading, setUploading] = useState(false);

  const fetchRecords = async () => {
    try {
      const res = await recordService.list();
      if (res.data.success) {
        setRecords(res.data.records);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !reportName) {
      setNotification({ type: 'error', msg: 'Please provide both file and name' });
      return;
    }

    setUploading(true);
    setNotification({ type: '', msg: '' });
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('reportName', reportName);
    formData.append('reportType', reportType);

    try {
      const res = await recordService.upload(formData);
      if (res.data.success) {
        setNotification({ type: 'success', msg: 'Document uploaded successfully!' });
        setReportName('');
        setFile(null);
        // Clear input field manually
        document.getElementById('file-upload-input').value = '';
        fetchRecords();
      }
    } catch (error) {
      setNotification({ 
        type: 'error', 
        msg: error.response?.data?.message || 'File upload failed. Ensure file is PDF/Image under 10MB.' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      const res = await recordService.delete(id);
      if (res.data.success) {
        setNotification({ type: 'success', msg: 'Record deleted.' });
        if (selectedRecordForAI?._id === id) {
          setSelectedRecordForAI(null);
          setAiSummary('');
        }
        fetchRecords();
      }
    } catch (error) {
      setNotification({ type: 'error', msg: 'Delete failed.' });
    }
  };

  const handleExplainReport = async (record) => {
    setSelectedRecordForAI(record);
    setAiLoading(true);
    setAiSummary('');
    try {
      const res = await aiService.reportSummary({ recordId: record._id });
      if (res.data.success) {
        setAiSummary(res.data.summary);
      }
    } catch (error) {
      setAiSummary('AI was unable to summarize this report. Please verify key parameters or try pasting text directly.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-navy-900">Secure Medical Records Vault</h2>
        <p className="text-xs text-navy-400 mt-1">Host test reports, recipes and retrieve automated AI explanations</p>
      </div>

      {notification.msg && (
        <div className={`p-4 rounded-xl text-xs border flex items-center gap-2 max-w-md ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{notification.msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List files & Upload (Col span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload panel */}
          <form onSubmit={handleUpload} className="p-6 rounded-2xl bg-white border border-navy-100 shadow-sm space-y-4">
            <h3 className="font-bold text-navy-950 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-hospital-500" />
              Upload Medical Document
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-navy-400 uppercase mb-1">Document Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. June Blood Chemistry"
                  required
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="w-full px-3 py-2 border border-navy-200 rounded-lg text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-navy-400 uppercase mb-1">Document Category</label>
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 border border-navy-200 rounded-lg text-xs bg-white focus:outline-none"
                >
                  <option value="blood_test">Blood Test</option>
                  <option value="prescription">Prescription File</option>
                  <option value="xray">Radiology / X-Ray</option>
                  <option value="other">Other Document</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-navy-400 uppercase mb-1">Select File (PDF or Image under 10MB)</label>
              <input 
                id="file-upload-input"
                type="file" 
                required
                onChange={handleFileChange}
                className="w-full text-xs text-navy-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-hospital-50 file:text-hospital-700 hover:file:bg-hospital-100"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="bg-hospital-500 hover:bg-hospital-600 text-white font-bold px-5 py-2.5 rounded-lg text-xs shadow-sm transition disabled:bg-navy-200"
            >
              {uploading ? 'Uploading File...' : 'Host File'}
            </button>
          </form>

          {/* List Files panel */}
          <div className="p-6 rounded-2xl bg-white border border-navy-100 shadow-sm space-y-4">
            <h3 className="font-bold text-navy-950">Hosted Records Vault</h3>
            {records.length === 0 ? (
              <p className="text-center py-12 text-navy-400 text-xs">No medical files uploaded yet.</p>
            ) : (
              <div className="divide-y divide-navy-50">
                {records.map((rec) => (
                  <div key={rec._id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-navy-800">{rec.reportName}</h4>
                        <p className="text-[10px] text-navy-400 uppercase font-bold tracking-wider">{rec.reportType}</p>
                        <p className="text-[10px] text-navy-400">Uploaded: {new Date(rec.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a 
                        href={`http://localhost:5000${rec.fileUrl}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-3 py-1.5 border border-navy-200 hover:bg-navy-50 text-navy-700 font-bold rounded-lg text-[10px] transition"
                      >
                        View File
                      </a>
                      
                      <button 
                        onClick={() => handleExplainReport(rec)}
                        className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold rounded-lg text-[10px] border border-purple-200 flex items-center gap-1 transition"
                      >
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        AI Explain
                      </button>

                      <button 
                        onClick={() => handleDelete(rec._id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI summary display */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-2xl bg-white border border-navy-100 shadow-sm sticky top-24 space-y-4 min-h-[300px] flex flex-col">
            <h3 className="font-bold text-navy-950 flex items-center gap-2 border-b border-navy-50 pb-3">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Gemini AI Report Summary
            </h3>

            {aiLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12">
                <Loader size="sm" />
                <p className="text-xs text-purple-700 font-semibold animate-pulse mt-2">
                  Gemini AI analyzing document...
                </p>
              </div>
            ) : selectedRecordForAI ? (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 text-[10px] text-purple-800 font-semibold mb-3">
                    Analyzing: {selectedRecordForAI.reportName}
                  </div>
                  
                  {/* Summary markdown rendering simulator */}
                  <div className="text-xs text-navy-800 leading-relaxed max-h-[380px] overflow-y-auto whitespace-pre-wrap font-sans space-y-2 prose">
                    {aiSummary}
                  </div>
                </div>

                <div className="border-t border-navy-50 pt-3 mt-4 text-[9px] text-navy-400 italic">
                  *AI summaries do not formulate official clinical advice. Check with doctors.
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-navy-400">
                <BookOpen className="w-10 h-10 text-navy-300 mb-2" />
                <p className="text-xs">Click "AI Explain" next to a hosted document to generate summaries instantly.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
