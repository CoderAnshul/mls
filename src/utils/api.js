const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user?.token ? { 'Authorization': `Bearer ${user.token}` } : {};
};

const handleResponse = async (res) => {
    const data = await res.json();
    if (!res.ok) {
        throw { response: { data } };
    }
    return data;
};

export const api = {
    auth: {
        login: async (email, password) => {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            return { data: await handleResponse(res) };
        },
        register: async (name, email, password) => {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            return { data: await handleResponse(res) };
        },
        forgotPassword: async (email) => {
            const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            return handleResponse(res);
        }
    },
    user: {
        getAll: async (keyword = '') => {
            const res = await fetch(`${API_BASE_URL}/user?keyword=${keyword}`, {
                headers: { ...getAuthHeader() }
            });
            return handleResponse(res);
        },
        getMyOrders: async () => {
            const res = await fetch(`${API_BASE_URL}/user/orders`, {
                headers: { ...getAuthHeader() }
            });
            return handleResponse(res);
        },
        updateProfile: async (profileData) => {
            const res = await fetch(`${API_BASE_URL}/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify(profileData)
            });
            return handleResponse(res);
        },
        getWishlist: async () => {
            const res = await fetch(`${API_BASE_URL}/user/wishlist`, {
                headers: { ...getAuthHeader() }
            });
            return handleResponse(res);
        },
        toggleWishlist: async (productId) => {
            const res = await fetch(`${API_BASE_URL}/user/wishlist/toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify({ productId })
            });
            return handleResponse(res);
        },
        getCart: async () => {
            const res = await fetch(`${API_BASE_URL}/user/cart`, {
                headers: { ...getAuthHeader() }
            });
            return handleResponse(res);
        },
        syncCart: async (cart) => {
            const res = await fetch(`${API_BASE_URL}/user/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify({ cart })
            });
            return handleResponse(res);
        }
    },
    navigation: {
        getAll: async () => {
            const res = await fetch(`${API_BASE_URL}/navigation`);
            return res.json();
        }
    },
    products: {
        getAll: async (filters = {}) => {
            const queryParams = new URLSearchParams(filters).toString();
            const res = await fetch(`${API_BASE_URL}/products?${queryParams}`);
            return res.json();
        },
        getOne: async (idOrSlug) => {
            const res = await fetch(`${API_BASE_URL}/products/${idOrSlug}`);
            return res.json();
        }
    },
    categories: {
        getAll: async () => {
            const res = await fetch(`${API_BASE_URL}/categories`);
            return res.json();
        }
    },
    journals: {
        getAll: async () => {
            const res = await fetch(`${API_BASE_URL}/journals`);
            return res.json();
        },
        getOne: async (slug) => {
            const res = await fetch(`${API_BASE_URL}/journals/${slug}`);
            return res.json();
        }
    },
    faqs: {
        getAll: async () => {
            const res = await fetch(`${API_BASE_URL}/faqs`);
            return res.json();
        }
    },
    homeAssets: {
        getAll: async () => {
            const res = await fetch(`${API_BASE_URL}/home-assets`);
            return res.json();
        }
    },
    reviews: {
        getAll: async () => {
            const res = await fetch(`${API_BASE_URL}/reviews`);
            return res.json();
        }
    },
    recommendations: {
        getAll: async (type) => {
            const query = type ? `?type=${type}` : '';
            const res = await fetch(`${API_BASE_URL}/recommendations${query}`);
            return res.json();
        }
    },
    lookbooks: {
        getAll: async () => {
            const res = await fetch(`${API_BASE_URL}/lookbooks`);
            return res.json();
        }
    },
    orders: {
        create: async (orderData) => {
            const res = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify(orderData)
            });
            return handleResponse(res);
        },
        getAll: async () => {
            const res = await fetch(`${API_BASE_URL}/orders`, {
                headers: { ...getAuthHeader() }
            });
            return handleResponse(res);
        }
    },
    pages: {
        getAll: async () => {
            const res = await fetch(`${API_BASE_URL}/pages`);
            return res.json();
        },
        getOne: async (slug) => {
            const res = await fetch(`${API_BASE_URL}/pages/${slug}`);
            return res.json();
        }
    }
};

// Maintain legacy exports for compatibility if needed
export const fetchNavigation = api.navigation.getAll;
export const fetchProducts = api.products.getAll;
export const fetchJournal = api.journals.getOne;
export const fetchFaqs = api.faqs.getAll;
