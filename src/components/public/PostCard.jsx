import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight, MessageSquare, Eye } from "lucide-react";
import { formatDate, formatRelativeTime, getPostUrl } from "../../lib/utils";
import { useLazyImage } from "../../hooks/useLazyImage";

const PostCard = ({ post, variant = "default", hideAuthor = false }) => {
	const {
		id,
		title,
		excerpt,
		image,
		author,
		date,
		category,
		slug,
		view_count,
	} = post;

	const postUrl = getPostUrl(slug || id);
	const {
		ref: imgRef,
		src: optimizedSrc,
		loading,
		isLoaded,
	} = useLazyImage(image, {
		threshold: 0.1,
		rootMargin: "50px",
	});

	// Format view count for display
	const formatViewCount = (count) => {
		if (!count || count === 0) return "0";
		if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
		if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
		return count.toString();
	};

	const cardClasses = {
		default: "card card-hover",
		horizontal: "card card-hover flex flex-row",
		featured: "card card-hover border-2 border-teal-primary",
	};

	const imageClasses = {
		default: "w-full h-48 object-cover",
		horizontal: "w-32 h-32 object-cover rounded-l-lg",
		featured: "w-full h-64 object-cover",
	};

	const contentClasses = {
		default: "p-6",
		horizontal: "p-4 flex-1",
		featured: "p-6",
	};

	return (
		<article className={cardClasses[variant]}>
			{image && (
				<Link to={postUrl} className="block overflow-hidden relative">
					<div className="relative">
						<img
							ref={imgRef}
							src={optimizedSrc}
							alt={title}
							className={
								imageClasses[variant] +
								" transition-all duration-300 hover:scale-105 " +
								(loading ? "opacity-0" : "opacity-100") +
								(!isLoaded ? "blur-sm" : "")
							}
						/>
						{loading && (
							<div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
								<div className="w-8 h-8 border-2 border-gray-300 border-t-teal-primary rounded-full animate-spin"></div>
							</div>
						)}
					</div>
				</Link>
			)}

			<div className={contentClasses[variant]}>
				{/* Category Badge */}
				{category && (
					<Link
						to={`/categoria/${encodeURIComponent(category.toLowerCase())}`}
						className="inline-block px-3 py-1 bg-navy text-white text-xs font-semibold rounded-full mb-3 hover:bg-teal-600 transition-colors"
					>
						{category}
					</Link>
				)}

				{/* Title */}
				<Link to={postUrl}>
					<h3
						className={`font-bold text-navy mb-2 hover:text-teal-primary transition-colors ${
							variant === "featured" ? "text-2xl" : "text-lg"
						}`}
					>
						{title}
					</h3>
				</Link>

				{/* Excerpt */}
				{excerpt && variant !== "horizontal" && (
					<p className="text-text-secondary text-sm mb-4 line-clamp-3">
						{excerpt}
					</p>
				)}

				{/* Meta Information */}
				<div className="flex items-center justify-between text-xs text-text-secondary">
					<div className="flex items-center space-x-3">
						{author && !hideAuthor && (
							<div className="flex items-center space-x-1">
								<User className="w-3 h-3" />
								<span>{author}</span>
							</div>
						)}

						{date && (
							<div className="flex items-center space-x-1">
								<Calendar className="w-3 h-3 text-gray-600" />
								<span
									className={`font-medium ${variant === "horizontal" ? "text-gray-900 text-sm" : ""}`}
								>
									{variant === "horizontal"
										? formatRelativeTime(date)
										: formatDate(date)}
								</span>
							</div>
						)}
					</div>

					<div className="flex items-center space-x-2">
						{view_count !== undefined && view_count !== null && (
							<div className="flex items-center space-x-1">
								<Eye className="w-3 h-3" />
								<span>{formatViewCount(view_count)}</span>
							</div>
						)}

						{variant === "horizontal" && (
							<ArrowRight className="w-4 h-4 text-teal-primary" />
						)}
					</div>
				</div>

				{/* Read More Link for featured variant */}
				{variant === "featured" && (
					<Link
						to={postUrl}
						className="inline-flex items-center space-x-2 text-teal-primary font-semibold text-sm mt-4 hover:text-teal-900 transition-colors"
					>
						<span>Ler mais</span>
						<ArrowRight className="w-4 h-4" />
					</Link>
				)}
			</div>
		</article>
	);
};

export default PostCard;
