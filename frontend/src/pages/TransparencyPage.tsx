import React, { useState, useEffect } from 'react';
import BilingualHeading from '../components/BilingualHeading';
import { Building2, Award, FileText, ShieldCheck, CheckCircle, Download } from 'lucide-react';
import { documentService } from '../services/api';

const TransparencyPage: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    documentService.getDocuments()
      .then(res => { if (res.data.data?.length) setDocuments(res.data.data); })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-warm-off-white min-h-screen py-16 font-sans text-dark-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <BilingualHeading 
          englishTitle="TRANSPARENCY & GOVERNANCE"
          hindiTitle="पारदर्शिता"
          subtitle="Honest, clear, and accountable non-profit operations."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Foundation Registration */}
          <div className="bg-white p-8 rounded-3xl border border-light-border shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-navy/10 text-primary-navy flex items-center justify-center">
              <Building2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-primary-navy">Trust Registration Status</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Jadu & Art Foundation is registered under Indian Trust Laws as a dedicated non-profit social foundation serving education, healthcare, animal welfare and relief.
            </p>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 flex items-center space-x-2">
              <CheckCircle size={16} className="text-primary-green" />
              <span>Official Registered Trust Entity</span>
            </div>
          </div>

          {/* 12A & 80G Status */}
          <div className="bg-white p-8 rounded-3xl border border-light-border shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-saffron/10 text-primary-saffron flex items-center justify-center">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-bold text-primary-navy">12A & 80G Tax Certificates</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Legal tax exemption documentation filed with the Income Tax Department of India for donor tax deduction eligibility.
            </p>
            <div className="p-3 bg-primary-saffron/10 rounded-xl border border-primary-saffron/20 text-xs font-semibold text-primary-saffron flex items-center space-x-2">
              <CheckCircle size={16} />
              <span>12A & 80G Registration Active</span>
            </div>
          </div>

        </div>

        {/* Dynamic Compliance Documents Table */}
        {documents.length > 0 && (
          <div className="bg-white rounded-3xl p-8 border border-light-border shadow-sm space-y-6">
            <h3 className="text-2xl font-bold text-primary-navy">Official Compliance Documents & Financial Reports</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div key={doc._id} className="p-5 bg-warm-off-white rounded-2xl border border-light-border flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold bg-primary-navy text-white px-2 py-0.5 rounded uppercase">
                      {doc.docType} ({doc.year})
                    </span>
                    <h4 className="font-bold text-primary-navy text-sm">{doc.name}</h4>
                    {doc.hindiName && <p className="text-xs text-primary-saffron font-semibold">{doc.hindiName}</p>}
                    {doc.description && <p className="text-xs text-gray-500 line-clamp-1">{doc.description}</p>}
                  </div>
                  <a 
                    href={doc.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-primary-saffron text-white p-3 rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center shadow-sm"
                    title="Download Document"
                  >
                    <Download size={18} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TransparencyPage;
