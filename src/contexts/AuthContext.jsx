"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

// Helper functions for localStorage with expiration
const setItemWithExpiry = (key, value, ttl) => {
	const now = new Date();
	const item = {
		value: value,
		expiry: now.getTime() + ttl,
	};
	localStorage.setItem(key, JSON.stringify(item));
};

const getItemWithExpiry = (key) => {
	const itemStr = localStorage.getItem(key);
	if (!itemStr) {
		return null;
	}

	try {
		const item = JSON.parse(itemStr);
		const now = new Date();

		if (now.getTime() > item.expiry) {
			localStorage.removeItem(key);
			return null;
		}

		return item.value;
	} catch (error) {
		localStorage.removeItem(key);
		return null;
	}
};

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		// Check if user is logged in from localStorage
		const checkAuth = async () => {
			try {
				const savedUser = getItemWithExpiry("user");
				if (savedUser) {
					setUser(savedUser);
				}

				/* Original API call - commented out for demo
        const res = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include',
        });
        
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
        */
			} catch (error) {
				console.error("Auth check failed:", error);
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, []);

	const login = async (email, password, rememberMe = false, role = null) => {
		try {
			// Demo mode - simulate successful login
			const demoUser = {
				id: "1",
				name: "Demo User",
				email: email,
				role: role, // Store the role from login context
				createdAt: new Date().toISOString(),
			};

			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Set expiration time based on remember me option
			const ttl = rememberMe ? 90 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 90 days or 24 hours
			setItemWithExpiry("user", demoUser, ttl);

			setUser(demoUser);
			return { success: true };

			/* Original API call - commented out for demo
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Set expiration time based on remember me option
      const ttl = rememberMe ? 90 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 90 days or 24 hours
      setItemWithExpiry('user', data.user, ttl);
      
      setUser(data.user);
      return { success: true };
      */
		} catch (error) {
			return { success: false, error: error.message };
		}
	};

	const register = async (userData) => {
		try {
			// Demo mode - simulate successful registration
			const demoUser = {
				id: Date.now().toString(),
				name: userData.name,
				email: userData.email,
				createdAt: new Date().toISOString(),
			};

			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Default to 24 hours for registration
			const ttl = 24 * 60 * 60 * 1000; // 24 hours
			setItemWithExpiry("user", demoUser, ttl);

			setUser(demoUser);
			return { success: true };

			/* Original API call - commented out for demo
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Default to 24 hours for registration
      const ttl = 24 * 60 * 60 * 1000; // 24 hours
      setItemWithExpiry('user', data.user, ttl);
      
      setUser(data.user);
      return { success: true };
      */
		} catch (error) {
			return { success: false, error: error.message };
		}
	};

	const logout = async () => {
		try {
			// Remove user from localStorage
			localStorage.removeItem("user");

			await fetch("http://localhost:5000/api/auth/logout", {
				method: "POST",
				credentials: "include",
			});

			setUser(null);
			router.push("/login");
		} catch (error) {
			console.error("Logout error:", error);
			// Even if API call fails, clear local state
			setUser(null);
			router.push("/login");
		}
	};

	const value = {
		user,
		loading,
		login,
		register,
		logout,
		isAuthenticated: !!user,
	};

	return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
