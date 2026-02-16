import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2, Link } from "lucide-react";
import { validateImage } from "../../lib/cloudinary";
import toast from "react-hot-toast";

const ImageUploadDirect = ({
	value,
	onChange,
	placeholder = "Clique para fazer upload da imagem",
	className = "",
	maxSize = 5 * 1024 * 1024, // 5MB
	aspectRatio = "free",
}) => {
	const [uploading, setUploading] = useState(false);
	const [dragActive, setDragActive] = useState(false);
	const [showUrlInput, setShowUrlInput] = useState(false);
	const [urlInput, setUrlInput] = useState("");
	const fileInputRef = useRef(null);

	const handleDirectUpload = async (file) => {
		if (!file) return;

		try {
			// Validate file first
			validateImage(file);

			setUploading(true);

			// Create FormData for direct upload
			const formData = new FormData();
			formData.append("file", file);
			formData.append(
				"upload_preset",
				import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
			);
			formData.append("folder", "opine-agora");

			// Direct upload to Cloudinary
			const response = await fetch(
				`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
				{
					method: "POST",
					body: formData,
				},
			);

			if (!response.ok) {
				throw new Error("Falha no upload da imagem");
			}

			const data = await response.json();

			if (data.secure_url) {
				onChange(data.secure_url);
				toast.success("Imagem enviada com sucesso!");
			} else {
				throw new Error("URL não retornada pelo Cloudinary");
			}
		} catch (error) {
			console.error("Upload error:", error);
			toast.error(error.message || "Erro ao fazer upload da imagem");
		} finally {
			setUploading(false);
		}
	};

	const handleUrlSubmit = () => {
		if (!urlInput.trim()) {
			toast.error("Por favor, insira uma URL válida");
			return;
		}

		// Basic URL validation
		try {
			new URL(urlInput);
			onChange(urlInput.trim());
			setUrlInput("");
			setShowUrlInput(false);
			toast.success("URL da imagem adicionada com sucesso!");
		} catch (error) {
			toast.error("URL inválida. Por favor, insira uma URL completa.");
		}
	};

	const handleFileSelect = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			handleDirectUpload(file);
		}
	};

	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		const file = e.dataTransfer.files?.[0];
		if (file) {
			handleDirectUpload(file);
		}
	};

	const handleRemove = () => {
		onChange("");
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const formatFileSize = (bytes) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	return (
		<div className={`space-y-2 ${className}`}>
			{/* Hidden file input */}
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleFileSelect}
				className="hidden"
			/>

			{/* Image Preview */}
			{value ? (
				<div className="relative group">
					<div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
						<img
							src={value}
							alt="Preview"
							className="w-full h-full object-cover"
						/>
					</div>

					{/* Overlay with actions */}
					<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
						<button
							onClick={() => fileInputRef.current?.click()}
							className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
							title="Trocar imagem"
						>
							<Upload className="w-4 h-4 text-gray-700" />
						</button>
						<button
							onClick={handleRemove}
							className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
							title="Remover imagem"
						>
							<X className="w-4 h-4 text-white" />
						</button>
					</div>
				</div>
			) : (
				<div
					className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
            ${
				dragActive
					? "border-teal-primary bg-teal-50"
					: "border-gray-300 hover:border-teal-primary hover:bg-teal-50"
			}
            ${uploading ? "pointer-events-none opacity-50" : ""}
          `}
					onDragEnter={handleDrag}
					onDragLeave={handleDrag}
					onDragOver={handleDrag}
					onDrop={handleDrop}
					onClick={() => !uploading && fileInputRef.current?.click()}
				>
					{uploading ? (
						<div className="flex flex-col items-center space-y-2">
							<Loader2 className="w-8 h-8 text-teal-primary animate-spin" />
							<p className="text-sm text-text-secondary">
								Enviando imagem...
							</p>
							<div className="w-full bg-gray-200 rounded-full h-2 mt-2">
								<div
									className="bg-teal-primary h-2 rounded-full transition-all duration-300"
									style={{ width: "75%" }}
								></div>
							</div>
						</div>
					) : (
						<div className="flex flex-col items-center space-y-2">
							<Upload className="w-8 h-8 text-gray-400" />
							<div>
								<p className="text-sm font-medium text-navy">
									{placeholder}
								</p>
								<p className="text-xs text-text-secondary mt-1">
									ou arraste e solte uma imagem aqui
								</p>
							</div>
							<p className="text-xs text-text-secondary">
								Formatos: JPG, PNG, GIF, WebP (máx.{" "}
								{formatFileSize(maxSize)})
							</p>
						</div>
					)}
				</div>
			)}

			{/* Action Buttons */}
			<div className="flex items-center space-x-2">
				<button
					type="button"
					onClick={() => setShowUrlInput(!showUrlInput)}
					className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
				>
					<Link className="w-4 h-4" />
					<span>Adicionar URL</span>
				</button>

				{!value && (
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						disabled={uploading}
						className="flex items-center space-x-2 px-3 py-2 text-sm bg-teal-primary hover:bg-teal-900 text-white rounded-lg transition-colors disabled:opacity-50"
					>
						<Upload className="w-4 h-4" />
						<span>Upload</span>
					</button>
				)}
			</div>

			{/* URL Input - Only show when there's no image */}
			{showUrlInput && !value && (
				<div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
					<input
						type="url"
						value={urlInput}
						onChange={(e) => setUrlInput(e.target.value)}
						placeholder="https://exemplo.com/imagem.jpg"
						className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
					/>
					<button
						onClick={handleUrlSubmit}
						className="px-4 py-2 bg-teal-primary hover:bg-teal-900 text-white rounded-lg transition-colors"
					>
						Adicionar
					</button>
					<button
						onClick={() => {
							setShowUrlInput(false);
							setUrlInput("");
						}}
						className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
					>
						Cancelar
					</button>
				</div>
			)}

			{/* Image info */}
			{value && (
				<div className="text-xs text-text-secondary">
					<p>URL: {value}</p>
				</div>
			)}
		</div>
	);
};

export default ImageUploadDirect;
