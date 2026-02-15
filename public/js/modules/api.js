// ==========================================
// API MODULE - Supabase & Cloudinary
// ==========================================

import { createClient } from "@supabase/supabase-js";

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cloudinary configuration
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env
	.VITE_CLOUDINARY_UPLOAD_PRESET;

// Initialize Supabase client
export const sb = createClient(supabaseUrl, supabaseKey);

/**
 * Generates optimized Cloudinary URL based on context
 * @param {string} url - Original Cloudinary URL
 * @param {string} context - Context: 'thumbnail' for grid cards, 'banner' for post pages
 * @returns {string} - Optimized URL with transformations
 */
export function getCloudinaryUrl(url, context = "default") {
	if (!url || !url.includes("cloudinary.com")) return url;

	const transformations = {
		thumbnail: "w_300,h_200,c_fill,f_auto,q_auto",
		banner: "w_1200,f_auto,q_auto",
	};

	const transform = transformations[context];
	if (!transform) return url;

	// Insert transformation parameters after '/upload/'
	return url.replace("/upload/", `/upload/${transform}/`);
}

/**
 * Busca todos os posts do banco
 */
export async function fetchPosts() {
	if (!sb) {
		console.error("Cliente Supabase não inicializado.");
		return [];
	}

	const { data, error } = await sb
		.from("posts")
		.select("*")
		.order("id", { ascending: false });

	if (error) {
		console.error("Erro ao buscar posts:", error);
		return [];
	}

	return data || [];
}

/**
 * Busca todos os anúncios do banco
 */
export async function fetchAds() {
	if (!sb) {
		console.error("Cliente Supabase não inicializado.");
		return [];
	}

	const { data, error } = await sb
		.from("ads")
		.select("*")
		.order("id", { ascending: false });

	if (error) {
		console.error("Erro ao buscar anúncios:", error);
		return [];
	}

	return data || [];
}

/**
 * Salva um post (insert ou update)
 */
export async function savePost(postData, editId = null) {
	if (!sb) return { error: "Cliente não conectado" };

	if (editId) {
		return await sb.from("posts").update(postData).eq("id", editId);
	} else {
		return await sb.from("posts").insert([postData]);
	}
}

/**
 * Deleta um post
 */
export async function deletePost(id) {
	if (!sb) return { error: "Cliente não conectado" };
	return await sb.from("posts").delete().eq("id", id);
}

/**
 * Salva um anúncio (insert ou update)
 */
export async function saveAd(adData, editId = null) {
	if (!sb) return { error: "Cliente não conectado" };

	if (editId) {
		return await sb.from("ads").update(adData).eq("id", editId);
	} else {
		return await sb.from("ads").insert([adData]);
	}
}

/**
 * Deleta um anúncio
 */
export async function deleteAd(id) {
	if (!sb) return { error: "Cliente não conectado" };
	return await sb.from("ads").delete().eq("id", id);
}

/**
 * Upload de imagem para Cloudinary
 */
export async function uploadToCloudinary(file) {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

	try {
		const response = await fetch(
			`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
			{
				method: "POST",
				body: formData,
			},
		);
		const result = await response.json();
		return result.secure_url || null;
	} catch (error) {
		console.error("Erro no upload Cloudinary:", error);
		return null;
	}
}

/**
 * Fetch pending comments
 */
export async function fetchPendingComments() {
	try {
		const response = await fetch("/api/comments?status=pending");
		if (!response.ok) throw new Error("Erro ao buscar comentários");
		return await response.json();
	} catch (error) {
		console.error("Erro ao buscar comentários pendentes:", error);
		return [];
	}
}

/**
 * Fetch approved comments (for admin)
 */
export async function fetchApprovedComments() {
	try {
		const response = await fetch("/api/admin/comments/approved");
		if (!response.ok)
			throw new Error("Erro ao buscar comentários aprovados");
		return await response.json();
	} catch (error) {
		console.error("Erro ao buscar comentários aprovados:", error);
		return [];
	}
}

/**
 * Approve a comment
 */
export async function approveComment(id) {
	try {
		const response = await fetch(`/api/comments/${id}/approve`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
		});
		if (!response.ok) throw new Error("Erro ao aprovar comentário");
		return await response.json();
	} catch (error) {
		console.error("Erro ao aprovar comentário:", error);
		throw error;
	}
}

/**
 * Reject (delete) a comment
 */
export async function rejectComment(id) {
	try {
		const response = await fetch(`/api/comments/${id}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		});
		if (!response.ok) throw new Error("Erro ao rejeitar comentário");
		return await response.json();
	} catch (error) {
		console.error("Erro ao rejeitar comentário:", error);
		throw error;
	}
}
