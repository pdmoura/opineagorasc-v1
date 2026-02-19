import { useState, useEffect } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
	Plus,
	Edit,
	Trash2,
	Eye,
	Search,
	Filter,
	Calendar,
	FileText,
	ToggleLeft,
	ToggleRight,
	ArrowLeft,
	X,
	CheckSquare,
	Square,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ReactMarkdown from "react-markdown";

// Components
import CarouselPreview from "../../components/admin/preview/CarouselPreview";
import Pagination from "../../components/admin/Pagination";

// Hooks
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

const ManagePosts = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");
	const [sortBy, setSortBy] = useState("latest"); // Novo estado para ordenação
	const [searchParams, setSearchParams] = useSearchParams();
	const location = useLocation();
	const [currentPage, setCurrentPage] = useState(
		parseInt(searchParams.get("page") || "1"),
	);
	const [totalPages, setTotalPages] = useState(0);
	const [totalPosts, setTotalPosts] = useState(0);
	const [previewPost, setPreviewPost] = useState(null);
	const [deleteModal, setDeleteModal] = useState({
		isOpen: false,
		posts: [],
		ids: [],
		isBulk: false,
	});
	const [selectedPosts, setSelectedPosts] = useState(new Set());
	const [error, setError] = useState(null);

	// Function to render content blocks
	const renderContentBlocks = (content) => {
		if (!content) return null;

		try {
			const blocks =
				typeof content === "string" ? JSON.parse(content) : content;

			if (!Array.isArray(blocks)) return null;

			return blocks.map((block) => {
				switch (block.type) {
					case "text":
						return (
							<div key={block.id} className="mb-6">
								<div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
									<ReactMarkdown>
										{block.data.content}
									</ReactMarkdown>
								</div>
							</div>
						);

					// Handle both "image" (legacy/incorrect) and "fullImage" (correct)
					case "image":
					case "fullImage":
						if (!block.data.imageUrl) return null;
						return (
							<div key={block.id} className="mb-6">
								<img
									src={block.data.imageUrl}
									alt={block.data.alt || ""}
									className="w-full h-auto rounded-lg shadow-md"
								/>
								{block.data.caption && (
									<p className="text-center text-sm text-gray-500 mt-2 italic">
										{block.data.caption}
									</p>
								)}
							</div>
						);

					case "imageText":
						return (
							<div key={block.id} className="mb-6 clearfix">
								<div
									className={`relative w-full lg:w-1/2 mb-4 ${
										block.data.align === "right"
											? "lg:float-right lg:ml-6"
											: "lg:float-left lg:mr-6"
									}`}
								>
									<img
										src={block.data.imageUrl}
										alt={block.data.alt || ""}
										className="w-full h-auto rounded-lg shadow-md"
									/>
								</div>
								<div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
									<ReactMarkdown>
										{block.data.text}
									</ReactMarkdown>
								</div>
							</div>
						);

					case "imagemComLink":
						if (!block.data.imageUrl || !block.data.linkUrl)
							return null;
						return (
							<div key={block.id} className="mb-6">
								<a
									href={block.data.linkUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="block group"
								>
									<div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
										<img
											src={block.data.imageUrl}
											alt={block.data.alt || ""}
											className="w-full h-auto object-cover transition-transform group-hover:scale-105"
										/>
									</div>
									{block.data.caption && (
										<p className="text-sm text-gray-600 mt-2 text-center italic">
											{block.data.caption}
										</p>
									)}
								</a>
							</div>
						);

					case "button":
						return (
							<div key={block.id} className="mb-6 text-center">
								<a
									href={block.data.url}
									target="_blank"
									rel="noopener noreferrer"
									className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors ${
										block.data.style === "primary"
											? "bg-teal-primary text-white hover:bg-teal-900"
											: "border border-gray-300 text-gray-700 hover:bg-gray-50"
									}`}
								>
									{block.data.text}
								</a>
							</div>
						);

					case "capa":
						if (
							!block.data.imageUrl ||
							block.data.showInBody === false
						)
							return null;

						return (
							<div key={block.id} className="mb-6">
								<img
									src={block.data.imageUrl}
									alt={block.data.alt || ""}
									className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
								/>
								{block.data.title && (
									<h2 className="text-2xl md:text-3xl font-bold text-navy mt-4 mb-2">
										{block.data.title}
									</h2>
								)}
							</div>
						);

					case "carousel":
						const images =
							block.data.images?.filter((img) => img.url) || [];
						if (images.length === 0) return null;

						return (
							<CarouselPreview key={block.id} images={images} />
						);

					case "video":
						if (!block.data.videoUrl) return null;
						const videoId = block.data.videoUrl.match(
							/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
						)?.[1];
						if (!videoId) return null;

						return (
							<div
								key={block.id}
								className="mb-6 aspect-video rounded-xl overflow-hidden shadow-lg"
							>
								<iframe
									src={`https://www.youtube.com/embed/${videoId}`}
									className="w-full h-full"
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								/>
							</div>
						);

					case "ad":
						if (!block.data.code) return null;
						return (
							<div
								key={block.id}
								className="mb-6 p-4 bg-gray-100 rounded-lg text-center"
							>
								<div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
									Publicidade
								</div>
								<div
									dangerouslySetInnerHTML={{
										__html: block.data.code,
									}}
								/>
							</div>
						);

					default:
						return null;
				}
			});
		} catch (error) {
			console.error("Error parsing content blocks:", error);
			return (
				<div className="text-red-500">Erro ao renderizar conteúdo</div>
			);
		}
	};

	const postsPerPage = 10;

	// Sync page with URL
	useEffect(() => {
		setSearchParams({ page: currentPage.toString() });
	}, [currentPage]);

	// Fetch posts
	useEffect(() => {
		fetchPosts();
	}, [
		searchTerm,
		filterStatus,
		currentPage,
		sortBy,
		location.key,
		location.state?.refresh,
	]); // Adicionado location.state?.refresh para garantir atualização ao voltar do form

	const fetchPosts = async () => {
		try {
			setLoading(true);

			// 1. Base query for data (with pagination)
			let dataQuery = supabase.from("posts").select(`
				id,
				title,
				excerpt,
				category,
				author,
				category,
				author,
				created_at,
				date,
				status,
                urgent
			`);

			// 2. Base query for count (no data, no pagination)
			let countQuery = supabase
				.from("posts")
				.select("id", { count: "exact", head: true });

			// Filter function to apply to both queries
			const applyFilters = (query) => {
				if (searchTerm) {
					query = query.or(
						`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`,
					);
				}
				if (filterStatus !== "all") {
					query = query.eq("status", filterStatus);
				}
				return query;
			};

			// Apply filters
			dataQuery = applyFilters(dataQuery);
			countQuery = applyFilters(countQuery);

			// Apply sorting (only for data)
			switch (sortBy) {
				case "latest":
					dataQuery = dataQuery.order("created_at", {
						ascending: false,
					});
					break;
				case "oldest":
					dataQuery = dataQuery.order("created_at", {
						ascending: true,
					});
					break;
				case "title":
					dataQuery = dataQuery.order("title", { ascending: true });
					break;
				case "status":
					dataQuery = dataQuery.order("status", { ascending: true });
					break;
				default:
					dataQuery = dataQuery.order("created_at", {
						ascending: false,
					});
			}

			// Apply pagination (only for data)
			const from = (currentPage - 1) * postsPerPage;
			const to = from + postsPerPage - 1;
			dataQuery = dataQuery.range(from, to);

			// Execute queries in parallel
			const [dataRes, countRes] = await Promise.all([
				dataQuery,
				countQuery,
			]);

			if (dataRes.error) throw dataRes.error;
			if (countRes.error) throw countRes.error;

			setPosts(dataRes.data || []);
			setTotalPosts(countRes.count || 0);
			setTotalPages(Math.ceil((countRes.count || 0) / postsPerPage));
		} catch (error) {
			console.error("Error fetching posts:", error);
			setError(error.message || "Erro desconhecido");
			toast.error("Erro ao carregar matérias");
		} finally {
			setLoading(false);
		}
	};

	const togglePostStatus = async (postId, currentStatus) => {
		try {
			const newStatus =
				currentStatus === "published" ? "draft" : "published";

			const { error } = await supabase
				.from("posts")
				.update({ status: newStatus })
				.eq("id", postId);

			if (error) throw error;

			setPosts(
				posts.map((post) =>
					post.id === postId ? { ...post, status: newStatus } : post,
				),
			);

			toast.success(
				`Matéria ${newStatus === "published" ? "publicada" : "despublicada"} com sucesso!`,
			);
		} catch (error) {
			console.error("Error toggling post status:", error);
			toast.error("Erro ao alterar status da matéria");
		}
	};

	const deletePost = async (postId, postTitle) => {
		setDeleteModal({
			isOpen: true,
			posts: [postTitle],
			ids: [postId],
			isBulk: false,
		});
	};

	const deleteSelectedPosts = async () => {
		const selectedIds = Array.from(selectedPosts);
		const selectedPostList = posts
			.filter((p) => selectedIds.includes(p.id))
			.map((p) => p.title);
		setDeleteModal({
			isOpen: true,
			posts: selectedPostList,
			ids: selectedIds,
			isBulk: true,
		});
	};

	const confirmDelete = async () => {
		try {
			for (const id of deleteModal.ids) {
				await supabase.from("posts").delete().eq("id", id);
			}
			toast.success(
				deleteModal.isBulk
					? `${deleteModal.ids.length} matérias removidas com sucesso!`
					: "Matéria removida com sucesso!",
			);

			// Update local state immediately
			setPosts((prevPosts) =>
				prevPosts.filter((post) => !deleteModal.ids.includes(post.id)),
			);
			setTotalPosts((prev) => Math.max(0, prev - deleteModal.ids.length));

			setDeleteModal({
				isOpen: false,
				posts: [],
				ids: [],
				isBulk: false,
			});
			setSelectedPosts(new Set());

			// Optional: fetch to ensure sync, but UI is already updated
			// fetchPosts();
		} catch (error) {
			console.error("Error deleting posts:", error);
			toast.error("Erro ao remover matérias");
		}
	};

	const cancelDelete = () => {
		setDeleteModal({ isOpen: false, posts: [], ids: [], isBulk: false });
	};

	const togglePostSelection = (id) => {
		const newSelected = new Set(selectedPosts);
		if (newSelected.has(id)) {
			newSelected.delete(id);
		} else {
			newSelected.add(id);
		}
		setSelectedPosts(newSelected);
	};

	const toggleAllPosts = () => {
		if (selectedPosts.size === posts.length) {
			setSelectedPosts(new Set());
		} else {
			setSelectedPosts(new Set(posts.map((p) => p.id)));
		}
	};

	const getStatusBadge = (status) => {
		const styles = {
			published: "bg-green-100 text-green-800",
			draft: "bg-yellow-100 text-yellow-800",
			archived: "bg-gray-100 text-gray-800",
		};

		const labels = {
			published: "Publicado",
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

	if (loading && posts.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-primary"></div>
			</div>
		);
	}

	return (
		<>
			<Helmet>
				<title>Gerenciar Matérias - Opine Agora SC</title>
				<meta
					name="description"
					content="Gerenciamento de matérias do portal Opine Agora SC"
				/>
			</Helmet>

			<div className="min-h-screen bg-gray-50">
				{/* Header */}
				<div className="bg-white shadow-sm border-b border-gray-200">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between items-center py-4">
							<div>
								<h1 className="text-2xl font-bold text-navy">
									Gerenciar Matérias
								</h1>
								<p className="text-text-secondary">
									{totalPosts} matéria
									{totalPosts !== 1 ? "s" : ""} encontrada
									{totalPosts !== 1 ? "s" : ""}
								</p>
							</div>
							<div className="flex items-center space-x-4">
								{selectedPosts.size > 0 && (
									<button
										onClick={deleteSelectedPosts}
										className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
									>
										<Trash2 className="w-4 h-4" />
										<span>
											Excluir ({selectedPosts.size})
										</span>
									</button>
								)}
								<Link
									to="/admin"
									className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
								>
									<ArrowLeft className="w-4 h-4" />
									<span>Voltar</span>
								</Link>
								<Link
									to="/admin/posts/new"
									className="btn-primary flex items-center space-x-2"
								>
									<Plus className="w-4 h-4" />
									<span>Nova Matéria</span>
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
							<div className="flex items-center space-x-4">
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
										<option value="all">
											Todos os status
										</option>
										<option value="published">
											Publicado
										</option>
										<option value="draft">Rascunho</option>
										<option value="archived">
											Arquivado
										</option>
									</select>
								</div>

								<div className="flex items-center space-x-2">
									<Calendar className="w-4 h-4 text-text-secondary" />
									<select
										value={sortBy}
										onChange={(e) => {
											setSortBy(e.target.value);
											setCurrentPage(1);
										}}
										className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
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
										<option value="status">
											Por status
										</option>
									</select>
								</div>
							</div>
						</div>
					</div>

					{/* Posts Table */}
					<div
						className={`bg-white rounded-lg shadow-md overflow-hidden transition-opacity duration-300 ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
					>
						{posts.length > 0 ? (
							<>
								<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-gray-200">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-6 py-3 text-left">
													<button
														onClick={toggleAllPosts}
														className="flex items-center space-x-2 text-xs font-medium text-text-secondary uppercase tracking-wider hover:text-gray-700"
													>
														{selectedPosts.size ===
															posts.length &&
														posts.length > 0 ? (
															<CheckSquare className="w-4 h-4" />
														) : (
															<Square className="w-4 h-4" />
														)}
														<span>Selecionar</span>
													</button>
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
													Matéria
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
													Categoria
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
													Autor
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
											{posts.map((post) => (
												<tr
													key={post.id}
													className="hover:bg-gray-50"
												>
													<td className="px-6 py-4">
														<button
															onClick={() =>
																togglePostSelection(
																	post.id,
																)
															}
															className="flex items-center"
														>
															{selectedPosts.has(
																post.id,
															) ? (
																<CheckSquare className="w-4 h-4 text-teal-primary" />
															) : (
																<Square className="w-4 h-4 text-gray-400" />
															)}
														</button>
													</td>
													<td className="px-6 py-4">
														<div>
															<div className="text-sm font-medium text-navy line-clamp-1 flex items-center">
																{post.title}
																{post.urgent && (
																	<span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
																		Urgente
																	</span>
																)}
															</div>
															{post.excerpt && (
																<div className="text-sm text-text-secondary line-clamp-2">
																	{
																		post.excerpt
																	}
																</div>
															)}
														</div>
													</td>
													<td className="px-6 py-4">
														<span className="text-sm text-text-primary">
															{post.category ||
																"Sem categoria"}
														</span>
													</td>
													<td className="px-6 py-4">
														<span className="text-sm text-text-primary">
															{post.author ||
																"Sem autor"}
														</span>
													</td>
													<td className="px-6 py-4">
														<div className="text-sm text-text-primary">
															{format(
																new Date(
																	post.date ||
																		post.created_at,
																),
																"dd/MM/yyyy",
																{
																	locale: ptBR,
																},
															)}
														</div>
													</td>
													<td className="px-6 py-4">
														{getStatusBadge(
															post.status,
														)}
													</td>
													<td className="px-6 py-4 text-right">
														<div className="flex items-center justify-end space-x-2">
															{/* Delete */}
															<button
																onClick={() =>
																	deletePost(
																		post.id,
																		post.title,
																	)
																}
																className="p-2 rounded hover:bg-red-50 transition-colors"
																title="Excluir"
															>
																<Trash2 className="w-5 h-5 text-red-500" />
															</button>
															{/* Toggle Status */}
															<button
																onClick={() =>
																	togglePostStatus(
																		post.id,
																		post.status,
																	)
																}
																className="p-1 rounded hover:bg-gray-100 transition-colors"
																title={
																	post.status ===
																	"published"
																		? "Despublicar"
																		: "Publicar"
																}
															>
																{post.status ===
																"published" ? (
																	<ToggleRight className="w-5 h-5 text-green-500" />
																) : (
																	<ToggleLeft className="w-5 h-5 text-gray-400" />
																)}
															</button>

															{/* Preview */}
															<button
																onClick={async () => {
																	try {
																		const {
																			data,
																			error,
																		} =
																			await supabase
																				.from(
																					"posts",
																				)
																				.select(
																					"*",
																				)
																				.eq(
																					"id",
																					post.id,
																				)
																				.single();
																		if (
																			data
																		) {
																			setPreviewPost(
																				data,
																			);
																		}
																	} catch (e) {
																		console.error(
																			"Error fetching preview:",
																			e,
																		);
																		toast.error(
																			"Erro ao carregar prévia",
																		);
																	}
																}}
																className="p-2 rounded hover:bg-gray-100 transition-colors"
																title="Visualizar"
															>
																<Eye className="w-5 h-5 text-text-secondary" />
															</button>

															{/* Edit */}
															<Link
																to={`/admin/posts/edit/${post.id}`}
																state={{
																	returnPage:
																		currentPage,
																}}
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
								<Pagination
									currentPage={currentPage}
									totalPages={totalPages}
									onPageChange={setCurrentPage}
									totalItems={totalPosts}
									itemsPerPage={postsPerPage}
									itemName="matéria"
									itemNamePlural="matérias"
								/>
							</>
						) : (
							<div className="text-center py-12">
								<FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
								<h3 className="text-lg font-medium text-navy mb-2">
									Nenhuma matéria encontrada
								</h3>
								<p className="text-text-secondary mb-6">
									{searchTerm || filterStatus !== "all"
										? "Tente ajustar os filtros ou busca."
										: "Comece criando sua primeira matéria."}
								</p>
								<Link
									to="/admin/posts/new"
									className="btn-primary"
								>
									<Plus className="w-4 h-4 inline mr-2" />
									Criar Matéria
								</Link>
							</div>
						)}
					</div>
				</div>

				{/* Preview Modal */}
				{previewPost && (
					<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
						<div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
							{/* Modal Header */}
							<div className="flex items-center justify-between p-6 border-b border-gray-200">
								<h2 className="text-xl font-semibold text-navy">
									Preview: {previewPost.title}
								</h2>
								<button
									onClick={() => setPreviewPost(null)}
									className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
								>
									<X className="w-5 h-5 text-gray-500" />
								</button>
							</div>

							{/* Modal Content */}
							<div className="flex-1 overflow-y-auto p-6">
								{/* Post Header */}
								<div className="mb-6">
									<h1 className="text-3xl font-bold text-navy mb-4">
										{previewPost.title}
									</h1>
									<div className="flex items-center space-x-4 text-sm text-text-secondary mb-6">
										<span>
											{format(
												new Date(
													previewPost.created_at,
												),
												"dd 'de' MMMM 'de' yyyy",
												{ locale: ptBR },
											)}
										</span>
										{previewPost.author && (
											<span>
												Por: {previewPost.author}
											</span>
										)}
										{previewPost.category && (
											<span className="px-2 py-1 bg-teal-primary text-white rounded-full text-xs">
												{previewPost.category}
											</span>
										)}
									</div>
								</div>

								{/* Post Image */}
								{previewPost.image && (
									<div className="mb-6">
										<img
											src={previewPost.image}
											alt={previewPost.title}
											className="w-full h-64 object-cover rounded-lg"
										/>
									</div>
								)}

								{/* Post Excerpt */}
								{previewPost.excerpt && (
									<div className="mb-6">
										<p className="text-lg text-text-secondary leading-relaxed">
											{previewPost.excerpt}
										</p>
									</div>
								)}

								{/* Post Content */}
								<div className="prose prose-lg max-w-none">
									{previewPost.content &&
										renderContentBlocks(
											previewPost.content,
										)}
								</div>
							</div>

							{/* Modal Footer */}
							<div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
								<div className="text-sm text-text-secondary">
									Preview da matéria - não publicado
								</div>
								<div className="flex items-center space-x-3">
									<a
										href={`/post/${previewPost.slug || previewPost.id}`}
										target="_blank"
										rel="noopener noreferrer"
										className="px-4 py-2 bg-teal-primary text-white rounded-lg hover:bg-teal-900 transition-colors"
									>
										Ver no Site
									</a>
									<button
										onClick={() => setPreviewPost(null)}
										className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
									>
										Fechar
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Delete Confirmation Modal */}
			{deleteModal.isOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-lg max-w-md w-full mx-4">
						<div className="flex items-center justify-between p-6 border-b border-gray-200">
							<h3 className="text-lg font-semibold text-gray-900">
								Confirmar Exclusão
							</h3>
							<button
								onClick={cancelDelete}
								className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
							>
								<X className="w-5 h-5 text-gray-500" />
							</button>
						</div>
						<div className="p-6">
							<div className="flex items-center mb-4">
								<div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
									<Trash2 className="w-6 h-6 text-red-600" />
								</div>
								<div>
									<p className="text-gray-900 font-medium">
										{deleteModal.isBulk
											? `Tem certeza que deseja remover ${deleteModal.posts.length} matérias?`
											: "Tem certeza que deseja remover esta matéria?"}
									</p>
									<div className="text-gray-600 text-sm mt-1">
										{deleteModal.isBulk ? (
											<div className="max-h-32 overflow-y-auto">
												{deleteModal.posts.map(
													(post, index) => (
														<div key={index}>
															• {post}
														</div>
													),
												)}
											</div>
										) : (
											deleteModal.posts[0]
										)}
									</div>
								</div>
							</div>
							<div className="flex justify-end space-x-3">
								<button
									onClick={cancelDelete}
									className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
								>
									Cancelar
								</button>
								<button
									onClick={confirmDelete}
									className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
								>
									Confirmar Exclusão
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ManagePosts;
