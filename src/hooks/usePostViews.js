import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

export const usePostViews = (postId) => {
	const [viewCount, setViewCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const isTrackingRef = useRef(false);

	// Fetch initial view count and subscribe to realtime updates
	useEffect(() => {
		if (!postId) return;

		const fetchInitialCount = async () => {
			try {
				const { data, error } = await supabase
					.from("posts")
					.select("view_count")
					.eq("id", postId)
					.single();

				if (error) throw error;
				setViewCount(data?.view_count || 0);
			} catch (err) {
				console.error("Error fetching view count:", err);
				// Don't set error state for missing columns/tables during dev
				if (err.code !== "42703") {
					setError(err.message);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchInitialCount();

		// Realtime subscription
		const channel = supabase
			.channel(`public:posts:id=eq.${postId}`)
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "posts",
					filter: `id=eq.${postId}`,
				},
				(payload) => {
					console.log("Realtime update received:", payload);
					if (payload.new && payload.new.view_count !== undefined) {
						setViewCount(payload.new.view_count);
					}
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [postId]);

	// Track view with session storage unique per post
	const trackView = async () => {
		if (!postId || isTrackingRef.current) return;

		const sessionKey = `viewed_post_${postId}`;

		// IMMEDIATE SYNC LOCK: Set session storage BEFORE anything else
		if (sessionStorage.getItem(sessionKey)) {
			console.log("Post already viewed (session storage).");
			// Still try to fetch latest count to ensure UI is up to date
			const { data } = await supabase
				.from("posts")
				.select("view_count")
				.eq("id", postId)
				.single();
			if (data?.view_count) setViewCount(data.view_count);
			return;
		}

		sessionStorage.setItem(sessionKey, "true");
		isTrackingRef.current = true;

		try {
			// Generate a unique request ID for idempotency pattern
			const requestId = crypto.randomUUID();

			console.log(`Incrementing view count for post ${postId}`);

			// Optimistically update local state
			setViewCount((prev) => prev + 1);

			// Use the idempotent function
			const { error } = await supabase.rpc("increment_view_count", {
				p_id: String(postId),
				p_request_id: requestId,
			});

			if (error) {
				console.error("RPC Error:", error);
				// Revert optimistic update
				setViewCount((prev) => Math.max(0, prev - 1));
				// Revert session lock
				sessionStorage.removeItem(sessionKey);
			} else {
				// Success - fetch authoritative count to sync
				const { data } = await supabase
					.from("posts")
					.select("view_count")
					.eq("id", postId)
					.single();
				if (data?.view_count) setViewCount(data.view_count);
			}
		} catch (err) {
			console.error("Error tracking view:", err);
			setViewCount((prev) => Math.max(0, prev - 1));
			sessionStorage.removeItem(sessionKey);
		} finally {
			isTrackingRef.current = false;
		}
	};

	return {
		viewCount,
		loading,
		error,
		trackView,
	};
};

// Hook to get popular posts
export const usePopularPosts = (limit = 10) => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchPopularPosts = async () => {
			try {
				// Try RPC first
				const { data, error } = await supabase.rpc(
					"get_popular_posts",
					{
						limit_count: limit,
					},
				);

				if (error) {
					// Fallback to standard query if RPC doesn't exist
					console.log(
						"Popular posts RPC failed, using standard query:",
						error.message,
					);
					const { data: standardData, error: standardError } =
						await supabase
							.from("posts")
							.select("*")
							.eq("status", "published")
							.order("view_count", { ascending: false })
							.limit(limit);

					if (standardError) throw standardError;
					setPosts(standardData || []);
				} else {
					setPosts(data || []);
				}
			} catch (err) {
				console.error("Error fetching popular posts:", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchPopularPosts();
	}, [limit]);

	return { posts, loading, error };
};

// Hook to get total views statistics
export const useViewStats = () => {
	const [stats, setStats] = useState({
		totalViews: 0,
		averageViews: 0,
		mostViewedPost: null,
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchViewStats = async () => {
			try {
				// Get total views from published posts
				const { data: totalData, error: totalError } = await supabase
					.from("posts")
					.select("view_count")
					.eq("status", "published");

				if (totalError) throw totalError;

				const totalViews =
					totalData?.reduce(
						(sum, post) => sum + (post.view_count || 0),
						0,
					) || 0;
				const averageViews =
					totalData?.length > 0
						? Math.round(totalViews / totalData.length)
						: 0;

				// Get most viewed post
				const { data: mostViewedData, error: mostViewedError } =
					await supabase
						.from("posts")
						.select("id, title, slug, view_count")
						.eq("status", "published")
						.order("view_count", { ascending: false })
						.limit(1)
						.single();

				if (mostViewedError && mostViewedError.code !== "PGRST116") {
					throw mostViewedError;
				}

				setStats({
					totalViews,
					averageViews,
					mostViewedPost: mostViewedData,
				});
			} catch (err) {
				console.error("Error fetching view stats:", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchViewStats();
	}, []);

	return { stats, loading, error };
};
