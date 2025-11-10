import React, { useState } from "react";

const Backup = () => {
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [isHovered, setIsHovered] = useState(null);

  const data = [
    { id: 1, name: "Backup_2025_11_01.zip", date: "2025-11-01", size: "25 MB" },
    { id: 2, name: "Backup_2025_10_20.zip", date: "2025-10-20", size: "22 MB" },
    { id: 3, name: "Backup_2025_10_05.zip", date: "2025-10-05", size: "18 MB" },
  ];

  const handleBackup = () => {
    setShowBackupModal(false);
    console.log("Backup initiated");
  };

  const handleRestore = () => {
    setShowRestoreModal(false);
    console.log("Restore initiated for:", selectedBackup);
  };

  const handleDownload = (backup) => {
    setSelectedBackup(backup);
    setShowDownloadModal(false);
    console.log("Download initiated for:", backup.name);
  };

  const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white border border-emerald-200 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform scale-0 animate-scaleIn">
          <div className={`flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mx-auto mb-6`}>
            {type === 'backup' && (
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            )}
            {type === 'restore' && (
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            {type === 'download' && (
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">{title}</h3>
          <p className="text-gray-600 text-center mb-8 leading-relaxed">{message}</p>
          
          <div className="flex space-x-4 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 flex-1"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-500 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25 flex-1"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div >
      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center animate-fadeInUp">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-900 to-emerald-800 bg-clip-text text-transparent mb-4 p-5">
            Backup Management
          </h1>
          <p className="text-gray-600 text-lg">Secure your data with automated backup solutions</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform animate-slideUp hover:shadow-2xl transition-all duration-300">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 px-5 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span>Backup Files</span>
              </h2>
              <div className="flex items-center space-x-2 text-emerald-100">
                <div className="w-3 h-3 bg-emerald-300 rounded-full animate-pulse"></div>
                <span className="text-sm">System Active</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setShowBackupModal(true)}
                onMouseEnter={() => setIsHovered('backup')}
                onMouseLeave={() => setIsHovered(null)}
                className="group bg-gradient-to-r from-emerald-700 to-emerald-800 text-white px-7 py-3 rounded-2xl hover:from-emerald-500 hover:to-emerald-600 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30 flex items-center space-x-3 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white to-white opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <svg className={`w-6 h-6 transform transition-transform duration-500 ${isHovered === 'backup' ? 'rotate-12 scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span className="font-semibold">Create Backup</span>
              </button>
              
              <button 
                onClick={() => setShowRestoreModal(true)}
                onMouseEnter={() => setIsHovered('restore')}
                onMouseLeave={() => setIsHovered(null)}
                className="group border-2 border-emerald-600 text-emerald-600 px-7 py-3 rounded-2xl hover:bg-emerald-50 transition-all duration-500 transform hover:scale-105 flex items-center space-x-3"
              >
                <svg className={`w-6 h-6 transform transition-transform duration-500 ${isHovered === 'restore' ? 'rotate-45 scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="font-semibold">Restore System</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-6 px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">File Name</th>
                  <th className="py-6 px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Date Created</th>
                  <th className="py-6 px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Size</th>
                  <th className="py-6 px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((row, index) => (
                  <tr 
                    key={row.id} 
                    className="hover:bg-emerald-50/50 transition-all duration-300 group"
                    style={{ animationDelay: `${index * 100}ms`, animation: `fadeInUp 0.5s ease-out ${index * 100}ms forwards` }}
                  >
                    <td className="py-5 px-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 group-hover:text-emerald-900 transition-colors block">{row.name}</span>
                          <span className="text-sm text-gray-500">Backup File</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <div className="text-gray-600 group-hover:text-gray-900 transition-colors">{row.date}</div>
                    </td>
                    <td className="py-5 px-8">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-emerald-200 text-emerald-800 border border-emerald-200 group-hover:bg-emerald-200 group-hover:border-emerald-300 transition-all duration-300">
                        {row.size}
                      </span>
                    </td>
                    <td className="py-5 px-8">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedBackup(row);
                            setShowDownloadModal(true);
                          }}
                          onMouseEnter={() => setIsHovered(`download-${row.id}`)}
                          onMouseLeave={() => setIsHovered(null)}
                          className="text-gray-400 hover:text-emerald-600 transition-all duration-300 p-3 rounded-xl hover:bg-emerald-50 transform hover:scale-110 group/btn"
                          title="Download Backup"
                        >
                          <svg className={`w-6 h-6 transform transition-transform duration-300 ${isHovered === `download-${row.id}` ? 'rotate-12 scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6" style={{ animation: 'fadeInUp 0.6s ease-out 400ms forwards' }}>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="text-xl font-bold text-emerald-800 mb-2">{data.length}</div>
            <div className="text-gray-600 font-medium">Total Backups</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="text-xl font-bold text-emerald-800 mb-2">65 MB</div>
            <div className="text-gray-600 font-medium">Total Storage</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="text-xl font-bold text-emerald-800 mb-2">Auto</div>
            <div className="text-gray-600 font-medium">Backup Status</div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        onConfirm={handleBackup}
        title="Create New Backup"
        message="Are you sure you want to create a new system backup? This process may take several minutes depending on your data size."
        type="backup"
      />

      <ConfirmationModal
        isOpen={showRestoreModal}
        onClose={() => setShowRestoreModal(false)}
        onConfirm={handleRestore}
        title="Restore System"
        message="This will restore your system from the selected backup file. All current data will be replaced. This action cannot be undone."
        type="restore"
      />

      <ConfirmationModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onConfirm={() => handleDownload(selectedBackup)}
        title="Download Backup"
        message={`Are you sure you want to download "${selectedBackup?.name}"? The file will be saved to your downloads folder.`}
        type="download"
      />
    </div>
  );
};

export default Backup;