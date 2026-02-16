import { useState } from "react";
import { Image, AlignLeft, AlignRight } from "lucide-react";
import ImageUploadDirect from "../ImageUploadDirect";

const ImageTextBlock = ({ data, onChange, preview = false }) => {
	const handleChange = (field, value) => {
		if (onChange) {
			onChange({ [field]: value });
		}
	};

	if (preview) {
		if (!data.imageUrl && !data.text) return null;

		return (
			<div
				className={`my-8 flex flex-col ${
					data.align === "right"
						? "md:flex-row-reverse"
						: "md:flex-row"
				} items-center gap-8`}
			>
				{data.imageUrl && (
					<img
						src={data.imageUrl}
						alt={data.alt || ""}
						className="w-full md:w-1/3 rounded-lg shadow-md"
					/>
				)}
				{data.text && (
					<div className="flex-1">
						<p className="text-lg leading-relaxed whitespace-pre-line">
							{data.text}
						</p>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div>
				<label className="block text-sm font-medium text-navy mb-2">
					Alinhamento
				</label>
				<div className="flex space-x-2">
					<button
						onClick={() => handleChange("align", "left")}
						className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
							data.align === "left" || !data.align
								? "border-teal-primary bg-teal-50 text-teal-primary"
								: "border-gray-300 hover:border-gray-400"
						}`}
					>
						<AlignLeft className="w-4 h-4" />
						<span>Esquerda</span>
					</button>
					<button
						onClick={() => handleChange("align", "right")}
						className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
							data.align === "right"
								? "border-teal-primary bg-teal-50 text-teal-primary"
								: "border-gray-300 hover:border-gray-400"
						}`}
					>
						<AlignRight className="w-4 h-4" />
						<span>Direita</span>
					</button>
				</div>
			</div>

			<div>
				<label className="block text-sm font-medium text-navy mb-2">
					Imagem
				</label>
				<ImageUploadDirect
					value={data.imageUrl || ""}
					onChange={(url) => handleChange("imageUrl", url)}
					placeholder="Clique para fazer upload da imagem"
					aspectRatio="4:3"
				/>
			</div>

			{data.imageUrl && (
				<div>
					<label className="block text-sm font-medium text-navy mb-2">
						Texto Alternativo (Alt)
					</label>
					<input
						type="text"
						value={data.alt || ""}
						onChange={(e) => handleChange("alt", e.target.value)}
						placeholder="Descreva a imagem para acessibilidade..."
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
					/>
				</div>
			)}

			<div>
				<label className="block text-sm font-medium text-navy mb-2">
					Texto
				</label>
				<textarea
					value={data.text || ""}
					onChange={(e) => handleChange("text", e.target.value)}
					placeholder="Digite o texto que acompanhará a imagem..."
					rows={6}
					className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent resize-none"
				/>
			</div>

			<div className="text-sm text-text-secondary">
				<p>
					Dica: Este bloco exibe uma imagem ao lado de um texto, ideal
					para ilustrar conteúdos.
				</p>
			</div>
		</div>
	);
};

export default ImageTextBlock;
