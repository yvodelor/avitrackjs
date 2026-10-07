/*
const API_BASE = import.meta.env.DEV
? 'http://localhost:5000/api'
: '/api'


export const API = {
    auth:{
       login:  `${API_BASE}/auth/login`,
       me: `${API_BASE}/auth/me`,
    },

    
    pages: {
        list: `${API_BASE}/pages`, 
        detail: (id:string) => `${API_BASE}/pages/$(id)`,
    }

} as const
 */