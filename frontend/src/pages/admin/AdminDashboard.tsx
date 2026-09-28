import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  adminService, 
  donationService, 
  volunteerService, 
  enquiryService,
  initiativeService,
  workService,
  storyService,
  galleryService,
  impactService,
  teamService,
  testimonialService,
  documentService,
  contentService,
  settingsService,
  notificationService,
  auditService,
  mediaService
} from '../../services/api';
import ImageUploader from '../../components/ImageUploader';
import MediaLibraryPage from './MediaLibraryPage';
import { 
  BarChart3, 
  DollarSign, 
  Users, 
  MessageSquare, 
  LogOut, 
  Plus,
  Edit2,
  Trash2,
  Eye,
  Star,
  Download,
  Bell,
  Search,
  CheckCircle,
  FileText,
  ShieldCheck,
  Settings,
  Layers,
  Layout,
  Globe,
  UserCheck,
  History,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  const [stats, setStats] = useState<any>({
    totalDonationsCount: 0,
    totalAmountRaised: 0,
    thisMonthAmountRaised: 0,
    volunteerCount: 0,
    pendingVolunteers: 0,
    enquiryCount: 0,
    newEnquiries: 0,
    activeInitiatives: 0,
    totalStories: 0,
    totalGalleryItems: 0,
    recentDonations: [],
    recentActivities: []
  });

  // Main navigation active tab
  const [activeTab, setActiveTab] = useState<
    | 'overview' 
    | 'donations' 
    | 'cms_homepage' 
    | 'cms_about' 
    | 'cms_work' 
    | 'cms_initiatives' 
    | 'cms_impact' 
    | 'cms_stories' 
    | 'cms_gallery' 
    | 'cms_testimonials' 
    | 'cms_team' 
    | 'cms_documents' 
    | 'cms_contact' 
    | 'cms_seo' 
    | 'cms_sections'
    | 'cms_legal'
    | 'cms_org_details'
    | 'volunteers' 
    | 'enquiries' 
    | 'settings' 
    | 'media'
    | 'users' 
    | 'audit_log'
  >('overview');

  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Sub-group state for collapsible sidebar menu
  const [websiteMenuOpen, setWebsiteMenuOpen] = useState(true);

  // Notification stream
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Donations specific filters & modal
  const [donationFilter, setDonationFilter] = useState({
    status: 'all',
    search: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  });
  const [selectedDonation, setSelectedDonation] = useState<any>(null);

  // General Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  // CMS Section Content Form state (Homepage, About, Contact, Footer, SEO, Settings)
  const [cmsData, setCmsData] = useState<any>({});
  const [cmsSaveLoading, setCmsSaveLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchStats();
    fetchNotifications();
  }, [navigate]);

  const fetchStats = () => {
    adminService.getStats()
      .then(res => { if (res.data.data) setStats(res.data.data); })
      .catch(() => {});
  };

  const fetchNotifications = () => {
    notificationService.getNotifications()
      .then(res => {
        if (res.data.data) {
          setNotifications(res.data.data);
          setUnreadCount(res.data.unreadCount || 0);
        }
      })
      .catch(() => {});
  };

  // Load active tab data
  useEffect(() => {
    setLoading(false);

    if (activeTab === 'overview') {
      fetchStats();
      return;
    }

    setLoading(true);

    if (activeTab === 'donations') {
      donationService.getDonations(donationFilter)
        .then(res => setDataList(res.data.data || []))
        .finally(() => setLoading(false));
    } 
    else if (activeTab === 'cms_work') {
      workService.getAllWorksAdmin()
        .then(res => setDataList(res.data.data || []))
        .finally(() => setLoading(false));
    } 
    else if (activeTab === 'cms_initiatives') {
      initiativeService.getAllInitiativesAdmin()
        .then(res => setDataList(res.data.data || []))
        .finally(() => setLoading(false));
    } 
    else if (activeTab === 'cms_impact') {
      impactService.getAllImpactMetrics()
        .then(res => setDataList(res.data.data || []))
        .finally(() => setLoading(false));
    } 
    else if (activeTab === 'cms_stories') {
      storyService.getAllStories()
        .then(res => setDataList(res.data.data || []))
        .finally(() => setLoading(false));
    } 
    else if (activeTab === 'cms_gallery') {
      galleryService.getAllGalleryItems()
        .then(res => setDataList(res.data.data || []))
        .finally(() => setLoading(false));
    } 
    else if (activeTab === 'cms_testimonials') {
      testimonialService.getAllTestimonialsAdmin()
        .then(res => setDataList(res.data.data || []))
        .finally(() => setLoading(false));
    } 
    else if (activeTab === 'cms_team') {
      teamService.getAllTeamMembersAdmin()
        .then(res => setDataList(res.data.data || []))
        .finally(() => setLoading(false));
    } 
    else if (activeTab === 'cms_documents') {
      documentService.getAllDocumentsAdmin()
        .then(res => setDataList(res.data.data || []))
        .finally(() => setLoading(false));
    } 
    else if (activeTab === 'volunteers') {
      volunteerService.getVolunteers()
        .then(res => setDataList(res.data.data || []))
        .finally(() => setLoading(false));
    } 
    else if (activeTab === 'enquiries') {
      enquiryService.getEnquiries()
        .then(res => setDataList(res.data.data || []))
        .finally(() => setLoading(false));
    } 
    else if (activeTab === 'users') {
      adminService.getUsers()
        .then(res => setDataList(res.data.data || []))
        .finally(() => setLoading(false));
    } 
    else if (activeTab === 'audit_log') {
      auditService.getAuditLogs()
        .then(res => setDataList(res.data.data || []))
        .finally(() => setLoading(false));
    }
    else if (['cms_homepage', 'cms_about', 'cms_contact'].includes(activeTab)) {
      const key = activeTab.replace('cms_', '');
      contentService.getContentByKey(key)
        .then(res => setCmsData(res.data.data || {}))
        .finally(() => setLoading(false));
    }
    else if (activeTab === 'settings' || activeTab === 'cms_seo' || activeTab === 'cms_sections' || activeTab === 'cms_legal' || activeTab === 'cms_org_details') {
      settingsService.getSettings()
        .then(res => setCmsData(res.data.data || {}))
        .finally(() => setLoading(false));
    }
  }, [activeTab, donationFilter]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  // CSV Export
  const handleExportCSV = async () => {
    try {
      const response = await donationService.exportCSV();
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `donations_export_${Date.now()}.csv`;
      a.click();
    } catch (err) {
      alert('Failed to export CSV file.');
    }
  };

  // Single CMS content save
  const handleSaveCMSContent = async (key: string) => {
    setCmsSaveLoading(true);
    try {
      if (key === 'settings' || key === 'seo' || key === 'cms_seo' || key === 'cms_sections' || key === 'sections') {
        const res = await settingsService.updateSettings(cmsData);
        if (res.data && res.data.data) {
          localStorage.setItem('cached_site_settings', JSON.stringify(res.data.data));
        }
      } else {
        const res = await contentService.updateContentByKey(key, cmsData);
        if (res.data && res.data.data) {
          localStorage.setItem(`cached_cms_${key}`, JSON.stringify(res.data.data));
        }
      }
      alert('Content saved successfully and updated on live website!');
    } catch (err) {
      alert('Failed to save content');
    } finally {
      setCmsSaveLoading(false);
    }
  };

  // Status updates
  const handleVolunteerStatus = (id: string, status: string) => {
    volunteerService.updateStatus(id, status).then(() => {
      setDataList(prev => prev.map(item => item._id === id ? { ...item, status } : item));
    });
  };

  const handleEnquiryStatus = (id: string, status: string) => {
    enquiryService.updateStatus(id, status).then(() => {
      setDataList(prev => prev.map(item => item._id === id ? { ...item, status } : item));
    });
  };

  // Modal open for CRUD items
  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  // Modal submit
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'cms_work') {
        if (editingItem) await workService.updateWork(editingItem._id, formData);
        else await workService.createWork(formData);
      }
      else if (activeTab === 'cms_initiatives') {
        if (editingItem) await initiativeService.updateInitiative(editingItem._id, formData);
        else await initiativeService.createInitiative(formData);
      }
      else if (activeTab === 'cms_impact') {
        if (editingItem) await impactService.updateImpactMetric(editingItem._id, formData);
        else await impactService.createImpactMetric(formData);
      }
      else if (activeTab === 'cms_stories') {
        if (editingItem) await storyService.updateStory(editingItem._id, formData);
        else await storyService.createStory(formData);
      }
      else if (activeTab === 'cms_gallery') {
        if (editingItem) await galleryService.createGalleryItem(formData); // or delete
        else await galleryService.createGalleryItem(formData);
      }
      else if (activeTab === 'cms_testimonials') {
        if (editingItem) await testimonialService.updateTestimonial(editingItem._id, formData);
        else await testimonialService.createTestimonial(formData);
      }
      else if (activeTab === 'cms_team') {
        if (editingItem) await teamService.updateTeamMember(editingItem._id, formData);
        else await teamService.createTeamMember(formData);
      }
      else if (activeTab === 'cms_documents') {
        if (editingItem) await documentService.updateDocument(editingItem._id, formData);
        else await documentService.createDocument(formData);
      }
      else if (activeTab === 'users') {
        if (editingItem) await adminService.updateUser(editingItem._id, formData);
        else await adminService.createUser(formData);
      }

      setIsModalOpen(false);
      // reload
      const evt = new Event('reload');
      setActiveTab(activeTab);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      if (activeTab === 'cms_work') await workService.deleteWork(id);
      else if (activeTab === 'cms_initiatives') await initiativeService.deleteInitiative(id);
      else if (activeTab === 'cms_impact') await impactService.deleteImpactMetric(id);
      else if (activeTab === 'cms_stories') await storyService.deleteStory(id);
      else if (activeTab === 'cms_gallery') await galleryService.deleteGalleryItem(id);
      else if (activeTab === 'cms_testimonials') await testimonialService.deleteTestimonial(id);
      else if (activeTab === 'cms_team') await teamService.deleteTeamMember(id);
      else if (activeTab === 'cms_documents') await documentService.deleteDocument(id);
      else if (activeTab === 'users') await adminService.deleteUser(id);

      setDataList(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <header className="bg-primary-navy text-white py-3 px-6 flex justify-between items-center shadow-md sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-primary-saffron text-white flex items-center justify-center font-black text-xl">
            J
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight block leading-none">Jadu & Art</span>
            <span className="text-[10px] text-gray-300 uppercase tracking-widest font-semibold">Central Admin CMS</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary-saffron text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-200 py-3 z-50">
                <div className="px-4 py-2 border-b flex justify-between items-center">
                  <span className="font-bold text-xs uppercase tracking-wider text-primary-navy">Notifications</span>
                  <button 
                    onClick={() => notificationService.markAllAsRead().then(() => fetchNotifications())}
                    className="text-[10px] font-bold text-primary-saffron hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-gray-500">No notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n._id} 
                        onClick={() => {
                          notificationService.markAsRead(n._id).then(() => fetchNotifications());
                          setNotifDropdownOpen(false);
                          if (n.link?.includes('donations')) setActiveTab('donations');
                        }}
                        className={`p-3 text-xs cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-orange-50/50 font-semibold' : ''}`}
                      >
                        <div className="font-bold text-primary-navy">{n.title}</div>
                        <div className="text-gray-600 text-[11px] mt-0.5">{n.message}</div>
                        <div className="text-[9px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleTimeString('en-IN')}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User profile & Logout */}
          <div className="flex items-center space-x-3 border-l border-white/20 pl-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold">{currentUser.name || 'Admin'}</div>
              <div className="text-[10px] text-primary-saffron uppercase font-bold">{currentUser.role || 'Super Admin'}</div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-grow flex">
        
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 p-4 space-y-6 flex-shrink-0 hidden md:block">
          
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 px-3">Main</span>
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview' ? 'bg-primary-navy text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 size={16} />
              <span>Dashboard</span>
            </button>
          </div>

          {/* Website CMS Menu Accordion */}
          <div className="space-y-1">
            <button 
              onClick={() => setWebsiteMenuOpen(!websiteMenuOpen)}
              className="w-full flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-gray-400 px-3 py-1"
            >
              <span>Website CMS</span>
              <span>{websiteMenuOpen ? '▼' : '▶'}</span>
            </button>

            {websiteMenuOpen && (
              <div className="pl-2 space-y-1 border-l-2 border-gray-100">
                {[
                  { id: 'cms_homepage', label: 'Homepage CMS', icon: Layout },
                  { id: 'cms_about', label: 'About Page CMS', icon: Globe },
                  { id: 'cms_work', label: 'Our Work CMS', icon: Layers },
                  { id: 'cms_initiatives', label: 'Initiatives CMS', icon: CheckCircle },
                  { id: 'cms_impact', label: 'Impact Metrics', icon: BarChart3 },
                  { id: 'cms_stories', label: 'Stories & News', icon: FileText },
                  { id: 'cms_gallery', label: 'Gallery CMS', icon: ImageIcon },
                  { id: 'cms_testimonials', label: 'Testimonials', icon: MessageSquare },
                  { id: 'cms_team', label: 'Team CMS', icon: Users },
                  { id: 'cms_documents', label: 'Transparency Docs', icon: ShieldCheck },
                  { id: 'cms_contact', label: 'Contact Information', icon: MessageSquare },
                  { id: 'cms_legal', label: 'Legal Policies CMS', icon: ShieldCheck },
                  { id: 'cms_org_details', label: 'Org & Legal Details', icon: FileText },
                  { id: 'cms_seo', label: 'SEO Settings', icon: Globe },
                  { id: 'cms_sections', label: 'Section ON/OFF Manager', icon: Eye },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        activeTab === item.id ? 'bg-primary-saffron text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={14} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Operations & Core Admin */}
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 px-3">Management</span>
            
            <button
              onClick={() => setActiveTab('donations')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'donations' ? 'bg-primary-navy text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <DollarSign size={16} />
              <span>Donations</span>
            </button>

            <button
              onClick={() => setActiveTab('volunteers')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'volunteers' ? 'bg-primary-navy text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users size={16} />
              <span>Volunteers</span>
            </button>

            <button
              onClick={() => setActiveTab('enquiries')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'enquiries' ? 'bg-primary-navy text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <MessageSquare size={16} />
              <span>Enquiries</span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'media' ? 'bg-primary-navy text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ImageIcon size={16} />
              <span>Media Library</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'settings' ? 'bg-primary-navy text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings size={16} />
              <span>Popup & Site Settings</span>
            </button>

            {currentUser.role === 'super_admin' && (
              <>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'users' ? 'bg-primary-navy text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <UserCheck size={16} />
                  <span>Admin Users</span>
                </button>

                <button
                  onClick={() => setActiveTab('audit_log')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'audit_log' ? 'bg-primary-navy text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <History size={16} />
                  <span>Audit Logs</span>
                </button>
              </>
            )}
          </div>

        </aside>

        {/* Main Content Area */}
        <main className="flex-grow p-6 space-y-6 max-w-7xl overflow-x-hidden">
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-primary-navy">System Overview</h2>
                  <p className="text-xs text-gray-500">Real-time stats from MongoDB database.</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-saffron/10 text-primary-saffron flex items-center justify-center font-bold">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-primary-navy">₹{stats.totalAmountRaised?.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">TOTAL RAISED</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-green/10 text-primary-green flex items-center justify-center font-bold">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-primary-green">₹{stats.thisMonthAmountRaised?.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">THIS MONTH</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-navy/10 text-primary-navy flex items-center justify-center font-bold">
                    <BarChart3 size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-primary-navy">{stats.totalDonationsCount}</div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">SUCCESSFUL DONATIONS</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-saffron/10 text-primary-saffron flex items-center justify-center font-bold">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-primary-saffron">{stats.activeInitiatives}</div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">ACTIVE INITIATIVES</div>
                  </div>
                </div>

              </div>

              {/* Recent Activity & Recent Donations Split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Recent Donations */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="font-bold text-primary-navy text-sm uppercase tracking-wider">Recent Donations</h3>
                    <button onClick={() => setActiveTab('donations')} className="text-xs font-bold text-primary-saffron hover:underline">View All →</button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {stats.recentDonations?.length === 0 ? (
                      <div className="py-6 text-center text-xs text-gray-500">No donations logged yet.</div>
                    ) : (
                      stats.recentDonations?.map((d: any) => (
                        <div key={d._id} className="py-3 flex justify-between items-center text-xs">
                          <div>
                            <div className="font-bold text-gray-800">{d.donorName}</div>
                            <div className="text-gray-500 text-[10px]">{d.campaign} • {new Date(d.createdAt).toLocaleDateString('en-IN')}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-black text-primary-navy">₹{d.amount?.toLocaleString('en-IN')}</div>
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                              d.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>{d.status}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent Admin Activity Log */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="font-bold text-primary-navy text-sm uppercase tracking-wider">Recent Admin Activity</h3>
                    {currentUser.role === 'super_admin' && (
                      <button onClick={() => setActiveTab('audit_log')} className="text-xs font-bold text-primary-saffron hover:underline">View Audit Log →</button>
                    )}
                  </div>
                  <div className="divide-y divide-gray-100">
                    {stats.recentActivities?.length === 0 ? (
                      <div className="py-6 text-center text-xs text-gray-500">No activity logged yet.</div>
                    ) : (
                      stats.recentActivities?.map((a: any) => (
                        <div key={a._id} className="py-3 text-xs space-y-0.5">
                          <div className="flex justify-between">
                            <span className="font-bold text-primary-navy">{a.action}</span>
                            <span className="text-[10px] text-gray-400">{new Date(a.createdAt).toLocaleTimeString('en-IN')}</span>
                          </div>
                          <p className="text-gray-600 text-[11px]">{a.details || a.module}</p>
                          <div className="text-[10px] text-gray-400">By: {a.adminEmail}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: DONATIONS MANAGEMENT */}
          {activeTab === 'donations' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-primary-navy uppercase tracking-wider">Donations Management</h3>
                  <p className="text-xs text-gray-500">Verified Razorpay payment transactions persistent in MongoDB.</p>
                </div>
                
                <button
                  onClick={handleExportCSV}
                  className="bg-primary-green text-white px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shadow hover:bg-green-700 transition-colors"
                >
                  <Download size={16} />
                  <span>EXPORT CSV</span>
                </button>
              </div>

              {/* Filter Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Status</label>
                  <select
                    value={donationFilter.status}
                    onChange={(e) => setDonationFilter({ ...donationFilter, status: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg font-semibold"
                  >
                    <option value="all">All Statuses</option>
                    <option value="success">Success</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-600 mb-1">Search Donor / ID</label>
                  <input
                    type="text"
                    placeholder="Name, email, payment ID..."
                    value={donationFilter.search}
                    onChange={(e) => setDonationFilter({ ...donationFilter, search: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={donationFilter.startDate}
                    onChange={(e) => setDonationFilter({ ...donationFilter, startDate: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={donationFilter.endDate}
                    onChange={(e) => setDonationFilter({ ...donationFilter, endDate: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Data Table */}
              {loading ? (
                <div className="py-12 text-center text-xs text-gray-500">Loading donation records...</div>
              ) : dataList.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-500">No donation records found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                        <th className="p-3">Donor Info</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Initiative / Campaign</th>
                        <th className="p-3">Payment / Order ID</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Date</th>
                        <th className="p-3 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {dataList.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50/80">
                          <td className="p-3 font-medium text-gray-800">
                            <div className="font-bold text-sm text-primary-navy">{item.donorName}</div>
                            <div className="text-[11px] text-gray-500">{item.email} • {item.phone}</div>
                          </td>

                          <td className="p-3 font-black text-primary-navy">
                            ₹{(item.amount || 0).toLocaleString('en-IN')}
                          </td>

                          <td className="p-3 text-gray-700 font-semibold">
                            {item.campaign}
                          </td>

                          <td className="p-3 font-mono text-[10px] text-gray-500">
                            <div>Pay: {item.razorpayPaymentId || '-'}</div>
                            <div>Ord: {item.razorpayOrderId || '-'}</div>
                          </td>

                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.status === 'success' ? 'bg-green-100 text-green-800' :
                              item.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>

                          <td className="p-3 text-gray-500 text-[11px]">
                            {new Date(item.createdAt).toLocaleDateString('en-IN')}
                          </td>

                          <td className="p-3 text-right">
                            <button
                              onClick={() => setSelectedDonation(item)}
                              className="px-2.5 py-1 bg-primary-navy/10 text-primary-navy rounded-lg font-bold hover:bg-primary-navy hover:text-white transition-colors"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HOMEPAGE CMS */}
          {activeTab === 'cms_homepage' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-8">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold text-primary-navy uppercase tracking-wider">Homepage & Founder Content CMS</h3>
                  <p className="text-xs text-gray-500">Edit hero banner, founder message, JADU philosophy, life philosophy, future generations, humanity & prayer sections.</p>
                </div>
                <button
                  onClick={() => handleSaveCMSContent('homepage')}
                  disabled={cmsSaveLoading}
                  className="bg-primary-saffron text-white px-6 py-2.5 rounded-xl text-xs font-black shadow hover:bg-orange-600 transition-colors"
                >
                  {cmsSaveLoading ? 'Saving...' : 'SAVE HOMEPAGE CMS'}
                </button>
              </div>

              <div className="space-y-6 text-xs font-medium">
                
                {/* 1. Hero Section */}
                <div className="border-b pb-6 space-y-4">
                  <h4 className="font-bold text-sm text-primary-navy uppercase tracking-wider flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-primary-saffron text-white flex items-center justify-center text-xs">1</span>
                    <span>Hero Banner Section</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Hero Badge Text</label>
                      <input
                        type="text"
                        value={cmsData.heroBadge || ''}
                        onChange={(e) => setCmsData({ ...cmsData, heroBadge: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Hero Main Title (English)</label>
                      <input
                        type="text"
                        value={cmsData.heroTitle || ''}
                        onChange={(e) => setCmsData({ ...cmsData, heroTitle: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Hero Highlight Title (Green)</label>
                      <input
                        type="text"
                        value={cmsData.heroTitleHighlight || ''}
                        onChange={(e) => setCmsData({ ...cmsData, heroTitleHighlight: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Hero Sub-Headline (Hindi)</label>
                      <input
                        type="text"
                        value={cmsData.heroHindiText || ''}
                        onChange={(e) => setCmsData({ ...cmsData, heroHindiText: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl font-semibold"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <ImageUploader
                        label="Hero Featured Photograph"
                        value={cmsData.heroImage || ''}
                        folder="jadu-art/homepage"
                        onChange={(data) => setCmsData({ ...cmsData, heroImage: data.secureUrl })}
                        onRemove={() => setCmsData({ ...cmsData, heroImage: '' })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Hero Supporting Description</label>
                    <textarea
                      rows={3}
                      value={cmsData.heroDescription || ''}
                      onChange={(e) => setCmsData({ ...cmsData, heroDescription: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-xl"
                    ></textarea>
                  </div>
                </div>

                {/* 2. Founder's Message Section */}
                <div className="border-b pb-6 space-y-4">
                  <h4 className="font-bold text-sm text-primary-navy uppercase tracking-wider flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-primary-saffron text-white flex items-center justify-center text-xs">2</span>
                    <span>Founder's Message & Official Philosophy</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Founder Name</label>
                      <input
                        type="text"
                        value={cmsData.founderName || ''}
                        onChange={(e) => setCmsData({ ...cmsData, founderName: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Founder Message Title (English)</label>
                      <input
                        type="text"
                        value={cmsData.founderMessageTitle || ''}
                        onChange={(e) => setCmsData({ ...cmsData, founderMessageTitle: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Founder Message Title (Hindi)</label>
                      <input
                        type="text"
                        value={cmsData.founderMessageHindiTitle || ''}
                        onChange={(e) => setCmsData({ ...cmsData, founderMessageHindiTitle: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Founder Core Highlight Quote</label>
                      <input
                        type="text"
                        value={cmsData.founderHighlight || ''}
                        onChange={(e) => setCmsData({ ...cmsData, founderHighlight: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl font-bold"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <ImageUploader
                        label="Founder Photograph (Cloudinary Upload)"
                        value={cmsData.founderImage || ''}
                        folder="jadu-art/founder"
                        onChange={(data) => setCmsData({ ...cmsData, founderImage: data.secureUrl })}
                        onRemove={() => setCmsData({ ...cmsData, founderImage: '' })}
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Founder Opening Greeting</label>
                      <textarea
                        rows={2}
                        value={cmsData.founderGreeting || ''}
                        onChange={(e) => setCmsData({ ...cmsData, founderGreeting: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Founder Message Paragraph 1 (Life & Soul)</label>
                      <textarea
                        rows={2}
                        value={cmsData.founderP1 || ''}
                        onChange={(e) => setCmsData({ ...cmsData, founderP1: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Founder Message Paragraph 2 (Meditation & Purity)</label>
                      <textarea
                        rows={2}
                        value={cmsData.founderP2 || ''}
                        onChange={(e) => setCmsData({ ...cmsData, founderP2: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Founder Message Paragraph 3 (Service & Public Welfare)</label>
                      <textarea
                        rows={2}
                        value={cmsData.founderP3 || ''}
                        onChange={(e) => setCmsData({ ...cmsData, founderP3: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Founder Message Paragraph 4 (National Development & Prosperity)</label>
                      <textarea
                        rows={2}
                        value={cmsData.founderP4 || ''}
                        onChange={(e) => setCmsData({ ...cmsData, founderP4: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* 3. Make Life Meaningful Section */}
                <div className="border-b pb-6 space-y-4">
                  <h4 className="font-bold text-sm text-primary-navy uppercase tracking-wider flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-primary-saffron text-white flex items-center justify-center text-xs">3</span>
                    <span>Make Life Meaningful Section</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Section Title</label>
                      <input
                        type="text"
                        value={cmsData.lifeTitle || ''}
                        onChange={(e) => setCmsData({ ...cmsData, lifeTitle: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Hindi Title</label>
                      <input
                        type="text"
                        value={cmsData.lifeHindiTitle || ''}
                        onChange={(e) => setCmsData({ ...cmsData, lifeHindiTitle: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Highlighted Statement</label>
                      <input
                        type="text"
                        value={cmsData.lifeHighlight || ''}
                        onChange={(e) => setCmsData({ ...cmsData, lifeHighlight: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Life Philosophy Content</label>
                    <textarea
                      rows={2}
                      value={cmsData.lifeText || ''}
                      onChange={(e) => setCmsData({ ...cmsData, lifeText: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-xl"
                    ></textarea>
                  </div>
                </div>

                {/* 4. Future Generation Section */}
                <div className="border-b pb-6 space-y-4">
                  <h4 className="font-bold text-sm text-primary-navy uppercase tracking-wider flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-primary-saffron text-white flex items-center justify-center text-xs">4</span>
                    <span>Future Generations Section</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Section Title</label>
                      <input
                        type="text"
                        value={cmsData.futureTitle || ''}
                        onChange={(e) => setCmsData({ ...cmsData, futureTitle: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Hindi Title</label>
                      <input
                        type="text"
                        value={cmsData.futureHindiTitle || ''}
                        onChange={(e) => setCmsData({ ...cmsData, futureHindiTitle: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Official Message Text</label>
                    <textarea
                      rows={2}
                      value={cmsData.futureText || ''}
                      onChange={(e) => setCmsData({ ...cmsData, futureText: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-xl"
                    ></textarea>
                  </div>
                </div>

                {/* 5. Humanity & Our Prayer Section */}
                <div className="border-b pb-6 space-y-4">
                  <h4 className="font-bold text-sm text-primary-navy uppercase tracking-wider flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-primary-saffron text-white flex items-center justify-center text-xs">5</span>
                    <span>Humanity & Final Prayer Section</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Humanity Message Text</label>
                      <textarea
                        rows={2}
                        value={cmsData.humanityText || ''}
                        onChange={(e) => setCmsData({ ...cmsData, humanityText: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Humanity Highlight (Large Banner)</label>
                      <input
                        type="text"
                        value={cmsData.humanityHighlight || ''}
                        onChange={(e) => setCmsData({ ...cmsData, humanityHighlight: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl font-bold"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-gray-700 mb-1">Our Prayer Text</label>
                      <input
                        type="text"
                        value={cmsData.prayerText || ''}
                        onChange={(e) => setCmsData({ ...cmsData, prayerText: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* 6. About Jadu & Art Section — Homepage Image */}
                <div className="space-y-4 pt-2">
                  <h4 className="font-bold text-sm text-primary-navy uppercase tracking-wider flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-primary-saffron text-white flex items-center justify-center text-xs">6</span>
                    <span>About Jadu &amp; Art Section — Homepage Image</span>
                  </h4>
                  <p className="text-xs text-gray-500">
                    This is the photo displayed in the <strong>"ABOUT JADU &amp; ART FOUNDATION"</strong> section on the Home page (left column image).
                  </p>
                  <ImageUploader
                    label="About Section Featured Image (Home Page)"
                    value={cmsData.aboutSectionImage || ''}
                    folder="jadu-art/homepage"
                    onChange={(data) => setCmsData({ ...cmsData, aboutSectionImage: data.secureUrl })}
                    onRemove={() => setCmsData({ ...cmsData, aboutSectionImage: '' })}
                  />
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: OUR WORK CMS */}
          {activeTab === 'cms_work' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-primary-navy uppercase tracking-wider">Our Work Programs Management</h3>
                  <p className="text-xs text-gray-500">Manage work causes visible on `/our-work` and homepage.</p>
                </div>
                <button
                  onClick={handleOpenCreateModal}
                  className="bg-primary-saffron text-white px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shadow hover:bg-orange-600 transition-colors"
                >
                  <Plus size={16} />
                  <span>ADD NEW WORK</span>
                </button>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-gray-500">Loading work items...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700 font-bold border-b">
                        <th className="p-3">Work Program</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Short Description</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {dataList.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="p-3 font-bold text-primary-navy">{item.title}</td>
                          <td className="p-3 font-semibold text-gray-700">{item.category}</td>
                          <td className="p-3 text-gray-600 line-clamp-1 max-w-xs">{item.shortDescription}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 font-bold uppercase text-[10px]">
                              {item.published ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button onClick={() => handleOpenEditModal(item)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Edit2 size={14} /></button>
                            <button onClick={() => handleDeleteItem(item._id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg"><Trash2 size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 5 & SEO TAB: SITE SETTINGS, LOGO, FAVICON & SEO */}
          {(activeTab === 'settings' || activeTab === 'cms_seo' || activeTab === 'cms_sections') && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-8">
              {/* Header section with Save action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
                <div>
                  <div className="flex items-center space-x-2">
                    <Globe className="text-primary-saffron w-6 h-6" />
                    <h3 className="text-xl font-black text-primary-navy uppercase tracking-wider">
                      Website Section Toggles, Logos, Favicon & SEO Settings
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    Turn website sections ON/OFF, customize website logo, browser favicon, meta title, meta description, social share (OG) image & brand palette.
                  </p>
                </div>
                <button
                  onClick={() => handleSaveCMSContent('settings')}
                  disabled={cmsSaveLoading}
                  className="bg-primary-saffron text-white px-7 py-3 rounded-xl text-xs font-black shadow-md hover:bg-orange-600 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 shrink-0"
                >
                  {cmsSaveLoading ? 'SAVING SETTINGS...' : 'SAVE ALL SETTINGS'}
                </button>
              </div>

              <div className="space-y-8 text-xs font-medium">

                {/* 0. Website Section Visibility Manager (ON / OFF Toggles) */}
                <div className="border border-gray-200 rounded-2xl p-5 bg-emerald-50/30 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-700 flex items-center justify-center font-bold">
                        <Eye size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-primary-navy uppercase tracking-wider">Website Section Visibility & Layout Manager (Turn ON / OFF)</h4>
                        <p className="text-[11px] text-gray-500 font-normal">Toggle individual sections ON or OFF to control what is displayed on the live website.</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          const allOn = {
                            heroSection: true,
                            impactStrip: true,
                            aboutSection: true,
                            initiativesSection: true,
                            workSection: true,
                            founderSection: true,
                            lifePhilosophySection: true,
                            futureGenerationsSection: true,
                            humanitySection: true,
                            storiesSection: true,
                            gallerySection: true,
                            testimonialsSection: true,
                            volunteerSection: true
                          };
                          setCmsData({
                            ...cmsData,
                            visibleSections: allOn
                          });
                        }}
                        className="px-3 py-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        ENABLE ALL SECTIONS
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const allOff = {
                            heroSection: false,
                            impactStrip: false,
                            aboutSection: false,
                            initiativesSection: false,
                            workSection: false,
                            founderSection: false,
                            lifePhilosophySection: false,
                            futureGenerationsSection: false,
                            humanitySection: false,
                            storiesSection: false,
                            gallerySection: false,
                            testimonialsSection: false,
                            volunteerSection: false
                          };
                          setCmsData({
                            ...cmsData,
                            visibleSections: allOff
                          });
                        }}
                        className="px-3 py-1.5 bg-red-100 text-red-800 hover:bg-red-200 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        DISABLE ALL SECTIONS
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { key: 'heroSection', name: 'Hero Banner Section', desc: 'Main header title, badges & primary donate CTA' },
                      { key: 'impactStrip', name: 'Impact Metrics Strip', desc: 'Live statistics strip (500+ children, 1200+ reached, etc.)' },
                      { key: 'aboutSection', name: 'About Jadu & Art Section', desc: 'Organization background & introduction' },
                      { key: 'initiativesSection', name: 'Featured Initiatives', desc: 'Featured initiative cards with progress bars' },
                      { key: 'workSection', name: 'Our Work Areas Section', desc: 'Education, Healthcare, Cow Welfare & Relief' },
                      { key: 'founderSection', name: "Founder's Message Section", desc: 'Founder greeting & spiritual vision' },
                      { key: 'lifePhilosophySection', name: 'Life Philosophy Section', desc: 'Make Life Meaningful guidance' },
                      { key: 'futureGenerationsSection', name: 'Future Generations Section', desc: 'A Better Future for Next Generation' },
                      { key: 'humanitySection', name: 'Humanity Section', desc: 'Humanity Above Differences message' },
                      { key: 'storiesSection', name: 'Stories & News Section', desc: 'Latest news, field stories & articles' },
                      { key: 'gallerySection', name: 'Photo & Video Gallery', desc: 'Interactive gallery lightbox cards' },
                      { key: 'testimonialsSection', name: 'Testimonials Section', desc: 'Community feedback & donor quotes' },
                      { key: 'volunteerSection', name: 'Volunteer Sign-up Form', desc: 'Join as a volunteer application form' }
                    ].map(sec => {
                      const isVisible = cmsData.visibleSections?.[sec.key] !== false;
                      return (
                        <div key={sec.key} className={`p-4 rounded-xl border transition-all flex items-start justify-between space-x-3 ${
                          isVisible ? 'bg-white border-emerald-300 shadow-xs' : 'bg-gray-100/80 border-gray-200 opacity-70'
                        }`}>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-gray-900 text-xs">{sec.name}</span>
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                              }`}>
                                {isVisible ? 'ON' : 'OFF'}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 font-normal leading-tight">{sec.desc}</p>
                          </div>
                          
                          {/* Switch Toggle */}
                          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                            <input
                              type="checkbox"
                              checked={isVisible}
                              onChange={(e) => {
                                const current = cmsData.visibleSections || {};
                                setCmsData({
                                  ...cmsData,
                                  visibleSections: {
                                    ...current,
                                    [sec.key]: e.target.checked
                                  }
                                });
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* 1. Website Branding, Logos & Favicon */}
                <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 space-y-6">
                  <div className="flex items-center space-x-2 border-b border-gray-200 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-navy/10 text-primary-navy flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-primary-navy uppercase tracking-wider">Website Branding, Logos & Favicon</h4>
                      <p className="text-[11px] text-gray-500 font-normal">Upload or update your website's main logo, dark/header logo, favicon icon and social share image.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Main Logo */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 shadow-xs">
                      <label className="block font-bold text-gray-800 text-xs uppercase tracking-wider">
                        Main Website Logo
                      </label>
                      <ImageUploader
                        label="Upload Main Logo (PNG / SVG)"
                        value={cmsData.logo || '/logo.svg'}
                        aspectRatioHint="Recommended: PNG or SVG with transparent background"
                        onChange={(data) => setCmsData({ ...cmsData, logo: data.secureUrl })}
                      />
                      <div className="pt-2">
                        <label className="block text-[11px] font-bold text-gray-500 mb-1">Direct Logo URL</label>
                        <input
                          type="text"
                          value={cmsData.logo || '/logo.svg'}
                          onChange={(e) => setCmsData({ ...cmsData, logo: e.target.value })}
                          placeholder="/logo.svg or https://..."
                          className="w-full p-2.5 border border-gray-300 rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>

                    {/* Navbar / Header Logo */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 shadow-xs">
                      <label className="block font-bold text-gray-800 text-xs uppercase tracking-wider">
                        Header / Navigation Logo (Horizontal)
                      </label>
                      <ImageUploader
                        label="Upload Header Logo"
                        value={cmsData.darkLogo || '/logo-horizontal.svg'}
                        aspectRatioHint="Used in top navbar and header navigation bar"
                        onChange={(data) => setCmsData({ ...cmsData, darkLogo: data.secureUrl })}
                      />
                      <div className="pt-2">
                        <label className="block text-[11px] font-bold text-gray-500 mb-1">Direct Header Logo URL</label>
                        <input
                          type="text"
                          value={cmsData.darkLogo || '/logo-horizontal.svg'}
                          onChange={(e) => setCmsData({ ...cmsData, darkLogo: e.target.value })}
                          placeholder="/logo-horizontal.svg or https://..."
                          className="w-full p-2.5 border border-gray-300 rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>

                    {/* Website Favicon */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 shadow-xs">
                      <div className="flex justify-between items-center">
                        <label className="block font-bold text-gray-800 text-xs uppercase tracking-wider">
                          Browser Favicon Icon
                        </label>
                        {/* Live Favicon Preview Badge */}
                        <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-gray-100 rounded-lg border border-gray-300 text-[11px] font-semibold text-gray-700">
                          <img src={cmsData.favicon || '/favicon.svg'} alt="Favicon" className="w-4 h-4 object-contain" />
                          <span>Tab Preview</span>
                        </div>
                      </div>
                      <ImageUploader
                        label="Upload Favicon (.ico, .png, .svg)"
                        value={cmsData.favicon || '/favicon.svg'}
                        aspectRatioHint="Square format (32x32, 64x64 or SVG)"
                        onChange={(data) => setCmsData({ ...cmsData, favicon: data.secureUrl })}
                      />
                      <div className="pt-2">
                        <label className="block text-[11px] font-bold text-gray-500 mb-1">Direct Favicon URL</label>
                        <input
                          type="text"
                          value={cmsData.favicon || '/favicon.svg'}
                          onChange={(e) => setCmsData({ ...cmsData, favicon: e.target.value })}
                          placeholder="/favicon.svg or https://..."
                          className="w-full p-2.5 border border-gray-300 rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>

                    {/* Social Share (OG) Image */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 shadow-xs">
                      <label className="block font-bold text-gray-800 text-xs uppercase tracking-wider">
                        Social Share Preview Image (OG:Image)
                      </label>
                      <ImageUploader
                        label="Upload OG Share Image"
                        value={cmsData.ogImage || cmsData.logo || '/logo.svg'}
                        aspectRatioHint="Displayed when link is shared on WhatsApp, Facebook, Twitter (1200x630)"
                        onChange={(data) => setCmsData({ ...cmsData, ogImage: data.secureUrl })}
                      />
                      <div className="pt-2">
                        <label className="block text-[11px] font-bold text-gray-500 mb-1">Direct OG Image URL</label>
                        <input
                          type="text"
                          value={cmsData.ogImage || ''}
                          onChange={(e) => setCmsData({ ...cmsData, ogImage: e.target.value })}
                          placeholder="https://..."
                          className="w-full p-2.5 border border-gray-300 rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. SEO & Search Engine Optimization */}
                <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 space-y-6">
                  <div className="flex items-center space-x-2 border-b border-gray-200 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-saffron/10 text-primary-saffron flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-primary-navy uppercase tracking-wider">Search Engine Optimization (SEO) Settings</h4>
                      <p className="text-[11px] text-gray-500 font-normal">Configure title tags, search snippets, meta keywords & webmaster metadata.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Meta Title */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block font-bold text-gray-700">Website Meta Title (Browser & Search Engine Title) *</label>
                        <span className={`text-[11px] font-mono font-bold ${
                          (cmsData.metaTitle?.length || 0) > 60 ? 'text-amber-600' : 'text-gray-400'
                        }`}>
                          {cmsData.metaTitle?.length || 0} / 60 chars recommended
                        </span>
                      </div>
                      <input
                        type="text"
                        value={cmsData.metaTitle || 'Jadu & Art Foundation | Seva • Sanskar • Samriddh Bharat'}
                        onChange={(e) => setCmsData({ ...cmsData, metaTitle: e.target.value })}
                        placeholder="e.g. Jadu & Art Foundation | Empowering Communities Through Art & Service"
                        className="w-full p-3 border border-gray-300 rounded-xl font-medium focus:ring-2 focus:ring-primary-navy"
                      />
                    </div>

                    {/* Meta Description */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block font-bold text-gray-700">Website Meta Description (Search Snippet Summary) *</label>
                        <span className={`text-[11px] font-mono font-bold ${
                          (cmsData.metaDescription?.length || 0) > 160 ? 'text-amber-600' : 'text-gray-400'
                        }`}>
                          {cmsData.metaDescription?.length || 0} / 160 chars recommended
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={cmsData.metaDescription || 'Jadu & Art Foundation works towards education, healthcare, cow welfare and humanitarian support while promoting values of service, humanity and a better future for India.'}
                        onChange={(e) => setCmsData({ ...cmsData, metaDescription: e.target.value })}
                        placeholder="Brief summary of your foundation for search results..."
                        className="w-full p-3 border border-gray-300 rounded-xl font-medium focus:ring-2 focus:ring-primary-navy"
                      />
                    </div>

                    {/* Google Search Live Preview Card */}
                    <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-1.5 shadow-xs">
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center space-x-1">
                        <Search size={12} className="text-blue-600" />
                        <span>Google Search Result Live Preview</span>
                      </span>
                      <div className="flex items-center space-x-2 text-[12px] text-gray-700">
                        <img src={cmsData.favicon || '/favicon.svg'} alt="Icon" className="w-4 h-4 object-contain rounded-xs" />
                        <span className="text-gray-600 font-mono text-[11px]">{cmsData.siteUrl || 'https://jaduandart.org'}</span>
                      </div>
                      <h5 className="text-base text-blue-800 font-medium hover:underline cursor-pointer leading-tight">
                        {cmsData.metaTitle || cmsData.foundationName || 'Jadu & Art Foundation'}
                      </h5>
                      <p className="text-xs text-gray-600 leading-normal line-clamp-2">
                        {cmsData.metaDescription || 'Jadu & Art Foundation works towards education, healthcare, cow welfare and humanitarian support...'}
                      </p>
                    </div>

                    {/* Meta Keywords & Additional Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Meta Keywords (Comma separated)</label>
                        <input
                          type="text"
                          value={cmsData.metaKeywords || 'Jadu and Art, NGO, Social Impact, Education, Healthcare, Cow Welfare, Charity, India'}
                          onChange={(e) => setCmsData({ ...cmsData, metaKeywords: e.target.value })}
                          placeholder="NGO, Art, Social Service, India..."
                          className="w-full p-3 border border-gray-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Canonical Website URL</label>
                        <input
                          type="text"
                          value={cmsData.siteUrl || 'https://jaduandart.org'}
                          onChange={(e) => setCmsData({ ...cmsData, siteUrl: e.target.value })}
                          placeholder="https://jaduandart.org"
                          className="w-full p-3 border border-gray-300 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Twitter Handle / Creator</label>
                        <input
                          type="text"
                          value={cmsData.twitterHandle || '@jaduandart'}
                          onChange={(e) => setCmsData({ ...cmsData, twitterHandle: e.target.value })}
                          placeholder="@jaduandart"
                          className="w-full p-3 border border-gray-300 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Author / Organization Name</label>
                        <input
                          type="text"
                          value={cmsData.author || 'Jadu & Art Foundation'}
                          onChange={(e) => setCmsData({ ...cmsData, author: e.target.value })}
                          placeholder="Jadu & Art Foundation"
                          className="w-full p-3 border border-gray-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Facebook Page URL</label>
                        <input
                          type="text"
                          value={cmsData.facebookUrl || ''}
                          onChange={(e) => setCmsData({ ...cmsData, facebookUrl: e.target.value })}
                          placeholder="https://facebook.com/..."
                          className="w-full p-3 border border-gray-300 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Instagram Profile URL</label>
                        <input
                          type="text"
                          value={cmsData.instagramUrl || ''}
                          onChange={(e) => setCmsData({ ...cmsData, instagramUrl: e.target.value })}
                          placeholder="https://instagram.com/..."
                          className="w-full p-3 border border-gray-300 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">YouTube Channel URL</label>
                        <input
                          type="text"
                          value={cmsData.youtubeUrl || ''}
                          onChange={(e) => setCmsData({ ...cmsData, youtubeUrl: e.target.value })}
                          placeholder="https://youtube.com/..."
                          className="w-full p-3 border border-gray-300 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">WhatsApp Business Number</label>
                        <input
                          type="text"
                          value={cmsData.whatsappNumber || ''}
                          onChange={(e) => setCmsData({ ...cmsData, whatsappNumber: e.target.value })}
                          placeholder="+919876543210"
                          className="w-full p-3 border border-gray-300 rounded-xl font-mono text-emerald-700 font-bold"
                        />
                      </div>
                    </div>

                    {/* Analytics & Search Console */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Google Analytics Tracking ID</label>
                        <input
                          type="text"
                          value={cmsData.googleAnalyticsId || ''}
                          onChange={(e) => setCmsData({ ...cmsData, googleAnalyticsId: e.target.value })}
                          placeholder="e.g. G-XXXXXXXXXX"
                          className="w-full p-3 border border-gray-300 rounded-xl font-mono text-primary-navy"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Google Search Console Verification Code</label>
                        <input
                          type="text"
                          value={cmsData.googleSearchConsoleVerification || ''}
                          onChange={(e) => setCmsData({ ...cmsData, googleSearchConsoleVerification: e.target.value })}
                          placeholder="Meta verification tag content..."
                          className="w-full p-3 border border-gray-300 rounded-xl font-mono text-primary-navy"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Official Foundation Identity & Taglines */}
                <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 space-y-4">
                  <div className="flex items-center space-x-2 border-b border-gray-200 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-700 flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-primary-navy uppercase tracking-wider">Official Foundation Information</h4>
                      <p className="text-[11px] text-gray-500 font-normal">Basic organization details used across headers, footers & contact pages.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Foundation Name</label>
                      <input
                        type="text"
                        value={cmsData.foundationName || 'Jadu & Art Foundation'}
                        onChange={(e) => setCmsData({ ...cmsData, foundationName: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Official Contact Email *</label>
                      <input
                        type="email"
                        value={cmsData.officialEmail || 'jaduandartfoundation@gmail.com'}
                        onChange={(e) => setCmsData({ ...cmsData, officialEmail: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl font-mono text-primary-navy font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Official Tagline (English)</label>
                      <input
                        type="text"
                        value={cmsData.tagline || 'Spiritual Values | Social Impact | A Brighter India'}
                        onChange={(e) => setCmsData({ ...cmsData, tagline: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Official Tagline (Hindi)</label>
                      <input
                        type="text"
                        value={cmsData.hindiTagline || 'Seva • Sanskar • Samriddh Bharat'}
                        onChange={(e) => setCmsData({ ...cmsData, hindiTagline: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Official Brand Palette */}
                <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 space-y-4">
                  <div className="flex items-center space-x-2 border-b border-gray-200 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-primary-navy uppercase tracking-wider">Official Brand Color Palette</h4>
                      <p className="text-[11px] text-gray-500 font-normal">Theme colors applied throughout the site.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Primary Deep Green</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={cmsData.primaryGreen || '#006B3C'}
                          onChange={(e) => setCmsData({ ...cmsData, primaryGreen: e.target.value })}
                          className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={cmsData.primaryGreen || '#006B3C'}
                          onChange={(e) => setCmsData({ ...cmsData, primaryGreen: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg font-mono text-[11px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Dark Teal / Forest</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={cmsData.darkTeal || '#063F36'}
                          onChange={(e) => setCmsData({ ...cmsData, darkTeal: e.target.value })}
                          className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={cmsData.darkTeal || '#063F36'}
                          onChange={(e) => setCmsData({ ...cmsData, darkTeal: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg font-mono text-[11px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Saffron / Orange</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={cmsData.orange || '#F47B20'}
                          onChange={(e) => setCmsData({ ...cmsData, orange: e.target.value })}
                          className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={cmsData.orange || '#F47B20'}
                          onChange={(e) => setCmsData({ ...cmsData, orange: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg font-mono text-[11px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Gold Accent</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={cmsData.gold || '#C99020'}
                          onChange={(e) => setCmsData({ ...cmsData, gold: e.target.value })}
                          className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={cmsData.gold || '#C99020'}
                          onChange={(e) => setCmsData({ ...cmsData, gold: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Timed Donation Popup */}
                <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 space-y-4">
                  <div className="flex items-center space-x-2 border-b border-gray-200 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
                      5
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-primary-navy uppercase tracking-wider">Timed Donation Popup Settings</h4>
                      <p className="text-[11px] text-gray-500 font-normal">Configure the automatic donation popup overlay displayed to visitors.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="popupEnabled"
                      checked={cmsData.donationPopup?.enabled !== false}
                      onChange={(e) => setCmsData({
                        ...cmsData,
                        donationPopup: { ...cmsData.donationPopup, enabled: e.target.checked }
                      })}
                      className="w-4 h-4 text-primary-saffron rounded cursor-pointer"
                    />
                    <label htmlFor="popupEnabled" className="font-bold text-gray-800 cursor-pointer">Enable Timed Donation Popup (10s delay)</label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Popup Delay (Milliseconds)</label>
                      <input
                        type="number"
                        value={cmsData.donationPopup?.delay || 10000}
                        onChange={(e) => setCmsData({
                          ...cmsData,
                          donationPopup: { ...cmsData.donationPopup, delay: Number(e.target.value) }
                        })}
                        placeholder="10000 = 10 seconds"
                        className="w-full p-3 border border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Popup Cooldown (Milliseconds)</label>
                      <input
                        type="number"
                        value={cmsData.donationPopup?.cooldown || 604800000}
                        onChange={(e) => setCmsData({
                          ...cmsData,
                          donationPopup: { ...cmsData.donationPopup, cooldown: Number(e.target.value) }
                        })}
                        placeholder="604800000 = 7 days"
                        className="w-full p-3 border border-gray-300 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB: LEGAL POLICIES CMS */}
          {activeTab === 'cms_legal' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
                <div>
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="text-primary-green w-6 h-6" />
                    <h3 className="text-xl font-black text-primary-navy uppercase tracking-wider">
                      Legal Policies &amp; Disclaimer Content (ADMIN → LEGAL)
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    Configure custom text paragraphs, last updated date, and grievance contact details displayed across Privacy Policy, Terms &amp; Conditions, and Donation Refund Policy.
                  </p>
                </div>
                <button
                  onClick={() => handleSaveCMSContent('settings')}
                  disabled={cmsSaveLoading}
                  className="bg-primary-saffron text-white px-7 py-3 rounded-xl text-xs font-black shadow-md hover:bg-orange-600 transition-all shrink-0"
                >
                  {cmsSaveLoading ? 'SAVING POLICIES...' : 'SAVE LEGAL CONTENT'}
                </button>
              </div>

              <div className="space-y-6 text-xs font-medium">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Policy Last Updated Date (Displayed publicly on legal pages)</label>
                  <input
                    type="text"
                    value={cmsData.lastUpdatedDate || 'September 26, 2026'}
                    onChange={(e) => setCmsData({ ...cmsData, lastUpdatedDate: e.target.value })}
                    placeholder="e.g. September 26, 2026"
                    className="w-full p-3 border border-gray-300 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">Privacy &amp; Grievance Contact Email</label>
                  <input
                    type="email"
                    value={cmsData.legalContactEmail || 'jaduandartfoundation@gmail.com'}
                    onChange={(e) => setCmsData({ ...cmsData, legalContactEmail: e.target.value })}
                    placeholder="jaduandartfoundation@gmail.com"
                    className="w-full p-3 border border-gray-300 rounded-xl font-mono text-primary-navy font-bold"
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h4 className="font-bold text-sm text-primary-navy uppercase tracking-wider">Custom Policy Content &amp; Overrides (Rich Text / Hindi Supported)</h4>
                  
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Privacy Policy Special Note / Custom Overrides</label>
                    <textarea
                      rows={4}
                      value={cmsData.privacyPolicyCustomText || ''}
                      onChange={(e) => setCmsData({ ...cmsData, privacyPolicyCustomText: e.target.value })}
                      placeholder="Optional organization-specific privacy note or custom instructions..."
                      className="w-full p-3 border border-gray-300 rounded-xl"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Terms &amp; Conditions Special Note / Custom Overrides</label>
                    <textarea
                      rows={4}
                      value={cmsData.termsCustomText || ''}
                      onChange={(e) => setCmsData({ ...cmsData, termsCustomText: e.target.value })}
                      placeholder="Optional organization-specific terms note or custom instructions..."
                      className="w-full p-3 border border-gray-300 rounded-xl"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Donation Refund Policy Special Note / Custom Overrides</label>
                    <textarea
                      rows={4}
                      value={cmsData.refundPolicyCustomText || ''}
                      onChange={(e) => setCmsData({ ...cmsData, refundPolicyCustomText: e.target.value })}
                      placeholder="Optional organization-specific refund note or custom instructions..."
                      className="w-full p-3 border border-gray-300 rounded-xl"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ORGANIZATION & LEGAL DETAILS */}
          {activeTab === 'cms_org_details' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
                <div>
                  <div className="flex items-center space-x-2">
                    <FileText className="text-primary-saffron w-6 h-6" />
                    <h3 className="text-xl font-black text-primary-navy uppercase tracking-wider">
                      Organization &amp; Verified Legal Details (ADMIN → ORGANIZATION / LEGAL DETAILS)
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    Store and manage official foundation registration numbers, PAN, 12A/80G status, and statutory addresses.
                  </p>
                </div>
                <button
                  onClick={() => handleSaveCMSContent('settings')}
                  disabled={cmsSaveLoading}
                  className="bg-primary-saffron text-white px-7 py-3 rounded-xl text-xs font-black shadow-md hover:bg-orange-600 transition-all shrink-0"
                >
                  {cmsSaveLoading ? 'SAVING DETAILS...' : 'SAVE ORG DETAILS'}
                </button>
              </div>

              {/* Strict Legal Fact Notice */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 text-xs text-amber-950 space-y-1 font-medium">
                <strong className="uppercase font-extrabold text-amber-900 tracking-wider">CRITICAL LEGAL COMPLIANCE RULE:</strong>
                <p>
                  Do NOT invent legal facts. Registration details, PAN, 12A, 80G, FCRA status, and registered address remain placeholder until official verified legal certificates are provided by the Foundation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-medium">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Official Foundation Legal Name *</label>
                  <input
                    type="text"
                    value={cmsData.foundationName || 'Jadu & Art Foundation'}
                    onChange={(e) => setCmsData({ ...cmsData, foundationName: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Official Contact Email *</label>
                  <input
                    type="email"
                    value={cmsData.officialEmail || 'jaduandartfoundation@gmail.com'}
                    onChange={(e) => setCmsData({ ...cmsData, officialEmail: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl font-mono text-primary-navy font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Registered Office Address</label>
                  <input
                    type="text"
                    value={cmsData.registeredAddress || '[Registered Office Address to be added]'}
                    onChange={(e) => setCmsData({ ...cmsData, registeredAddress: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Organization Registration Type (Trust / Society / Sec 8)</label>
                  <input
                    type="text"
                    value={cmsData.registrationType || '[Registration Type to be added]'}
                    onChange={(e) => setCmsData({ ...cmsData, registrationType: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Registration / Incorporation Number</label>
                  <input
                    type="text"
                    value={cmsData.registrationNumber || '[Registration Number to be added]'}
                    onChange={(e) => setCmsData({ ...cmsData, registrationNumber: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Permanent Account Number (PAN)</label>
                  <input
                    type="text"
                    value={cmsData.pan || '[PAN to be added]'}
                    onChange={(e) => setCmsData({ ...cmsData, pan: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl font-semibold uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Income Tax 12A Registration Status</label>
                  <input
                    type="text"
                    value={cmsData.status12A || '[12A Status to be added]'}
                    onChange={(e) => setCmsData({ ...cmsData, status12A: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Income Tax 80G Approval Status</label>
                  <input
                    type="text"
                    value={cmsData.status80G || '[80G Status to be added]'}
                    onChange={(e) => setCmsData({ ...cmsData, status80G: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">FCRA Registration Status (Foreign Contribution)</label>
                  <input
                    type="text"
                    value={cmsData.fcraStatus || '[FCRA Status to be added]'}
                    onChange={(e) => setCmsData({ ...cmsData, fcraStatus: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl font-semibold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Other Government Approvals / CSR Registrations</label>
                  <input
                    type="text"
                    value={cmsData.otherRegistrations || '[Other verified registrations to be added]'}
                    onChange={(e) => setCmsData({ ...cmsData, otherRegistrations: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: MEDIA LIBRARY */}
          {activeTab === 'media' && <MediaLibraryPage />}

          {/* Fallback generic table for remaining tabs */}
          {!['overview', 'donations', 'cms_homepage', 'cms_work', 'settings', 'cms_seo', 'cms_sections', 'cms_legal', 'cms_org_details', 'media'].includes(activeTab) && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-primary-navy uppercase tracking-wider">{activeTab.replace('cms_', '')} Management</h3>
                <button
                  onClick={handleOpenCreateModal}
                  className="bg-primary-saffron text-white px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shadow hover:bg-orange-600 transition-colors"
                >
                  <Plus size={16} />
                  <span>Add Record</span>
                </button>
              </div>

              {/* Bulk Image Upload Dropzone for Gallery */}
              {activeTab === 'cms_gallery' && (
                <div className="p-4 bg-primary-saffron/5 border border-primary-saffron/20 rounded-2xl">
                  <ImageUploader
                    label="Batch Drag & Drop Multiple Gallery Images"
                    allowBulk={true}
                    folder="jadu-art/gallery"
                    onChange={() => {}}
                    onBulkUploaded={async (uploadedItems) => {
                      try {
                        for (const item of uploadedItems) {
                          await galleryService.createGalleryItem({
                            title: item.altText || 'Gallery Image',
                            imageUrl: item.secureUrl,
                            cloudinaryPublicId: item.publicId,
                            altText: item.altText,
                            category: 'General',
                          });
                        }
                        alert(`Successfully uploaded and created ${uploadedItems.length} gallery items!`);
                        const evt = new Event('reload');
                        setActiveTab('cms_gallery');
                      } catch (err) {
                        alert('Error saving batch gallery items.');
                      }
                    }}
                  />
                </div>
              )}

              {loading ? (
                <div className="py-12 text-center text-xs text-gray-500">Loading records...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700 font-bold border-b">
                        <th className="p-3">Title / Name</th>
                        <th className="p-3">Category / Role / Info</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {dataList.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="p-3 font-bold text-primary-navy">{item.title || item.name || item.label || 'Record'}</td>
                          <td className="p-3 text-gray-600">{item.category || item.role || item.value || '-'}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 font-bold uppercase text-[10px]">
                              {item.status || (item.published ? 'published' : 'active')}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button onClick={() => handleOpenEditModal(item)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Edit2 size={14} /></button>
                            <button onClick={() => handleDeleteItem(item._id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg"><Trash2 size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Donation Details Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-xl font-bold text-primary-navy">Donation Record Details</h3>
              <button onClick={() => setSelectedDonation(null)} className="text-gray-400 font-bold text-lg">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                <span className="font-bold text-gray-500">Donor Name:</span>
                <span className="font-black text-primary-navy text-sm">{selectedDonation.donorName}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                <span className="font-bold text-gray-500">Amount Paid:</span>
                <span className="font-black text-primary-saffron text-base">₹{selectedDonation.amount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                <span className="font-bold text-gray-500">Initiative / Campaign:</span>
                <span className="font-bold text-gray-800">{selectedDonation.campaign}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                <span className="font-bold text-gray-500">Payment Status:</span>
                <span className="font-bold uppercase text-green-700">{selectedDonation.status}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl space-y-1 font-mono text-[11px]">
                <div><span className="font-bold text-gray-500">Email:</span> {selectedDonation.email}</div>
                <div><span className="font-bold text-gray-500">Phone:</span> {selectedDonation.phone}</div>
                <div><span className="font-bold text-gray-500">PAN:</span> {selectedDonation.pan || 'N/A'}</div>
                <div><span className="font-bold text-gray-500">Razorpay Order ID:</span> {selectedDonation.razorpayOrderId}</div>
                <div><span className="font-bold text-gray-500">Razorpay Payment ID:</span> {selectedDonation.razorpayPaymentId}</div>
                <div><span className="font-bold text-gray-500">Date:</span> {new Date(selectedDonation.createdAt).toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button 
                onClick={() => setSelectedDonation(null)}
                className="bg-primary-navy text-white px-6 py-2 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CRUD Creation/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-xl font-bold text-primary-navy">
                {editingItem ? 'Edit Record' : 'Add New Record'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Title / Name *</label>
                <input
                  type="text"
                  required
                  value={formData.title || formData.name || formData.label || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value, name: e.target.value, label: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Hindi Title / Hindi Name</label>
                <input
                  type="text"
                  value={formData.hindiTitle || formData.hindiName || formData.hindiLabel || ''}
                  onChange={(e) => setFormData({ ...formData, hindiTitle: e.target.value, hindiName: e.target.value, hindiLabel: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl"
                />
              </div>

              {activeTab === 'cms_work' && (
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category || 'Education'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  />
                </div>
              )}

              {activeTab === 'cms_documents' ? (
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Document File URL (PDF)</label>
                  <input
                    type="text"
                    value={formData.fileUrl || ''}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  />
                </div>
              ) : (
                <ImageUploader
                  label="Featured Image / Photo"
                  value={formData.image || formData.photo || formData.heroImage || formData.imageUrl || ''}
                  folder={`jadu-art/${activeTab.replace('cms_', '')}`}
                  onChange={(data) => setFormData({ 
                    ...formData, 
                    image: data.secureUrl, 
                    photo: data.secureUrl, 
                    heroImage: data.secureUrl,
                    imageUrl: data.secureUrl,
                    cloudinaryPublicId: data.publicId,
                    altText: data.altText
                  })}
                  onRemove={() => setFormData({ ...formData, image: '', photo: '', heroImage: '', imageUrl: '', cloudinaryPublicId: '' })}
                />
              )}

              <div>
                <label className="block font-bold text-gray-700 mb-1">Short Description / Excerpt / Bio</label>
                <textarea
                  rows={2}
                  value={formData.shortDescription || formData.excerpt || formData.bio || formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value, excerpt: e.target.value, bio: e.target.value, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Content / Story / Details</label>
                <textarea
                  rows={4}
                  value={formData.fullDescription || formData.content || formData.testimonial || ''}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value, content: e.target.value, testimonial: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl"
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary-saffron text-white font-extrabold shadow hover:bg-orange-600"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
