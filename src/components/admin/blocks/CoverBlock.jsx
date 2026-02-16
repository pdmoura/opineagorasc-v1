import { useState } from "react";
import { Image, Upload, Eye, EyeOff } from "lucide-react";
import ImageUploadDirect from "../ImageUploadDirect";

const CoverBlock = ({ data, onChange, preview = false }) => {
	const [showInBody, setShowInBody] = useState(data.showInBody !== false);

	const handleChange = (field, value) => {
		if (onChange) {
			onChange({ [field]: value });
		}
	};

	if (preview) {
		if (!data.imageUrl || showInBody === false) return null;

		return (
			<div className="my-8">
				<img
					src={data.imageUrl}
					alt={data.alt || ""}
					className="w-full rounded-xl shadow-lg"
				/>
				{data.title && (
					<div className="mt-4 text-center">
						<h2 className="text-3xl font-bold text-navy">
							{data.title}
						</h2>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div>
				<label className="block text-sm font-medium text-navy mb-2">
					Título da Capa
				</label>
				<input
					type="text"
					value={data.title || ""}
					onChange={(e) => handleChange("title", e.target.value)}
					placeholder="Digite o título principal..."
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-navy mb-2">
					Imagem da Capa
				</label>
				<ImageUploadDirect
					value={data.imageUrl || ""}
					onChange={(url) => handleChange("imageUrl", url)}
					placeholder="Clique para fazer upload da imagem de capa"
					aspectRatio="16:9"
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

			<div className="flex items-center space-x-2">
				<input
					type="checkbox"
					id="showInBody"
					checked={showInBody}
					onChange={(e) => {
						setShowInBody(e.target.checked);
						handleChange("showInBody", e.target.checked);
					}}
					className="w-4 h-4 text-teal-primary border-gray-300 rounded focus:ring-teal-primary"
				/>
				<label htmlFor="showInBody" className="text-sm text-navy">
					Exibir imagem no corpo da matéria
				</label>
			</div>
		</div>
	);
};

export default CoverBlock;
