import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User
} from 'firebase/auth';
import { 
  doc, 
  onSnapshot, 
  collection, 
  setDoc, 
  updateDoc, 
  addDoc,
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

// Define Types for better IDE support
interface SiteContent {
  logoText: string;
  announcementBar: string;
  footerTagline: string;
  socialLinks: any[];
  partners: any[];
  footerAddress: string;
  footerEmail: string;
  footerPhone: string;
  copyrightText: string;
  navLinks: { name: string; path: string }[];
}

const SiteContext = createContext<any>(undefined);

export const SiteProvider = ({ children }: { children: React.ReactNode }) => {

  const [content, setContent] = useState<SiteContent>({
    logoText: "IYSDI",
    announcementBar: "Welcome to IYSDI",
    footerTagline: "",
    socialLinks: [],
    partners: [],
    footerAddress: "",
    footerEmail: "",
    footerPhone: "",
    copyrightText: "© 2026 IYSDI",
    navLinks: [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Events", path: "/events" }
    ]
  });

  // --- DATA & AUTH STATES ---
  const [athletes, setAthletes] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [officials, setOfficials] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null); 
  const [loading, setLoading] = useState(true);

  // --- 1. FIREBASE REAL-TIME LISTENERS ---
  useEffect(() => {
    // A. Listen to Auth Changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setCurrentUser({ uid: firebaseUser.uid, ...userDoc.data() });
          } else {
            setCurrentUser(firebaseUser);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setCurrentUser(firebaseUser);
        }
      } else {
        setCurrentUser(null);
      }
    });

    // B. Listen to Site Settings
    const unsubSettings = onSnapshot(doc(db, "settings", "siteContent"), (snapshot) => {
      if (snapshot.exists()) setContent(snapshot.data() as SiteContent);
    });

    // C. Listen to Athletes
    const unsubAthletes = onSnapshot(collection(db, "athletes"), (snapshot) => {
      setAthletes(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // D. Listen to Coaches
    const unsubCoaches = onSnapshot(collection(db, "coaches"), (snapshot) => {
      setCoaches(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // E. Listen to Officials
    const unsubOfficials = onSnapshot(collection(db, "officials"), (snapshot) => {
      setOfficials(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      // Set loading false once the last critical collection is fetched
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubSettings();
      unsubAthletes();
      unsubCoaches();
      unsubOfficials();
    };
  }, []);

  // --- 2. AUTHENTICATION ACTIONS ---
  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, role: string = 'user', extraData: any = {}) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const userProfile = {
      email,
      role,
      ...extraData,
      createdAt: new Date().toISOString(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(doc(db, 'users', res.user.uid), userProfile);
    return res.user;
  };

  const logout = () => signOut(auth);

  // --- 3. DATABASE ACTIONS ---
  const updateContent = async (newContent: Partial<SiteContent>) => {
    try {
      const contentRef = doc(db, "settings", "siteContent");
      // Use setDoc with merge:true to create if doesn't exist, or updateDoc if you're sure it exists
      await setDoc(contentRef, newContent, { merge: true });
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  };

  const addAthlete = async (athleteData: any) => {
    try {
      await addDoc(collection(db, "athletes"), {
        ...athleteData,
        timestamp: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error("Error adding athlete:", error);
      return false;
    }
  };

  return (
    <SiteContext.Provider value={{ 
      content, 
      updateContent, 
      loading, 
      athletes, 
      coaches, 
      officials, 
      addAthlete, 
      currentUser,
      setCurrentUser,
      login,
      signup,
      logout 
    }}>
      {!loading && children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) throw new Error("useSite must be used within SiteProvider");
  return context;
};