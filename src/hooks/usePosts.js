import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getOptimizedImageUrl } from "../lib/cloudinary";

export const usePosts = (category = null, limit = null) => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				setLoading(true);
				setError(null);

				// Query otimizada com apenas campos necessários
				let query = supabase
					.from("posts")
					.select(
						`
						id, 
						title, 
						excerpt, 
						slug, 
						category, 
						tags,
						author, 
						date, 
						image, 
						featured,
						view_count,
						status
					`,
					)
					.eq("status", "published")
					.order("date", { ascending: false });

				if (category && category !== "all") {
					query = query.ilike("category", `%${category}%`);
				}

				if (limit) {
					query = query.limit(limit);
				}

				const { data, error } = await query;

				if (error) throw error;

				// Process posts com optimized images de forma assíncrona
				const processedPosts = await Promise.all(
					data.map(async (post) => ({
						...post,
						image: post.image
							? getOptimizedImageUrl(post.image, {
									width: 400,
									height: 250,
									crop: "fill",
									quality: "auto",
									format: "auto",
								})
							: null,
					})),
				);

				setPosts(processedPosts);
			} catch (err) {
				console.error("Error fetching posts:", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, [category, limit]);

	return { posts, loading, error };
};

export const usePost = (slug) => {
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchPost = async () => {
			if (!slug) {
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				setError(null);

				const { data, error } = await supabase
					.from("posts")
					.select("*")
					.eq("slug", slug)
					.eq("status", "published")
					.single();

				if (error) throw error;

				// Process post with optimized image
				const processedPost = {
					...data,
					image: data.image
						? getOptimizedImageUrl(data.image, {
								width: 800,
								height: 450,
							})
						: null,
				};

				setPost(processedPost);
			} catch (error) {
				console.error("Error fetching post:", error);
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchPost();
	}, [slug]);

	return { post, loading, error };
};

export const useFeaturedPosts = (limit = 5) => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchFeaturedPosts = async () => {
			try {
				setLoading(true);
				setError(null);

				// Query otimizada com apenas campos necessários
				const { data, error } = await supabase
					.from("posts")
					.select(
						`
						id, 
						title, 
						excerpt, 
						slug, 
						category, 
						tags,
						author, 
						date, 
						image, 
						featured,
						view_count,
						status
					`,
					)
					.eq("status", "published")
					.eq("featured", true)
					.order("date", { ascending: false })
					.limit(limit);

				if (error) throw error;

				// Process posts com optimized images de forma assíncrona
				const processedPosts = await Promise.all(
					data.map(async (post) => ({
						...post,
						image: post.image
							? getOptimizedImageUrl(post.image, {
									width: 600,
									height: 350,
									crop: "fill",
									quality: "auto",
									format: "auto",
								})
							: null,
					})),
				);

				setPosts(processedPosts);
			} catch (err) {
				console.error("Error fetching featured posts:", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchFeaturedPosts();
	}, [limit]);

	return { posts, loading, error };
};
