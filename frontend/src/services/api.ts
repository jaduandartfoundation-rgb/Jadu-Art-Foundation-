import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for 401 Unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const donationService = {
  createOrder: (data: any) => api.post('/donations/create-order', data),
  verifyPayment: (data: any) => api.post('/donations/verify', data),
  getDonations: (params?: any) => api.get('/donations', { params }),
  getDonationById: (id: string) => api.get(`/donations/${id}`),
  getDonationReports: () => api.get('/donations/reports'),
  exportCSV: () => api.get('/donations/export', { responseType: 'blob' }),
};

export const authService = {
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const campaignService = {
  getCampaigns: () => api.get('/campaigns'),
  getCampaignBySlug: (slug: string) => api.get(`/campaigns/${slug}`),
  createCampaign: (data: any) => api.post('/campaigns', data),
  updateCampaign: (id: string, data: any) => api.put(`/campaigns/${id}`, data),
  deleteCampaign: (id: string) => api.delete(`/campaigns/${id}`),
};

export const initiativeService = {
  getInitiatives: (category?: string) => api.get(`/initiatives${category ? `?category=${category}` : ''}`),
  getFeaturedInitiatives: () => api.get('/initiatives/featured'),
  getAllInitiativesAdmin: () => api.get('/initiatives/all'),
  getInitiativeBySlug: (slug: string) => api.get(`/initiatives/${slug}`),
  createInitiative: (data: any) => api.post('/initiatives', data),
  updateInitiative: (id: string, data: any) => api.patch(`/initiatives/${id}`, data),
  deleteInitiative: (id: string) => api.delete(`/initiatives/${id}`),
  addTimelineUpdate: (id: string, data: any) => api.post(`/initiatives/${id}/updates`, data),
  deleteTimelineUpdate: (id: string, updateId: string) => api.delete(`/initiatives/${id}/updates/${updateId}`),
};

export const workService = {
  getWorks: (category?: string) => api.get(`/work${category ? `?category=${category}` : ''}`),
  getCategories: () => api.get('/work/categories'),
  getWorkBySlug: (slug: string) => api.get(`/work/${slug}`),
  getAllWorksAdmin: () => api.get('/work/admin/all'),
  createWork: (data: any) => api.post('/work', data),
  updateWork: (id: string, data: any) => api.put(`/work/${id}`, data),
  deleteWork: (id: string) => api.delete(`/work/${id}`),
  createCategory: (data: any) => api.post('/work/categories', data),
};

export const teamService = {
  getTeamMembers: () => api.get('/team'),
  getAllTeamMembersAdmin: () => api.get('/team/all'),
  createTeamMember: (data: any) => api.post('/team', data),
  updateTeamMember: (id: string, data: any) => api.put(`/team/${id}`, data),
  deleteTeamMember: (id: string) => api.delete(`/team/${id}`),
};

export const testimonialService = {
  getTestimonials: () => api.get('/testimonials'),
  getAllTestimonialsAdmin: () => api.get('/testimonials/all'),
  createTestimonial: (data: any) => api.post('/testimonials', data),
  updateTestimonial: (id: string, data: any) => api.put(`/testimonials/${id}`, data),
  deleteTestimonial: (id: string) => api.delete(`/testimonials/${id}`),
};

export const documentService = {
  getDocuments: () => api.get('/documents'),
  getAllDocumentsAdmin: () => api.get('/documents/all'),
  createDocument: (data: any) => api.post('/documents', data),
  updateDocument: (id: string, data: any) => api.put(`/documents/${id}`, data),
  deleteDocument: (id: string) => api.delete(`/documents/${id}`),
};

export const contentService = {
  getContentByKey: (key: string) => api.get(`/content/${key}`),
  updateContentByKey: (key: string, data: any) => api.put(`/content/${key}`, { data }),
};

export const settingsService = {
  getSettings: () => api.get('/settings'),
  updateSettings: (data: any) => api.put('/settings', data),
};

export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};

export const auditService = {
  getAuditLogs: (page = 1, limit = 25) => api.get(`/admin/audit-logs?page=${page}&limit=${limit}`),
};

export const storyService = {
  getStories: () => api.get('/stories'),
  getAllStories: () => api.get('/stories/all'),
  getStoryBySlug: (slug: string) => api.get(`/stories/${slug}`),
  createStory: (data: any) => api.post('/stories', data),
  updateStory: (id: string, data: any) => api.put(`/stories/${id}`, data),
  deleteStory: (id: string) => api.delete(`/stories/${id}`),
};

export const galleryService = {
  getGalleryItems: (category?: string) => api.get(`/gallery${category ? `?category=${category}` : ''}`),
  getAllGalleryItems: () => api.get('/gallery/all'),
  createGalleryItem: (data: any) => api.post('/gallery', data),
  deleteGalleryItem: (id: string) => api.delete(`/gallery/${id}`),
};

export const impactService = {
  getImpactMetrics: () => api.get('/impact'),
  getAllImpactMetrics: () => api.get('/impact/all'),
  createImpactMetric: (data: any) => api.post('/impact', data),
  updateImpactMetric: (id: string, data: any) => api.put(`/impact/${id}`, data),
  deleteImpactMetric: (id: string) => api.delete(`/impact/${id}`),
};

export const volunteerService = {
  submitVolunteer: (data: any) => api.post('/volunteers', data),
  getVolunteers: () => api.get('/volunteers'),
  updateStatus: (id: string, status: string) => api.patch(`/volunteers/${id}`, { status }),
};

export const enquiryService = {
  submitEnquiry: (data: any) => api.post('/enquiries', data),
  getEnquiries: () => api.get('/enquiries'),
  updateStatus: (id: string, status: string) => api.patch(`/enquiries/${id}`, { status }),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  createUser: (data: any) => api.post('/admin/users', data),
  updateUser: (id: string, data: any) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
};

export const mediaService = {
  getSignature: (folder?: string) => api.get(`/media/signature${folder ? `?folder=${folder}` : ''}`),
  registerMedia: (data: any) => api.post('/media', data),
  getMediaList: (params?: any) => api.get('/media', { params }),
  getMediaUsage: (id: string) => api.get(`/media/${id}/usage`),
  updateMedia: (id: string, data: any) => api.put(`/media/${id}`, data),
  deleteMedia: (id: string, force = false) => api.delete(`/media/${id}${force ? '?forceDelete=true' : ''}`),
  
  uploadDirectToCloudinary: async (file: File, sigData: any, onProgress?: (percent: number) => void) => {
    // If Cloudinary is not configured or in simulation mode
    if (!sigData.cloudName || !sigData.apiKey || sigData.isConfigured === false) {
      return new Promise<any>((resolve) => {
        let pct = 0;
        const interval = setInterval(() => {
          pct += 25;
          if (onProgress) onProgress(pct);
          if (pct >= 100) {
            clearInterval(interval);
            const fakePublicId = `jadu-art/${file.name.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}`;
            const previewUrl = URL.createObjectURL(file);
            resolve({
              secure_url: previewUrl,
              public_id: fakePublicId,
              resource_type: 'image',
              format: file.name.split('.').pop() || 'jpg',
              width: 1200,
              height: 800,
              bytes: file.size,
              original_filename: file.name,
              isSimulation: true,
            });
          }
        }, 150);
      });
    }

    // Real signed upload to Cloudinary API
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', sigData.apiKey);
    formData.append('timestamp', sigData.timestamp);
    formData.append('signature', sigData.signature);
    formData.append('folder', sigData.folder || 'jadu-art');

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`;

    const res = await axios.post(cloudinaryUrl, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    return res.data;
  },
};

export default api;
