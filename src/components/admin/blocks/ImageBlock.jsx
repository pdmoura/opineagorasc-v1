import { Image } from "lucide-react";
import ImageUploadDirect from "../ImageUploadDirect";

const ImageBlock = ({ data, onChange, preview = false }) => {
	const handleChange = (field, value) => {
		if (onChange) {
			onChange({ [field]: value });
		}
	};

	if (preview) {
		if (!data.imageUrl) return null;

		return (
			<div className="my-8">
				<img
					src={data.imageUrl}
					alt={data.alt || ""}
					className="w-full rounded-xl shadow-lg"
				/>
				{data.caption && (
					<p className="text-center text-sm text-text-secondary mt-4 italic">
						{data.caption}
					</p>
				)}
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
			</div>

			{data.imageUrl && (
				<>
					<div>
						<label className="block text-sm font-medium text-navy mb-2">
							Texto Alternativo (Alt)
						</label>
						<input
							type="text"
							value={data.alt || ""}
							onChange={(e) =>
								handleChange("alt", e.target.value)
							}
							placeholder="Descreva a imagem para acessibilidade..."
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
							onChange={(e) =>
								handleChange("caption", e.target.value)
							}
							placeholder="Adicione uma legenda para a imagem..."
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default ImageBlock;
