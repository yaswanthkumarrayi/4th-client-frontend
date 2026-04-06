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
  // Firebase tokens expire after 1 hour, this ensures we always have a valid one
  const getToken = async () => {
    try {
      if (auth.currentUser) {
        // Force refresh to get a new token if needed
        const token = await auth.currentUser.getIdToken(true);
        console.log('🔑 Got fresh token for:', auth.currentUser.email);
        return token;
      }
      console.log('⚠️ No current user for token');
      return null;
    } catch (error) {
      console.error('❌ Error getting token:', error);
      return null;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    console.log('🔄 Setting up auth state listener...');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔔 Auth state changed:', firebaseUser?.email || 'No user');
      
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          console.log('🔑 Got initial token');
          
          // Try to sync with backend
          try {
            console.log('🔄 Syncing with backend...');
            const response = await authAPI.syncUser(token);
            
            if (response.success && response.user) {
              console.log('✅ Backend sync successful');
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
            console.log('⚠️ Backend sync failed (server might be offline):', syncError.message);
            // Still set user from Firebase data
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || 'User'
            });
          }
        } catch (tokenError) {
          console.error('❌ Error getting initial token:', tokenError);
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
      console.log('🔐 Starting Google Sign In...');
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      
      console.log('✅ Google Sign In successful, syncing with backend...');
      
      // Sync with backend
      try {
        const response = await authAPI.googleAuth(token);
        if (response.success && response.user) {
          console.log('✅ Backend sync successful');
          setUser({
            uid: result.user.uid,
            email: result.user.email,
            name: response.user.name || result.user.displayName || 'User'
          });
        }
      } catch (backendError) {
        console.log('⚠️ Backend sync failed:', backendError.message);
        // Still set user from Firebase
        setUser({
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName || 'User'
        });
      }
      
      return { success: true, user: result.user };
    } catch (error) {
      console.error('❌ Google sign in error:', error);
      return { success: false, error: error.message };
    }
  };

  // Email/Password Sign In
  const signInWithEmail = async (email, password) => {
    try {
      console.log('🔐 Starting Email Sign In...');
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      
      console.log('✅ Email Sign In successful, syncing with backend...');
      
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
        console.log('⚠️ Backend sync failed:', backendError.message);
      }
      
      return { success: true, user: result.user };
    } catch (error) {
      console.error('❌ Email sign in error:', error);
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
      console.log('📝 Starting Email Sign Up...');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Firebase profile with name
      await updateProfile(result.user, {
        displayName: name
      });

      const token = await result.user.getIdToken();
      console.log('✅ Firebase account created');

      // Register with backend (creates user in MongoDB)
      try {
        await authAPI.register(name, email, password);
        console.log('✅ Backend registration successful');
      } catch (backendError) {
        console.log('⚠️ Backend registration failed:', backendError.message);
      }

      // Sync to ensure user exists in MongoDB with firebaseUid
      try {
        await authAPI.syncUser(token);
        console.log('✅ Backend sync successful');
      } catch (syncError) {
        console.log('⚠️ Backend sync failed:', syncError.message);
      }

      setUser({
        uid: result.user.uid,
        email: result.user.email,
        name: name
      });

      return { success: true, user: result.user };
    } catch (error) {
      console.error('❌ Sign up error:', error);
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
      console.log('👋 Logging out...');
      await signOut(auth);
      setUser(null);
      console.log('✅ Logged out');
      return { success: true };
    } catch (error) {
      console.error('❌ Logout error:', error);
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
    getToken  // Always use this to get fresh tokens for API calls
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
