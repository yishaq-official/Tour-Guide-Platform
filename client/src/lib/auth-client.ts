import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: "http://localhost:5000" // the base url of your auth server
});

export const { useSession, signOut } = authClient;
