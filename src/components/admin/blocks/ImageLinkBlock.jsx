import { useState } from "react";
import { ExternalLink, Image as ImageIcon } from "lucide-react";
import ImageUploadDirect from "../ImageUploadDirect";

const ImageLinkBlock = ({ data, onChange, preview = false }) => {
	const handleChange = (field, value) => {
		if (onChange) {
			onChange({ [field]: value });
		}
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
		if (!data.imageUrl || !data.linkUrl) return null;

		return (
			<div className="my-6">
				<a
					href={data.linkUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="block group"
				>
					<div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
						<img
							src={data.imageUrl}
							alt={data.alt || ""}
							className="w-full h-auto object-cover transition-transform group-hover:scale-105"
						/>
						{data.showOverlay && (
							<div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
								<div className="text-white text-center">
									<ExternalLink className="w-8 h-8 mx-auto mb-2" />
									<p className="text-sm font-medium">
										Clique para visitar
									</p>
								</div>
							</div>
						)}
					</div>
					{data.caption && (
						<p className="text-sm text-gray-600 mt-2 text-center italic">
							{data.caption}
						</p>
					)}
				</a>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div>
				<label className="block text-sm font-medium text-navy mb-2">
					Imagem
				</label>
				<ImageUploadDirect
					value={data.imageUrl || ""}
					onChange={(url) => handleChange("imageUrl", url)}
					placeholder="Clique para fazer upload da imagem"
					aspectRatio="free"
				/>
				{data.imageUrl && !isValidUrl(data.imageUrl) && (
					<p className="text-sm text-red-500 mt-1">
						URL da imagem inválida.
					</p>
				)}
			</div>

			<div>
				<label className="block text-sm font-medium text-navy mb-2">
					URL do Link
				</label>
				<div className="relative">
					<input
						type="url"
						value={data.linkUrl || ""}
						onChange={(e) =>
							handleChange("linkUrl", e.target.value)
						}
						placeholder="https://exemplo.com/pagina"
						className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
					/>
					{data.linkUrl && isValidUrl(data.linkUrl) && (
						<a
							href={data.linkUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-primary hover:text-teal-900"
						>
							<ExternalLink className="w-4 h-4" />
						</a>
					)}
				</div>
				{data.linkUrl && !isValidUrl(data.linkUrl) && (
					<p className="text-sm text-red-500 mt-1">
						URL do link inválida.
					</p>
				)}
			</div>

			<div>
				<label className="block text-sm font-medium text-navy mb-2">
					Texto Alternativo (Alt)
				</label>
				<input
					type="text"
					value={data.alt || ""}
					onChange={(e) => handleChange("alt", e.target.value)}
					placeholder="Descrição da imagem para acessibilidade"
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-navy mb-2">
					Legenda (opcional)
				</label>
				<input
					type="text"
					value={data.caption || ""}
					onChange={(e) => handleChange("caption", e.target.value)}
					placeholder="Legenda que aparecerá abaixo da imagem"
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
				/>
			</div>

			<div className="flex items-center">
				<input
					type="checkbox"
					id="showOverlay"
					checked={data.showOverlay || false}
					onChange={(e) =>
						handleChange("showOverlay", e.target.checked)
					}
					className="w-4 h-4 text-teal-primary border-gray-300 rounded focus:ring-teal-primary"
				/>
				<label
					htmlFor="showOverlay"
					className="ml-2 text-sm text-gray-700"
				>
					Mostrar overlay ao passar o mouse
				</label>
			</div>

			{/* Preview */}
			{data.imageUrl &&
				data.linkUrl &&
				isValidUrl(data.imageUrl) &&
				isValidUrl(data.linkUrl) && (
					<div>
						<label className="block text-sm font-medium text-navy mb-2">
							Visualização
						</label>
						<div className="p-4 bg-gray-50 rounded-lg">
							<a
								href={data.linkUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="block group"
							>
								<div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
									<img
										src={data.imageUrl}
										alt={data.alt || ""}
										className="w-full h-48 object-cover transition-transform group-hover:scale-105"
									/>
									{data.showOverlay && (
										<div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
											<div className="text-white text-center">
												<ExternalLink className="w-6 h-6 mx-auto mb-1" />
												<p className="text-xs">
													Clique para visitar
												</p>
											</div>
										</div>
									)}
								</div>
								{data.caption && (
									<p className="text-sm text-gray-600 mt-2 text-center italic">
										{data.caption}
									</p>
								)}
							</a>
						</div>
					</div>
				)}

			<div className="text-sm text-text-secondary">
				<p>Dicas:</p>
				<ul className="list-disc list-inside mt-2 space-y-1">
					<li>
						Use o upload para enviar imagens diretamente para o
						servidor
					</li>
					<li>Use imagens de boa qualidade e otimizadas para web</li>
					<li>
						O texto alternativo é importante para acessibilidade
					</li>
					<li>O overlay ajuda a indicar que a imagem é clicável</li>
					<li>Links externos abrirão em nova aba</li>
				</ul>
			</div>
		</div>
	);
};

export default ImageLinkBlock;
