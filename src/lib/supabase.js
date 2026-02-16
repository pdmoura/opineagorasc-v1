import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error("Missing Supabase environment variables");
}

// Create a single client instance without hardcoding global Authorization header
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: true,
		storage: window.localStorage,
		storageKey: "opine-agora-auth",
	},
});

// Clean and reliable helper functions
export const signIn = async (email, password) => {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (error) throw error;
	return data.user;
};

export const signUp = async (email, password) => {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
	});
	if (error) throw error;
	return data.user;
};

export const signOut = async () => {
	const { error } = await supabase.auth.signOut();
	if (error) throw error;
};

export const getCurrentUser = async () => {
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();
	if (error) {
		console.error("Error getting current user:", error);
		return null;
	}
	return user;
};
