import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
	ChevronLeft,
	ChevronRight,
	Calendar,
	User,
	Tag,
	MessageSquare,
	ArrowLeft,
	Facebook,
	Twitter,
	Send,
	Eye,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

// Components
import PostCard from "../components/public/PostCard";
import CommentForm from "../components/public/CommentForm";
import CommentList from "../components/public/CommentList";
import SocialShare from "../components/public/SocialShare";

// Hooks
import { usePost, usePosts } from "../hooks/usePosts";
import { useRelatedPosts } from "../hooks/useRelatedPosts";
import { useComments, useSubmitComment } from "../hooks/useComments";
import { usePostViews } from "../hooks/usePostViews";

// Utils
import { formatDate, formatDateTime, getSocialShareUrls } from "../lib/utils";

const Post = () => {
	const { slug } = useParams();
	const { post, loading, error } = usePost(slug);
	const { posts: relatedPosts } = useRelatedPosts(post, 4);
	const { comments: commentsData, loading: commentsLoading } = useComments(
		post?.id,
	);
	const { submitComment, submitting } = useSubmitComment();
	const { viewCount, trackView } = usePostViews(post?.id || null);

	const [currentSlide, setCurrentSlide] = useState(0);
	const [comments, setComments] = useState([]);
	const [sortBy, setSortBy] = useState("latest");
	const [showComments, setShowComments] = useState(true);

	// Sync comments when loaded
	useEffect(() => {
		if (commentsData) {
			setComments(commentsData);
		}
	}, [commentsData]);

	const handleCommentSubmit = async (data) => {
		const newComment = await submitComment(data);
		if (newComment) {
			// If auto-approved (rare but possible), add to list
			if (newComment.status === "approved") {
				setComments((prev) => [newComment, ...prev]);
			}
			return true;
		}
		return false;
	};

	// Scroll to top when post loads
	useEffect(() => {
		if (post && !loading) {
			window.scrollTo(0, 0);
			// Track view when post is loaded
			trackView();
		}
	}, [post, loading]);

	// Auto-play for carousel
	useEffect(() => {
		if (!post?.content) return;

		let content;
		try {
			// Handle different content types
			if (typeof post.content === "string") {
				// Try to parse as JSON first
				try {
					content = JSON.parse(post.content);
				} catch (jsonError) {
					// If JSON parsing fails, treat as plain text
					content = [
						{
							id: "block_content_1",
							type: "text",
							data: {
								text: post.content,
							},
						},
					];
				}
			} else if (Array.isArray(post.content)) {
				// Already an array, use as-is
				content = post.content;
			} else {
				// Unknown format, default to empty array
				content = [];
			}
		} catch (e) {
			console.error("Error processing content for carousel:", e);
			return; // Exit if content can't be processed
		}
		const carouselBlocks = content.filter(
			(block) => block.type === "carousel",
		);

		if (carouselBlocks.length === 0) return;

		// Find the first carousel with multiple images
		const firstCarousel = carouselBlocks.find(
			(block) => block.data.images?.filter((img) => img.url).length > 1,
		);

		if (!firstCarousel) return;

		const images = firstCarousel.data.images.filter((img) => img.url);
		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % images.length);
		}, 3000);

		return () => clearInterval(interval);
	}, [post?.content]);

	// Render block content
	const renderBlockContent = (content) => {
		if (!content) return null;

		let parsedContent;
		try {
			parsedContent = Array.isArray(content)
				? content
				: JSON.parse(content);
		} catch (e) {
			console.error("Error parsing content blocks:", e);
			// Return as text block if parsing fails
			parsedContent = [
				{
					type: "text",
					data: {
						content:
							typeof content === "string"
								? content
								: JSON.stringify(content),
					},
				},
			];
		}

		return parsedContent.map((block, index) => {
			const { type, data } = block;

			switch (type) {
				case "capa":
					if (!data.imageUrl || data.showInBody === false)
						return null;
					return (
						<div key={index} className="my-8">
							<img
								src={data.imageUrl}
								alt={data.alt || ""}
								className="w-full rounded-xl shadow-lg"
								loading="lazy"
							/>
						</div>
					);

				case "imageText":
					if (!data.imageUrl && !data.text) return null;
					return (
						<div key={index} className="my-8 clearfix">
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
										alt=""
										className="w-full rounded-lg shadow-md"
										loading="lazy"
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

				case "fullImage":
					if (!data.imageUrl) return null;
					return (
						<div key={index} className="my-8">
							<img
								src={data.imageUrl}
								alt=""
								className="w-full rounded-xl shadow-lg"
								loading="lazy"
							/>
							{data.caption && (
								<p className="text-center text-sm text-gray-600 mt-4 italic">
									{data.caption}
								</p>
							)}
						</div>
					);

				case "video":
					if (!data.videoUrl) return null;
					const videoId = data.videoUrl.match(
						/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
					)?.[1];
					if (!videoId) return null;

					return (
						<div
							key={index}
							className="my-8 aspect-video rounded-xl overflow-hidden shadow-lg"
						>
							<iframe
								src={`https://www.youtube.com/embed/${videoId}`}
								className="w-full h-full"
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								loading="lazy"
							/>
						</div>
					);

				case "text":
					if (!data.content) return null;
					return (
						<div key={index} className="my-6">
							<div className="text-lg leading-relaxed prose max-w-none">
								<ReactMarkdown>{data.content}</ReactMarkdown>
							</div>
						</div>
					);

				case "button":
					if (!data.text || !data.url) return null;
					return (
						<div key={index} className="my-6 text-center">
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

				case "imagemComLink":
					if (!data.imageUrl || !data.linkUrl) return null;
					return (
						<div key={index} className="my-6">
							<a
								href={data.linkUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="block group"
							>
								<div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
									<img
										src={data.imageUrl}
										alt={data.alt || ""}
										className="w-full h-auto object-cover transition-transform group-hover:scale-105"
										loading="lazy"
									/>
									{data.showOverlay && (
										<div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
											<div className="text-white text-center">
												<svg
													className="w-8 h-8 mx-auto mb-2"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
													/>
												</svg>
												<p className="text-sm font-medium">
													Clique para visitar
												</p>
											</div>
										</div>
									)}
								</div>
								{data.caption && (
									<p className="text-sm text-gray-600 mt-2 text-center italic">
										{data.caption}
									</p>
								)}
							</a>
						</div>
					);

				case "carousel":
					const images = data.images?.filter((img) => img.url) || [];
					if (images.length === 0) return null;

					const nextSlide = () => {
						setCurrentSlide((prev) => (prev + 1) % images.length);
					};

					const prevSlide = () => {
						setCurrentSlide(
							(prev) =>
								(prev - 1 + images.length) % images.length,
						);
					};

					return (
						<div key={index} className="my-6">
							<div className="relative overflow-hidden rounded-lg shadow-md">
								<div className="relative h-96">
									{images.map((image, imgIndex) => (
										<div
											key={imgIndex}
											className={`absolute inset-0 transition-opacity duration-500 ${
												imgIndex === currentSlide
													? "opacity-100"
													: "opacity-0"
											}`}
										>
											{image.link ? (
												<a
													href={image.link}
													target="_blank"
													rel="noopener noreferrer"
													className="block w-full h-full"
												>
													<img
														src={image.url}
														alt={image.alt || ""}
														className="w-full h-full object-cover"
														loading="lazy"
													/>
												</a>
											) : (
												<img
													src={image.url}
													alt={image.alt || ""}
													className="w-full h-full object-cover"
													loading="lazy"
												/>
											)}
										</div>
									))}
								</div>

								{/* Navigation */}
								{images.length > 1 && (
									<>
										<button
											onClick={prevSlide}
											className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
										>
											<ChevronLeft className="w-5 h-5" />
										</button>
										<button
											onClick={nextSlide}
											className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
										>
											<ChevronRight className="w-5 h-5" />
										</button>
									</>
								)}

								{/* Indicators */}
								{images.length > 1 && (
									<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
										{images.map((_, imgIndex) => (
											<button
												key={imgIndex}
												onClick={() =>
													setCurrentSlide(imgIndex)
												}
												className={`w-2 h-2 rounded-full transition-colors ${
													imgIndex === currentSlide
														? "bg-white"
														: "bg-white bg-opacity-50"
												}`}
											/>
										))}
									</div>
								)}

								{/* Caption */}
								{images[currentSlide]?.caption && (
									<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
										<p className="text-white text-sm">
											{images[currentSlide].caption}
										</p>
									</div>
								)}
							</div>
						</div>
					);

				case "ad":
					if (!data.code) return null;
					return (
						<div
							key={index}
							className="my-8 p-4 bg-gray-100 rounded-lg text-center"
						>
							<div
								dangerouslySetInnerHTML={{ __html: data.code }}
							/>
						</div>
					);

				default:
					return null;
			}
		});
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-primary"></div>
			</div>
		);
	}

	if (error || !post) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-navy mb-4">
						Matéria não encontrada
					</h1>
					<p className="text-gray-600 mb-6">
						A matéria que você procura não existe ou foi removida.
					</p>
					<Link to="/" className="btn-primary">
						Voltar para a página inicial
					</Link>
				</div>
			</div>
		);
	}

	// Parse content blocks
	let contentBlocks = [];
	try {
		contentBlocks = JSON.parse(post.content || "[]");
	} catch (e) {
		contentBlocks = [
			{ type: "text", data: { content: post.content || "" } },
		];
	}

	const shareUrls = getSocialShareUrls(
		post.title,
		window.location.href,
		post.excerpt,
	);

	return (
		<>
			<Helmet>
				<title>{post.title} - Opine Agora SC</title>
				<meta name="description" content={post.excerpt || post.title} />
				<meta name="keywords" content={post.category} />

				{/* Open Graph */}
				<meta property="og:title" content={post.title} />
				<meta
					property="og:description"
					content={post.excerpt || post.title}
				/>
				<meta property="og:image" content={post.image} />
				<meta property="og:url" content={window.location.href} />
				<meta property="og:type" content="article" />
				<meta property="article:section" content={post.category} />
				<meta property="article:published_time" content={post.date} />
				<meta property="article:author" content={post.author} />

				{/* Twitter Card */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={post.title} />
				<meta
					name="twitter:description"
					content={post.excerpt || post.title}
				/>
				<meta name="twitter:image" content={post.image} />
			</Helmet>

			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Back Button */}
				<Link
					to="/"
					className="inline-flex items-center space-x-2 text-teal-primary hover:text-teal-900 mb-6 font-medium"
				>
					<ArrowLeft className="w-4 h-4" />
					<span>Voltar</span>
				</Link>

				{/* Article Header */}
				<article className="bg-white rounded-xl shadow-lg overflow-hidden">
					{/* Featured Image */}
					{post.image && (
						<div className="aspect-video overflow-hidden">
							<img
								src={post.image}
								alt={post.title}
								className="w-full h-full object-cover"
								loading="lazy"
							/>
						</div>
					)}

					{/* Article Content */}
					<div className="p-8">
						{/* Category */}
						{post.category && (
							<Link
								to={`/categoria/${encodeURIComponent(post.category.toLowerCase())}`}
								className="inline-block px-3 py-1 bg-teal-primary text-white text-xs font-semibold rounded-full mb-4 hover:bg-teal-900 transition-colors"
							>
								{post.category}
							</Link>
						)}

						{/* Title */}
						<h1 className="text-3xl md:text-4xl font-bold text-navy mb-6 leading-tight">
							{post.title}
						</h1>

						{/* Article Meta */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm text-text-secondary mb-8 pb-6 border-b border-gray-200">
							{/* Left side - Author, Date, Views */}
							<div className="flex flex-wrap items-center gap-4 sm:gap-6">
								{post.author && (
									<div className="flex items-center space-x-2">
										<User className="w-4 h-4" />
										<span>{post.author}</span>
									</div>
								)}

								<div className="flex items-center space-x-2">
									<Calendar className="w-4 h-4" />
									<span>{formatDateTime(post.date)}</span>
								</div>

								{viewCount !== undefined &&
									viewCount !== null && (
										<div className="flex items-center space-x-2">
											<Eye className="w-4 h-4" />
											<span>
												{viewCount.toLocaleString()}{" "}
												visualizações
											</span>
										</div>
									)}
							</div>

							{/* Right side - Social Share */}
							<div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2">
								<span className="text-base font-semibold text-text-primary">
									Compartilhar:
								</span>
								<div className="flex items-center space-x-2">
									<a
										href={shareUrls.whatsapp}
										target="_blank"
										rel="noopener noreferrer"
										className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
										aria-label="Compartilhar no WhatsApp"
									>
										<svg
											width="20"
											height="20"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
										</svg>
									</a>
									<a
										href={shareUrls.facebook}
										target="_blank"
										rel="noopener noreferrer"
										className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
										aria-label="Compartilhar no Facebook"
									>
										<Facebook className="w-4 h-4" />
									</a>
									<a
										href={shareUrls.twitter}
										target="_blank"
										rel="noopener noreferrer"
										className="p-2 bg-[#0f1419] text-white rounded-full hover:bg-sky-500 transition-colors"
										aria-label="Compartilhar no Twitter"
									>
										<svg
											width="18"
											height="18"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
										</svg>
									</a>
									<a
										href={shareUrls.telegram}
										target="_blank"
										rel="noopener noreferrer"
										className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
										aria-label="Compartilhar no Telegram"
									>
										<Send className="w-4 h-4" />
									</a>
								</div>
							</div>
						</div>

						{/* Article Body */}
						<div className="prose prose-lg max-w-none">
							{renderBlockContent(contentBlocks)}
						</div>

						{/* Tags */}
						{post.tags && post.tags.length > 0 && (
							<div className="mt-8 pt-6 border-t border-gray-200">
								<div className="flex flex-wrap gap-2">
									{post.tags.map((tag, index) => (
										<span
											key={index}
											className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
										>
											#{tag}
										</span>
									))}
								</div>
							</div>
						)}

						{/* Post Navigation */}
						{(post.prevPost || post.nextPost) && (
							<div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* Previous Post (Newer) - Left */}
								<div className="flex flex-col items-start text-left">
									{post.prevPost ? (
										<Link
											to={`/post/${post.prevPost.slug}`}
											className="group w-full"
										>
											<span className="flex items-center text-sm text-gray-500 font-medium mb-2 group-hover:text-teal-primary transition-colors">
												<ChevronLeft className="w-4 h-4 mr-1" />
												Matéria Anterior
											</span>
											<h4 className="text-lg font-bold text-navy group-hover:text-teal-primary transition-colors line-clamp-2">
												{post.prevPost.title}
											</h4>
										</Link>
									) : (
										<div className="hidden md:block" />
									)}
								</div>

								{/* Next Post (Older) - Right */}
								<div className="flex flex-col items-end text-right">
									{post.nextPost ? (
										<Link
											to={`/post/${post.nextPost.slug}`}
											className="group w-full"
										>
											<span className="flex items-center justify-end text-sm text-gray-500 font-medium mb-2 group-hover:text-teal-primary transition-colors">
												Próxima Matéria
												<ChevronRight className="w-4 h-4 ml-1" />
											</span>
											<h4 className="text-lg font-bold text-navy group-hover:text-teal-primary transition-colors line-clamp-2">
												{post.nextPost.title}
											</h4>
										</Link>
									) : (
										<div className="hidden md:block" />
									)}
								</div>
							</div>
						)}
					</div>
				</article>

				{/* Comments Section */}
				<div className="mt-12 bg-white rounded-xl shadow-lg p-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-navy flex items-center space-x-2">
							<MessageSquare className="w-6 h-6 text-teal-primary" />
							<span>Comentários ({comments.length})</span>
						</h2>
						<button
							onClick={() => setShowComments(!showComments)}
							className="text-teal-primary hover:text-teal-900 font-medium"
						>
							{showComments ? "Ocultar" : "Mostrar"}
						</button>
					</div>

					{showComments && (
						<>
							<CommentForm
								postId={post.id}
								onSubmit={handleCommentSubmit}
								submitting={submitting}
							/>
							<CommentList
								comments={comments}
								loading={commentsLoading}
							/>
						</>
					)}
				</div>
			</div>

			{/* Related Posts */}
			{relatedPosts && relatedPosts.length > 0 && (
				<section className="bg-gray-50 py-12 mt-12">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="section-title mb-8">
							Matérias Relacionadas
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							{relatedPosts
								.filter((p) => p.id !== post.id)
								.slice(0, 4)
								.map((relatedPost) => (
									<PostCard
										key={relatedPost.id}
										post={relatedPost}
									/>
								))}
						</div>
					</div>
				</section>
			)}
		</>
	);
};

export default Post;
