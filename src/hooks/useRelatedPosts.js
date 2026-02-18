import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getOptimizedImageUrl } from "../lib/cloudinary";

export const useRelatedPosts = (currentPost, limit = 4) => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchRelatedPosts = async () => {
			if (!currentPost?.id) {
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				setError(null);

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
					.neq("id", currentPost.id)
					.order("date", { ascending: false })
					.limit(limit);

				const orConditions = [];

				// Match by category
				if (currentPost.category) {
					// Using ilike for case-insensitive match, though typically categories are consistent
					orConditions.push(`category.eq."${currentPost.category}"`);
				}

				// Match by tags (overlap)
				if (currentPost.tags && currentPost.tags.length > 0) {
					// Create Postgres array string format: {"tag1","tag2"}
					// Escape double quotes in tags if necessary (simple replacement usually enough for tags)
					const sanitizedTags = currentPost.tags.map((t) =>
						t.replace(/"/g, '\\"'),
					);
					const tagsArrayString = `{"${sanitizedTags.join('","')}"}`;
					orConditions.push(`tags.ov.${tagsArrayString}`);
				}

				if (orConditions.length > 0) {
					query = query.or(orConditions.join(","));
				}

				const { data, error } = await query;

				if (error) throw error;

				// Process posts with optimized images
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
				console.error("Error fetching related posts:", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchRelatedPosts();
	}, [
		currentPost?.id,
		currentPost?.category,
		JSON.stringify(currentPost?.tags),
		limit,
	]);

	return { posts, loading, error };
};
