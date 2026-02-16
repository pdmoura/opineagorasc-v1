import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
	Mail,
	Download,
	Trash2,
	Users,
	ArrowLeft,
	Search,
	X,
	AlertTriangle,
	CheckSquare,
	Square,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Hooks
import { useNewsletters } from "../../hooks/useNewsletters";
import toast from "react-hot-toast";

const ManageNewsletters = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [submitting, setSubmitting] = useState(false);
	const [deleteModal, setDeleteModal] = useState({
		isOpen: false,
		emails: [],
		ids: [],
		isBulk: false,
	});
	const [selectedEmails, setSelectedEmails] = useState(new Set());

	const {
		newsletters,
		loading,
		addNewsletter: addNewsletterHook,
		deleteNewsletter: deleteNewsletterHook,
	} = useNewsletters();

	const newslettersPerPage = 10;

	// Filter and paginate newsletters
	const filteredNewsletters = newsletters.filter((newsletter) =>
		newsletter.email.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	useEffect(() => {
		setTotalPages(
			Math.ceil(filteredNewsletters.length / newslettersPerPage),
		);
	}, [filteredNewsletters, newslettersPerPage]);

	const paginatedNewsletters = filteredNewsletters.slice(
		(currentPage - 1) * newslettersPerPage,
		currentPage * newslettersPerPage,
	);

	const deleteNewsletter = async (id, email) => {
		setDeleteModal({
			isOpen: true,
			emails: [email],
			ids: [id],
			isBulk: false,
		});
	};

	const deleteSelectedNewsletters = async () => {
		const selectedIds = Array.from(selectedEmails);
		const selectedEmailList = newsletters
			.filter((n) => selectedIds.includes(n.id))
			.map((n) => n.email);
		setDeleteModal({
			isOpen: true,
			emails: selectedEmailList,
			ids: selectedIds,
			isBulk: true,
		});
	};

	const confirmDelete = async () => {
		try {
			for (const id of deleteModal.ids) {
				await deleteNewsletterHook(id);
			}
			toast.success(
				deleteModal.isBulk
					? `${deleteModal.ids.length} emails removidos com sucesso!`
					: "Email removido com sucesso!",
			);
			setDeleteModal({
				isOpen: false,
				emails: [],
				ids: [],
				isBulk: false,
			});
			setSelectedEmails(new Set());
		} catch (error) {
			toast.error("Erro ao remover emails");
		}
	};

	const cancelDelete = () => {
		setDeleteModal({ isOpen: false, emails: [], ids: [], isBulk: false });
	};

	const toggleEmailSelection = (id) => {
		const newSelected = new Set(selectedEmails);
		if (newSelected.has(id)) {
			newSelected.delete(id);
		} else {
			newSelected.add(id);
		}
		setSelectedEmails(newSelected);
	};

	const toggleAllEmails = () => {
		if (selectedEmails.size === paginatedNewsletters.length) {
			setSelectedEmails(new Set());
		} else {
			setSelectedEmails(new Set(paginatedNewsletters.map((n) => n.id)));
		}
	};

	const addNewsletter = async (email) => {
		if (!email || !email.trim()) {
			toast.error("Email é obrigatório");
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			toast.error("Por favor, insira um email válido");
			return;
		}

		try {
			setSubmitting(true);
			await addNewsletterHook(email);
			toast.success("Email adicionado com sucesso!");
		} catch (error) {
			toast.error(error.message);
		} finally {
			setSubmitting(false);
		}
	};

	const exportEmails = () => {
		const emails = newsletters.map((n) => n.email).join("\n");
		const blob = new Blob([emails], { type: "text/plain" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `newsletter_emails_${format(new Date(), "dd-MM-yyyy")}.txt`;
		a.click();
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
		toast.success("Emails exportados com sucesso!");
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-primary mx-auto mb-4"></div>
					<p className="text-gray-600">Carregando inscritos...</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<Helmet>
				<title>Gerenciar Newsletter - Opine Agora SC</title>
				<meta
					name="description"
					content="Gerenciamento de inscritos da newsletter do portal Opine Agora SC"
				/>
			</Helmet>

			<div className="min-h-screen bg-gray-50">
				{/* Header */}
				<div className="bg-white shadow-sm border-b border-gray-200">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between items-center py-4">
							<div>
								<h1 className="text-2xl font-bold text-navy">
									Gerenciar Newsletter
								</h1>
								<p className="text-text-secondary">
									{paginatedNewsletters.length} inscrito
									{paginatedNewsletters.length !== 1
										? "s"
										: ""}{" "}
									encontrado
									{paginatedNewsletters.length !== 1
										? "s"
										: ""}
								</p>
							</div>
							<div className="flex items-center space-x-4">
								{selectedEmails.size > 0 && (
									<button
										onClick={deleteSelectedNewsletters}
										className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
									>
										<Trash2 className="w-4 h-4" />
										<span>
											Excluir ({selectedEmails.size})
										</span>
									</button>
								)}
								<button
									onClick={exportEmails}
									disabled={newsletters.length === 0}
									className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<Download className="w-4 h-4" />
									<span>Exportar Emails</span>
								</button>
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
					{/* Add Email Form */}
					<div className="bg-white rounded-lg shadow-md p-6 mb-6">
						<h2 className="text-lg font-semibold text-navy mb-4">
							Adicionar Email
						</h2>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								addNewsletter(e.target.email.value);
							}}
							className="flex gap-4"
						>
							<div className="flex-1">
								<input
									type="email"
									name="email"
									placeholder="Digite o email para adicionar..."
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
									required
								/>
							</div>
							<button
								type="submit"
								disabled={submitting}
								className="px-6 py-2 bg-teal-primary text-white rounded-lg hover:bg-teal-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
							>
								{submitting ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
										<span>Adicionando...</span>
									</>
								) : (
									<>
										<Mail className="w-4 h-4" />
										<span>Adicionar</span>
									</>
								)}
							</button>
						</form>
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
										placeholder="Buscar por email..."
										value={searchTerm}
										onChange={(e) => {
											setSearchTerm(e.target.value);
											setCurrentPage(1);
										}}
										className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Email List */}
					<div className="bg-white rounded-lg shadow-md overflow-hidden">
						{paginatedNewsletters.length > 0 ? (
							<>
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead className="bg-gray-50 border-b border-gray-200">
											<tr>
												<th className="px-6 py-3 text-left">
													<button
														onClick={
															toggleAllEmails
														}
														className="flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
													>
														{selectedEmails.size ===
															paginatedNewsletters.length &&
														paginatedNewsletters.length >
															0 ? (
															<CheckSquare className="w-4 h-4" />
														) : (
															<Square className="w-4 h-4" />
														)}
														<span>Selecionar</span>
													</button>
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Email
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Data de Inscrição
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Status
												</th>
												<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
													Ações
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{paginatedNewsletters.map(
												(newsletter) => (
													<tr
														key={newsletter.id}
														className="hover:bg-gray-50"
													>
														<td className="px-6 py-4">
															<button
																onClick={() =>
																	toggleEmailSelection(
																		newsletter.id,
																	)
																}
																className="flex items-center"
															>
																{selectedEmails.has(
																	newsletter.id,
																) ? (
																	<CheckSquare className="w-4 h-4 text-teal-primary" />
																) : (
																	<Square className="w-4 h-4 text-gray-400" />
																)}
															</button>
														</td>
														<td className="px-6 py-4">
															<div className="text-sm font-medium text-gray-900">
																{
																	newsletter.email
																}
															</div>
														</td>
														<td className="px-6 py-4">
															<div className="text-sm text-text-primary">
																{format(
																	new Date(
																		newsletter.created_at,
																	),
																	"dd 'de' MMMM 'de' yyyy",
																	{
																		locale: ptBR,
																	},
																)}
															</div>
														</td>
														<td className="px-6 py-4">
															<span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
																Ativo
															</span>
														</td>
														<td className="px-6 py-4 text-right">
															<button
																onClick={() =>
																	deleteNewsletter(
																		newsletter.id,
																		newsletter.email,
																	)
																}
																className="text-red-600 hover:text-red-800 transition-colors"
															>
																<Trash2 className="w-4 h-4" />
															</button>
														</td>
													</tr>
												),
											)}
										</tbody>
									</table>
								</div>

								{/* Pagination */}
								{totalPages > 1 && (
									<div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
										<div className="flex-1 flex justify-between sm:hidden">
											<button
												onClick={() =>
													setCurrentPage(
														currentPage - 1,
													)
												}
												disabled={currentPage === 1}
												className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
											>
												Anterior
											</button>
											<button
												onClick={() =>
													setCurrentPage(
														Math.min(
															currentPage + 1,
															totalPages,
														),
													)
												}
												disabled={
													currentPage === totalPages
												}
												className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
											>
												Próxima
											</button>
										</div>
										<div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
											<p className="text-sm text-gray-700">
												Página{" "}
												<span className="font-medium">
													{currentPage}
												</span>{" "}
												de{" "}
												<span className="font-medium">
													{totalPages}
												</span>
											</p>
											<nav
												className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
												aria-label="Pagination"
											>
												<button
													onClick={() =>
														setCurrentPage(
															currentPage - 1,
														)
													}
													disabled={currentPage === 1}
													className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
												>
													Anterior
												</button>
												{/* Page Numbers */}
												{Array.from(
													{ length: totalPages },
													(_, i) => i + 1,
												).map((page) => (
													<button
														key={page}
														onClick={() =>
															setCurrentPage(page)
														}
														className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
															currentPage === page
																? "z-10 bg-teal-primary border-teal-primary text-white"
																: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
														}`}
													>
														{page}
													</button>
												))}
												<button
													onClick={() =>
														setCurrentPage(
															Math.min(
																currentPage + 1,
																totalPages,
															),
														)
													}
													disabled={
														currentPage ===
														totalPages
													}
													className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
												>
													Próxima
												</button>
											</nav>
										</div>
									</div>
								)}
							</>
						) : (
							<div className="text-center py-12">
								<Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
								<h3 className="text-lg font-medium text-navy mb-2">
									Nenhum inscrito encontrado
								</h3>
								<p className="text-text-secondary mb-6">
									{searchTerm
										? "Tente ajustar os filtros ou busca."
										: "Nenhum email cadastrado na newsletter."}
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
										<AlertTriangle className="w-6 h-6 text-red-600" />
									</div>
									<div>
										<p className="text-gray-900 font-medium">
											{deleteModal.isBulk
												? `Tem certeza que deseja remover ${deleteModal.emails.length} emails?`
												: "Tem certeza que deseja remover este email?"}
										</p>
										<div className="text-gray-600 text-sm mt-1">
											{deleteModal.isBulk ? (
												<div className="max-h-32 overflow-y-auto">
													{deleteModal.emails.map(
														(email, index) => (
															<div key={index}>
																• {email}
															</div>
														),
													)}
												</div>
											) : (
												deleteModal.emails[0]
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

export default ManageNewsletters;
