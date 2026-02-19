import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { AlertCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import PostCard from "../components/public/PostCard";
import SkeletonLoader from "../components/public/SkeletonLoader";

const UrgentNews = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const { data, error } = await supabase
					.from("posts")
					.select("*")
					.eq("status", "published")
					.eq("urgent", true)
					.order("created_at", { ascending: false });

				if (error) throw error;
				setPosts(data || []);
				console.log("Urgent posts fetched:", data?.length);
			} catch (error) {
				console.error("Error fetching urgent posts:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();

		// Realtime subscription
		const channel = supabase
			.channel("public:urgent_news")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "posts",
				},
				(payload) => {
					console.log("Change received!", payload);
					fetchPosts();
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, []);

	return (
		<div className="min-h-screen bg-gray-50 pb-12">
			<Helmet>
				<title>Notícias Urgentes | Opine Agora SC</title>
				<meta
					name="description"
					content="Acompanhe as notícias urgentes e de última hora de Concórdia e região."
				/>
			</Helmet>

			<div className="bg-[hsl(5,55%,48%)] text-white py-12 mb-8">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-center space-x-4">
						<div className="bg-white/20 p-3 rounded-full animate-pulse">
							<AlertCircle className="w-8 h-8 text-white" />
						</div>
						<h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider">
							Plantão Urgente
						</h1>
					</div>
					<p className="text-center mt-4 text-white/90 max-w-2xl mx-auto text-lg">
						Cobertura em tempo real dos fatos mais importantes que
						estão acontecendo agora.
					</p>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{loading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<SkeletonLoader key={i} type="card" />
						))}
					</div>
				) : posts.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{posts.map((post) => (
							<div key={post.id} className="h-full">
								<PostCard post={post} />
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-16 bg-white rounded-lg shadow-sm">
						<div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
							<AlertCircle className="w-8 h-8 text-gray-400" />
						</div>
						<h3 className="text-xl font-medium text-gray-900 mb-2">
							Sem notícias urgentes no momento
						</h3>
						<p className="text-gray-500">
							Fique tranquilo, informaremos assim que houver
							atualizações importantes.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default UrgentNews;
