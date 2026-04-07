import { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Get FRESH Firebase ID token - always call this before API requests
  const getToken = async () => {
    try {
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken(true);
        return token;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          
          // Try to sync with backend
          try {
            const response = await authAPI.syncUser(token);
            
            if (response.success && response.user) {
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: response.user.name || firebaseUser.displayName || 'User'
              });
            } else {
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || 'User'
              });
            }
          } catch (syncError) {
            // Still set user from Firebase data
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || 'User'
            });
          }
        } catch (tokenError) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || 'User'
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google Sign In
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      
      // Sync with backend
      try {
        const response = await authAPI.googleAuth(token);
        if (response.success && response.user) {
          setUser({
            uid: result.user.uid,
            email: result.user.email,
            name: response.user.name || result.user.displayName || 'User'
          });
        }
      } catch (backendError) {
        // Still set user from Firebase
        setUser({
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName || 'User'
        });
      }
      
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Email/Password Sign In
  const signInWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      
      // Sync with backend
      try {
        const response = await authAPI.syncUser(token);
        if (response.success && response.user) {
          setUser({
            uid: result.user.uid,
            email: result.user.email,
            name: response.user.name || result.user.displayName || 'User'
          });
        }
      } catch (backendError) {
        // Backend sync failed silently
      }
      
      return { success: true, user: result.user };
    } catch (error) {
      let errorMessage = 'Failed to sign in';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password';
      }
      return { success: false, error: errorMessage };
    }
  };

  // Sign Up with Email/Password
  const signUpWithEmail = async (name, email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Firebase profile with name
      await updateProfile(result.user, {
        displayName: name
      });

      const token = await result.user.getIdToken();

      // Register with backend (creates user in MongoDB)
      try {
        await authAPI.register(name, email, password);
      } catch (backendError) {
        // Backend registration failed silently
      }

      // Sync to ensure user exists in MongoDB with firebaseUid
      try {
        await authAPI.syncUser(token);
      } catch (syncError) {
        // Backend sync failed silently
      }

      setUser({
        uid: result.user.uid,
        email: result.user.email,
        name: name
      });

      return { success: true, user: result.user };
    } catch (error) {
      let errorMessage = 'Failed to create account';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      return { success: false, error: errorMessage };
    }
  };

  // Sign Out
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Modal controls
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const value = {
    user,
    loading,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
