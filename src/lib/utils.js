import slugify from "slugify";
import {
	format,
	differenceInDays,
	differenceInHours,
	differenceInMinutes,
} from "date-fns";
import { ptBR } from "date-fns/locale";

// Slug generation
export const generateSlug = (title, existingSlugs = []) => {
	let baseSlug = slugify(title, {
		lower: true,
		strict: true,
		locale: "pt",
		remove: /[*+~.()'"!:@]/g,
	});

	let slug = baseSlug;
	let counter = 1;

	// Ensure uniqueness
	while (existingSlugs.includes(slug)) {
		slug = `${baseSlug}-${counter}`;
		counter++;
	}

	return slug;
};

// Date formatting
export const formatDate = (date, formatStr = "dd/MM/yyyy") => {
	if (!date) return "";
	return format(new Date(date), formatStr, { locale: ptBR });
};

export const formatDateTime = (date) => {
	if (!date) return "";
	return format(new Date(date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
		locale: ptBR,
	});
};

export const formatRelativeTime = (date) => {
	if (!date) return "";
	const dateObj = new Date(date);
	const now = new Date();

	const days = differenceInDays(now, dateObj);

	if (days < 10) {
		if (days > 0) {
			return `${days} ${days === 1 ? "dia" : "dias"} atrás`;
		}

		const hours = differenceInHours(now, dateObj);
		if (hours > 0) {
			return `${hours} ${hours === 1 ? "hora" : "horas"} atrás`;
		}

		const minutes = differenceInMinutes(now, dateObj);
		return `${minutes} ${minutes === 1 ? "minuto" : "minutos"} atrás`;
	}

	return format(dateObj, "dd/MM/yyyy", { locale: ptBR });
};

// URL helpers
export const getPostUrl = (slug) => {
	return `/post/${slug}`;
};

export const getCategoryUrl = (category) => {
	return `/categoria/${encodeURIComponent(category.toLowerCase())}`;
};

// Social sharing
export const getShareUrls = (title, url, description = "") => {
	const encodedTitle = encodeURIComponent(title);
	const encodedUrl = encodeURIComponent(url);
	const encodedDescription = encodeURIComponent(description);

	return {
		whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
		facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
		twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
		telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
	};
};

// Alias for backward compatibility
export const getSocialShareUrls = getShareUrls;

// Image optimization with Cloudinary
export const getOptimizedImageUrl = (url, options = {}) => {
	if (!url || !url.includes("cloudinary.com")) return url;

	const {
		width,
		height,
		crop = "fill",
		quality = "auto",
		format = "auto",
	} = options;

	const transformations = [];
	if (width) transformations.push(`w_${width}`);
	if (height) transformations.push(`h_${height}`);
	transformations.push(`c_${crop}`, `q_${quality}`, `f_${format}`);

	const transformationString = transformations.join(",");

	// Insert transformations into Cloudinary URL
	return url.replace("/upload/", `/upload/${transformationString}/`);
};

// Text utilities
export const truncateText = (text, maxLength = 150) => {
	if (!text || text.length <= maxLength) return text;
	return text.substring(0, maxLength).trim() + "...";
};

export const stripHtml = (html) => {
	return html.replace(/<[^>]*>/g, "");
};

// Validation
export const validateEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export const validateUrl = (url) => {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
};

// YouTube utilities
export const extractYouTubeId = (url) => {
	if (!url) return null;

	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
		/youtube\.com\/embed\/([^&\n?#]+)/,
	];

	for (const pattern of patterns) {
		const match = url.match(pattern);
		if (match && match[1]) {
			return match[1];
		}
	}
	return null;
};

export const getYouTubeEmbedUrl = (videoId) => {
	return `https://www.youtube.com/embed/${videoId}`;
};

// IP address extraction
export const getClientIP = async () => {
	try {
		const response = await fetch("https://api.ipify.org?format=json");
		const data = await response.json();
		return data.ip;
	} catch {
		// Fallback to a default or return null
		return null;
	}
};

// Local storage helpers
export const storage = {
	get: (key, defaultValue = null) => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : defaultValue;
		} catch {
			return defaultValue;
		}
	},

	set: (key, value) => {
		try {
			window.localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error("Error saving to localStorage:", error);
		}
	},

	remove: (key) => {
		try {
			window.localStorage.removeItem(key);
		} catch (error) {
			console.error("Error removing from localStorage:", error);
		}
	},
};
