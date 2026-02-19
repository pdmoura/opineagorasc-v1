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
						updated_at,
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

		// Realtime subscription with debounce to prevent race conditions
		let channel = null;
		const timeoutId = setTimeout(() => {
			channel = supabase
				.channel("public:posts")
				.on(
					"postgres_changes",
					{
						event: "*",
						schema: "public",
						table: "posts",
					},
					() => {
						fetchPosts();
					},
				)
				.subscribe();
		}, 100);

		return () => {
			clearTimeout(timeoutId);
			if (channel) {
				supabase.removeChannel(channel).catch(() => {
					// Ignore cleanup errors
				});
			}
		};
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

				// 1. Fetch current post
				const { data: currentPost, error: postError } = await supabase
					.from("posts")
					.select("*")
					.eq("slug", slug)
					.eq("status", "published")
					.single();

				if (postError) throw postError;

				// Process post with optimized image
				const processedPost = {
					...currentPost,
					image: currentPost.image
						? getOptimizedImageUrl(currentPost.image, {
								width: 800,
								height: 450,
							})
						: null,
				};

				setPost(processedPost);

				// 2. Fetch adjacent posts (Next = Older, Previous = Newer in a feed context)
				// But typically "Previous Post" means Older and "Next Post" means Newer in chronological terms.
				// However, for a news site, "Next" usually implies "Next in the list", which is Older.
				// Let's implement:
				// Next (Older): date < current.date
				// Previous (Newer): date > current.date

				// Fetch Next (Older)
				const { data: nextData } = await supabase
					.from("posts")
					.select("title, slug, date")
					.eq("status", "published")
					.lt("date", currentPost.date)
					.order("date", { ascending: false })
					.limit(1)
					.maybeSingle();

				// Fetch Previous (Newer)
				const { data: prevData } = await supabase
					.from("posts")
					.select("title, slug, date")
					.eq("status", "published")
					.gt("date", currentPost.date)
					.order("date", { ascending: true })
					.limit(1)
					.maybeSingle();

				setPost((prev) => ({
					...prev,
					nextPost: nextData, // Older post
					prevPost: prevData, // Newer post
				}));
			} catch (error) {
				console.error("Error fetching post:", error);
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchPost();

		// Realtime subscription for single post with debounce
		let channel = null;
		const timeoutId = setTimeout(() => {
			channel = supabase
				.channel(`public:posts:slug=eq.${slug}`)
				.on(
					"postgres_changes",
					{
						event: "*",
						schema: "public",
						table: "posts",
						filter: `slug=eq.${slug}`,
					},
					() => {
						fetchPost();
					},
				)
				.subscribe();
		}, 100);

		return () => {
			clearTimeout(timeoutId);
			if (channel) {
				supabase.removeChannel(channel).catch(() => {});
			}
		};
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
						updated_at,
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

		// Realtime subscription with debounce
		let channel = null;
		const timeoutId = setTimeout(() => {
			channel = supabase
				.channel("public:posts:featured")
				.on(
					"postgres_changes",
					{
						event: "*",
						schema: "public",
						table: "posts",
						filter: "featured=eq.true",
					},
					() => {
						fetchFeaturedPosts();
					},
				)
				.subscribe();
		}, 100);

		return () => {
			clearTimeout(timeoutId);
			if (channel) {
				supabase.removeChannel(channel).catch(() => {});
			}
		};
	}, [limit]);

	return { posts, loading, error };
};
