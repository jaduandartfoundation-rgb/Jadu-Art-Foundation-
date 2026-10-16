import React, { useState, useEffect, useMemo } from 'react';
import { volunteerService } from '../../services/api';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Eye,
  Trash2,
  Download,
  RefreshCw,
  AlertCircle,
  X,
  MessageCircle,
  MapPin,
  Calendar,
  Sparkles,
  FileText,
  Save,
  Check,
  ChevronDown,
  UserCheck,
  Award
} from 'lucide-react';

export interface Volunteer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  interest: string;
  message?: string;
  skills?: string;
  availability?: string;
  adminNotes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const STATUS_OPTIONS = [
  { value: 'New', label: 'New', desc: 'Application received, not yet reviewed' },
  { value: 'Contacted', label: 'Contacted', desc: 'Admin has contacted the applicant' },
  { value: 'Under Review', label: 'Under Review', desc: 'Application is being evaluated' },
  { value: 'Approved', label: 'Approved', desc: 'Accepted as a volunteer' },
  { value: 'Joined', label: 'Joined', desc: 'Volunteer has started participating' },
  { value: 'On Hold', label: 'On Hold', desc: 'Temporarily paused' },
  { value: 'Rejected', label: 'Rejected', desc: 'Application declined' },
  { value: 'Inactive', label: 'Inactive', desc: 'Previously active, no longer participating' },
];

export const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  'New': { bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200', dot: 'bg-sky-500' },
  'Contacted': { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200', dot: 'bg-purple-500' },
  'Under Review': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', dot: 'bg-amber-500' },
  'Approved': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  'Joined': { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200', dot: 'bg-teal-500' },
  'On Hold': { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200', dot: 'bg-orange-500' },
  'Rejected': { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200', dot: 'bg-rose-500' },
  'Inactive': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-400' },
};

const VolunteerManagementTab: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedInterest, setSelectedInterest] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name-asc' | 'name-desc'>('newest');

  // Modal / Drawer state
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [modalNotes, setModalNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchVolunteers = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setRefreshing(true);
    try {
      const res = await volunteerService.getVolunteers();
      if (res.data && res.data.data) {
        setVolunteers(res.data.data);
      }
    } catch (err: any) {
      console.error('Error fetching volunteers:', err);
      showNotification('error', 'Failed to load volunteer records. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => {
      setNotification(prev => (prev?.text === text ? null : prev));
    }, 4000);
  };

  // Status update handler
  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingStatusId(id);
    try {
      const res = await volunteerService.updateStatus(id, { status: newStatus });
      const updatedVolunteer = res.data?.data;

      // Update state upon confirmed backend response
      setVolunteers(prev =>
        prev.map(v => (v._id === id ? { ...v, status: updatedVolunteer?.status || newStatus } : v))
      );

      // If viewing in modal, update modal state too
      if (selectedVolunteer && selectedVolunteer._id === id) {
        setSelectedVolunteer(prev => prev ? { ...prev, status: updatedVolunteer?.status || newStatus } : null);
      }

      showNotification('success', `Status updated to "${newStatus}" successfully.`);
    } catch (err: any) {
      console.error('Failed to update status:', err);
      const msg = err.response?.data?.message || 'Failed to update status on server. Please try again.';
      showNotification('error', msg);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Save notes handler
  const handleSaveNotes = async () => {
    if (!selectedVolunteer) return;
    setIsSavingNotes(true);
    try {
      const res = await volunteerService.updateStatus(selectedVolunteer._id, { adminNotes: modalNotes });
      const updated = res.data?.data;

      setVolunteers(prev =>
        prev.map(v => (v._id === selectedVolunteer._id ? { ...v, adminNotes: modalNotes } : v))
      );
      setSelectedVolunteer(prev => (prev ? { ...prev, adminNotes: modalNotes } : null));

      showNotification('success', 'Internal admin notes saved successfully.');
    } catch (err: any) {
      console.error('Failed to save notes:', err);
      showNotification('error', 'Could not save notes. Please try again.');
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Delete handler
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete the volunteer application for "${name}"?`)) {
      return;
    }
    setDeletingId(id);
    try {
      await volunteerService.deleteVolunteer(id);
      setVolunteers(prev => prev.filter(v => v._id !== id));
      if (selectedVolunteer && selectedVolunteer._id === id) {
        setSelectedVolunteer(null);
      }
      showNotification('success', `Volunteer application for "${name}" deleted.`);
    } catch (err: any) {
      console.error('Failed to delete volunteer:', err);
      showNotification('error', 'Failed to delete volunteer application.');
    } finally {
      setDeletingId(null);
    }
  };

  // Open details modal
  const openDetails = (v: Volunteer) => {
    setSelectedVolunteer(v);
    setModalNotes(v.adminNotes || '');
  };

  // Helper for WhatsApp link
  const getWhatsAppUrl = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const formatted = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const msg = encodeURIComponent(`Hello ${name}, greetings from Jadu & Art Foundation regarding your volunteer application.`);
    return `https://wa.me/${formatted}?text=${msg}`;
  };

  // Helper for Date format
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Distinct interests list for filter dropdown
  const allInterests = useMemo(() => {
    const set = new Set<string>();
    volunteers.forEach(v => {
      if (v.interest && v.interest.trim()) {
        set.add(v.interest.trim());
      }
    });
    return Array.from(set).sort();
  }, [volunteers]);

  // Filtered & Sorted volunteers
  const filteredVolunteers = useMemo(() => {
    return volunteers
      .filter(v => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = v.name?.toLowerCase().includes(q);
          const matchEmail = v.email?.toLowerCase().includes(q);
          const matchPhone = v.phone?.includes(q);
          const matchCity = v.city?.toLowerCase().includes(q);
          if (!matchName && !matchEmail && !matchPhone && !matchCity) {
            return false;
          }
        }
        // Status filter
        if (selectedStatus !== 'ALL') {
          if ((v.status || 'New') !== selectedStatus) {
            return false;
          }
        }
        // Interest filter
        if (selectedInterest !== 'ALL') {
          if (v.interest !== selectedInterest) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        }
        if (sortBy === 'name-asc') {
          return (a.name || '').localeCompare(b.name || '');
        }
        if (sortBy === 'name-desc') {
          return (b.name || '').localeCompare(a.name || '');
        }
        return 0;
      });
  }, [volunteers, searchQuery, selectedStatus, selectedInterest, sortBy]);

  // Summary counts
  const stats = useMemo(() => {
    const total = volunteers.length;
    const newCount = volunteers.filter(v => (v.status || 'New') === 'New').length;
    const inReviewCount = volunteers.filter(v => ['Contacted', 'Under Review'].includes(v.status)).length;
    const activeCount = volunteers.filter(v => ['Approved', 'Joined'].includes(v.status)).length;
    return { total, newCount, inReviewCount, activeCount };
  }, [volunteers]);

  // Export CSV
  const handleExportCSV = () => {
    if (filteredVolunteers.length === 0) {
      alert('No volunteer records to export');
      return;
    }
    const headers = ['Name', 'Email', 'Phone', 'City', 'Interest', 'Status', 'Applied Date', 'Message', 'Skills', 'Availability', 'Admin Notes'];
    const rows = filteredVolunteers.map(v => [
      `"${(v.name || '').replace(/"/g, '""')}"`,
      `"${(v.email || '').replace(/"/g, '""')}"`,
      `"${(v.phone || '').replace(/"/g, '""')}"`,
      `"${(v.city || '').replace(/"/g, '""')}"`,
      `"${(v.interest || '').replace(/"/g, '""')}"`,
      `"${(v.status || 'New').replace(/"/g, '""')}"`,
      `"${formatDate(v.createdAt)}"`,
      `"${(v.message || '').replace(/"/g, '""')}"`,
      `"${(v.skills || '').replace(/"/g, '""')}"`,
      `"${(v.availability || '').replace(/"/g, '""')}"`,
      `"${(v.adminNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `volunteers_jadu_art_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`flex items-center justify-between p-4 rounded-xl text-sm font-semibold shadow-md border animate-fadeIn ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <CheckCircle className="text-emerald-600 flex-shrink-0" size={18} />
            ) : (
              <AlertCircle className="text-rose-600 flex-shrink-0" size={18} />
            )}
            <span>{notification.text}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-gray-700">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Top Header & Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-primary-navy/10 text-primary-navy rounded-xl">
                <Users size={22} />
              </span>
              <div>
                <h2 className="text-xl font-black text-primary-navy tracking-tight">Volunteer Management</h2>
                <p className="text-xs text-gray-500 font-medium">
                  Review applicant profiles, manage recruitment statuses, and communicate directly with volunteers.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start md:self-auto">
            <button
              onClick={() => fetchVolunteers(false)}
              disabled={refreshing}
              className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
              title="Refresh list"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-primary-navy hover:bg-navy-900 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow transition-colors"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Stat Cards Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-100">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Total Applications</div>
            <div className="text-2xl font-black text-primary-navy mt-1">{stats.total}</div>
          </div>
          <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-700 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-sky-500 inline-block"></span>
              <span>New (Unreviewed)</span>
            </div>
            <div className="text-2xl font-black text-sky-900 mt-1">{stats.newCount}</div>
          </div>
          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
              <span>In Evaluation</span>
            </div>
            <div className="text-2xl font-black text-amber-900 mt-1">{stats.inReviewCount}</div>
          </div>
          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>Approved / Joined</span>
            </div>
            <div className="text-2xl font-black text-emerald-900 mt-1">{stats.activeCount}</div>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search box */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone, city..."
              className="w-full pl-10 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary-navy focus:bg-white outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="md:col-span-3">
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:ring-2 focus:ring-primary-navy outline-none appearance-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
          </div>

          {/* Interest filter */}
          <div className="md:col-span-2">
            <div className="relative">
              <select
                value={selectedInterest}
                onChange={e => setSelectedInterest(e.target.value)}
                className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:ring-2 focus:ring-primary-navy outline-none appearance-none cursor-pointer"
              >
                <option value="ALL">All Interests</option>
                {allInterests.map(interest => (
                  <option key={interest} value={interest}>
                    {interest}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
          </div>

          {/* Sort dropdown */}
          <div className="md:col-span-2">
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:ring-2 focus:ring-primary-navy outline-none appearance-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {(searchQuery || selectedStatus !== 'ALL' || selectedInterest !== 'ALL') && (
          <div className="flex items-center flex-wrap gap-2 pt-2 border-t border-gray-100 text-xs">
            <span className="text-gray-500 font-medium">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-gray-100 text-gray-800 rounded-lg font-semibold">
                <span>"{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')}><X size={12} /></button>
              </span>
            )}
            {selectedStatus !== 'ALL' && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-sky-50 text-sky-800 rounded-lg font-semibold">
                <span>Status: {selectedStatus}</span>
                <button onClick={() => setSelectedStatus('ALL')}><X size={12} /></button>
              </span>
            )}
            {selectedInterest !== 'ALL' && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg font-semibold">
                <span>Interest: {selectedInterest}</span>
                <button onClick={() => setSelectedInterest('ALL')}><X size={12} /></button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('ALL');
                setSelectedInterest('ALL');
              }}
              className="text-xs text-primary-navy font-bold hover:underline ml-2"
            >
              Reset all
            </button>
            <span className="ml-auto text-gray-500 font-medium">
              Showing {filteredVolunteers.length} of {volunteers.length} volunteers
            </span>
          </div>
        )}
      </div>

      {/* Volunteer Applications Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="animate-spin mx-auto text-primary-navy" size={28} />
            <p className="text-xs font-bold text-gray-500">Loading volunteer applications...</p>
          </div>
        ) : filteredVolunteers.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
              <Users size={24} />
            </div>
            <h4 className="text-sm font-bold text-gray-800">No Volunteer Applications Found</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {volunteers.length === 0
                ? 'No volunteer submissions yet. Applications submitted from the website will appear here.'
                : 'No applications match your active search or filter criteria.'}
            </p>
            {volunteers.length > 0 && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus('ALL');
                  setSelectedInterest('ALL');
                }}
                className="mt-2 text-xs font-bold text-primary-navy hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200 uppercase tracking-wider text-[11px]">
                  <th className="p-3.5 pl-5">Volunteer Name</th>
                  <th className="p-3.5">Contact Details</th>
                  <th className="p-3.5">Interested Area</th>
                  <th className="p-3.5">Applied Date</th>
                  <th className="p-3.5">Workflow Status</th>
                  <th className="p-3.5">Quick Contact</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredVolunteers.map(volunteer => {
                  const currentStatus = volunteer.status || 'New';
                  const statusStyle = STATUS_CONFIG[currentStatus] || STATUS_CONFIG['New'];
                  const isUpdating = updatingStatusId === volunteer._id;

                  return (
                    <tr key={volunteer._id} className="hover:bg-gray-50/80 transition-colors group">
                      
                      {/* Name & City */}
                      <td className="p-3.5 pl-5">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary-navy/10 text-primary-navy font-bold flex items-center justify-center flex-shrink-0 text-xs uppercase">
                            {volunteer.name ? volunteer.name.charAt(0) : 'V'}
                          </div>
                          <div>
                            <button
                              onClick={() => openDetails(volunteer)}
                              className="font-bold text-primary-navy hover:text-primary-saffron text-left block leading-tight transition-colors"
                              title="Click to view full application details"
                            >
                              {volunteer.name}
                            </button>
                            {volunteer.city && (
                              <div className="flex items-center space-x-1 text-[11px] text-gray-500 mt-0.5">
                                <MapPin size={11} className="text-gray-400" />
                                <span>{volunteer.city}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contact Details */}
                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <a
                            href={`mailto:${volunteer.email}`}
                            className="text-gray-800 hover:text-primary-navy flex items-center space-x-1.5 font-medium truncate max-w-[200px]"
                            title={volunteer.email}
                          >
                            <Mail size={12} className="text-gray-400 flex-shrink-0" />
                            <span className="truncate">{volunteer.email}</span>
                          </a>
                          <a
                            href={`tel:${volunteer.phone}`}
                            className="text-gray-600 hover:text-primary-navy flex items-center space-x-1.5 font-medium"
                          >
                            <Phone size={12} className="text-gray-400 flex-shrink-0" />
                            <span>{volunteer.phone}</span>
                          </a>
                        </div>
                      </td>

                      {/* Interested Area */}
                      <td className="p-3.5">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-primary-saffron/10 text-primary-navy font-bold text-[11px]">
                          {volunteer.interest || 'General'}
                        </span>
                      </td>

                      {/* Applied Date */}
                      <td className="p-3.5 text-gray-600 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5 text-xs font-medium">
                          <Calendar size={13} className="text-gray-400" />
                          <span>{formatDate(volunteer.createdAt)}</span>
                        </div>
                      </td>

                      {/* Workflow Status Dropdown */}
                      <td className="p-3.5">
                        <div className="relative inline-block">
                          <select
                            value={currentStatus}
                            disabled={isUpdating}
                            onChange={e => handleStatusChange(volunteer._id, e.target.value)}
                            className={`py-1 pl-6 pr-6 rounded-lg text-xs font-bold border cursor-pointer outline-none transition-all appearance-none ${
                              statusStyle.bg
                            } ${statusStyle.text} ${statusStyle.border} ${
                              isUpdating ? 'opacity-50 cursor-wait' : 'hover:shadow-sm'
                            }`}
                          >
                            {STATUS_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value} className="bg-white text-gray-800 py-1 font-semibold">
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <span
                            className={`absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none ${statusStyle.dot}`}
                          ></span>
                          <ChevronDown
                            className={`absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none ${statusStyle.text}`}
                            size={12}
                          />
                        </div>
                      </td>

                      {/* Quick Communication Actions */}
                      <td className="p-3.5">
                        <div className="flex items-center space-x-1.5">
                          {/* Call */}
                          <a
                            href={`tel:${volunteer.phone}`}
                            className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title={`Call ${volunteer.phone}`}
                          >
                            <Phone size={14} />
                          </a>

                          {/* WhatsApp */}
                          <a
                            href={getWhatsAppUrl(volunteer.phone, volunteer.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title={`Chat on WhatsApp (${volunteer.phone})`}
                          >
                            <MessageCircle size={14} />
                          </a>

                          {/* Email */}
                          <a
                            href={`mailto:${volunteer.email}`}
                            className="p-1.5 text-gray-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                            title={`Send email to ${volunteer.email}`}
                          >
                            <Mail size={14} />
                          </a>
                        </div>
                      </td>

                      {/* Row Actions */}
                      <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => openDetails(volunteer)}
                            className="px-2.5 py-1.5 bg-primary-navy/5 text-primary-navy hover:bg-primary-navy hover:text-white rounded-lg font-bold text-xs flex items-center space-x-1 transition-colors"
                            title="View full application"
                          >
                            <Eye size={13} />
                            <span>Details</span>
                          </button>

                          <button
                            onClick={() => handleDelete(volunteer._id, volunteer.name)}
                            disabled={deletingId === volunteer._id}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete volunteer application"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Full Details Modal */}
      {selectedVolunteer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 border border-gray-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider border ${
                      STATUS_CONFIG[selectedVolunteer.status || 'New']?.bg || 'bg-gray-100'
                    } ${
                      STATUS_CONFIG[selectedVolunteer.status || 'New']?.text || 'text-gray-800'
                    } ${
                      STATUS_CONFIG[selectedVolunteer.status || 'New']?.border || 'border-gray-200'
                    }`}
                  >
                    {selectedVolunteer.status || 'New'}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    Applied on {formatDateTime(selectedVolunteer.createdAt)}
                  </span>
                </div>
                <h3 className="text-xl font-black text-primary-navy">{selectedVolunteer.name}</h3>
                {selectedVolunteer.city && (
                  <p className="text-xs text-gray-500 flex items-center space-x-1">
                    <MapPin size={13} className="text-primary-saffron" />
                    <span className="font-semibold">{selectedVolunteer.city}</span>
                  </p>
                )}
              </div>

              <button
                onClick={() => setSelectedVolunteer(null)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Contact & Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <a
                href={`tel:${selectedVolunteer.phone}`}
                className="flex items-center justify-center space-x-2 p-2.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors border border-emerald-200"
              >
                <Phone size={14} />
                <span>Call ({selectedVolunteer.phone})</span>
              </a>

              <a
                href={getWhatsAppUrl(selectedVolunteer.phone, selectedVolunteer.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 p-2.5 bg-green-50 text-green-800 hover:bg-green-100 rounded-xl text-xs font-bold transition-colors border border-green-200"
              >
                <MessageCircle size={14} />
                <span>WhatsApp Chat</span>
              </a>

              <a
                href={`mailto:${selectedVolunteer.email}`}
                className="flex items-center justify-center space-x-2 p-2.5 bg-sky-50 text-sky-800 hover:bg-sky-100 rounded-xl text-xs font-bold transition-colors border border-sky-200 truncate"
              >
                <Mail size={14} />
                <span className="truncate">Email Applicant</span>
              </a>
            </div>

            {/* Application Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">Full Name</span>
                <span className="font-bold text-gray-900 text-sm mt-0.5 block">{selectedVolunteer.name}</span>
              </div>

              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">Interested Area</span>
                <span className="font-bold text-primary-navy text-sm mt-0.5 block">{selectedVolunteer.interest || 'General'}</span>
              </div>

              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">Email Address</span>
                <span className="font-semibold text-gray-800 break-all mt-0.5 block">{selectedVolunteer.email}</span>
              </div>

              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">Phone Number</span>
                <span className="font-semibold text-gray-800 mt-0.5 block">{selectedVolunteer.phone}</span>
              </div>

              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">Location / City</span>
                <span className="font-semibold text-gray-800 mt-0.5 block">{selectedVolunteer.city || 'Not specified'}</span>
              </div>

              <div>
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">Availability</span>
                <span className="font-semibold text-gray-800 mt-0.5 block">{selectedVolunteer.availability || 'Not specified'}</span>
              </div>

              {selectedVolunteer.skills && (
                <div className="sm:col-span-2">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">Skills & Experience</span>
                  <span className="font-semibold text-gray-800 mt-0.5 block">{selectedVolunteer.skills}</span>
                </div>
              )}
            </div>

            {/* Motivation / Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">
                Applicant Motivation & Experience Message
              </label>
              <div className="p-4 bg-amber-50/40 border border-amber-200/60 rounded-2xl text-xs text-gray-800 leading-relaxed italic">
                {selectedVolunteer.message && selectedVolunteer.message.trim() ? (
                  `"${selectedVolunteer.message}"`
                ) : (
                  <span className="text-gray-400 not-italic">No additional message or notes provided by the applicant.</span>
                )}
              </div>
            </div>

            {/* Status Workflow Selector */}
            <div className="space-y-2 border-t pt-4">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                Manage Application Workflow Status
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STATUS_OPTIONS.map(opt => {
                  const isCurrent = (selectedVolunteer.status || 'New') === opt.value;
                  const cfg = STATUS_CONFIG[opt.value];
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={updatingStatusId === selectedVolunteer._id}
                      onClick={() => handleStatusChange(selectedVolunteer._id, opt.value)}
                      className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all relative ${
                        isCurrent
                          ? `${cfg.bg} ${cfg.text} ${cfg.border} ring-2 ring-primary-navy shadow-sm`
                          : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt.label}</span>
                        {isCurrent && <Check size={14} className="text-primary-navy" />}
                      </div>
                      <span className="text-[10px] font-normal text-gray-500 block mt-0.5 line-clamp-1">
                        {opt.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Internal Admin Notes */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center space-x-1.5">
                  <FileText size={14} className="text-primary-navy" />
                  <span>Internal Admin Notes (Private)</span>
                </label>
                <span className="text-[10px] text-gray-400">Visible to administrators only</span>
              </div>
              <textarea
                rows={3}
                value={modalNotes}
                onChange={e => setModalNotes(e.target.value)}
                placeholder="Add private evaluation notes, interview results, or follow-up logs..."
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-navy outline-none"
              ></textarea>
              <div className="flex justify-end">
                <button
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="px-4 py-2 bg-primary-navy hover:bg-navy-900 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow transition-colors"
                >
                  <Save size={14} />
                  <span>{isSavingNotes ? 'Saving Notes...' : 'Save Admin Notes'}</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t pt-4 flex justify-between items-center text-xs">
              <button
                onClick={() => handleDelete(selectedVolunteer._id, selectedVolunteer.name)}
                className="text-rose-600 hover:text-rose-800 font-bold flex items-center space-x-1"
              >
                <Trash2 size={14} />
                <span>Delete Record</span>
              </button>

              <button
                onClick={() => setSelectedVolunteer(null)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default VolunteerManagementTab;
