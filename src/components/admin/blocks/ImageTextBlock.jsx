import { useState } from "react";
import { Image, AlignLeft, AlignRight } from "lucide-react";
import ImageUploadDirect from "../ImageUploadDirect";
import RichTextEditor from "../RichTextEditor";
import ReactMarkdown from "react-markdown";

const ImageTextBlock = ({ data, onChange, preview = false }) => {
	const handleChange = (field, value) => {
		if (onChange) {
			onChange({ [field]: value });
		}
	};

	if (preview) {
		if (!data.imageUrl && !data.text) return null;

		return (
			<div className="my-8 clearfix">
				{data.imageUrl && (
					<div
						className={`relative w-full md:w-1/3 mb-4 ${
							data.align === "right"
								? "md:float-right md:ml-6"
								: "md:float-left md:mr-6"
						}`}
					>
						<img
							src={data.imageUrl}
							alt={data.alt || ""}
							className="w-full rounded-lg shadow-md"
						/>
					</div>
				)}
				{data.text && (
					<div className="text-lg leading-relaxed prose max-w-none">
						<ReactMarkdown>{data.text}</ReactMarkdown>
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
				<RichTextEditor
					content={data.text || ""}
					onChange={(value) => handleChange("text", value)}
					placeholder="Digite o texto que acompanhará a imagem..."
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
