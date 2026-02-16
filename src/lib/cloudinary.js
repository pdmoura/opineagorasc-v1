// Client-side Cloudinary configuration for browser environment
// Note: We only use the upload widget client-side, not the full SDK

// Upload widget configuration
const getUploadWidgetConfig = (options = {}) => {
	return {
		cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
		uploadPreset:
			import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ml_default",
		sources: ["local", "url", "camera"],
		multiple: false,
		maxFileSize: 5000000, // 5MB
		folder: "opine-agora",
		resourceType: "image",
		clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
		...options,
	};
};

// Open upload widget
export const openUploadWidget = (onSuccess, options = {}) => {
	return new Promise((resolve, reject) => {
		const widgetConfig = getUploadWidgetConfig(options);

		// Create widget script if not exists
		if (!window.cloudinary) {
			const script = document.createElement("script");
			script.src = "https://upload-widget.cloudinary.com/global/all.js";
			script.async = true;
			script.onload = () => {
				initializeWidget();
			};
			script.onerror = () => {
				reject(new Error("Failed to load Cloudinary widget"));
			};
			document.head.appendChild(script);
		} else {
			initializeWidget();
		}

		function initializeWidget() {
			const widget = window.cloudinary.createUploadWidget(
				widgetConfig,
				(error, result) => {
					if (error) {
						reject(error);
						return;
					}

					if (result.event === "success") {
						const { info } = result;
						const optimizedUrl = getOptimizedImageUrl(
							info.secure_url,
							{
								width: 1200,
								height: 800,
								crop: "fill",
								quality: "auto",
								format: "auto",
							},
						);

						const imageData = {
							url: optimizedUrl,
							originalUrl: info.secure_url,
							publicId: info.public_id,
							width: info.width,
							height: info.height,
							format: info.format,
							size: info.bytes,
						};

						if (onSuccess) {
							onSuccess(imageData);
						}
						resolve(imageData);
					}
				},
			);

			widget.open();
		}
	});
};

// Get optimized image URL
export const getOptimizedImageUrl = (url, options = {}) => {
	if (!url || !url.includes("cloudinary.com")) return url;

	const {
		width,
		height,
		crop = "fill",
		quality = "auto",
		format = "auto",
		gravity = "auto",
	} = options;

	const transformations = [];

	if (width) transformations.push(`w_${width}`);
	if (height) transformations.push(`h_${height}`);
	if (crop) transformations.push(`c_${crop}`);
	if (gravity) transformations.push(`g_${gravity}`);
	transformations.push(`q_${quality}`, `f_${format}`);

	const transformationString = transformations.join(",");

	// Insert transformations into Cloudinary URL
	return url.replace("/upload/", `/upload/${transformationString}/`);
};

// Generate responsive image URLs
export const getResponsiveImageUrls = (url, breakpoints = [400, 800, 1200]) => {
	if (!url || !url.includes("cloudinary.com")) {
		return {
			src: url,
			srcSet: "",
			sizes: "",
		};
	}

	const srcSet = breakpoints
		.map((width) => {
			const optimizedUrl = getOptimizedImageUrl(url, {
				width,
				crop: "fill",
			});
			return `${optimizedUrl} ${width}w`;
		})
		.join(", ");

	const sizes = breakpoints
		.map((width, index) => {
			if (index === breakpoints.length - 1) {
				return `${width}px`;
			}
			return `(max-width: ${width}px) ${width}px`;
		})
		.join(", ");

	return {
		src: getOptimizedImageUrl(url, { width: 800, crop: "fill" }),
		srcSet,
		sizes,
	};
};

// Delete image from Cloudinary (server-side only)
export const deleteImage = async (publicId) => {
	try {
		// This requires server-side implementation for security
		const response = await fetch("/api/cloudinary/delete", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ publicId }),
		});

		if (!response.ok) {
			throw new Error("Failed to delete image");
		}

		return await response.json();
	} catch (error) {
		console.error("Error deleting image:", error);
		throw error;
	}
};

// Generate image placeholder (blur effect)
export const getPlaceholderUrl = (url, width = 20, height = 20) => {
	return getOptimizedImageUrl(url, {
		width,
		height,
		crop: "fill",
		quality: 1,
		format: "auto",
		blur: 1000,
	});
};

// Validate image before upload
export const validateImage = (file) => {
	const maxSize = 5 * 1024 * 1024; // 5MB
	const allowedTypes = [
		"image/jpeg",
		"image/jpg",
		"image/png",
		"image/gif",
		"image/webp",
	];

	if (!allowedTypes.includes(file.type)) {
		throw new Error(
			"Tipo de arquivo não permitido. Use JPG, PNG, GIF ou WebP.",
		);
	}

	if (file.size > maxSize) {
		throw new Error("Arquivo muito grande. Tamanho máximo: 5MB.");
	}

	return true;
};

// Get image info from URL
export const getImageInfo = (url) => {
	if (!url || !url.includes("cloudinary.com")) {
		return null;
	}

	const matches = url.match(/\/upload\/(?:v\d+\/)?([^/]+)$/);
	if (!matches) return null;

	const publicId = matches[1];
	const parts = publicId.split(".");
	const format = parts.length > 1 ? parts[parts.length - 1] : "jpg";
	const baseId = parts.slice(0, -1).join(".");

	return {
		publicId,
		baseId,
		format,
		originalUrl: url,
	};
};

export default {
	openUploadWidget,
	getOptimizedImageUrl,
	getResponsiveImageUrls,
	deleteImage,
	getPlaceholderUrl,
	validateImage,
	getImageInfo,
};
