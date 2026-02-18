import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
	FileText,
	MessageSquare,
	Megaphone,
	Users,
	TrendingUp,
	Calendar,
	Eye,
	ThumbsUp,
	AlertCircle,
	LogOut,
	Mail,
} from "lucide-react";

// Hooks
import { useAuth } from "../../hooks/useAuth";
import { useAdminComments } from "../../hooks/useComments";
import { useViewStats } from "../../hooks/usePostViews";
import { supabase } from "../../lib/supabase";

const AdminDashboard = () => {
	const { user, signOut } = useAuth();
	const location = useLocation();
	const { comments } = useAdminComments();
	const { stats: viewStats, loading: viewStatsLoading } = useViewStats();
	const [stats, setStats] = useState({
		totalPosts: 0,
		publishedPosts: 0,
		pendingComments: 0,
		totalComments: 0,
		totalAds: 0,
		totalViews: 0,
		averageViews: 0,
		totalNewsletters: 0,
	});
	const [loading, setLoading] = useState(true);

	const handleLogout = async () => {
		try {
			await signOut();
		} catch (error) {
			console.error("❌ AdminDashboard - Logout error:", error);
		}
	};

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const [
					postsCount,
					publishedCount,
					commentsCount,
					adsCount,
					newslettersCount,
				] = await Promise.all([
					supabase.from("posts").select("id", { count: "exact" }),
					supabase
						.from("posts")
						.select("id", { count: "exact" })
						.eq("status", "published"),
					supabase.from("comments").select("id", { count: "exact" }),
					supabase.from("ads").select("id", { count: "exact" }),
					supabase
						.from("newsletter_subscriptions")
						.select("id", { count: "exact" }),
				]);

				setStats({
					totalPosts: postsCount.count || 0,
					publishedPosts: publishedCount.count || 0,
					pendingComments:
						comments?.filter((c) => c.status === "pending")
							.length || 0,
					totalComments: commentsCount.count || 0,
					totalAds: adsCount.count || 0,
					totalViews: viewStats.totalViews || 0,
					averageViews: viewStats.averageViews || 0,
					totalNewsletters: newslettersCount.count || 0,
				});
			} catch (error) {
				console.error("Error fetching stats:", error);
			} finally {
				setLoading(false);
			}
		};

		// Only fetch when viewStats is loaded
		if (!viewStatsLoading) {
			fetchStats();
		}
	}, [comments, viewStats, viewStatsLoading, location.key]);

	const statCards = [
		{
			title: "Total de Matérias",
			value: stats.totalPosts,
			icon: FileText,
			color: "bg-blue-500",
			link: "/admin/posts",
		},
		{
			title: "Matérias Publicadas",
			value: stats.publishedPosts,
			icon: Eye,
			color: "bg-green-500",
			link: "/admin/posts",
		},
		{
			title: "Total de Visualizações",
			value: stats.totalViews.toLocaleString(),
			icon: TrendingUp,
			color: "bg-teal-500",
			link: "#",
		},
		{
			title: "Gerenciar Anúncios",
			value: stats.totalAds,
			icon: Megaphone,
			color: "bg-indigo-500",
			link: "/admin/ads",
		},
		{
			title: "Comentários Pendentes",
			value: stats.pendingComments,
			icon: AlertCircle,
			color: "bg-orange-500",
			link: "/admin/comments",
		},
		{
			title: "Inscritos na Newsletter",
			value: stats.totalNewsletters,
			icon: MessageSquare,
			color: "bg-pink-500",
			link: "/admin/newsletters",
		},
	];

	const recentComments =
		comments?.slice(0, 5).filter((c) => c.status === "pending") || [];

	if (loading || viewStatsLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-primary"></div>
			</div>
		);
	}

	return (
		<>
			<Helmet>
				<title>Dashboard Admin - Opine Agora SC</title>
				<meta
					name="description"
					content="Painel administrativo do portal Opine Agora SC"
				/>
			</Helmet>

			<div className="bg-gray-50">
				{/* Header */}
				<div className="bg-white shadow-sm border-b border-gray-200">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between items-center py-4">
							<div>
								<h1 className="text-2xl font-bold text-navy">
									Dashboard Administrativo
								</h1>
								<p className="text-sm text-text-secondary">
									Bem-vindo de volta! Aqui está um resumo da
									sua aplicação.
								</p>
							</div>
							<div className="flex items-center space-x-4">
								<span className="text-sm text-text-secondary">
									{user?.email}
								</span>
								<button
									onClick={handleLogout}
									className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
									title="Sair do sistema"
								>
									<LogOut className="w-4 h-4" />
									<span>Sair</span>
								</button>
							</div>
						</div>
					</div>
				</div>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-0">
					{/* Stats Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
						{statCards.map((stat, index) => {
							const Icon = stat.icon;
							return (
								<Link
									key={index}
									to={stat.link}
									className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
								>
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-medium text-text-secondary">
												{stat.title}
											</p>
											<p className="text-3xl font-bold text-navy mt-2">
												{stat.value}
											</p>
										</div>
										<div
											className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
										>
											<Icon className="w-6 h-6 text-white" />
										</div>
									</div>
								</Link>
							);
						})}
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Quick Actions */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<h2 className="text-lg font-semibold text-navy mb-4">
								Ações Rápidas
							</h2>
							<div className="space-y-3">
								<Link
									to="/admin/posts/new"
									className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
								>
									<div className="w-10 h-10 bg-teal-primary rounded-lg flex items-center justify-center">
										<FileText className="w-5 h-5 text-white" />
									</div>
									<div>
										<p className="font-medium text-navy">
											Nova Matéria
										</p>
										<p className="text-sm text-text-secondary">
											Criar nova matéria
										</p>
									</div>
								</Link>

								<Link
									to="/admin/ads/new"
									className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
								>
									<div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
										<Megaphone className="w-5 h-5 text-white" />
									</div>
									<div>
										<p className="font-medium text-navy">
											Novo Anúncio
										</p>
										<p className="text-sm text-text-secondary">
											Adicionar novo anúncio
										</p>
									</div>
								</Link>

								<Link
									to="/admin/ads"
									className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
								>
									<div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
										<Megaphone className="w-5 h-5 text-white" />
									</div>
									<div>
										<p className="font-medium text-navy">
											Gerenciar Anúncios
										</p>
										<p className="text-sm text-text-secondary">
											Ver e editar anúncios
										</p>
									</div>
								</Link>

								<Link
									to="/admin/comments"
									className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
								>
									<div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
										<MessageSquare className="w-5 h-5 text-white" />
									</div>
									<div>
										<p className="font-medium text-navy">
											Comentários
										</p>
										<p className="text-sm text-text-secondary">
											Revisar comentários
										</p>
									</div>
								</Link>

								<Link
									to="/admin/newsletters"
									className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
								>
									<div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
										<Mail className="w-5 h-5 text-white" />
									</div>
									<div>
										<p className="font-medium text-navy">
											Newsletter
										</p>
										<p className="text-sm text-text-secondary">
											Gerenciar emails
										</p>
									</div>
								</Link>
							</div>
						</div>

						{/* Recent Pending Comments */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-lg font-semibold text-navy">
									Comentários Pendentes
								</h2>
								<Link
									to="/admin/comments"
									className="text-teal-primary hover:text-teal-900 text-sm font-medium"
								>
									Ver todos
								</Link>
							</div>

							{recentComments.length > 0 ? (
								<div className="space-y-4">
									{recentComments.map((comment) => (
										<div
											key={comment.id}
											className="border-b border-gray-100 pb-4 last:border-0"
										>
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="flex items-center space-x-2 mb-1">
														<span className="font-medium text-navy">
															{comment.name}
														</span>
														<span className="text-xs text-text-secondary">
															{new Date(
																comment.created_at,
															).toLocaleDateString(
																"pt-BR",
															)}
														</span>
													</div>
													<p className="text-sm text-text-primary line-clamp-2">
														{comment.content}
													</p>
													<p className="text-xs text-text-secondary mt-1">
														Post:{" "}
														{comment.posts?.title}
													</p>
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-8">
									<MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
									<p className="text-text-secondary">
										Nenhum comentário pendente
									</p>
								</div>
							)}
						</div>
					</div>

					{/* Go to Site Button */}
					<div className="mt-8 bg-white rounded-lg shadow-md p-6 mb-0 text-center">
						<h2 className="text-lg font-semibold text-navy mb-4">
							Acesso Rápido
						</h2>
						<a
							href="/"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center space-x-2 px-6 py-3 bg-teal-primary hover:bg-teal-900 text-white rounded-lg transition-colors font-medium text-lg"
						>
							<LogOut className="w-5 h-5 rotate-180" />
							<span>Ir para o Site</span>
						</a>
						<p className="text-sm text-text-secondary mt-4">
							Acesse a página inicial do portal em uma nova aba
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default AdminDashboard;
