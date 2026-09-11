import { createAuthClient } from "better-auth/react"

const authBaseUrl = 
    import.meta.env.VITE_AUTH_URL || 
    (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "") : "http://localhost:5000");

export const authClient = createAuthClient({
    baseURL: authBaseUrl
});

export const { useSession, signOut } = authClient;
