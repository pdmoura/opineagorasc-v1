import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Newspaper, Filter, ArrowRight } from "lucide-react";

// Components
import PostCard from "../components/public/PostCard";

// Hooks
import { usePosts } from "../hooks/usePosts";
import { useCategories } from "../hooks/useCategories";

// Utils
import { formatDate } from "../lib/utils";

const TodasCategorias = () => {
	const { posts, loading: postsLoading, error: postsError } = usePosts(); // Todos os posts
	const {
		categories,
		loading: categoriesLoading,
		error: categoriesError,
	} = useCategories();
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [sortBy, setSortBy] = useState("latest");
	const postsRef = useRef(null);

	const handleCategoryClick = (category) => {
		setSelectedCategory(category);
		// Scroll to posts on mobile
		if (window.innerWidth < 1024) {
			setTimeout(() => {
				postsRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}, 100);
		}
	};

	// Filter posts by selected category
	const filteredPosts = selectedCategory
		? posts?.filter((post) => post.category === selectedCategory) || []
		: posts || [];

	// Sort posts
	const sortedPosts = filteredPosts
		? [...filteredPosts].sort((a, b) => {
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

	// Count posts per category
	const getCategoryCount = (category) => {
		return posts?.filter((post) => post.category === category).length || 0;
	};

	if (postsLoading || categoriesLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-primary"></div>
			</div>
		);
	}

	if (postsError || categoriesError) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-navy mb-4">
						Erro ao carregar
					</h1>
					<p className="text-gray-600 mb-6">
						{postsError || categoriesError}
					</p>
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
				<title>Categorias - Opine Agora SC</title>
				<meta
					name="description"
					content="Explore todas as categorias de notícias do Opine Agora SC. Política, Economia, Sociedade, Esportes, Cultura e mais."
				/>
			</Helmet>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Page Header */}
				<div className="bg-gradient-to-r from-teal-primary to-navy text-white rounded-xl p-8 mb-8">
					<div className="flex items-center space-x-3 mb-4">
						<Newspaper className="w-8 h-8" />
						<h1 className="text-3xl md:text-4xl font-bold">
							Todas as Categorias
						</h1>
					</div>
					<p className="text-lg text-gray-100">
						Explore todas as categorias de notícias e encontre os
						assuntos que mais interessam você
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Categories Sidebar / Topbar */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-lg shadow-md p-4 lg:p-6 sticky top-4">
							<div className="flex items-center space-x-2 mb-4">
								<Filter className="w-5 h-5 text-teal-primary" />
								<h2 className="text-lg font-bold text-navy">
									Categorias
								</h2>
							</div>

							<div className="flex flex-col gap-2">
								{/* All Categories Option */}
								<button
									onClick={() => handleCategoryClick(null)}
									className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors mb-0 border-transparent ${
										!selectedCategory
											? "bg-teal-primary text-white"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}
								>
									<div className="flex items-center justify-between">
										<span>Todas as Notícias</span>
										<span className="text-sm font-bold text-white bg-teal-600 px-2 py-1 rounded-full">
											{posts?.length || 0}
										</span>
									</div>
								</button>

								{/* Individual Categories */}
								{categories?.map((category) => (
									<button
										key={category}
										onClick={() =>
											handleCategoryClick(category)
										}
										className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors mb-0 border-transparent ${
											selectedCategory === category
												? "bg-teal-primary text-white"
												: "bg-gray-100 text-gray-700 hover:bg-gray-200"
										}`}
									>
										<div className="flex items-center justify-between">
											<span>{category}</span>
											<span
												className={`text-sm font-bold px-2 py-1 rounded-full ${
													selectedCategory ===
													category
														? "text-white bg-orange-500"
														: "text-white bg-teal-600"
												}`}
											>
												{getCategoryCount(category)}
											</span>
										</div>
									</button>
								))}
							</div>

							{/* Quick Links - Hidden on mobile to save space, visible on desktop */}
							<div className="hidden lg:block mt-6 pt-6 border-t border-gray-200">
								<h3 className="text-lg font-semibold text-navy mb-4">
									Links Rápidos
								</h3>
								<div className="space-y-3">
									<Link
										to="/eleicoes"
										className="flex items-center space-x-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
									>
										<span className="text-2xl">🗳</span>
										<div>
											<div className="font-medium">
												Eleições 2024
											</div>
											<div className="text-sm text-blue-600">
												Acompanhe as últimas notícias
											</div>
										</div>
									</Link>
									<Link
										to="/sobre"
										className="flex items-center space-x-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
									>
										<span className="text-2xl">ℹ️</span>
										<div>
											<div className="font-medium">
												Sobre o Portal
											</div>
											<div className="text-sm text-gray-600">
												Conheça nossa história
											</div>
										</div>
									</Link>
								</div>
							</div>
						</div>
					</div>

					{/* Posts Content */}
					<div className="lg:col-span-3 scroll-mt-24" ref={postsRef}>
						<div
							key={selectedCategory || "all"}
							className="bg-white rounded-lg shadow-md p-6 fade-in scroll-mt-24"
						>
							{/* Header with sort */}
							<div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
								<h2 className="text-xl font-bold text-navy">
									{selectedCategory
										? `Notícias de ${selectedCategory}`
										: "Todas as Notícias"}
									<span className="ml-2 text-sm text-gray-500">
										({sortedPosts.length} matéria
										{sortedPosts.length !== 1 ? "s" : ""})
									</span>
								</h2>
								<div className="flex items-center gap-2 self-end md:self-auto w-full md:w-auto">
									<select
										value={sortBy}
										onChange={(e) =>
											setSortBy(e.target.value)
										}
										className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
									>
										<option value="latest">
											Mais recentes
										</option>
										<option value="oldest">
											Mais antigas
										</option>
										<option value="title">
											Ordem alfabética
										</option>
									</select>
								</div>
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
										{selectedCategory
											? `Nenhuma matéria encontrada em "${selectedCategory}"`
											: "Nenhuma matéria encontrada"}
									</h3>
									<p className="text-text-secondary mb-6">
										{selectedCategory
											? "Não há matérias publicadas nesta categoria ainda."
											: "Não há matérias publicadas no momento."}
									</p>
									<button
										onClick={() =>
											setSelectedCategory(null)
										}
										className="btn-primary"
									>
										Ver todas as categorias
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default TodasCategorias;
