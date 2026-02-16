import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Newspaper, Filter } from "lucide-react";

// Components
import PostCard from "../components/public/PostCard";

// Hooks
import { usePosts } from "../hooks/usePosts";

// Utils
import { formatDate } from "../lib/utils";

const Category = () => {
	const { category } = useParams();
	const { posts, loading, error } = usePosts(category);
	const [sortBy, setSortBy] = useState("latest");

	// Format category name for display
	const formatCategoryName = (cat) => {
		if (!cat) return "Todas as Notícias";
		// Mantém o nome exato da categoria como está no banco
		return cat;
	};

	const categoryName = formatCategoryName(category);

	// Sort posts
	const sortedPosts = posts
		? [...posts].sort((a, b) => {
				switch (sortBy) {
					case "latest":
						return new Date(b.date) - new Date(a.date);
					case "oldest":
						return new Date(a.date) - new Date(b.date);
					case "title":
						return a.title.localeCompare(b.title);
					default:
						return 0;
				}
			})
		: [];

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
					<h1 className="text-2xl font-bold text-navy mb-4">
						Erro ao carregar categoria
					</h1>
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
				<title>{categoryName} - Opine Agora SC</title>
				<meta
					name="description"
					content={`Confira as últimas notícias sobre ${categoryName} em Santa Catarina.`}
				/>
			</Helmet>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Category Header */}
				<div className="bg-gradient-to-r from-teal-primary to-navy text-white rounded-xl p-8 mb-8">
					<div className="flex items-center space-x-3 mb-4">
						<Newspaper className="w-8 h-8" />
						<h1 className="text-3xl md:text-4xl font-bold">
							{categoryName}
						</h1>
					</div>
					<p className="text-lg text-gray-100">
						{posts?.length || 0} matéria
						{posts?.length !== 1 ? "s" : ""} encontrada
						{posts?.length !== 1 ? "s" : ""}
					</p>
				</div>

				{/* Filters and Sort */}
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
					<div className="flex items-center space-x-2">
						<Filter className="w-5 h-5 text-text-secondary" />
						<span className="text-text-secondary">
							Ordenar por:
						</span>
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

					{/* Category Navigation */}
					<nav className="flex flex-wrap gap-2">
						<Link
							to="/"
							className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
								!category
									? "bg-teal-primary text-white"
									: "bg-gray-100 text-text-primary hover:bg-gray-200"
							}`}
						>
							Todas
						</Link>
						{[
							"Política",
							"Economia",
							"Sociedade",
							"Esportes",
							"Cultura",
							"Opinião",
						].map((cat) => (
							<Link
								key={cat}
								to={`/categoria/${encodeURIComponent(cat.toLowerCase())}`}
								className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
									category?.toLowerCase() ===
									cat.toLowerCase()
										? "bg-teal-primary text-white"
										: "bg-gray-100 text-text-primary hover:bg-gray-200"
								}`}
							>
								{cat}
							</Link>
						))}
					</nav>
				</div>

				{/* Posts Grid */}
				{sortedPosts.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{sortedPosts.map((post) => (
							<PostCard key={post.id} post={post} />
						))}
					</div>
				) : (
					<div className="text-center py-12">
						<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Newspaper className="w-10 h-10 text-gray-400" />
						</div>
						<h3 className="text-xl font-semibold text-navy mb-2">
							Nenhuma matéria encontrada
						</h3>
						<p className="text-text-secondary mb-6">
							Não há matérias publicadas nesta categoria ainda.
						</p>
						<Link to="/" className="btn-primary">
							Ver outras categorias
						</Link>
					</div>
				)}

				{/* Load More (for future pagination) */}
				{sortedPosts.length > 0 && sortedPosts.length >= 12 && (
					<div className="text-center mt-12">
						<button className="btn-outline">
							Carregar mais matérias
						</button>
					</div>
				)}
			</div>
		</>
	);
};

export default Category;
