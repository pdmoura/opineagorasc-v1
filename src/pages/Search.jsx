import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Components
import PostCard from "../components/public/PostCard";
import { supabase } from "../lib/supabase";
import { formatDate } from "../lib/utils";

const SearchPage = () => {
	const [searchParams] = useSearchParams();
	const query = searchParams.get("q") || "";
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [sortBy, setSortBy] = useState("latest");

	useEffect(() => {
		if (query) {
			fetchSearchResults();
		} else {
			setPosts([]);
			setLoading(false);
		}
	}, [query, sortBy]);

	const fetchSearchResults = async () => {
		try {
			setLoading(true);
			setError(null);

			let supabaseQuery = supabase
				.from("posts")
				.select("*")
				.eq("status", "published");

			// Apply search filter
			if (query) {
				supabaseQuery = supabaseQuery.or(
					`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`
				);
			}

			// Apply sorting
			switch (sortBy) {
				case "latest":
					supabaseQuery = supabaseQuery.order("created_at", { ascending: false });
					break;
				case "oldest":
					supabaseQuery = supabaseQuery.order("created_at", { ascending: true });
					break;
				case "title":
					supabaseQuery = supabaseQuery.order("title", { ascending: true });
					break;
				default:
					supabaseQuery = supabaseQuery.order("created_at", { ascending: false });
			}

			const { data, error } = await supabaseQuery;

			if (error) throw error;

			setPosts(data || []);
		} catch (error) {
			console.error("Error searching posts:", error);
			setError("Erro ao buscar notícias. Tente novamente.");
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-primary"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-navy mb-4">Erro na Busca</h1>
					<p className="text-gray-600 mb-6">{error}</p>
					<Link to="/" className="btn-primary">
						Voltar para a página inicial
					</Link>
				</div>
			</div>
		);
	}

	return (
		<>
			<Helmet>
				<title>
					{query ? `Busca: ${query} - Opine Agora SC` : "Busca - Opine Agora SC"}
				</title>
				<meta
					name="description"
					content={
						query
							? `Resultados da busca por "${query}" no Opine Agora SC`
							: "Busque notícias no Opine Agora SC"
					}
				/>
			</Helmet>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Search Header */}
				<div className="bg-gradient-to-r from-teal-primary to-navy text-white rounded-xl p-8 mb-8">
					<div className="flex items-center space-x-3 mb-4">
						<Search className="w-8 h-8" />
						<h1 className="text-3xl md:text-4xl font-bold">
							Resultados da Busca
						</h1>
					</div>
					{query && (
						<p className="text-lg text-gray-100">
							Buscando por: <span className="font-semibold">"{query}"</span>
						</p>
					)}
					<p className="text-lg text-gray-100 mt-2">
						{posts.length} notícia{posts.length !== 1 ? "s" : ""} encontrada
						{posts.length !== 1 ? "s" : ""}
					</p>
				</div>

				{/* Filters and Sort */}
				{posts.length > 0 && (
					<div className="flex justify-end mb-6">
						<div className="flex items-center space-x-2">
							<span className="text-text-secondary">Ordenar por:</span>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
							>
								<option value="latest">Mais recentes</option>
								<option value="oldest">Mais antigas</option>
								<option value="title">Ordem alfabética</option>
							</select>
						</div>
					</div>
				)}

				{/* Results */}
				{posts.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{posts.map((post) => (
							<PostCard key={post.id} post={post} />
						))}
					</div>
				) : (
					<div className="text-center py-12">
						<Search className="w-20 h-20 text-gray-300 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-navy mb-2">
							{query
								? "Nenhuma notícia encontrada"
								: "Digite um termo para buscar"}
						</h3>
						<p className="text-text-secondary mb-6">
							{query
								? "Tente usar outros termos ou palavras-chave."
								: "Use o campo de busca para encontrar notícias."}
						</p>
						{query && (
							<Link to="/" className="btn-primary">
								Voltar para a página inicial
							</Link>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default SearchPage;
