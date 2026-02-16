import { ExternalLink } from "lucide-react";

const ButtonBlock = ({ data, onChange, preview = false }) => {
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
		if (!data.text || !data.url) return null;

		return (
			<div className="my-6 text-center">
				<a
					href={data.url}
					target="_blank"
					rel="noopener noreferrer"
					className={`inline-block px-6 py-3 rounded-lg font-semibold transition-colors ${
						data.style === "primary"
							? "bg-teal-primary text-white hover:bg-teal-900"
							: "bg-orange-warm text-white hover:bg-orange-600"
					}`}
				>
					{data.text}
				</a>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div>
				<label className="block text-sm font-medium text-navy mb-2">
					Texto do Botão
				</label>
				<input
					type="text"
					value={data.text || ""}
					onChange={(e) => handleChange("text", e.target.value)}
					placeholder="Ex: Saiba mais, Leia o artigo completo..."
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-navy mb-2">
					URL do Link
				</label>
				<div className="relative">
					<input
						type="url"
						value={data.url || ""}
						onChange={(e) => handleChange("url", e.target.value)}
						placeholder="https://exemplo.com/pagina"
						className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
					/>
					{data.url && isValidUrl(data.url) && (
						<a
							href={data.url}
							target="_blank"
							rel="noopener noreferrer"
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-primary hover:text-teal-900"
						>
							<ExternalLink className="w-4 h-4" />
						</a>
					)}
				</div>
				{data.url && !isValidUrl(data.url) && (
					<p className="text-sm text-red-500 mt-1">
						URL inválida. Por favor, insira uma URL completa
						(https://...).
					</p>
				)}
			</div>

			<div>
				<label className="block text-sm font-medium text-navy mb-2">
					Estilo do Botão
				</label>
				<div className="grid grid-cols-2 gap-4">
					<button
						onClick={() => handleChange("style", "primary")}
						className={`p-4 rounded-lg border-2 transition-colors ${
							data.style === "primary" || !data.style
								? "border-teal-primary bg-teal-50"
								: "border-gray-200 hover:border-gray-300"
						}`}
					>
						<div className="flex flex-col items-center space-y-2">
							<div className="w-full px-4 py-2 bg-teal-primary text-white rounded text-center text-sm">
								Primário
							</div>
							<span className="text-xs text-text-secondary">
								Cor principal do site
							</span>
						</div>
					</button>

					<button
						onClick={() => handleChange("style", "secondary")}
						className={`p-4 rounded-lg border-2 transition-colors ${
							data.style === "secondary"
								? "border-orange-warm bg-orange-50"
								: "border-gray-200 hover:border-gray-300"
						}`}
					>
						<div className="flex flex-col items-center space-y-2">
							<div className="w-full px-4 py-2 bg-orange-warm text-white rounded text-center text-sm">
								Secundário
							</div>
							<span className="text-xs text-text-secondary">
								Cor de destaque
							</span>
						</div>
					</button>
				</div>
			</div>

			{/* Preview */}
			{data.text && data.url && isValidUrl(data.url) && (
				<div>
					<label className="block text-sm font-medium text-navy mb-2">
						Visualização
					</label>
					<div className="p-4 bg-gray-50 rounded-lg text-center">
						<a
							href={data.url}
							target="_blank"
							rel="noopener noreferrer"
							className={`inline-block px-6 py-3 rounded-lg font-semibold transition-colors ${
								data.style === "secondary"
									? "bg-orange-warm text-white hover:bg-orange-600"
									: "bg-teal-primary text-white hover:bg-teal-900"
							}`}
						>
							{data.text}
						</a>
					</div>
				</div>
			)}

			<div className="text-sm text-text-secondary">
				<p>Dicas:</p>
				<ul className="list-disc list-inside mt-2 space-y-1">
					<li>Use textos curtos e claros para melhor conversão</li>
					<li>Links externos abrirão em nova aba</li>
					<li>
						Escolha o estilo que combina melhor com seu conteúdo
					</li>
				</ul>
			</div>
		</div>
	);
};

export default ButtonBlock;
