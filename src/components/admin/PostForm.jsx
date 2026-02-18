import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
	Save,
	Eye,
	ArrowLeft,
	Calendar,
	User,
	Tag,
	FileText,
	Globe,
	ToggleLeft,
	ToggleRight,
	Image,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Components
import BlockEditor from "./BlockEditor";
import ImageUploadDirect from "./ImageUploadDirect";

// Hooks
import { supabase } from "../../lib/supabase";
import { generateSlug } from "../../lib/utils";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const PostForm = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const returnPage = location.state?.returnPage || 1;
	const isEditing = Boolean(id);
	const { user } = useAuth();

	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [tagsInput, setTagsInput] = useState("");
	const [showSeo, setShowSeo] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		excerpt: "",
		content: JSON.stringify([]),
		category: "",
		author: "",
		image: "",
		featured: false,
		status: "draft",
		slug: "",
		tags: [],
		meta_title: "",
		meta_description: "",
		meta_keywords: "",
	});

	const [categories] = useState([
		"Política",
		"Economia",
		"Sociedade",
		"Esportes",
		"Cultura",
		"Opinião",
		"Tecnologia",
		"Saúde",
		"Educação",
	]);

	useEffect(() => {
		if (isEditing) {
			fetchPost();
		}
	}, [id]);

	const fetchPost = async () => {
		try {
			setLoading(true);
			const { data, error } = await supabase
				.from("posts")
				.select("*")
				.eq("id", id)
				.single();

			if (error) throw error;

			// Ensure content is valid JSON
			let validContent = "[]";
			if (data.content) {
				try {
					const parsed = JSON.parse(data.content);
					validContent = JSON.stringify(parsed); // Re-serialize to ensure valid JSON
				} catch (error) {
					console.error("Invalid content JSON in database:", error);
					console.error("Content that failed:", data.content);
					validContent = "[]";
				}
			}

			setFormData({
				...data,
				content: validContent,
				tags: data.tags || [],
			});
			setTagsInput((data.tags || []).join(", "));
		} catch (error) {
			console.error("Error fetching post:", error);
			toast.error("Erro ao carregar matéria");
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));

		// Auto-generate slug when title changes
		if (field === "title" && !isEditing) {
			const newSlug = generateSlug(value);
			setFormData((prev) => ({
				...prev,
				slug: newSlug,
			}));
		}
	};

	const handleTagsChange = (value) => {
		setTagsInput(value);
		const tags = value
			.split(",")
			.map((tag) => tag.trim())
			.filter(Boolean);
		handleChange("tags", tags);
	};

	const validateForm = () => {
		if (!formData.title.trim()) {
			toast.error("O título é obrigatório");
			return false;
		}

		if (!formData.excerpt.trim()) {
			toast.error("O resumo é obrigatório");
			return false;
		}

		if (!formData.category) {
			toast.error("A categoria é obrigatória");
			return false;
		}

		if (!formData.author.trim()) {
			// Autor não é obrigatório - pode ficar em branco
			return true;
		}

		try {
			const content = JSON.parse(formData.content || "[]");
			if (!Array.isArray(content) || content.length === 0) {
				toast.error("Adicione pelo menos um bloco de conteúdo");
				return false;
			}
		} catch (error) {
			toast.error("O conteúdo está em formato inválido");
			return false;
		}

		return true;
	};

	const handleSave = async (publish = false) => {
		if (!validateForm()) return;

		// Verificar se usuário está autenticado
		if (!user) {
			toast.error("Você precisa estar autenticado para salvar matérias");
			navigate("/login");
			return;
		}

		try {
			setSaving(true);

			// SEO Auto-generation logic if fields are empty
			const metaTitle =
				formData.meta_title || formData.title.substring(0, 60);
			const metaDescription =
				formData.meta_description || formData.excerpt.substring(0, 160);
			const metaKeywords =
				formData.meta_keywords ||
				(formData.tags && formData.tags.length > 0
					? formData.tags.join(", ")
					: formData.category);

			const postData = {
				...formData,
				meta_title: metaTitle,
				meta_description: metaDescription,
				meta_keywords: metaKeywords,
				status: publish ? "published" : "draft",
				date: formData.date || new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};

			let result;
			if (isEditing) {
				result = await supabase
					.from("posts")
					.update(postData)
					.eq("id", id)
					.select()
					.single();
			} else {
				result = await supabase
					.from("posts")
					.insert(postData)
					.select()
					.single();
			}

			if (result.error) {
				// Handle duplicate slug error
				if (
					result.error.code === "23505" &&
					result.error.message?.includes("slug")
				) {
					// Append timestamp to slug to make it unique and retry
					const newSlug = `${postData.slug}-${Date.now()}`;
					toast.success(
						"Título duplicado detectado. A URL foi ajustada automaticamente.",
						{ icon: "🔗" },
					);

					const retryData = { ...postData, slug: newSlug };

					if (isEditing) {
						result = await supabase
							.from("posts")
							.update(retryData)
							.eq("id", id)
							.select()
							.single();
					} else {
						result = await supabase
							.from("posts")
							.insert(retryData)
							.select()
							.single();
					}

					if (result.error) throw result.error;
				} else {
					throw result.error;
				}
			}

			toast.success(
				`Matéria ${id ? "atualizada" : "criada"} com sucesso!`,
			);
			navigate(`/admin/posts?page=${returnPage}`, {
				state: { refresh: Date.now() },
			});
		} catch (error) {
			console.error("Error saving post:", error);
			toast.error(
				"Erro ao salvar matéria: " +
					(error.message || "Erro desconhecido"),
			);
		} finally {
			setSaving(false);
		}
	};

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
				<title>
					{isEditing ? "Editar Matéria" : "Nova Matéria"} - Opine
					Agora SC
				</title>
			</Helmet>

			<div className="min-h-screen bg-gray-50">
				{/* Header */}
				<div className="bg-white shadow-sm border-b border-gray-200">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between items-center py-4">
							<div>
								<h1 className="text-2xl font-bold text-navy">
									{id ? "Editar Matéria" : "Nova Matéria"}
								</h1>
								<p className="text-text-secondary">
									{formData.status === "published"
										? "Publicado"
										: "Rascunho"}
								</p>
							</div>

							<div className="flex items-center space-x-2">
								<button
									onClick={() =>
										navigate(
											`/admin/posts?page=${returnPage}`,
										)
									}
									className="btn-outline flex items-center space-x-2"
								>
									<ArrowLeft className="w-4 h-4" />
									<span>Voltar</span>
								</button>

								<button
									onClick={() => handleSave(false)}
									disabled={saving}
									className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
								>
									<Save className="w-4 h-4" />
									<span>
										{saving
											? "Salvando..."
											: "Salvar Rascunho"}
									</span>
								</button>

								<button
									onClick={() => handleSave(true)}
									disabled={saving}
									className="btn-primary flex items-center space-x-2 disabled:opacity-50"
								>
									<Globe className="w-4 h-4" />
									<span>
										{saving ? "Publicando..." : "Publicar"}
									</span>
								</button>
							</div>
						</div>
					</div>
				</div>

				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="space-y-8">
						{/* Basic Information */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<h2 className="text-lg font-semibold text-navy mb-6 flex items-center space-x-2">
								<FileText className="w-5 h-5" />
								<span>Informações Básicas</span>
							</h2>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="md:col-span-2">
									<label className="block text-sm font-medium text-navy mb-2">
										Título *
									</label>
									<input
										type="text"
										value={formData.title}
										onChange={(e) =>
											handleChange(
												"title",
												e.target.value,
											)
										}
										placeholder="Digite o título da matéria..."
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
									/>
								</div>

								<div className="md:col-span-2">
									<label className="block text-sm font-medium text-navy mb-2">
										Resumo *
									</label>
									<textarea
										value={formData.excerpt}
										onChange={(e) =>
											handleChange(
												"excerpt",
												e.target.value,
											)
										}
										placeholder="Digite um resumo da matéria (será exibido na listagem)..."
										rows={3}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent resize-none"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-navy mb-2">
										Categoria *
									</label>
									<select
										value={formData.category}
										onChange={(e) =>
											handleChange(
												"category",
												e.target.value,
											)
										}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
									>
										<option value="">
											Selecione uma categoria
										</option>
										{categories.map((category) => (
											<option
												key={category}
												value={category}
											>
												{category}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-navy mb-2">
										Autor *
									</label>
									<input
										type="text"
										value={formData.author}
										onChange={(e) =>
											handleChange(
												"author",
												e.target.value,
											)
										}
										placeholder="Nome do autor..."
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-navy mb-2">
										URL Amigável (Slug)
									</label>
									<input
										type="text"
										value={formData.slug}
										onChange={(e) =>
											handleChange("slug", e.target.value)
										}
										placeholder="url-amigavel-da-materia"
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-navy mb-2">
										Tags
									</label>
									<input
										type="text"
										value={tagsInput}
										onChange={(e) =>
											handleTagsChange(e.target.value)
										}
										placeholder="tag1, tag2, tag3"
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
									/>
									<p className="text-xs text-text-secondary mt-1">
										Separe as tags com vírgula
									</p>
								</div>
							</div>
						</div>

						{/* Featured Image */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<h2 className="text-lg font-semibold text-navy mb-6 flex items-center space-x-2">
								<Image className="w-5 h-5" />
								<span>Imagem Destaque</span>
							</h2>

							<ImageUploadDirect
								value={formData.image || ""}
								onChange={(url) => handleChange("image", url)}
								placeholder="Clique para fazer upload da imagem destaque"
								aspectRatio="16:9"
							/>
						</div>

						{/* Content Editor */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<BlockEditor
								value={
									formData.content
										? (() => {
												try {
													return JSON.parse(
														formData.content,
													);
												} catch (error) {
													console.error(
														"Error parsing content JSON:",
														error,
													);
													return [];
												}
											})()
										: []
								}
								onChange={(blocks) =>
									handleChange(
										"content",
										JSON.stringify(blocks),
									)
								}
							/>
						</div>

						{/* SEO Settings (Optional) */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<button
								onClick={() => setShowSeo(!showSeo)}
								className="w-full flex items-center justify-between text-lg font-semibold text-navy mb-2 focus:outline-none"
							>
								<div className="flex items-center space-x-2">
									<Globe className="w-5 h-5" />
									<span>Configurações de SEO (Opcional)</span>
								</div>
								{showSeo ? (
									<ToggleRight className="w-5 h-5 text-teal-primary" />
								) : (
									<ToggleLeft className="w-5 h-5 text-gray-400" />
								)}
							</button>

							{showSeo && (
								<div className="space-y-6 mt-6 border-t pt-6 transition-all duration-300">
									<div>
										<label className="block text-sm font-medium text-navy mb-2">
											Meta Título
										</label>
										<input
											type="text"
											value={formData.meta_title || ""}
											onChange={(e) =>
												handleChange(
													"meta_title",
													e.target.value,
												)
											}
											placeholder={`Padrão: ${formData.title.substring(0, 60)}`}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
										/>
										<p className="text-xs text-text-secondary mt-1">
											Título que aparecerá nos resultados
											de busca do Google (Ideal: até 60
											caracteres)
										</p>
									</div>

									<div>
										<label className="block text-sm font-medium text-navy mb-2">
											Meta Descrição
										</label>
										<textarea
											value={
												formData.meta_description || ""
											}
											onChange={(e) =>
												handleChange(
													"meta_description",
													e.target.value,
												)
											}
											placeholder={`Padrão: ${formData.excerpt.substring(0, 160)}`}
											rows={2}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent resize-none"
										/>
										<p className="text-xs text-text-secondary mt-1">
											Resumo que aparecerá nos resultados
											de busca (Ideal: até 160 caracteres)
										</p>
									</div>

									<div>
										<label className="block text-sm font-medium text-navy mb-2">
											Palavras-chave (Keywords)
										</label>
										<input
											type="text"
											value={formData.meta_keywords || ""}
											onChange={(e) =>
												handleChange(
													"meta_keywords",
													e.target.value,
												)
											}
											placeholder={`Padrão: ${formData.tags.join(", ") || formData.category}`}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
										/>
										<p className="text-xs text-text-secondary mt-1">
											Separe com vírgulas (Ex: política,
											eleições, sc)
										</p>
									</div>
								</div>
							)}
							{!showSeo && (
								<p className="text-sm text-text-secondary">
									Os campos de SEO serão gerados
									automaticamente com base no título, resumo e
									tags se deixados em branco.
								</p>
							)}
						</div>

						{/* Options */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<h2 className="text-lg font-semibold text-navy mb-6">
								Opções
							</h2>

							<div className="space-y-6">
								<div>
									<label className="block text-sm font-medium text-navy mb-2">
										Data de Publicação
									</label>
									<div className="flex items-center gap-2">
										<input
											type="datetime-local"
											value={
												formData.date
													? new Date(formData.date)
															.toISOString()
															.slice(0, 16)
													: ""
											}
											onChange={(e) =>
												handleChange(
													"date",
													new Date(
														e.target.value,
													).toISOString(),
												)
											}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
										/>
										{formData.date && (
											<button
												type="button"
												onClick={() =>
													handleChange("date", "")
												}
												className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
												title="Limpar data (usar data atual)"
											>
												Limpar
											</button>
										)}
									</div>
									<p className="text-xs text-text-secondary mt-1">
										Se deixado em branco, será usada a data
										atual no momento da publicação.
									</p>
								</div>

								<div className="flex items-center justify-between">
									<div>
										<label className="text-sm font-medium text-navy">
											Matéria em Destaque
										</label>
										<p className="text-xs text-text-secondary">
											Será exibida na página inicial
										</p>
									</div>
									<button
										onClick={() =>
											handleChange(
												"featured",
												!formData.featured,
											)
										}
										className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
											formData.featured
												? "bg-teal-primary"
												: "bg-gray-200"
										}`}
									>
										<span
											className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
												formData.featured
													? "translate-x-6"
													: "translate-x-1"
											}`}
										/>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default PostForm;
