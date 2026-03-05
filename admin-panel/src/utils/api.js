const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
    // Auth
    auth: {
        login: async (email, password) => {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            return res.json();
        },
        register: async (name, email, password) => {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            return res.json();
        }
    },
    // Products
    products: {
        getAll: async () => {
            const res = await fetch(`${API_BASE_URL}/products`);
            return res.json();
        },
        getOne: async (idOrSlug) => {
            const res = await fetch(`${API_BASE_URL}/products/${idOrSlug}`);
            return res.json();
        },
        create: async (data) => {
            const res = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        update: async (id, data) => {
            const res = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        delete: async (id) => {
            const res = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'DELETE'
            });
            return res.json();
        },
        bulkDelete: async (ids) => {
            const res = await fetch(`${API_BASE_URL}/products/bulk-delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids })
            });
            return res.json();
        }
    },
    // Upload Utility
    upload: {
        image: async (file) => {
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: formData
            });
            return res.json();
        }
    },
    // Journals
    journals: {
        getAll: async () => {
            const res = await fetch(`${API_BASE_URL}/journals?admin=true`);
            return res.json();
        },
        create: async (data) => {
            const res = await fetch(`${API_BASE_URL}/journals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        update: async (slug, data) => {
            const res = await fetch(`${API_BASE_URL}/journals/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        delete: async (slug) => {
            const res = await fetch(`${API_BASE_URL}/journals/${slug}`, {
                method: 'DELETE'
            });
            return res.json();
        }
    },
    // FAQs
    faqs: {
        getAll: async () => {
            const res = await fetch(`${API_BASE_URL}/faqs`);
            return res.json();
        },
        create: async (data) => {
            const res = await fetch(`${API_BASE_URL}/faqs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        }
    },
    // Navigation
    navigation: {
        getAll: async () => {
            const res = await fetch(`${API_BASE_URL}/navigation`);
            return res.json();
        },
        create: async (data) => {
            const res = await fetch(`${API_BASE_URL}/navigation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        update: async (id, data) => {
            const res = await fetch(`${API_BASE_URL}/navigation/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        delete: async (id) => {
            const res = await fetch(`${API_BASE_URL}/navigation/${id}`, {
                method: 'DELETE'
            });
            return res.json();
        }
    },
    // Categories
    categories: {
        getAll: async () => {
            const res = await fetch(`${API_BASE_URL}/categories`);
            return res.json();
        },
        create: async (data) => {
            const res = await fetch(`${API_BASE_URL}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        update: async (id, data) => {
            const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        delete: async (id) => {
            const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
                method: 'DELETE'
            });
            return res.json();
        }
    },
    // Reviews
    reviews: {
        getAll: async () => {
            const res = await fetch(`${API_BASE_URL}/reviews`);
            return res.json();
        },
        update: async (id, data) => {
            const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        delete: async (id) => {
            const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
                method: 'DELETE'
            });
            return res.json();
        },
        importExcel: async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch(`${API_BASE_URL}/reviews/bulk-import`, {
                method: 'POST',
                body: formData
            });
            return res.json();
        }
    },
    // Attributes
    attributes: {
        getAll: async () => {
            const res = await fetch(`${API_BASE_URL}/attributes`);
            return res.json();
        },
        create: async (data) => {
            const res = await fetch(`${API_BASE_URL}/attributes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        delete: async (id) => {
            const res = await fetch(`${API_BASE_URL}/attributes/${id}`, {
                method: 'DELETE'
            });
            return res.json();
        }
    },
    // Recommendations
    recommendations: {
        getAll: async () => {
            const res = await fetch(`${API_BASE_URL}/recommendations/all`);
            return res.json();
        },
        create: async (data) => {
            const res = await fetch(`${API_BASE_URL}/recommendations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        update: async (id, data) => {
            const res = await fetch(`${API_BASE_URL}/recommendations/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        delete: async (id) => {
            const res = await fetch(`${API_BASE_URL}/recommendations/${id}`, {
                method: 'DELETE'
            });
            return res.json();
        }
    },
    // Lookbooks
    lookbooks: {
        getAll: async () => {
            const res = await fetch(`${API_BASE_URL}/lookbooks`);
            return res.json();
        },
        create: async (data) => {
            const res = await fetch(`${API_BASE_URL}/lookbooks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        update: async (id, data) => {
            const res = await fetch(`${API_BASE_URL}/lookbooks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        delete: async (id) => {
            const res = await fetch(`${API_BASE_URL}/lookbooks/${id}`, {
                method: 'DELETE'
            });
            return res.json();
        }
    },
    // Orders
    orders: {
        getAll: async () => {
            const res = await fetch(`${API_BASE_URL}/orders`);
            return res.json();
        },
        updateStatus: async (id, statusData) => {
            const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(statusData)
            });
            return res.json();
        },
        dispatch: async (id, dispatchData) => {
            const res = await fetch(`${API_BASE_URL}/orders/${id}/dispatch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dispatchData)
            });
            return res.json();
        }
    },
    // Delivery Partners
    deliveryPartners: {
        getAll: async () => {
            const res = await fetch(`${API_BASE_URL}/delivery-partners`);
            return res.json();
        },
        create: async (data) => {
            const res = await fetch(`${API_BASE_URL}/delivery-partners`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        update: async (id, data) => {
            const res = await fetch(`${API_BASE_URL}/delivery-partners/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        delete: async (id) => {
            const res = await fetch(`${API_BASE_URL}/delivery-partners/${id}`, {
                method: 'DELETE'
            });
            return res.json();
        }
    },
    // Users
    users: {
        getAll: async (keyword = '') => {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const token = user.token;
            const res = await fetch(`${API_BASE_URL}/user?keyword=${keyword}`, {
                headers: { 
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });
            return res.json();
        }
    }
};
