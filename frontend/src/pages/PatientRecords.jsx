import React, { useEffect, useState } from 'react';
import { appointmentService, recordService } from '../services/api';
import Loader from '../components/Loader';
import { User, FileText, ChevronRight, Search, ShieldAlert } from 'lucide-react';

const PatientRecords = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await appointmentService.list();
        if (res.data.success) {
          // Extract unique patients from the doctor's appointments list
          const uniquePatientsMap = {};
          res.data.appointments.forEach(app => {
            if (app.patientId) {
              uniquePatientsMap[app.patientId._id] = app.patientId;
            }
          });
          setPatients(Object.values(uniquePatientsMap));
        }
      } catch (error) {
        console.error('Error compiling patient list:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient);
    setRecordsLoading(true);
    setRecords([]);
    try {
      const res = await recordService.list({ patientId: patient._id });
      if (res.data.success) {
        setRecords(res.data.records);
      }
    } catch (error) {
      console.error('Error fetching records for patient:', error);
    } finally {
      setRecordsLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-navy-900">Patient Medical Records Access</h2>
        <p className="text-xs text-navy-400 mt-1">Access medical history files uploaded by your consultations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Patient Selector Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-navy-100 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-navy-950 text-sm">Consultation Roster</h3>
            
            {/* Search filter */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-navy-400">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                placeholder="Search patient name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-navy-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-hospital-500 bg-navy-50 bg-opacity-20"
              />
            </div>

            {filteredPatients.length === 0 ? (
              <p className="text-center py-6 text-navy-400 text-xs">No patients found.</p>
            ) : (
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {filteredPatients.map((pat) => (
                  <div 
                    key={pat._id}
                    onClick={() => handleSelectPatient(pat)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between text-xs ${
                      selectedPatient?._id === pat._id 
                        ? 'border-hospital-500 bg-hospital-50 bg-opacity-20 font-bold' 
                        : 'border-navy-50 hover:bg-navy-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-navy-100 rounded-full flex items-center justify-center text-navy-600 font-bold text-xs uppercase">
                        {pat.name?.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-navy-900 truncate">{pat.name}</p>
                        <p className="text-[10px] text-navy-400 font-medium truncate">{pat.email}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-navy-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Historical Medical records timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-navy-100 rounded-2xl p-6 shadow-sm min-h-[400px] flex flex-col">
            {selectedPatient ? (
              <div className="flex-1 flex flex-col">
                <div className="border-b border-navy-50 pb-4 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-navy-950 text-base">{selectedPatient.name}</h3>
                    <p className="text-xs text-navy-400">
                      Age: {selectedPatient.age || 'N/A'} • Gender: {selectedPatient.gender || 'N/A'} • Phone: {selectedPatient.phone || 'N/A'}
                    </p>
                  </div>
                </div>

                {recordsLoading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader size="sm" />
                  </div>
                ) : records.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-navy-400 py-12">
                    <ShieldAlert className="w-10 h-10 text-navy-300 mb-2" />
                    <p className="text-xs">This patient hasn't uploaded any documents to their medical records vault yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3 flex-1 overflow-y-auto">
                    <h4 className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-2">Patient Files Vault</h4>
                    {records.map((rec) => (
                      <div key={rec._id} className="p-3.5 rounded-xl border border-navy-50 bg-navy-50 bg-opacity-30 flex justify-between items-center text-xs">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-navy-800">{rec.reportName}</p>
                            <p className="text-[10px] text-navy-400 uppercase font-bold tracking-wider">{rec.reportType}</p>
                            <p className="text-[10px] text-navy-400">Uploaded: {new Date(rec.uploadedAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <a 
                          href={`http://localhost:5000${rec.fileUrl}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="bg-hospital-500 hover:bg-hospital-600 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] shadow-sm transition"
                        >
                          View Document
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-navy-400 p-8 text-center">
                <User className="w-12 h-12 text-navy-300 mb-3" />
                <h3 className="text-sm font-bold text-navy-800">No Patient Selected</h3>
                <p className="text-xs text-navy-500 max-w-xs mt-1">
                  Select a patient from your consultation roster on the left to examine their hosted medical reports.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRecords;
