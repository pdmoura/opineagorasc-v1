import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
	Save,
	ArrowLeft,
	Upload,
	X,
	Megaphone,
	Calendar,
	Globe,
	Phone,
	Mail,
	MapPin,
	Image as ImageIcon,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Hooks
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

const AdForm = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const isEditing = Boolean(id);

	const [formData, setFormData] = useState({
		title: "",
		slug: "",
		content: "",
		category: "banner",
		link_url: "",
		image_url: "",
		status: "approved",
		start_date: format(new Date(), "yyyy-MM-dd"),
		end_date: format(
			new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
			"yyyy-MM-dd",
		), // 30 days from now
	});

	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [imagePreview, setImagePreview] = useState("");

	useEffect(() => {
		if (isEditing) {
			fetchAd();
		}
	}, [id, isEditing]);

	const fetchAd = async () => {
		try {
			setLoading(true);
			const { data, error } = await supabase
				.from("ads")
				.select("*")
				.eq("id", id)
				.single();

			if (error) throw error;

			if (data) {
				setFormData({
					title: data.title || "",
					slug: data.slug || "",
					content: data.content || "",
					category: data.category || "banner",
					link_url: data.link_url || "",
					image_url: data.image_url || "",
					status: data.status || "approved",
					start_date: data.start_date
						? (() => {
								const date = new Date(data.start_date);
								if (isNaN(date.getTime())) {
									return format(new Date(), "yyyy-MM-dd");
								}
								return date.toISOString().split("T")[0];
							})()
						: format(new Date(), "yyyy-MM-dd"),
					end_date: data.end_date
						? (() => {
								const date = new Date(data.end_date);
								if (isNaN(date.getTime())) {
									return format(
										new Date(
											Date.now() +
												30 * 24 * 60 * 60 * 1000,
										),
										"yyyy-MM-dd",
									);
								}
								return date.toISOString().split("T")[0];
							})()
						: format(
								new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
								"yyyy-MM-dd",
							),
				});
				setImagePreview(data.image_url || "");
			}
		} catch (error) {
			console.error("Error fetching ad:", error);
			toast.error("Erro ao carregar anúncio");
			navigate("/admin/ads");
		} finally {
			setLoading(false);
		}
	};

	const generateSlug = (title) => {
		return title
			.toLowerCase()
			.replace(/[^\w\s-]/g, "")
			.replace(/[\s_-]+/g, "-")
			.replace(/^-+|-+$/g, "");
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Auto-generate slug from title
		if (name === "title") {
			setFormData((prev) => ({
				...prev,
				slug: generateSlug(value),
			}));
		}

		// Update image preview
		if (name === "image_url") {
			setImagePreview(value);
		}

		// Debug para datas
		if (name === "start_date" || name === "end_date") {
			console.log(`📅 ${name} changed to:`, value);
		}
	};

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith("image/")) {
			toast.error("Por favor, selecione uma imagem válida");
			return;
		}

		// Validate file size (5MB max)
		if (file.size > 5 * 1024 * 1024) {
			toast.error("A imagem deve ter no máximo 5MB");
			return;
		}

		try {
			setLoading(true);

			// Create a simple preview (in production, you'd upload to a service like Cloudinary)
			const reader = new FileReader();
			reader.onloadend = () => {
				const preview = reader.result;
				setImagePreview(preview);
				setFormData((prev) => ({
					...prev,
					image_url: preview,
				}));
			};
			reader.readAsDataURL(file);

			toast.success("Imagem carregada com sucesso!");
		} catch (error) {
			console.error("Error uploading image:", error);
			toast.error("Erro ao carregar imagem");
		} finally {
			setLoading(false);
		}
	};

	const removeImage = () => {
		setImagePreview("");
		setFormData((prev) => ({
			...prev,
			image_url: "",
		}));
	};

	const validateForm = () => {
		if (!formData.title.trim()) {
			toast.error("O título é obrigatório");
			return false;
		}

		if (!formData.content.trim()) {
			toast.error("O conteúdo é obrigatório");
			return false;
		}

		if (!formData.start_date || !formData.end_date) {
			toast.error("As datas de início e fim são obrigatórias");
			return false;
		}

		if (new Date(formData.start_date) > new Date(formData.end_date)) {
			toast.error("A data de início deve ser anterior à data de fim");
			return false;
		}

		return true;
	};

	const handleSave = async (publish = false) => {
		if (!validateForm()) return;

		try {
			setSaving(true);

			const adData = {
				...formData,
				status: publish ? "approved" : "draft",
				updated_at: new Date().toISOString(),
			};

			let result;

			if (isEditing) {
				result = await supabase
					.from("ads")
					.update(adData)
					.eq("id", id)
					.select()
					.single();
			} else {
				adData.created_at = new Date().toISOString();
				result = await supabase
					.from("ads")
					.insert(adData)
					.select()
					.single();
			}

			if (result.error) throw result.error;

			toast.success(
				publish
					? "Anúncio publicado com sucesso!"
					: "Anúncio salvo como rascunho!",
			);
			navigate("/admin/ads");
		} catch (error) {
			console.error("Error saving ad:", error);
			toast.error("Erro ao salvar anúncio");
		} finally {
			setSaving(false);
		}
	};

	const categories = [
		{ value: "banner", label: "Banner" },
		{ value: "sidebar", label: "Sidebar" },
		{ value: "footer", label: "Footer" },
		{ value: "popup", label: "Popup" },
	];

	return (
		<>
			<Helmet>
				<title>
					{isEditing ? "Editar Anúncio" : "Novo Anúncio"} - Opine
					Agora SC
				</title>
				<meta
					name="description"
					content={`${isEditing ? "Editar" : "Criar"} anúncio no portal Opine Agora SC`}
				/>
			</Helmet>

			<div className="min-h-screen bg-gray-50">
				{/* Header */}
				<div className="bg-white shadow-sm border-b border-gray-200">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between items-center py-4">
							<div className="flex items-center space-x-4">
								<button
									onClick={() => navigate("/admin/ads")}
									className="flex items-center space-x-2 text-teal-primary hover:text-teal-900 font-medium"
								>
									<ArrowLeft className="w-4 h-4" />
									<span>Voltar</span>
								</button>
								<div>
									<h1 className="text-2xl font-bold text-navy">
										{isEditing
											? "Editar Anúncio"
											: "Novo Anúncio"}
									</h1>
									<p className="text-text-secondary">
										{isEditing
											? "Edite as informações do anúncio"
											: "Preencha as informações para criar um novo anúncio"}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="bg-white rounded-lg shadow-md">
						<div className="p-6 space-y-6">
							{/* Basic Information */}
							<div>
								<h2 className="text-lg font-semibold text-navy mb-4">
									Informações Básicas
								</h2>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{/* Title */}
									<div className="md:col-span-2">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Título do Anúncio *
										</label>
										<input
											type="text"
											name="title"
											value={formData.title}
											onChange={handleInputChange}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
											placeholder="Título do anúncio"
											required
										/>
									</div>

									{/* Category */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Categoria
										</label>
										<select
											name="category"
											value={formData.category}
											onChange={handleInputChange}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
										>
											{categories.map((cat) => (
												<option
													key={cat.value}
													value={cat.value}
												>
													{cat.label}
												</option>
											))}
										</select>
									</div>

									{/* Status */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Status
										</label>
										<select
											name="status"
											value={formData.status}
											onChange={handleInputChange}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
										>
											<option value="draft">
												Rascunho
											</option>
											<option value="approved">
												Aprovado
											</option>
											<option value="archived">
												Arquivado
											</option>
										</select>
									</div>

									{/* Content */}
									<div className="md:col-span-2">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Conteúdo *
										</label>
										<textarea
											name="content"
											value={formData.content}
											onChange={handleInputChange}
											rows={4}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
											placeholder="Conteúdo do anúncio"
											required
										/>
									</div>
								</div>
							</div>

							{/* Link URL */}
							<div>
								<h2 className="text-lg font-semibold text-navy mb-4">
									Link do Anúncio
								</h2>
								<input
									type="url"
									name="link_url"
									value={formData.link_url}
									onChange={handleInputChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
									placeholder="https://exemplo.com/anuncio"
								/>
							</div>

							{/* Image */}
							<div>
								<h2 className="text-lg font-semibold text-navy mb-4">
									Imagem do Anúncio
								</h2>

								<div className="space-y-4">
									{/* Image Upload */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Upload de Imagem
										</label>
										<div className="flex items-center space-x-4">
											<label className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
												<Upload className="w-4 h-4 mr-2" />
												<span>Selecionar Imagem</span>
												<input
													type="file"
													accept="image/*"
													onChange={handleImageUpload}
													className="hidden"
												/>
											</label>
										</div>
									</div>

									{/* Image URL */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Ou URL da Imagem
										</label>
										<input
											type="url"
											name="image_url"
											value={formData.image_url}
											onChange={handleInputChange}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
											placeholder="https://exemplo.com/imagem.jpg"
										/>
									</div>

									{/* Image Preview */}
									{imagePreview && (
										<div className="relative">
											<img
												src={imagePreview}
												alt="Preview"
												className="w-full max-w-md rounded-lg shadow-md"
											/>
											<button
												onClick={removeImage}
												className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
												title="Remover imagem"
											>
												<X className="w-4 h-4" />
											</button>
										</div>
									)}
								</div>
							</div>

							{/* Dates */}
							<div>
								<h2 className="text-lg font-semibold text-navy mb-4">
									Período de Exibição
								</h2>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{/* Start Date */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Data de Início *
										</label>
										<input
											type="date"
											name="start_date"
											value={formData.start_date}
											onChange={handleInputChange}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
											required
										/>
									</div>

									{/* End Date */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Data de Fim *
										</label>
										<input
											type="date"
											name="end_date"
											value={formData.end_date}
											onChange={handleInputChange}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
											required
										/>
									</div>
								</div>
							</div>

							{/* Actions */}
							<div className="flex items-center justify-between pt-6 border-t border-gray-200">
								<button
									onClick={() => navigate("/admin/ads")}
									className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
								>
									Cancelar
								</button>

								<div className="flex items-center space-x-4">
									<button
										onClick={() => handleSave(false)}
										disabled={saving}
										className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{saving
											? "Salvando..."
											: "Salvar Rascunho"}
									</button>

									<button
										onClick={() => handleSave(true)}
										disabled={saving}
										className="px-6 py-2 bg-teal-primary text-white rounded-lg hover:bg-teal-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{saving
											? "Publicando..."
											: "Publicar Anúncio"}
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

export default AdForm;
