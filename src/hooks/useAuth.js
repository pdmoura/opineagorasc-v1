import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const useAuth = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Check for existing session on mount
	useEffect(() => {
		const getSession = async () => {
			try {
				const {
					data: { session },
				} = await supabase.auth.getSession();
				setUser(session?.user || null);
			} catch (error) {
				console.error("❌ Error getting session:", error);
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		getSession();

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
				setUser(session?.user || null);
			} else if (event === "SIGNED_OUT") {
				setUser(null);
			}
			setLoading(false);
		});

		return () => subscription.unsubscribe();
	}, []);

	const signOut = async () => {
		try {
			await supabase.auth.signOut();
			setUser(null);
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	return {
		user,
		loading,
		signOut,
		signIn: async (email, password) => {
			try {
				const { data, error } = await supabase.auth.signInWithPassword({
					email,
					password,
				});

				if (error) throw error;

				setUser(data.user);
				return { success: true };
			} catch (error) {
				console.error("Error signing in:", error);
				return { success: false, error: error.message };
			}
		},
		signUp: async (email, password) => {
			try {
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
				});

				if (error) throw error;

				setUser(data.user);
				return { success: true };
			} catch (error) {
				console.error("Error signing up:", error);
				return { success: false, error: error.message };
			}
		},
	};
};
