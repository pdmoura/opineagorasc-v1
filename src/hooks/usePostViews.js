import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

export const usePostViews = (postId) => {
	const [viewCount, setViewCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isIncrementing, setIsIncrementing] = useState(false);
	const hasFetchedRef = useRef(false);
	const hasIncrementedRef = useRef(false);

	// Fetch current view count
	const fetchViewCount = async () => {
		if (!postId || hasIncrementedRef.current) return;

		try {
			const { data, error } = await supabase
				.from("posts")
				.select("view_count")
				.eq("id", postId)
				.single();

			if (error) {
				// Handle case where view_count column doesn't exist yet
				if (error.code === "42703") {
					// column does not exist
					setViewCount(0);
					return;
				}
				throw error;
			}
			setViewCount(data?.view_count || 0);
		} catch (err) {
			console.error("Error fetching view count:", err);
			// Don't set error state for migration-related issues
			if (err.code !== "42703") {
				setError(err.message);
			}
			setViewCount(0);
		} finally {
			setLoading(false);
		}
	};

	// Increment view count
	const incrementView = async () => {
		if (!postId || isIncrementing) return;

		setIsIncrementing(true);

		try {
			// Try RPC function first
			const { error } = await supabase.rpc("increment_post_view_text", {
				post_id: postId.toString(),
			});

			if (error) {
				// If RPC fails, try direct SQL update
				const { error: updateError } = await supabase
					.from("posts")
					.update({ view_count: (viewCount || 0) + 1 })
					.eq("id", postId);

				if (updateError) {
					console.error("Direct SQL update failed:", updateError);
				} else {
					// Update local state on success
					setViewCount((prev) => prev + 1);
				}
			} else {
				// Update local state on success
				setViewCount((prev) => {
					return prev + 1;
				});
				hasIncrementedRef.current = true;
			}
		} catch (err) {
			console.error("Error incrementing view count:", err);
			// Don't set error state for migration-related issues
			if (err.code !== "42883") {
				setError(err.message);
			}
		} finally {
			setIsIncrementing(false);
		}
	};

	// Track view with session storage to avoid counting multiple views from same session
	const trackView = async () => {
		if (!postId) return;

		const sessionKey = `post_view_${postId}`;
		const hasViewed = sessionStorage.getItem(sessionKey);

		// Temporary: bypass session storage for testing
		const bypassSession = sessionStorage.getItem("bypass_session");

		if (!hasViewed || bypassSession) {
			await incrementView();
			sessionStorage.setItem(sessionKey, "true");
			// Set session storage to expire after 30 minutes
			setTimeout(
				() => {
					sessionStorage.removeItem(sessionKey);
				},
				30 * 60 * 1000,
			);
		} else {
			// Post already viewed in this session
			return;
		}
	};

	useEffect(() => {
		if (!postId || isIncrementing || hasFetchedRef.current) return;

		hasFetchedRef.current = true;
		fetchViewCount();
	}, [postId, isIncrementing]);

	return {
		viewCount,
		loading,
		error,
		incrementView,
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
				const { data, error } = await supabase.rpc(
					"get_popular_posts",
					{
						limit_count: limit,
					},
				);

				if (error) {
					// Handle case where function doesn't exist yet
					if (error.code === "42883") {
						// function does not exist
						// Fallback to regular posts sorted by date
						const { data: fallbackData, error: fallbackError } =
							await supabase
								.from("posts")
								.select("*")
								.eq("status", "published")
								.order("date", { ascending: false })
								.limit(limit);

						if (fallbackError) throw fallbackError;
						setPosts(fallbackData || []);
						return;
					}
					throw error;
				}
				setPosts(data || []);
			} catch (err) {
				console.error("Error fetching popular posts:", err);
				// Don't set error state for migration-related issues
				if (err.code !== "42883") {
					setError(err.message);
				}
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
				// Get total views
				const { data: totalData, error: totalError } = await supabase
					.from("posts")
					.select("view_count")
					.eq("status", "published");

				if (totalError) {
					// Handle case where view_count column doesn't exist yet
					if (totalError.code === "42703") {
						// column does not exist
						setStats({
							totalViews: 0,
							averageViews: 0,
							mostViewedPost: null,
						});
						return;
					}
					throw totalError;
				}

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
				// Don't set error state for migration-related issues
				if (err.code !== "42703") {
					setError(err.message);
				}
				setStats({
					totalViews: 0,
					averageViews: 0,
					mostViewedPost: null,
				});
			} finally {
				setLoading(false);
			}
		};

		fetchViewStats();
	}, []);

	return { stats, loading, error };
};
