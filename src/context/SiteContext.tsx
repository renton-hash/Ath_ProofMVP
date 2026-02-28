import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { 
  doc, onSnapshot, collection, setDoc, addDoc, getDoc, serverTimestamp, query, orderBy 
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

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

interface SiteContextType {
  content: SiteContent;
  updateContent: (newContent: Partial<SiteContent>) => Promise<void>;
  loading: boolean;
  athletes: any[];
  coaches: any[];
  officials: any[];
  blogPosts: any[];
  galleryImages: any[];
  addAthlete: (data: any) => Promise<boolean>;
  currentUser: any;
  setCurrentUser: React.Dispatch<React.SetStateAction<any>>;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string, role?: string) => Promise<any>;
  logout: () => Promise<void>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState<SiteContent>({
    logoText: "IYSDC",
    announcementBar: "Welcome to IYSDI",
    footerTagline: "",
    socialLinks: [],
    partners: [],
    footerAddress: "",
    footerEmail: "",
    footerPhone: "",
    copyrightText: "© 2026 IYSDC",
    navLinks: [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Events", path: "/events" }
    ]
  });

  const [athletes, setAthletes] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [officials, setOfficials] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Track auth changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'admin_users', firebaseUser.uid));
          setCurrentUser(userDoc.exists() ? { uid: firebaseUser.uid, ...userDoc.data() } : firebaseUser);
        } catch (error) {
          console.error("Auth Profile Error:", error);
          setCurrentUser(firebaseUser);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Track site content
    const unsubSettings = onSnapshot(doc(db, "settings", "siteContent"), (snapshot) => {
      if (snapshot.exists()) setContent(snapshot.data() as SiteContent);
    });

    // Athletes
    const unsubAthletes = onSnapshot(collection(db, "athletes"), (snapshot) => {
      setAthletes(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Blogs
    const blogQuery = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const unsubBlogs = onSnapshot(blogQuery, (snapshot) => {
      setBlogPosts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Gallery
    const galleryQuery = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    const unsubGallery = onSnapshot(galleryQuery, (snapshot) => {
      setGalleryImages(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubscribeAuth();
      unsubSettings();
      unsubAthletes();
      unsubBlogs();
      unsubGallery();
    };
  }, []);

  // Auth functions
  const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);

  const signup = async (email: string, password: string, role: string = 'super_admin') => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const userProfile = { email, role, createdAt: serverTimestamp() };
    await setDoc(doc(db, 'admin_users', res.user.uid), userProfile);
    return res.user;
  };

  const logout = () => signOut(auth);

  // Update content
  const updateContent = async (newContent: Partial<SiteContent>) => {
    await setDoc(doc(db, "settings", "siteContent"), newContent, { merge: true });
  };

  // Add athlete
  const addAthlete = async (athleteData: any) => {
    try {
      await addDoc(collection(db, "athletes"), { ...athleteData, timestamp: serverTimestamp() });
      return true;
    } catch (error) {
      console.error(error);
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
      blogPosts,
      galleryImages,
      addAthlete,
      currentUser,
      setCurrentUser,
      login,
      signup,
      logout
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) throw new Error("useSite must be used within SiteProvider");
  return context;
};