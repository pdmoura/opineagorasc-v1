import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
	Search,
	Plus,
	Edit,
	ToggleLeft,
	ToggleRight,
	Trash2,
	ArrowLeft,
	Image as ImageIcon,
	Filter,
	Megaphone,
	CheckSquare,
	Square,
	X,
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
	const [filterCategory, setFilterCategory] = useState("all");
	const [filterDate, setFilterDate] = useState("");
	const [sortOption, setSortOption] = useState("newest");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [selectedAds, setSelectedAds] = useState(new Set());
	const [deleteModal, setDeleteModal] = useState({
		isOpen: false,
		ads: [],
		ids: [],
		isBulk: false,
	});

	const adsPerPage = 10;

	useEffect(() => {
		fetchAds();
	}, [
		searchTerm,
		filterStatus,
		filterCategory,
		filterDate,
		sortOption,
		currentPage,
	]);

	const fetchAds = async () => {
		try {
			setLoading(true);

			let query = supabase.from("ads").select("*", { count: "exact" });

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

			// Apply category filter
			if (filterCategory !== "all") {
				query = query.eq("category", filterCategory);
			}

			// Apply sorting and date filter
			if (sortOption === "date" && filterDate) {
				const startDate = new Date(filterDate);
				startDate.setUTCHours(0, 0, 0, 0);
				const endDate = new Date(filterDate);
				endDate.setUTCHours(23, 59, 59, 999);

				query = query
					.gte("created_at", startDate.toISOString())
					.lte("created_at", endDate.toISOString())
					.order("created_at", { ascending: false });
			} else {
				// Apply numeric/text sorting
				switch (sortOption) {
					case "oldest":
						query = query.order("created_at", { ascending: true });
						break;
					case "a-z":
						query = query.order("title", { ascending: true });
						break;
					case "newest":
					default:
						query = query.order("created_at", { ascending: false });
						break;
				}
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

			const updates = { status: newStatus };
			if (newStatus === "approved") {
				updates.created_at = new Date().toISOString();
			}

			const { error } = await supabase
				.from("ads")
				.update(updates)
				.eq("id", adId);

			if (error) throw error;

			setAds(
				ads.map((ad) => (ad.id === adId ? { ...ad, ...updates } : ad)),
			);

			toast.success(
				`Anúncio ${newStatus === "approved" ? "aprovado" : "desativado"} com sucesso!`,
			);
		} catch (error) {
			console.error("Error toggling ad status:", error);
			toast.error("Erro ao alterar status do anúncio");
		}
	};

	const deleteAd = async (adId, adTitle) => {
		setDeleteModal({
			isOpen: true,
			ads: [adTitle],
			ids: [adId],
			isBulk: false,
		});
	};

	const deleteSelectedAds = () => {
		const selectedIds = Array.from(selectedAds);
		const selectedAdList = ads
			.filter((ad) => selectedIds.includes(ad.id))
			.map((ad) => ad.title);

		setDeleteModal({
			isOpen: true,
			ads: selectedAdList,
			ids: selectedIds,
			isBulk: true,
		});
	};

	const confirmDelete = async () => {
		try {
			// Delete ads sequentially to ensure consistency
			for (const id of deleteModal.ids) {
				const { error } = await supabase
					.from("ads")
					.delete()
					.eq("id", id);
				if (error) throw error;
			}

			setAds(ads.filter((ad) => !deleteModal.ids.includes(ad.id)));
			setSelectedAds(new Set());
			toast.success(
				deleteModal.isBulk
					? "Anúncios excluídos com sucesso!"
					: "Anúncio excluído com sucesso!",
			);

			setDeleteModal({
				isOpen: false,
				ads: [],
				ids: [],
				isBulk: false,
			});

			// Refresh list to be sure
			fetchAds();
		} catch (error) {
			console.error("Error deleting ads:", error);
			toast.error("Erro ao excluir anúncios");
		}
	};

	const cancelDelete = () => {
		setDeleteModal({
			isOpen: false,
			ads: [],
			ids: [],
			isBulk: false,
		});
	};

	const toggleBulkStatus = async (newStatus) => {
		try {
			const selectedIds = Array.from(selectedAds);
			const updates = { status: newStatus };

			if (newStatus === "approved") {
				updates.created_at = new Date().toISOString();
			}

			for (const id of selectedIds) {
				const { error } = await supabase
					.from("ads")
					.update(updates)
					.eq("id", id);
				if (error) throw error;
			}

			setAds(
				ads.map((ad) =>
					selectedIds.includes(ad.id) ? { ...ad, ...updates } : ad,
				),
			);

			toast.success(
				`Status atualizado para ${filteredAds.length} anúncios!`,
			);
			// Optional: Clear selection after action? User might want to keep selection.
			// setSelectedAds(new Set());
		} catch (error) {
			console.error("Error updating bulk status:", error);
			toast.error("Erro ao atualizar status em massa");
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

		const matchesStatus =
			filterStatus === "all" || ad.status === filterStatus;

		const matchesCategory =
			filterCategory === "all" || ad.category === filterCategory;

		const matchesDate =
			sortOption !== "date" ||
			!filterDate ||
			new Date(ad.created_at).toISOString().split("T")[0] === filterDate;

		return matchesSearch && matchesStatus && matchesCategory && matchesDate;
	});

	const toggleAdSelection = (id) => {
		const newSelected = new Set(selectedAds);
		if (newSelected.has(id)) {
			newSelected.delete(id);
		} else {
			newSelected.add(id);
		}
		setSelectedAds(newSelected);
	};

	const toggleAllAds = () => {
		if (selectedAds.size === filteredAds.length) {
			setSelectedAds(new Set());
		} else {
			setSelectedAds(new Set(filteredAds.map((ad) => ad.id)));
		}
	};

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
							<div>
								<h1 className="text-2xl font-bold text-navy">
									Gerenciar Anúncios
								</h1>
							</div>
							<div className="flex items-center space-x-4">
								{selectedAds.size > 0 && (
									<>
										{
											/* Show Activate if at least one selected is NOT approved (i.e. is draft) */
											Array.from(selectedAds).some(
												(id) =>
													ads.find((a) => a.id === id)
														?.status !== "approved",
											) && (
												<button
													onClick={() =>
														toggleBulkStatus(
															"approved",
														)
													}
													className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
												>
													<ToggleRight className="w-4 h-4" />
													<span>
														Ativar (
														{selectedAds.size})
													</span>
												</button>
											)
										}
										{
											/* Show Deactivate if at least one selected is approved */
											Array.from(selectedAds).some(
												(id) =>
													ads.find((a) => a.id === id)
														?.status === "approved",
											) && (
												<button
													onClick={() =>
														toggleBulkStatus(
															"draft",
														)
													}
													className="flex items-center space-x-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
												>
													<ToggleLeft className="w-4 h-4" />
													<span>
														Inativar (
														{selectedAds.size})
													</span>
												</button>
											)
										}
										<button
											onClick={deleteSelectedAds}
											className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
										>
											<Trash2 className="w-4 h-4" />
											<span>
												Excluir ({selectedAds.size})
											</span>
										</button>
									</>
								)}
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
					<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
						<div className="flex flex-col sm:flex-row gap-4">
							<div className="flex-1">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
									<input
										type="text"
										placeholder="Buscar anúncios..."
										value={searchTerm}
										onChange={(e) =>
											setSearchTerm(e.target.value)
										}
										className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-primary focus:border-transparent"
									/>
								</div>
							</div>
							<div className="flex items-center space-x-2">
								<Filter className="w-5 h-5 text-gray-500" />
								<select
									value={sortOption}
									onChange={(e) =>
										setSortOption(e.target.value)
									}
									className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-primary focus:border-transparent"
								>
									<option value="newest">
										Mais recentes
									</option>
									<option value="oldest">Mais antigas</option>
									<option value="a-z">
										Ordem alfabética
									</option>
									<option value="date">
										Por data específica
									</option>
								</select>

								{sortOption === "date" && (
									<input
										type="date"
										value={filterDate}
										onChange={(e) =>
											setFilterDate(e.target.value)
										}
										className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-primary focus:border-transparent text-gray-700"
									/>
								)}
								<select
									value={filterCategory}
									onChange={(e) =>
										setFilterCategory(e.target.value)
									}
									className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-primary focus:border-transparent"
								>
									<option value="all">
										Todas Categorias
									</option>
									<option value="banner">Banner</option>
									<option value="sidebar">Sidebar</option>
									<option value="footer">Footer</option>
									<option value="popup">Popup</option>
								</select>
								<select
									value={filterStatus}
									onChange={(e) =>
										setFilterStatus(e.target.value)
									}
									className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-primary focus:border-transparent"
								>
									<option value="all">Todos Status</option>
									<option value="approved">Ativos</option>
									<option value="draft">Inativos</option>
								</select>
							</div>
						</div>
					</div>

					{/* Ads Table */}
					<div className="bg-white rounded-lg shadow-md overflow-hidden">
						{loading ? (
							<div className="flex items-center justify-center py-12">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-primary"></div>
							</div>
						) : filteredAds.length > 0 ? (
							<>
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-6 py-3 text-left">
													<button
														onClick={toggleAllAds}
														className="flex items-center space-x-2 text-xs font-medium text-text-secondary uppercase tracking-wider hover:text-gray-700"
													>
														{selectedAds.size ===
															filteredAds.length &&
														filteredAds.length >
															0 ? (
															<CheckSquare className="w-4 h-4" />
														) : (
															<Square className="w-4 h-4" />
														)}
														<span>Selecionar</span>
													</button>
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
													Anúncio
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
													Categoria
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
													Data
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
													Status
												</th>
												<th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
													Ações
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{filteredAds.map((ad) => (
												<tr
													key={ad.id}
													className="hover:bg-gray-50"
												>
													<td className="px-6 py-4">
														<button
															onClick={() =>
																toggleAdSelection(
																	ad.id,
																)
															}
															className="flex items-center"
														>
															{selectedAds.has(
																ad.id,
															) ? (
																<CheckSquare className="w-4 h-4 text-teal-primary" />
															) : (
																<Square className="w-4 h-4 text-gray-400" />
															)}
														</button>
													</td>
													<td className="px-6 py-4">
														<div className="flex items-center space-x-4">
															{ad.image_url ? (
																<img
																	src={
																		ad.image_url
																	}
																	alt={
																		ad.title
																	}
																	className="w-16 h-16 object-cover rounded-lg shadow-sm"
																/>
															) : (
																<div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
																	<Megaphone className="w-6 h-6 text-gray-400" />
																</div>
															)}
															<div>
																<div className="text-sm font-medium text-navy line-clamp-2">
																	{ad.title}
																</div>
															</div>
														</div>
													</td>
													<td className="px-6 py-4">
														<span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
															{ad.category}
														</span>
													</td>
													<td className="px-6 py-4">
														<div className="text-sm text-text-primary">
															{format(
																new Date(
																	ad.created_at,
																),
																"dd/MM/yyyy",
																{
																	locale: ptBR,
																},
															)}
														</div>
													</td>
													<td className="px-6 py-4">
														<span
															className={`px-2 py-1 text-xs font-medium rounded-full ${
																ad.status ===
																"approved"
																	? "bg-green-100 text-green-800"
																	: "bg-gray-100 text-gray-800"
															}`}
														>
															{ad.status ===
															"approved"
																? "Ativo"
																: "Inativo"}
														</span>
													</td>
													<td className="px-6 py-4 text-right">
														<div className="flex items-center justify-end space-x-2">
															<button
																onClick={() =>
																	deleteAd(
																		ad.id,
																	)
																}
																className="p-2 rounded hover:bg-red-50 transition-colors"
																title="Excluir"
															>
																<Trash2 className="w-5 h-5 text-red-500" />
															</button>

															<button
																onClick={() =>
																	toggleAdStatus(
																		ad.id,
																		ad.status,
																	)
																}
																className="p-1 rounded hover:bg-gray-100 transition-colors"
																title={
																	ad.status ===
																	"approved"
																		? "Desativar"
																		: "Ativar"
																}
															>
																{ad.status ===
																"approved" ? (
																	<ToggleRight className="w-5 h-5 text-green-500" />
																) : (
																	<ToggleLeft className="w-5 h-5 text-gray-400" />
																)}
															</button>

															<Link
																to={`/admin/ads/edit/${ad.id}`}
																className="p-2 rounded hover:bg-gray-100 transition-colors"
																title="Editar"
															>
																<Edit className="w-5 h-5 text-text-secondary" />
															</Link>
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
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
												filteredAds.length,
											)}{" "}
											de {filteredAds.length} anúncios
										</div>
										<div className="flex space-x-2">
											{Array.from(
												{ length: totalPages },
												(_, i) => i + 1,
											).map((page) => (
												<button
													key={page}
													onClick={() =>
														handlePageChange(page)
													}
													className={`px-3 py-1 text-sm border rounded-md ${
														currentPage === page
															? "bg-teal-primary text-white border-teal-primary"
															: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
													} transition-colors`}
												>
													{page}
												</button>
											))}
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
