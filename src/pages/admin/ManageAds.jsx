import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
	Search,
	Plus,
	Edit2,
	ToggleLeft,
	ToggleRight,
	Trash2,
	ArrowLeft,
	Image as ImageIcon,
	Filter,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Hooks
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

const ManageAds = () => {
	const [ads, setAds] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);

	const adsPerPage = 10;

	useEffect(() => {
		fetchAds();
	}, [searchTerm, filterStatus, currentPage]);

	const fetchAds = async () => {
		try {
			setLoading(true);

			let query = supabase
				.from("ads")
				.select("*", { count: "exact" })
				.order("created_at", { ascending: false });

			// Apply search filter
			if (searchTerm) {
				query = query.or(
					`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`,
				);
			}

			// Apply status filter
			if (filterStatus !== "all") {
				query = query.eq("status", filterStatus);
			}

			// Apply pagination
			const from = (currentPage - 1) * adsPerPage;
			const to = from + adsPerPage - 1;
			query = query.range(from, to);

			const { data, error, count } = await query;

			if (error) throw error;

			setAds(data || []);
			setTotalPages(Math.ceil((count || 0) / adsPerPage));
		} catch (error) {
			console.error("Error fetching ads:", error);
			toast.error("Erro ao carregar anúncios");
		} finally {
			setLoading(false);
		}
	};

	const toggleAdStatus = async (adId, currentStatus) => {
		try {
			const newStatus =
				currentStatus === "approved" ? "draft" : "approved";

			const { error } = await supabase
				.from("ads")
				.update({ status: newStatus })
				.eq("id", adId);

			if (error) throw error;

			setAds(
				ads.map((ad) =>
					ad.id === adId ? { ...ad, status: newStatus } : ad,
				),
			);

			toast.success(
				`Anúncio ${newStatus === "approved" ? "aprovado" : "desativado"} com sucesso!`,
			);
		} catch (error) {
			console.error("Error toggling ad status:", error);
			toast.error("Erro ao alterar status do anúncio");
		}
	};

	const deleteAd = async (adId) => {
		if (
			!confirm(
				"Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.",
			)
		) {
			return;
		}

		try {
			const { error } = await supabase
				.from("ads")
				.delete()
				.eq("id", adId);

			if (error) throw error;

			setAds(ads.filter((ad) => ad.id !== adId));
			toast.success("Anúncio excluído com sucesso!");
		} catch (error) {
			console.error("Error deleting ad:", error);
			toast.error("Erro ao excluir anúncio");
		}
	};

	const getStatusBadge = (status) => {
		const styles = {
			approved: "bg-green-100 text-green-800",
			draft: "bg-yellow-100 text-yellow-800",
			archived: "bg-gray-100 text-gray-800",
		};

		const labels = {
			approved: "Aprovado",
			draft: "Rascunho",
			archived: "Arquivado",
		};

		return (
			<span
				className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.draft}`}
			>
				{labels[status] || "Rascunho"}
			</span>
		);
	};

	const getCategoryBadge = (category) => {
		const colors = {
			imobiliario: "bg-blue-100 text-blue-800",
			veiculos: "bg-green-100 text-green-800",
			servicos: "bg-purple-100 text-purple-800",
			produtos: "bg-orange-100 text-orange-800",
			outros: "bg-gray-100 text-gray-800",
		};

		return (
			<span
				className={`px-2 py-1 text-xs font-medium rounded-full ${colors[category] || colors.outros}`}
			>
				{category || "Outros"}
			</span>
		);
	};

	if (loading && ads.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-primary"></div>
			</div>
		);
	}

	return (
		<>
			<Helmet>
				<title>Gerenciar Anúncios - Opine Agora SC</title>
				<meta
					name="description"
					content="Gerenciamento de anúncios do portal Opine Agora SC"
				/>
			</Helmet>

			<div className="min-h-screen bg-gray-50">
				{/* Header */}
				<div className="bg-white shadow-sm border-b border-gray-200">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between mb-6">
							<div>
								<h1 className="text-3xl font-bold text-navy">
									Gerenciar Anúncios
								</h1>
								<p className="text-text-secondary mt-1">
									Crie, edite e gerencie todos os anúncios do
									portal
								</p>
							</div>
							<div className="flex items-center space-x-4">
								<Link
									to="/admin"
									className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
								>
									<ArrowLeft className="w-4 h-4" />
									<span>Voltar</span>
								</Link>
								<Link
									to="/admin/ads/new"
									className="btn-primary flex items-center space-x-2"
								>
									<Plus className="w-4 h-4" />
									<span>Novo Anúncio</span>
								</Link>
							</div>
						</div>
					</div>
				</div>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{/* Filters */}
					<div className="bg-white rounded-lg shadow-md p-6 mb-6">
						<div className="flex flex-col lg:flex-row gap-4">
							{/* Search */}
							<div className="flex-1">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
									<input
										type="text"
										placeholder="Buscar por título ou conteúdo..."
										value={searchTerm}
										onChange={(e) => {
											setSearchTerm(e.target.value);
											setCurrentPage(1);
										}}
										className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
									/>
								</div>
							</div>

							{/* Status Filter */}
							<div className="flex items-center space-x-2">
								<Filter className="w-4 h-4 text-text-secondary" />
								<select
									value={filterStatus}
									onChange={(e) => {
										setFilterStatus(e.target.value);
										setCurrentPage(1);
									}}
									className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
								>
									<option value="all">Todos os status</option>
									<option value="approved">Aprovado</option>
									<option value="draft">Rascunho</option>
									<option value="archived">Arquivado</option>
								</select>
							</div>
						</div>
					</div>

					{/* Ads Grid */}
					<div className="bg-white rounded-lg shadow-md overflow-hidden">
						{ads.length > 0 ? (
							<>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
									{ads.map((ad) => (
										<div
											key={ad.id}
											className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
										>
											{/* Ad Image */}
											{ad.image_url ? (
												<div className="aspect-video bg-gray-100">
													<img
														src={ad.image_url}
														alt={ad.title}
														className="w-full h-full object-cover"
														onError={(e) => {
															e.target.style.display =
																"none";
															e.target.nextElementSibling.style.display =
																"flex";
														}}
													/>
													<div
														className="aspect-video bg-gray-100 flex items-center justify-center"
														style={{
															display: "none",
														}}
													>
														<ImageIcon className="w-12 h-12 text-gray-400" />
													</div>
												</div>
											) : (
												<div className="aspect-video bg-gray-100 flex items-center justify-center">
													<ImageIcon className="w-12 h-12 text-gray-400" />
												</div>
											)}

											{/* Ad Content */}
											<div className="p-4">
												<div className="flex items-start justify-between mb-2">
													<h3 className="font-semibold text-navy line-clamp-2">
														{ad.title}
													</h3>
													{getStatusBadge(ad.status)}
												</div>

												<p className="text-sm text-text-secondary line-clamp-3 mb-3">
													{ad.content}
												</p>

												<div className="flex items-center justify-between mb-3">
													<span className="text-xs text-text-secondary">
														{format(
															new Date(
																ad.created_at,
															),
															"dd/MM/yyyy",
															{ locale: ptBR },
														)}
													</span>
												</div>

												{ad.link_url && (
													<p className="text-xs text-text-secondary mb-3 truncate">
														<strong>Link:</strong>{" "}
														{ad.link_url}
													</p>
												)}

												{/* Actions */}
												<div className="flex items-center justify-between pt-3 border-t border-gray-100">
													<div className="flex items-center space-x-2">
														{/* Toggle Status */}
														<button
															onClick={() =>
																handleToggleStatus(
																	ad,
																)
															}
															disabled={loading}
															className="p-2 rounded hover:bg-gray-100 transition-colors"
															title={
																ad.status ===
																"approved"
																	? "Desativar"
																	: "Ativar"
															}
														>
															{ad.status ===
															"approved" ? (
																<ToggleRight className="w-6 h-6 text-green-500" />
															) : (
																<ToggleLeft className="w-6 h-6 text-gray-400" />
															)}
														</button>

														{/* Edit */}
														<Link
															to={`/admin/ads/edit/${ad.id}`}
															className="p-2 rounded hover:bg-gray-100 transition-colors"
															title="Editar"
														>
															<Edit2 className="w-5 h-5 text-text-secondary" />
														</Link>

														{/* Delete */}
														<button
															onClick={() =>
																handleDeleteAd(
																	ad,
																)
															}
															disabled={loading}
															className="p-2 rounded hover:bg-red-50 transition-colors"
															title="Apagar"
														>
															<Trash2 className="w-5 h-5 text-red-500" />
														</button>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>

								{/* Pagination */}
								{totalPages > 1 && (
									<div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
										<div className="text-sm text-text-secondary">
											Mostrando{" "}
											{(currentPage - 1) * adsPerPage + 1}{" "}
											a{" "}
											{Math.min(
												currentPage * adsPerPage,
												ads.length,
											)}{" "}
											de {ads.length} anúncios
										</div>
										<div className="flex space-x-2">
											<button
												onClick={() =>
													setCurrentPage(
														Math.max(
															1,
															currentPage - 1,
														),
													)
												}
												disabled={currentPage === 1}
												className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
											>
												Anterior
											</button>
											<span className="px-3 py-1 text-sm">
												Página {currentPage} de{" "}
												{totalPages}
											</span>
											<button
												onClick={() =>
													setCurrentPage(
														Math.min(
															totalPages,
															currentPage + 1,
														),
													)
												}
												disabled={
													currentPage === totalPages
												}
												className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
											>
												Próxima
											</button>
										</div>
									</div>
								)}
							</>
						) : (
							<div className="text-center py-12">
								<Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
								<h3 className="text-lg font-medium text-navy mb-2">
									Nenhum anúncio encontrado
								</h3>
								<p className="text-text-secondary mb-6">
									{searchTerm || filterStatus !== "all"
										? "Tente ajustar os filtros ou busca."
										: "Comece criando seu primeiro anúncio."}
								</p>
								<Link
									to="/admin/ads/new"
									className="btn-primary"
								>
									<Plus className="w-4 h-4 inline mr-2" />
									Criar Anúncio
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default ManageAds;
