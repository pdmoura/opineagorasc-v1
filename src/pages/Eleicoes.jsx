import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Newspaper, ExternalLink } from "lucide-react";

// Components
import PostCard from "../components/public/PostCard";

// Hooks
import { usePosts } from "../hooks/usePosts";

// Utils
import { formatDate } from "../lib/utils";

const Eleicoes = () => {
	const { posts, loading, error } = usePosts("Política"); // Busca posts da categoria Política
	const [sortBy, setSortBy] = useState("latest");

	// Afiliados (links externos)
	const afiliados = [
		{
			name: "TSE - Tribunal Superior Eleitoral",
			url: "https://www.tse.jus.br/",
			description:
				"Portal oficial com todas as informações sobre as eleições",
		},
		{
			name: "Divulga Cândidatos",
			url: "https://divulgacandcontas.tse.jus.br/",
			description:
				"Sistema de Divulgação de Candidaturas e Contas Eleitorais",
		},
		{
			name: "Eleições 2024",
			url: "https://www.eleicoes2024.com.br/",
			description:
				"Acompanhe em tempo real as apurações das eleições municipais",
		},
		{
			name: "Política SC",
			url: "https://www.politicasc.com.br/",
			description: "Notícias e análises políticas de Santa Catarina",
		},
	];

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
						Erro ao carregar notícias
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
				<title>Eleições - Opine Agora SC</title>
				<meta
					name="description"
					content="Acompanhe as últimas notícias sobre eleições em Santa Catarina e no Brasil. Informações, candidatos e resultados."
				/>
			</Helmet>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Page Header */}
				<div className="bg-gradient-to-r from-navy to-teal-primary text-white rounded-xl p-8 mb-8">
					<div className="flex items-center space-x-3 mb-4">
						<Newspaper className="w-8 h-8" />
						<h1 className="text-3xl md:text-4xl font-bold">
							Eleições 2024
						</h1>
					</div>
					<p className="text-lg text-gray-100">
						Acompanhe tudo sobre as eleições municipais de Santa
						Catarina
					</p>
				</div>

				{/* Afiliados Section */}
				<div className="bg-white rounded-lg shadow-md p-6 mb-8">
					<h2 className="text-2xl font-bold text-navy mb-6 flex items-center">
						<ExternalLink className="w-6 h-6 mr-2 text-teal-primary" />
						Links Úteis
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{afiliados.map((afiliado, index) => (
							<a
								key={index}
								href={afiliado.url}
								target="_blank"
								rel="noopener noreferrer"
								className="block p-4 border border-gray-200 rounded-lg hover:border-teal-primary hover:shadow-md transition-all"
							>
								<h3 className="font-semibold text-navy mb-2">
									{afiliado.name}
								</h3>
								<p className="text-sm text-gray-600 mb-3">
									{afiliado.description}
								</p>
								<div className="flex items-center text-teal-primary text-sm font-medium">
									<span>Acessar site</span>
									<ExternalLink className="w-4 h-4 ml-1" />
								</div>
							</a>
						))}
					</div>
				</div>

				{/* Sort and Posts */}
				<div className="bg-white rounded-lg shadow-md p-6">
					{/* Sort Options */}
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-bold text-navy">
							Últimas Notícias sobre Eleições
						</h2>
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
								Nenhuma notícia encontrada
							</h3>
							<p className="text-text-secondary mb-6">
								Não há notícias sobre eleições no momento.
							</p>
							<Link to="/" className="btn-primary">
								Ver outras notícias
							</Link>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Eleicoes;
