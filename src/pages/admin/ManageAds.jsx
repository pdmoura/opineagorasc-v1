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
	Megaphone,
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
		if (!window.confirm("Tem certeza que deseja excluir este anúncio?")) {
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

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const filteredAds = ads.filter((ad) => {
		const matchesSearch =
			!searchTerm ||
			ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			ad.content?.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesStatus = filterStatus === "all" || ad.status === filterStatus;

		return matchesSearch && matchesStatus;
	});

	return (
		<>
			<Helmet>
				<title>Gerenciar Anúncios - Admin</title>
				<meta
					name="description"
					content="Painel de gerenciamento de anúncios"
				/>
			</Helmet>

			<div className="min-h-screen bg-gray-50">
				{/* Header */}
				<div className="bg-white shadow-sm border-b border-gray-200">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between items-center py-4">
							<div className="flex items-center space-x-4">
								<Link
									to="/admin"
									className="flex items-center space-x-2 text-gray-600 hover:text-navy transition-colors"
								>
									<ArrowLeft className="w-5 h-5" />
									<span>Voltar</span>
								</Link>
								<h1 className="text-2xl font-bold text-navy">
									Gerenciar Anúncios
								</h1>
							</div>
							<Link
								to="/admin/ads/new"
								className="btn-primary flex items-center space-x-2"
							>
								<Plus className="w-5 h-5" />
								<span>Novo Anúncio</span>
							</Link>
						</div>
					</div>
				</div>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{/* Filters */}
					<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
						<div className="flex flex-col sm:flex-row gap-4">
							<div className="flex-1">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
									<input
										type="text"
										placeholder="Buscar anúncios..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-primary focus:border-transparent"
									/>
								</div>
							</div>
							<div className="flex items-center space-x-2">
								<Filter className="w-5 h-5 text-gray-500" />
								<select
									value={filterStatus}
									onChange={(e) => setFilterStatus(e.target.value)}
									className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-primary focus:border-transparent"
								>
									<option value="all">Todos</option>
									<option value="approved">Ativos</option>
									<option value="draft">Inativos</option>
								</select>
							</div>
						</div>
					</div>

					{/* Ads List */}
					<div className="bg-white rounded-lg shadow-sm">
						{loading ? (
							<div className="flex items-center justify-center py-12">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-primary"></div>
							</div>
						) : filteredAds.length > 0 ? (
							<div className="divide-y divide-gray-200">
								{filteredAds.map((ad) => (
									<div
										key={ad.id}
										className="p-6 hover:bg-gray-50 transition-colors"
									>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="flex items-center space-x-3 mb-2">
													<h3 className="text-lg font-semibold text-navy">
														{ad.title}
													</h3>
													<span
														className={`px-2 py-1 text-xs font-medium rounded-full ${
															ad.status === "approved"
																? "bg-green-100 text-green-800"
																: "bg-gray-100 text-gray-800"
														}`}
													>
														{ad.status === "approved"
															? "Ativo"
															: "Inativo"}
													</span>
												</div>

												{ad.image_url && (
													<img
														src={ad.image_url}
														alt={ad.title}
														className="w-20 h-20 object-cover rounded-lg mb-3"
													/>
												)}

												{ad.content && (
													<p className="text-gray-600 mb-3 line-clamp-2">
														{ad.content}
													</p>
												)}

												{ad.link_url && (
													<p className="text-sm text-teal-primary mb-3">
														<a
															href={ad.link_url}
															target="_blank"
															rel="noopener noreferrer"
															className="hover:underline"
														>
															{ad.link_url}
														</a>
													</p>
												)}

												<p className="text-sm text-gray-500">
													Criado em{" "}
													{format(
														new Date(ad.created_at),
														"dd 'de' MMMM 'de' yyyy",
														{ locale: ptBR },
													)}
												</p>
											</div>

											{/* Actions */}
											<div className="flex items-center justify-between pt-3 border-t border-gray-100">
												<div className="flex items-center space-x-2">
													{/* Toggle Status */}
													<button
														onClick={() =>
															toggleAdStatus(
																ad.id,
																ad.status,
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
															<ToggleLeft className="w-4 h-4 text-gray-600" />
														) : (
															<ToggleRight className="w-4 h-4 text-teal-primary" />
														)}
													</button>

													{/* Edit */}
													<Link
														to={`/admin/ads/edit/${ad.id}`}
														className="p-2 rounded hover:bg-gray-100 transition-colors"
														title="Editar"
													>
														<Edit2 className="w-4 h-4 text-gray-600" />
													</Link>

													{/* Delete */}
													<button
														onClick={() => deleteAd(ad.id)}
														disabled={loading}
														className="p-2 rounded hover:bg-red-50 transition-colors"
														title="Excluir"
													>
														<Trash2 className="w-4 h-4 text-red-600" />
													</button>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
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

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="mt-6 flex justify-center">
							<div className="flex items-center space-x-2">
								{Array.from(
									{ length: totalPages },
									(_, i) => i + 1,
								).map((page) => (
									<button
										key={page}
										onClick={() => handlePageChange(page)}
										className={`px-3 py-2 rounded-lg ${
											currentPage === page
												? "bg-teal-primary text-white"
												: "bg-white text-gray-700 hover:bg-gray-100"
										} transition-colors`}
									>
										{page}
									</button>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default ManageAds;
