import React, { createContext, useContext, useState, useEffect } from 'react';
import { useOrganizationStore } from '../stores/organizationStore';
import { User, UserRole, SYSTEM_ADMIN_EMAIL } from '../types/user';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  hasOrganization: boolean;
  isSystemAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { currentOrganization } = useOrganizationStore();

  // Load users and current user from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    const storedUser = localStorage.getItem('user');
    
    // Initialize users array
    const existingUsers = storedUsers ? JSON.parse(storedUsers) : [];
    setUsers(existingUsers);

    // Set current user if exists
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Find the user in the users array to get the most up-to-date data
      const currentUser = existingUsers.find((u: User) => u.id === parsedUser.id) || parsedUser;
      setUser(currentUser);
      setIsAuthenticated(true);
    }
  }, []);

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    // Calculate profile completion
    const requiredFields = ['nameAr', 'nameEn', 'phone', 'titleAr', 'titleEn', 'email'];
    const updatedUser = { ...user, ...data };
    const completedFields = requiredFields.filter(field => updatedUser[field as keyof User]);
    const profileCompletion = Math.round((completedFields.length / requiredFields.length) * 100);

    // Update user with new data and profile completion
    const finalUpdatedUser = {
      ...updatedUser,
      profileCompletion,
      updatedAt: new Date().toISOString(),
    };

    // Update user in state
    setUser(finalUpdatedUser);

    // Update user in users array
    const updatedUsers = users.map(u => 
      u.id === user.id ? finalUpdatedUser : u
    );
    setUsers(updatedUsers);

    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(finalUpdatedUser));
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const login = async (email: string, password: string) => {
    const storedUsers = localStorage.getItem('users');
    const existingUsers = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Check if user exists
    let loginUser = existingUsers.find((u: User) => u.email === email);
    
    if (!loginUser) {
      // Create new user if doesn't exist
      const role: UserRole = email === SYSTEM_ADMIN_EMAIL ? 'SYSTEM_ADMIN' : 'USER';
      loginUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        nameAr: '',
        nameEn: email.split('@')[0],
        phone: '',
        titleAr: '',
        titleEn: '',
        role,
        organizationId: localStorage.getItem('userOrgId') || undefined,
        profileCompletion: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add new user to users array
      existingUsers.push(loginUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));
    }

    // Set current user
    setUser(loginUser);
    setUsers(existingUsers);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(loginUser));
  };

  const register = async (email: string, password: string, name: string) => {
    const role: UserRole = email === SYSTEM_ADMIN_EMAIL ? 'SYSTEM_ADMIN' : 'USER';
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      nameAr: '',
      nameEn: name,
      phone: '',
      titleAr: '',
      titleEn: '',
      role,
      profileCompletion: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUser(newUser);
    setUsers(updatedUsers);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('userOrgId');
  };

  const hasOrganization = Boolean(user?.organizationId || currentOrganization);
  const isSystemAdmin = user?.role === 'SYSTEM_ADMIN';

  return (
    <AuthContext.Provider value={{ 
      user,
      users,
      login, 
      register, 
      logout,
      updateProfile,
      isAuthenticated,
      hasOrganization,
      isSystemAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}