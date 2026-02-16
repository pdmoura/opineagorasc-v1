import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight, MessageSquare } from "lucide-react";
import { formatDate, getPostUrl } from "../../lib/utils";

const PostCard = ({ post, variant = "default" }) => {
	const { id, title, excerpt, image, author, date, category, slug } = post;

	const postUrl = getPostUrl(slug || id);

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
				<Link to={postUrl} className="block overflow-hidden">
					<img
						src={image}
						alt={title}
						className={
							imageClasses[variant] +
							" transition-transform duration-300 hover:scale-105"
						}
						loading="lazy"
					/>
				</Link>
			)}

			<div className={contentClasses[variant]}>
				{/* Category Badge */}
				{category && (
					<Link
						to={`/categoria/${encodeURIComponent(category.toLowerCase())}`}
						className="inline-block px-3 py-1 bg-teal-primary text-white text-xs font-semibold rounded-full mb-3 hover:bg-teal-900 transition-colors"
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
						{author && (
							<div className="flex items-center space-x-1">
								<User className="w-3 h-3" />
								<span>{author}</span>
							</div>
						)}

						{date && (
							<div className="flex items-center space-x-1">
								<Calendar className="w-3 h-3" />
								<span>{formatDate(date)}</span>
							</div>
						)}
					</div>

					{variant === "horizontal" && (
						<ArrowRight className="w-4 h-4 text-teal-primary" />
					)}
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
