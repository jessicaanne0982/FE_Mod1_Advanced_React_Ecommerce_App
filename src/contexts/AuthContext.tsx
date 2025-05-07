import React, { createContext, useState, useContext, useEffect, Dispatch, SetStateAction } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { User as UserInterface } from "../types/types";

// TypeScript interface for context's shape
interface AuthContextType {
    user: UserInterface | null;
    setUser: Dispatch<SetStateAction<UserInterface | null>>;
    loading: boolean;
}

// Create a context that is undefined to begin
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider wraps the app and provides authentication state to child components
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserInterface | null>(null); // Authenticated user state
    const [loading, setLoading] = useState(true); // Loading state while checking auth

    useEffect(() => {
        // Listens for Firebase auth state changes
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                // If user is logged in, retrieve their data from Firestore
                const userDocument = await getDoc(doc(db, "users", user.uid));
                if (userDocument.exists()) {
                    const data = userDocument.data() as UserInterface;
                    setUser(data); // Set user state with data from Firestore
                }
                
            } else {
                setUser(null); // No user is logged in
            }
            setLoading(false); // Auth check complete
        });
        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, []);

    return (
        // Provide auth state and updated to the rest of the app
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to access authentication context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export { AuthContext }; 
export type { AuthContextType };

export default AuthProvider;

