const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
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
        }
    },
    // Journals
    journals: {
        getAll: async () => {
            const res = await fetch(`${API_BASE_URL}/journals`);
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
        },
        uploadImage: async (file) => {
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: formData
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
        },
        uploadImage: async (file) => {
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: formData
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
    }
};
