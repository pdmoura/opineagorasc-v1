import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Zap } from "lucide-react";
import { supabase } from "../../lib/supabase";

const UrgentTicker = () => {
	const [urgentPosts, setUrgentPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		// Check if dismissed in this session
		const isDismissed = sessionStorage.getItem("urgent_ticker_dismissed");
		if (isDismissed) {
			setIsVisible(false);
		}

		const fetchUrgentPosts = async () => {
			try {
				const { data, error } = await supabase
					.from("posts")
					.select("id, title, slug")
					.eq("status", "published")
					.eq("urgent", true)
					.order("created_at", { ascending: false });

				if (error) throw error;
				setUrgentPosts(data || []);
			} catch (error) {
				console.error("Error fetching urgent posts:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchUrgentPosts();

		// Realtime subscription
		const channel = supabase
			.channel("public:posts:urgent")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "posts",
					filter: "urgent=eq.true",
				},
				() => {
					fetchUrgentPosts();
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, []);

	const handleDismiss = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsVisible(false);
		sessionStorage.setItem("urgent_ticker_dismissed", "true");
	};

	if (loading || urgentPosts.length === 0) return null;

	if (!isVisible) {
		return (
			<Link
				to="/urgentes"
				className="fixed bottom-4 left-4 z-50 bg-[hsl(5,65%,40%)] text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 hover:bg-[hsl(5,65%,30%)] transition-all hover:scale-105 animate-in fade-in slide-in-from-bottom-4 duration-300 group"
				title="Ver notícias urgentes"
			>
				<span className="relative flex h-3 w-3">
					<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
					<span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
				</span>
				<span className="font-bold text-sm flex items-center">
					<Zap className="w-4 h-4 text-yellow-400 mr-1 fill-yellow-400" />
					NOTÍCIAS URGENTES
				</span>
			</Link>
		);
	}

	// Duplicate list for seamless loop
	const tickerItems = [
		...urgentPosts,
		...urgentPosts,
		...urgentPosts,
		...urgentPosts,
	];

	return (
		<div className="w-full bg-[hsl(5,55%,48%)] border-b border-[hsl(5,55%,40%)] overflow-hidden relative z-40 h-10 flex cursor-pointer group shadow-md shrink-0">
			<Link
				to="/urgentes"
				className="flex w-full h-full items-center decoration-transparent min-w-0"
			>
				{/* Urgent Label - Darker Red */}
				<div className="bg-[hsl(5,65%,30%)] text-white px-4 h-full flex items-center font-bold text-xs sm:text-sm tracking-widest uppercase shrink-0 z-20 relative shadow-md">
					<span className="relative flex h-2 w-2 mr-2">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
						<span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
					</span>
					URGENTE
					{/* Triangle pointer */}
					<div className="absolute right-[-12px] top-0 h-0 w-0 border-t-[20px] border-t-transparent border-l-[12px] border-l-[hsl(5,65%,30%)] border-b-[20px] border-b-transparent"></div>
				</div>

				{/* Ticker Container */}
				<div className="flex-1 min-w-0 overflow-hidden relative h-full flex items-center">
					{/* Gradient masks */}
					<div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[hsl(5,55%,48%)] to-transparent z-10"></div>
					<div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[hsl(5,55%,48%)] to-transparent z-10"></div>

					{/* Ticker Content Wrapper */}
					<div className="flex items-center whitespace-nowrap animate-ticker group-hover:pause-animation pl-4 pr-12">
						{tickerItems.map((post, index) => (
							<span
								key={`${post.id}-${index}`}
								className="mx-6 text-white font-medium text-sm inline-flex items-center"
							>
								<span className="w-1.5 h-1.5 bg-white rounded-full mr-3 opacity-80"></span>
								{post.title}
							</span>
						))}
					</div>
				</div>
			</Link>

			{/* Dismiss Button */}
			<button
				onClick={handleDismiss}
				className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center bg-[hsl(5,55%,48%)] text-white hover:bg-[hsl(5,55%,40%)] transition-colors z-30"
				aria-label="Fechar alerta"
			>
				<X className="w-5 h-5" />
			</button>
		</div>
	);
};

export default UrgentTicker;
