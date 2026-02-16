import { useState } from "react";
import {
	ChevronLeft,
	ChevronRight,
	Plus,
	Trash2,
	ExternalLink,
	Image as ImageIcon,
} from "lucide-react";
import ImageUploadDirect from "../ImageUploadDirect";

const CarouselBlock = ({ data, onChange, preview = false }) => {
	const [currentSlide, setCurrentSlide] = useState(0);

	const handleChange = (field, value) => {
		if (onChange) {
			onChange({ [field]: value });
		}
	};

	const handleImageChange = (index, field, value) => {
		const images = [...(data.images || [])];
		images[index] = { ...images[index], [field]: value };
		handleChange("images", images);
	};

	const addImage = () => {
		const images = [...(data.images || [])];
		images.push({ url: "", alt: "", caption: "", link: "" });
		handleChange("images", images);
	};

	const removeImage = (index) => {
		const images = [...(data.images || [])];
		images.splice(index, 1);
		handleChange("images", images);
		if (currentSlide >= images.length && currentSlide > 0) {
			setCurrentSlide(currentSlide - 1);
		}
	};

	const nextSlide = () => {
		const totalSlides = data.images?.length || 0;
		setCurrentSlide((prev) => (prev + 1) % totalSlides);
	};

	const prevSlide = () => {
		const totalSlides = data.images?.length || 0;
		setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
	};

	const isValidUrl = (url) => {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	};

	if (preview) {
		const images =
			data.images?.filter((img) => img.url && isValidUrl(img.url)) || [];
		if (images.length === 0) return null;

		return (
			<div className="my-6">
				<div className="relative overflow-hidden rounded-lg shadow-md">
					<div className="relative h-96">
						{images.map((image, index) => (
							<div
								key={index}
								className={`absolute inset-0 transition-opacity duration-500 ${
									index === currentSlide
										? "opacity-100"
										: "opacity-0"
								}`}
							>
								{image.link ? (
									<a
										href={image.link}
										target="_blank"
										rel="noopener noreferrer"
										className="block w-full h-full"
									>
										<img
											src={image.url}
											alt={image.alt || ""}
											className="w-full h-full object-cover"
										/>
									</a>
								) : (
									<img
										src={image.url}
										alt={image.alt || ""}
										className="w-full h-full object-cover"
									/>
								)}
							</div>
						))}
					</div>

					{/* Navigation */}
					{images.length > 1 && (
						<>
							<button
								onClick={prevSlide}
								className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
							>
								<ChevronLeft className="w-5 h-5" />
							</button>
							<button
								onClick={nextSlide}
								className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
							>
								<ChevronRight className="w-5 h-5" />
							</button>
						</>
					)}

					{/* Indicators */}
					{images.length > 1 && (
						<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
							{images.map((_, index) => (
								<button
									key={index}
									onClick={() => setCurrentSlide(index)}
									className={`w-2 h-2 rounded-full transition-colors ${
										index === currentSlide
											? "bg-white"
											: "bg-white bg-opacity-50"
									}`}
								/>
							))}
						</div>
					)}

					{/* Caption */}
					{images[currentSlide]?.caption && (
						<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
							<p className="text-white text-sm">
								{images[currentSlide].caption}
							</p>
						</div>
					)}
				</div>
			</div>
		);
	}

	const images = data.images || [];

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<label className="block text-sm font-medium text-navy">
					Imagens do Carrossel
				</label>
				<button
					onClick={addImage}
					className="flex items-center space-x-1 px-3 py-1 bg-teal-primary text-white rounded-lg hover:bg-teal-900 transition-colors"
				>
					<Plus className="w-4 h-4" />
					<span>Adicionar Imagem</span>
				</button>
			</div>

			{images.length === 0 ? (
				<div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
					<ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
					<p className="text-gray-600 mb-4">
						Nenhuma imagem no carrossel
					</p>
					<button
						onClick={addImage}
						className="px-4 py-2 bg-teal-primary text-white rounded-lg hover:bg-teal-900 transition-colors"
					>
						Adicionar Primeira Imagem
					</button>
				</div>
			) : (
				<div className="space-y-4">
					{images.map((image, index) => (
						<div key={index} className="p-4 bg-gray-50 rounded-lg">
							<div className="flex items-center justify-between mb-4">
								<h4 className="font-medium text-navy">
									Imagem {index + 1}
								</h4>
								<button
									onClick={() => removeImage(index)}
									className="text-red-500 hover:text-red-700 transition-colors"
								>
									<Trash2 className="w-4 h-4" />
								</button>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-navy mb-2">
										Imagem
									</label>
									<ImageUploadDirect
										value={image.url || ""}
										onChange={(url) =>
											handleImageChange(index, "url", url)
										}
										placeholder="Clique para fazer upload da imagem"
										aspectRatio="free"
									/>
									{image.url && !isValidUrl(image.url) && (
										<p className="text-sm text-red-500 mt-1">
											URL inválida.
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-navy mb-2">
										Link (opcional)
									</label>
									<div className="relative">
										<input
											type="url"
											value={image.link || ""}
											onChange={(e) =>
												handleImageChange(
													index,
													"link",
													e.target.value,
												)
											}
											placeholder="https://exemplo.com/pagina"
											className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
										/>
										{image.link &&
											isValidUrl(image.link) && (
												<a
													href={image.link}
													target="_blank"
													rel="noopener noreferrer"
													className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-primary hover:text-teal-900"
												>
													<ExternalLink className="w-4 h-4" />
												</a>
											)}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-navy mb-2">
										Texto Alternativo
									</label>
									<input
										type="text"
										value={image.alt || ""}
										onChange={(e) =>
											handleImageChange(
												index,
												"alt",
												e.target.value,
											)
										}
										placeholder="Descrição para acessibilidade"
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-navy mb-2">
										Legenda
									</label>
									<input
										type="text"
										value={image.caption || ""}
										onChange={(e) =>
											handleImageChange(
												index,
												"caption",
												e.target.value,
											)
										}
										placeholder="Legenda da imagem"
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
									/>
								</div>
							</div>

							{/* Preview */}
							{image.url && isValidUrl(image.url) && (
								<div className="mt-4">
									<label className="block text-sm font-medium text-navy mb-2">
										Visualização
									</label>
									<div className="border border-gray-200 rounded-lg overflow-hidden">
										{image.link ? (
											<a
												href={image.link}
												target="_blank"
												rel="noopener noreferrer"
												className="block"
											>
												<img
													src={image.url}
													alt={image.alt || ""}
													className="w-full h-32 object-cover"
												/>
											</a>
										) : (
											<img
												src={image.url}
												alt={image.alt || ""}
												className="w-full h-32 object-cover"
											/>
										)}
										{image.caption && (
											<p className="text-sm text-gray-600 p-2 bg-gray-50 italic">
												{image.caption}
											</p>
										)}
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			)}

			<div className="text-sm text-text-secondary">
				<p>Dicas:</p>
				<ul className="list-disc list-inside mt-2 space-y-1">
					<li>
						Adicione várias imagens para criar um carrossel dinâmico
					</li>
					<li>
						Use imagens com proporções similares para melhor
						visualização
					</li>
					<li>
						Links opcionais permitem que cada imagem seja clicável
					</li>
					<li>Legendas aparecem na parte inferior das imagens</li>
					<li>
						O carrossel é responsivo e funciona em todos os
						dispositivos
					</li>
				</ul>
			</div>
		</div>
	);
};

export default CarouselBlock;
