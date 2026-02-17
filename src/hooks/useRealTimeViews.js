import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

// Hook para sincronizar contagem de visualizações em tempo real
export const useRealTimeViews = (postId) => {
	const [viewCount, setViewCount] = useState(0);

	useEffect(() => {
		if (!postId) return;

		// Subscribe to real-time changes for this post
		const subscription = supabase
			.channel(`post_${postId}_views`)
			.on(
				'postgres_changes',
				{
					event: 'UPDATE',
					schema: 'public',
					table: 'posts',
					filter: `id=eq.${postId}`,
				},
				(payload) => {
					// Update view count when it changes in database
					if (payload.new.view_count !== undefined) {
						setViewCount(payload.new.view_count);
					}
				}
			)
			.subscribe();

		// Fetch initial view count
		const fetchInitialCount = async () => {
			const { data } = await supabase
				.from('posts')
				.select('view_count')
				.eq('id', postId)
				.single();

			if (data) {
				setViewCount(data.view_count || 0);
			}
		};

		fetchInitialCount();

		// Cleanup subscription
		return () => {
			subscription.unsubscribe();
		};
	}, [postId]);

	return viewCount;
};
