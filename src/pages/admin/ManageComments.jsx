import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
	MessageSquare,
	Check,
	X,
	Search,
	Filter,
	Calendar,
	User,
	FileText,
	AlertCircle,
	CheckCircle,
	ArrowLeft,
	Trash2,
	CheckSquare,
	Square,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Hooks
import { useAdminComments } from "../../hooks/useComments";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

// Components
import Pagination from "../../components/admin/Pagination";

const ManageComments = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("pending");
	const [currentPage, setCurrentPage] = useState(1);
	const [deleteModal, setDeleteModal] = useState({
		isOpen: false,
		comments: [],
		ids: [],
		isBulk: false,
	});
	const [selectedComments, setSelectedComments] = useState(new Set());
	const { comments, loading, approveComment, rejectComment, fetchComments } =
		useAdminComments();

	const commentsPerPage = 10;

	// Filter comments based on search and status
	const filteredComments =
		comments?.filter((comment) => {
			const matchesSearch =
				!searchTerm ||
				comment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				comment.email
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				comment.content
					.toLowerCase()
					.includes(searchTerm.toLowerCase());

			const matchesStatus =
				filterStatus === "all" || comment.status === filterStatus;

			return matchesSearch && matchesStatus;
		}) || [];

	// Pagination
	const totalPages = Math.ceil(filteredComments.length / commentsPerPage);
	const startIndex = (currentPage - 1) * commentsPerPage;
	const paginatedComments = filteredComments.slice(
		startIndex,
		startIndex + commentsPerPage,
	);

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, filterStatus]);

	const handleApprove = async (commentId) => {
		const success = await approveComment(commentId);
		if (success) {
			toast.success("Comentário aprovado com sucesso!");
		}
	};

	const handleReject = async (commentId) => {
		const success = await rejectComment(commentId);
		if (success) {
			toast.success("Comentário rejeitado com sucesso!");
		}
	};

	const deleteComment = async (id, comment) => {
		setDeleteModal({
			isOpen: true,
			comments: [comment],
			ids: [id],
			isBulk: false,
		});
	};

	const deleteSelectedComments = async () => {
		const selectedIds = Array.from(selectedComments);
		const selectedCommentList = paginatedComments
			.filter((c) => selectedIds.includes(c.id))
			.map((c) => `${c.name} - ${c.content.substring(0, 50)}...`);
		setDeleteModal({
			isOpen: true,
			comments: selectedCommentList,
			ids: selectedIds,
			isBulk: true,
		});
	};

	const approveSelectedComments = async () => {
		const selectedIds = Array.from(selectedComments);
		try {
			for (const id of selectedIds) {
				await approveComment(id);
			}
			toast.success(
				`${selectedIds.length} comentários aprovados com sucesso!`,
			);
			setSelectedComments(new Set());
		} catch (error) {
			toast.error("Erro ao aprovar comentários");
		}
	};

	const confirmDelete = async () => {
		try {
			for (const id of deleteModal.ids) {
				await supabase.from("comments").delete().eq("id", id);
			}
			toast.success(
				deleteModal.isBulk
					? `${deleteModal.ids.length} comentários removidos com sucesso!`
					: "Comentário removido com sucesso!",
			);
			setDeleteModal({
				isOpen: false,
				comments: [],
				ids: [],
				isBulk: false,
			});
			setSelectedComments(new Set());
			fetchComments();
		} catch (error) {
			toast.error("Erro ao remover comentários");
		}
	};

	const cancelDelete = () => {
		setDeleteModal({ isOpen: false, comments: [], ids: [], isBulk: false });
	};

	const toggleCommentSelection = (id) => {
		const newSelected = new Set(selectedComments);
		if (newSelected.has(id)) {
			newSelected.delete(id);
		} else {
			newSelected.add(id);
		}
		setSelectedComments(newSelected);
	};

	const toggleAllComments = () => {
		if (selectedComments.size === paginatedComments.length) {
			setSelectedComments(new Set());
		} else {
			setSelectedComments(new Set(paginatedComments.map((c) => c.id)));
		}
	};

	const getStatusBadge = (status) => {
		const styles = {
			pending: "bg-orange-100 text-orange-800",
			approved: "bg-green-100 text-green-800",
			rejected: "bg-red-100 text-red-800",
		};

		const labels = {
			pending: "Pendente",
			approved: "Aprovado",
			rejected: "Rejeitado",
		};

		const icons = {
			pending: AlertCircle,
			approved: CheckCircle,
			rejected: X,
		};

		const Icon = icons[status];

		return (
			<span
				className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}
			>
				<Icon className="w-3 h-3" />
				<span>{labels[status]}</span>
			</span>
		);
	};

	const getStats = () => {
		const pending =
			comments?.filter((c) => c.status === "pending").length || 0;
		const approved =
			comments?.filter((c) => c.status === "approved").length || 0;
		const rejected =
			comments?.filter((c) => c.status === "rejected").length || 0;

		return { pending, approved, rejected };
	};

	const stats = getStats();

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-primary"></div>
			</div>
		);
	}

	return (
		<>
			<Helmet>
				<title>Gerenciar Comentários - Opine Agora SC</title>
				<meta
					name="description"
					content="Moderação de comentários do portal Opine Agora SC"
				/>
			</Helmet>

			<div className="min-h-screen bg-gray-50">
				{/* Header */}
				<div className="bg-white shadow-sm border-b border-gray-200">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between items-center py-4">
							<div>
								<h1 className="text-2xl font-bold text-navy">
									Gerenciar Comentários
								</h1>
								<p className="text-text-secondary">
									{filteredComments.length} comentário
									{filteredComments.length !== 1
										? "s"
										: ""}{" "}
									encontrados
								</p>
							</div>
							<div className="flex items-center space-x-4">
								{selectedComments.size > 0 && (
									<>
										<button
											onClick={approveSelectedComments}
											className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
										>
											<Check className="w-4 h-4" />
											<span>
												Aprovar ({selectedComments.size}
												)
											</span>
										</button>
										<button
											onClick={deleteSelectedComments}
											className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
										>
											<Trash2 className="w-4 h-4" />
											<span>
												Excluir ({selectedComments.size}
												)
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
							</div>
						</div>
					</div>
				</div>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{/* Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
						<div className="bg-white rounded-lg shadow-md p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-text-secondary">
										Pendentes
									</p>
									<p className="text-3xl font-bold text-orange-500 mt-2">
										{stats.pending}
									</p>
								</div>
								<div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
									<AlertCircle className="w-6 h-6 text-orange-500" />
								</div>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow-md p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-text-secondary">
										Aprovados
									</p>
									<p className="text-3xl font-bold text-green-500 mt-2">
										{stats.approved}
									</p>
								</div>
								<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
									<Check className="w-6 h-6 text-green-500" />
								</div>
							</div>
						</div>
					</div>

					{/* Filters */}
					<div className="bg-white rounded-lg shadow-md p-6 mb-6">
						<div className="flex flex-col lg:flex-row gap-4">
							{/* Search */}
							<div className="flex-1">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
									<input
										type="text"
										placeholder="Buscar por nome, e-mail ou conteúdo..."
										value={searchTerm}
										onChange={(e) =>
											setSearchTerm(e.target.value)
										}
										className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
									/>
								</div>
							</div>

							{/* Status Filter */}
							<div className="flex items-center space-x-2">
								<Filter className="w-4 h-4 text-text-secondary" />
								<select
									value={filterStatus}
									onChange={(e) =>
										setFilterStatus(e.target.value)
									}
									className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
								>
									<option value="pending">Pendentes</option>
									<option value="approved">Aprovados</option>
									<option value="all">Todos</option>
								</select>
							</div>
						</div>
					</div>

					{/* Comments List */}
					<div className="bg-white rounded-lg shadow-md overflow-hidden">
						{paginatedComments.length > 0 ? (
							<>
								<div className="divide-y divide-gray-200">
									{/* Header with select all */}
									<div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
										<button
											onClick={toggleAllComments}
											className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
										>
											{selectedComments.size ===
												paginatedComments.length &&
											paginatedComments.length > 0 ? (
												<CheckSquare className="w-4 h-4" />
											) : (
												<Square className="w-4 h-4" />
											)}
											<span>
												{selectedComments.size ===
													paginatedComments.length &&
												paginatedComments.length > 0
													? "Deselecionar todos"
													: "Selecionar todos"}
											</span>
										</button>
									</div>
									{paginatedComments.map((comment) => (
										<div
											key={comment.id}
											className="p-6 hover:bg-gray-50"
										>
											<div className="flex items-start justify-between mb-4">
												<div className="flex items-start space-x-3 flex-1">
													<button
														onClick={() =>
															toggleCommentSelection(
																comment.id,
															)
														}
														className="mt-1"
													>
														{selectedComments.has(
															comment.id,
														) ? (
															<CheckSquare className="w-4 h-4 text-teal-primary" />
														) : (
															<Square className="w-4 h-4 text-gray-400" />
														)}
													</button>
													<div className="flex-1">
														<div className="flex items-center space-x-3 mb-2">
															<div className="w-10 h-10 bg-teal-primary rounded-full flex items-center justify-center">
																<span className="text-white font-semibold">
																	{comment.name
																		.charAt(
																			0,
																		)
																		.toUpperCase()}
																</span>
															</div>
															<div>
																<h3 className="font-semibold text-navy">
																	{
																		comment.name
																	}
																</h3>
																<p className="text-sm text-text-secondary">
																	{
																		comment.email
																	}
																</p>
															</div>
														</div>

														<div className="flex items-center space-x-4 mb-3">
															<span className="text-sm text-text-secondary">
																{format(
																	new Date(
																		comment.created_at,
																	),
																	"dd 'de' MMMM 'de' yyyy 'às' HH:mm",
																	{
																		locale: ptBR,
																	},
																)}
															</span>
															{getStatusBadge(
																comment.status,
															)}
														</div>

														<div className="bg-gray-50 rounded-lg p-4 mb-3">
															<p className="text-text-primary leading-relaxed whitespace-pre-wrap">
																{
																	comment.content
																}
															</p>
														</div>

														{comment.posts && (
															<div className="flex items-center space-x-2 text-sm text-text-secondary">
																<FileText className="w-4 h-4" />
																<span>
																	Post:{" "}
																	{
																		comment
																			.posts
																			.title
																	}
																</span>
															</div>
														)}
													</div>
												</div>

												{/* Actions */}
												<div className="flex items-center space-x-2 ml-4">
													<button
														onClick={() =>
															deleteComment(
																comment.id,
																`${comment.name} - ${comment.content.substring(0, 50)}...`,
															)
														}
														className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
														title="Excluir comentário"
													>
														<Trash2 className="w-4 h-4" />
													</button>
													{comment.status ===
														"pending" && (
														<button
															onClick={() =>
																handleApprove(
																	comment.id,
																)
															}
															className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
															title="Aprovar comentário"
														>
															<Check className="w-4 h-4" />
														</button>
													)}
												</div>
											</div>
										</div>
									))}
								</div>

								{/* Pagination */}
								<Pagination
									currentPage={currentPage}
									totalPages={totalPages}
									onPageChange={setCurrentPage}
									totalItems={filteredComments.length}
									itemsPerPage={commentsPerPage}
									itemName="comentário"
									itemNamePlural="comentários"
								/>
							</>
						) : (
							<div className="text-center py-12">
								<MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
								<h3 className="text-lg font-medium text-navy mb-2">
									Nenhum comentário encontrado
								</h3>
								<p className="text-text-secondary">
									{searchTerm || filterStatus !== "pending"
										? "Tente ajustar os filtros ou busca."
										: "Não há comentários pendentes no momento."}
								</p>
							</div>
						)}
					</div>
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
												? `Tem certeza que deseja remover ${deleteModal.comments.length} comentários?`
												: "Tem certeza que deseja remover este comentário?"}
										</p>
										<div className="text-gray-600 text-sm mt-1">
											{deleteModal.isBulk ? (
												<div className="max-h-32 overflow-y-auto">
													{deleteModal.comments.map(
														(comment, index) => (
															<div key={index}>
																• {comment}
															</div>
														),
													)}
												</div>
											) : (
												deleteModal.comments[0]
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
			</div>
		</>
	);
};

export default ManageComments;
