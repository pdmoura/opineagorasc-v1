import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
	Newspaper,
	TrendingUp,
	Megaphone,
	ChevronRight,
	Mail,
	Users,
	Phone,
	Eye,
} from "lucide-react";
import toast from "react-hot-toast";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Componente SVG personalizado do WhatsApp
const WhatsAppIcon = ({ className }) => (
	<svg className={className} viewBox="0 0 24 24" fill="currentColor">
		<path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
	</svg>
);

// Components
import PostCard from "../components/public/PostCard";
import SkeletonLoader from "../components/public/SkeletonLoader";
import { usePosts, useFeaturedPosts } from "../hooks/usePosts";
import { usePopularPosts } from "../hooks/usePostViews";
import { formatDate } from "../lib/utils";
import { supabase } from "../lib/supabase";
import { useNewsletters } from "../hooks/useNewsletters";

const Home = () => {
	const [newsletterEmail, setNewsletterEmail] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [ads, setAds] = useState([]);
	const [bannerAds, setBannerAds] = useState([]);
	const [sidebarAds, setSidebarAds] = useState([]);
	const [adsLoading, setAdsLoading] = useState(true);
	const [limit, setLimit] = useState(8);
	const { addNewsletter } = useNewsletters();
	const {
		posts,
		loading: postsLoading,
		error: postsError,
	} = usePosts(null, limit);
	const {
		posts: featuredPosts,
		loading: featuredLoading,
		error: featuredError,
	} = useFeaturedPosts(3);
	const {
		posts: popularPosts,
		loading: popularLoading,
		error: popularError,
	} = usePopularPosts(5);

	// Fetch approved ads
	useEffect(() => {
		const fetchAds = async () => {
			try {
				// Fetch Home/Footer Ads
				const { data: footerData, error: footerError } = await supabase
					.from("ads")
					.select("*")
					.eq("status", "approved")
					.eq("category", "footer")
					.order("created_at", { ascending: false })
					.limit(6);

				if (footerError) throw footerError;
				setAds(footerData || []);

				// Fetch Top Banner Ads
				const { data: bannerData, error: bannerError } = await supabase
					.from("ads")
					.select("*")
					.eq("status", "approved")
					.eq("category", "banner")
					.order("created_at", { ascending: false });

				if (bannerError) throw bannerError;
				setBannerAds(bannerData || []);

				// Fetch Sidebar Ads
				const { data: sidebarData, error: sidebarError } =
					await supabase
						.from("ads")
						.select("*")
						.eq("status", "approved")
						.eq("category", "sidebar")
						.order("created_at", { ascending: false });

				if (sidebarError) throw sidebarError;
				setSidebarAds(sidebarData || []);
			} catch (error) {
				console.error("Error fetching ads:", error);
			} finally {
				setAdsLoading(false);
			}
		};

		fetchAds();

		// Realtime subscription with debounce
		let channel = null;
		const timeoutId = setTimeout(() => {
			channel = supabase
				.channel("public:ads")
				.on(
					"postgres_changes",
					{
						event: "*",
						schema: "public",
						table: "ads",
					},
					() => {
						fetchAds();
					},
				)
				.subscribe();
		}, 100);

		return () => {
			clearTimeout(timeoutId);
			if (channel) {
				supabase.removeChannel(channel).catch(() => {});
			}
		};
	}, []);

	const handleNewsletterSubmit = async (e) => {
		e.preventDefault();

		if (!newsletterEmail || !newsletterEmail.trim()) {
			toast.error("Por favor, insira um email válido.");
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(newsletterEmail)) {
			toast.error("Por favor, insira um email válido.");
			return;
		}

		try {
			setSubmitting(true);
			await addNewsletter(newsletterEmail);
			toast.success("Inscrição realizada com sucesso! 🎉");
			setNewsletterEmail("");
		} catch (error) {
			toast.error(error.message);
		} finally {
			setSubmitting(false);
		}
	};

	if (
		(postsLoading && posts.length === 0) ||
		featuredLoading ||
		adsLoading ||
		popularLoading
	) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-primary mx-auto mb-4"></div>
					<p className="text-gray-600">Carregando notícias...</p>
					<p className="text-sm text-gray-500 mt-2">
						Posts: {postsLoading ? "carregando" : "carregado"} |
						Featured: {featuredLoading ? "carregando" : "carregado"}{" "}
						| Popular: {popularLoading ? "carregando" : "carregado"}
					</p>
				</div>
			</div>
		);
	}

	if (postsError || featuredError || popularError) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-600 mb-2">
						Erro ao carregar notícias
					</p>
					<p className="text-sm text-gray-600">
						{postsError || featuredError || popularError}
					</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<Helmet>
				<title>
					Opine Agora SC - Notícias de Santa Catarina | Portal de
					Jornalismo Online
				</title>
				<meta
					name="description"
					content="Leia as últimas notícias de Santa Catarina no Opine Agora SC. Política, economia, sociedade, esportes, cultura e mais. Jornalismo local com credibilidade e transparência. Notícias em tempo real de Concórdia e todo o estado."
				/>
				<meta
					name="keywords"
					content="Opine Agora SC, notícias Santa Catarina, jornalismo SC, Concórdia SC, política catarinense, economia SC, esportes SC, cultura SC, notícias locais, portal de notícias, jornalismo online, Santa Catarina, SC, notícias em tempo real, opinião com credibilidade"
				/>
				<meta
					name="robots"
					content="index, follow, max-snippet:-1, max-image-preview:large"
				/>
				<meta name="language" content="pt-BR" />
				<meta name="geo.region" content="BR-SC" />
				<meta
					name="geo.placename"
					content="Concórdia, Santa Catarina"
				/>
				<link rel="canonical" href="https://opineagorasc.vercel.app" />

				{/* Open Graph */}
				<meta property="og:type" content="website" />
				<meta
					property="og:title"
					content="Opine Agora SC - Notícias de Santa Catarina | Portal de Jornalismo Online"
				/>
				<meta
					property="og:description"
					content="Leia as últimas notícias de Santa Catarina no Opine Agora SC. Política, economia, sociedade, esportes, cultura e mais. Jornalismo local com credibilidade e transparência."
				/>
				<meta
					property="og:url"
					content="https://opineagorasc.vercel.app"
				/>
				<meta property="og:site_name" content="Opine Agora SC" />
				<meta
					property="og:image"
					content="https://opineagorasc.vercel.app/ogimage-opineagorasc.png"
				/>
				<meta property="og:image:width" content="1200" />
				<meta property="og:image:height" content="630" />
				<meta property="og:locale" content="pt_BR" />

				{/* Twitter Card */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta
					name="twitter:title"
					content="Opine Agora SC - Notícias de Santa Catarina | Portal de Jornalismo Online"
				/>
				<meta
					name="twitter:description"
					content="Leia as últimas notícias de Santa Catarina no Opine Agora SC. Política, economia, sociedade, esportes, cultura e mais. Jornalismo local com credibilidade e transparência."
				/>
				<meta
					name="twitter:image"
					content="https://opineagorasc.vercel.app/ogimage-opineagorasc.png"
				/>

				{/* Schema.org Structured Data */}
				<script type="application/ld+json">
					{JSON.stringify({
						"@context": "https://schema.org",
						"@type": "WebSite",
						name: "Opine Agora SC",
						alternateName: "Opine Agora",
						url: "https://opineagorasc.com.br",
						description:
							"Portal de notícias de Santa Catarina com foco em informação local, política, economia e opinião. Comprometido com a verdade e a transparência.",
						potentialAction: {
							"@type": "SearchAction",
							target: "https://opineagorasc.com.br/search?q={search_term_string}",
							"query-input": "required name=search_term_string",
						},
						publisher: {
							"@type": "Organization",
							name: "Opine Agora SC",
							url: "https://opineagorasc.com.br",
							logo: {
								"@type": "ImageObject",
								url: "https://opineagorasc.com.br/ogimage-opineagorasc.png",
							},
						},
					})}
				</script>
			</Helmet>

			{/* Top Banner Ad Section */}
			{bannerAds.length > 0 && (
				<div className="bg-gray-100 border-b border-gray-200 w-full">
					<div className="w-full">
						<Swiper
							modules={[Autoplay]}
							spaceBetween={0}
							slidesPerView={1}
							loop={bannerAds.length > 1}
							allowTouchMove={false} // Disable user swiping as requested "without buttons for user to move"
							autoplay={{
								delay: 5000,
								disableOnInteraction: false,
							}}
							className="w-full"
						>
							{bannerAds.map((ad) => (
								<SwiperSlide key={ad.id}>
									<div className="w-full flex justify-center">
										{ad.link_url ? (
											<a
												href={ad.link_url}
												target="_blank"
												rel="noopener noreferrer"
												className="block w-full"
											>
												<img
													src={ad.image_url}
													alt={ad.title}
													className="w-full h-auto object-cover"
												/>
											</a>
										) : (
											<img
												src={ad.image_url}
												alt={ad.title}
												className="w-full h-auto object-cover"
											/>
										)}
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					</div>
				</div>
			)}

			{/* Hero Section */}
			<section className="bg-gradient-to-br from-navy to-teal-primary text-white py-8 md:py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<Swiper
						modules={[Autoplay, Pagination, Navigation]}
						spaceBetween={30}
						slidesPerView={1}
						pagination={{ clickable: true }}
						autoplay={{
							delay: 5000,
							disableOnInteraction: false,
						}}
						loop={true}
						className="hero-swiper"
					>
						{/* Slide 1: Welcome Message */}
						<SwiperSlide>
							<div className="flex flex-col items-center justify-center text-center h-full min-h-[350px] lg:min-h-[450px] px-4">
								<h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight max-w-4xl">
									Informação com
									<span className="text-orange-warm">
										{" "}
										Credibilidade{" "}
									</span>
									para Santa Catarina
								</h1>
								<p className="text-lg md:text-xl mb-6 md:mb-8 text-gray-100 max-w-2xl">
									Portal de notícias comprometido com a
									verdade, transparência e jornalismo de
									qualidade para a sociedade catarinense.
								</p>
								<div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
									<Link
										to="/categoria/todas"
										className="btn-primary bg-orange-600 hover:bg-orange-700 inline-flex items-center justify-center space-x-2 px-8 py-3 text-lg"
									>
										<Newspaper className="w-6 h-6" />
										<span>Últimas Notícias</span>
									</Link>
								</div>
							</div>
						</SwiperSlide>

						{/* Slides 2+: Featured Posts */}
						{!featuredLoading &&
							featuredPosts?.map((post) => (
								<SwiperSlide key={post.id}>
									<div className="flex items-center justify-center h-full min-h-[350px] lg:min-h-[450px] px-4">
										<div className="w-full max-w-6xl">
											<div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-white/20">
												<div className="grid grid-cols-1 md:grid-cols-2">
													<div className="h-56 md:h-auto relative min-h-[250px] md:min-h-full">
														<img
															src={post.image}
															alt={post.title}
															className="w-full h-full object-cover absolute inset-0"
														/>
														<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
													</div>
													<div className="p-6 md:p-8 lg:p-12 flex flex-col justify-center text-left">
														{post.category && (
															<span className="inline-block px-3 py-1 bg-orange-600 text-white text-xs font-semibold rounded-full mb-3 md:mb-4 w-fit">
																{post.category}
															</span>
														)}
														<Link
															to={`/post/${post.slug || post.id}`}
														>
															<h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 hover:text-orange-warm transition-colors line-clamp-3 md:line-clamp-none leading-tight">
																{post.title}
															</h2>
														</Link>
														<p className="text-gray-200 mb-4 md:mb-6 line-clamp-3 hidden md:block text-base md:text-lg">
															{post.excerpt}
														</p>
														<Link
															to={`/post/${post.slug || post.id}`}
															className="inline-flex items-center text-orange-warm hover:text-white transition-colors font-semibold text-base md:text-lg"
														>
															Ler matéria completa
															<ChevronRight className="w-5 h-5 ml-1" />
														</Link>
													</div>
												</div>
											</div>
										</div>
									</div>
								</SwiperSlide>
							))}
					</Swiper>
				</div>
			</section>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-12">
						{/* Latest News */}
						<section>
							<div className="section-header">
								<h2 className="section-title flex items-center space-x-2">
									<Newspaper className="w-6 h-6 text-teal-primary" />
									<span>Últimas Notícias</span>
								</h2>
								<Link
									to="/categoria/todas"
									className="text-teal-primary hover:text-teal-900 flex items-center space-x-1 text-sm font-medium"
								>
									<span>Ver todas</span>
									<ChevronRight className="w-4 h-4" />
								</Link>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{postsLoading ? (
									<>
										<SkeletonLoader type="card" />
										<SkeletonLoader type="card" />
										<SkeletonLoader type="card" />
										<SkeletonLoader type="card" />
									</>
								) : posts && posts.length > 0 ? (
									posts
										?.slice(0, 4)
										.map((post) => (
											<PostCard
												key={post.id}
												post={post}
											/>
										))
								) : (
									<div className="col-span-2 text-center py-8">
										<p className="text-gray-500">
											Nenhuma notícia encontrada.
										</p>
									</div>
								)}
							</div>
						</section>

						{/* More News */}
						<section>
							<div className="section-header">
								<h2 className="section-title">Mais Notícias</h2>
							</div>

							<div className="space-y-4">
								{posts?.slice(4).map((post) => (
									<PostCard
										key={post.id}
										post={post}
										variant="horizontal"
										hideAuthor={true}
									/>
								))}
							</div>

							{posts && posts.length >= limit && (
								<div className="mt-8 text-center pt-8 border-t border-gray-100">
									<button
										onClick={() =>
											setLimit((prev) => prev + 4)
										}
										disabled={postsLoading}
										className="btn-primary w-full sm:w-auto min-w-[200px]"
									>
										{postsLoading ? (
											<span className="flex items-center justify-center space-x-2">
												<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
												<span>Carregando...</span>
											</span>
										) : (
											"Carregar Mais"
										)}
									</button>
								</div>
							)}
						</section>
					</div>

					{/* Sidebar */}
					<aside className="space-y-8">
						{/* Most Read */}
						<div className="card">
							<div className="p-6">
								<h3 className="section-title text-lg flex items-center space-x-2 mb-4">
									<TrendingUp className="w-5 h-5 text-orange-warm" />
									<span>Mais Lidas</span>
								</h3>
								<div className="space-y-4">
									{popularPosts?.map((post, index) => (
										<Link
											key={post.id}
											to={`/post/${post.slug || post.id}`}
											className="flex items-start space-x-3 group"
										>
											<span className="text-3xl font-bold text-orange-600 flex-shrink-0">
												{String(index + 1).padStart(
													2,
													"0",
												)}
											</span>
											<div className="flex-1">
												<h4 className="font-semibold text-sm group-hover:text-teal-primary transition-colors line-clamp-2">
													{post.title}
												</h4>
											</div>
										</Link>
									))}
								</div>
							</div>
						</div>

						{/* Ad Banner */}
						<div className="bg-gray-100 rounded-lg p-6 text-center border-4 border-dotted border-gray-300">
							<p className="text-sm text-text-secondary mb-2">
								Publicidade
							</p>
							<h3 className="text-lg font-bold text-navy mb-1">
								Anuncie Aqui
							</h3>
							<p className="text-sm text-text-secondary mb-4">
								Entre em contato pelo WhatsApp
							</p>
							<button className="w-full btn-primary bg-navy hover:bg-teal-primary text-sm">
								Contatar Anunciante
							</button>
						</div>

						{/* Comunidade WhatsApp */}
						<div className="card border-4 border-teal-primary">
							<div className="p-6 text-center">
								<div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
									<WhatsAppIcon className="w-8 h-8 text-white" />
								</div>
								<h3 className="text-lg font-bold text-navy mb-3">
									Participe da Comunidade
								</h3>
								<p className="text-sm text-text-secondary mb-4 leading-relaxed">
									Participe da comunidade no WhatsApp do Opine
									Agora SC e receba as principais notícias do
									Oeste Catarinense na palma da sua mão.
								</p>
								<a
									href="https://chat.whatsapp.com/FPhqmB9FoW4HH67zJnVWD2"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
								>
									<Users className="w-5 h-5 mr-2" />
									<span>ENTRAR NA COMUNIDADE</span>
								</a>
								<p className="text-xs text-text-secondary mt-4">
									*Ao entrar você está ciente e de acordo com
									todos os termos de uso e privacidade do
									WhatsApp
								</p>
							</div>
						</div>

						{/* Sidebar Ads */}
						{sidebarAds.length > 0 && (
							<div className="space-y-6">
								{sidebarAds.map((ad) => (
									<div
										key={ad.id}
										className="bg-white rounded-lg shadow-md overflow-hidden"
									>
										{ad.image_url ? (
											<a
												href={ad.link_url}
												target="_blank"
												rel="noopener noreferrer"
												className="block"
											>
												<img
													src={ad.image_url}
													alt={ad.title}
													className="w-full h-auto object-cover"
												/>
											</a>
										) : (
											<div className="p-4 text-center bg-gray-100">
												<p className="text-gray-500">
													{ad.title}
												</p>
												{ad.link_url && (
													<a
														href={ad.link_url}
														target="_blank"
														rel="noopener noreferrer"
														className="text-teal-primary text-sm mt-2 block"
													>
														Saiba mais
													</a>
												)}
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</aside>
				</div>
			</div>

			{/* Ads Section */}
			<section className="bg-gray-50 py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="section-header mb-8">
						<h2 className="section-title flex items-center space-x-2">
							<Megaphone className="w-6 h-6 text-teal-primary" />
							<span>
								Anúncios{" "}
								<span className="text-orange-600">
									Destaque
								</span>
							</span>
						</h2>
						<Link
							to="/anuncios"
							className="text-teal-primary hover:text-teal-900 flex items-center space-x-1 text-sm font-medium"
						>
							<span>Ver todos</span>
							<ChevronRight className="w-4 h-4" />
						</Link>
					</div>

					<Swiper
						modules={[Autoplay, Pagination, Navigation]}
						spaceBetween={24}
						slidesPerView={1}
						navigation
						pagination={{ clickable: true }}
						autoplay={{
							delay: 5000,
							disableOnInteraction: false,
						}}
						loop={true}
						breakpoints={{
							640: {
								slidesPerView: 2,
							},
							1024: {
								slidesPerView: 3,
							},
						}}
						className="pb-12" // Padding bottom for pagination bullets
					>
						{ads.map((ad) => (
							<SwiperSlide key={ad.id} className="h-auto">
								<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
									{/* Ad Image */}
									{ad.image_url ? (
										<a
											href={ad.link_url}
											target="_blank"
											rel="noopener noreferrer"
											className="aspect-video bg-gray-100 block relative overflow-hidden group"
										>
											<img
												src={ad.image_url}
												alt={ad.title}
												className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
											/>
										</a>
									) : (
										<div className="aspect-video bg-gray-100 flex items-center justify-center">
											<Megaphone className="w-12 h-12 text-gray-400" />
										</div>
									)}

									{/* Ad Content */}
									<div className="p-4 flex-1 flex flex-col">
										{ad.link_url ? (
											<a
												href={ad.link_url}
												target="_blank"
												rel="noopener noreferrer"
												className="font-semibold text-navy mb-2 line-clamp-2 block hover:text-teal-primary transition-colors"
											>
												{ad.title}
											</a>
										) : (
											<h3 className="font-semibold text-navy mb-2 line-clamp-2">
												{ad.title}
											</h3>
										)}
										<p className="text-sm text-text-secondary line-clamp-3 mb-3 flex-1">
											{ad.content}
										</p>
									</div>
								</div>
							</SwiperSlide>
						))}
					</Swiper>

					{ads.length === 0 && !adsLoading && (
						<div className="text-center py-12">
							<Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-navy mb-2">
								Nenhum anúncio disponível
							</h3>
							<p className="text-text-secondary">
								Em breve teremos novos anúncios para você.
							</p>
						</div>
					)}
				</div>
			</section>

			{/* Newsletter Section */}
			<section className="bg-gradient-to-br from-navy to-teal-primary text-white py-16">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<div className="flex justify-center mb-6">
						<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
							<Mail className="w-8 h-8 !text-orange-warm" />
						</div>
					</div>
					<h2 className="text-3xl font-bold mb-4">
						Fique por dentro!
					</h2>
					<p className="text-xl mb-8 text-gray-100">
						Receba as principais notícias de Santa Catarina direto
						no seu e-mail.
					</p>
					<form
						onSubmit={handleNewsletterSubmit}
						className="flex flex-col sm:flex-row max-w-md mx-auto space-y-4 sm:space-y-0 sm:space-x-4"
					>
						<div className="w-full sm:flex-1 relative min-w-0">
							<input
								type="email"
								value={newsletterEmail}
								onChange={(e) =>
									setNewsletterEmail(e.target.value)
								}
								placeholder="Seu melhor e-mail"
								className="w-full px-4 py-3 rounded-lg text-navy placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
								required
								disabled={submitting}
							/>
						</div>
						<button
							type="submit"
							disabled={submitting}
							className="group px-6 py-3 bg-white text-teal-primary rounded-lg hover:bg-orange-600 hover:text-white transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
						>
							{submitting ? (
								<>
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-primary"></div>
									<span>Inscrevendo...</span>
								</>
							) : (
								<>
									<Mail className="w-5 h-5 text-orange-600 group-hover:text-white transition-colors" />
									<span>Inscrever-se</span>
								</>
							)}
						</button>
					</form>
				</div>
			</section>
		</>
	);
};

export default Home;
