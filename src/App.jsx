import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { useSmoothScroll } from "./hooks/useSmoothScroll";

// Configuração para eliminar warnings do React Router v7
const routerConfig = {
	future: {
		v7_startTransition: true,
		v7_relativeSplatPath: true,
	},
};

// Pages
import Home from "./pages/Home";
import Post from "./pages/Post";
import Category from "./pages/Category";
import Eleicoes from "./pages/Eleicoes";
import Concordia from "./pages/Concordia";
import Sobre from "./pages/Sobre";
import TodasCategorias from "./pages/TodasCategorias";
import Search from "./pages/Search";
import PoliticaTermos from "./pages/PoliticaTermos";
import Login from "./pages/Login";
import AllAds from "./pages/AllAds";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagePosts from "./pages/admin/ManagePosts";
import ManageAds from "./pages/admin/ManageAds";
import ManageComments from "./pages/admin/ManageComments";
import ManageNewsletters from "./pages/admin/ManageNewsletters";
import PostForm from "./components/admin/PostForm";
import AdForm from "./components/admin/AdForm";

// Components
import Header from "./components/public/Header";
import Footer from "./components/public/Footer";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import AdminRoute from "./components/auth/AdminRoute";

// Hooks
import { useAuth } from "./hooks/useAuth";

function App() {
	const { user, loading } = useAuth();
	useSmoothScroll(); // Hook para scroll suave global

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-primary mx-auto mb-4"></div>
					<p className="text-gray-600">Carregando...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col">
			<Helmet>
				<title>
					Opine Agora SC - Opinião com Credibilidade | Notícias de
					Santa Catarina
				</title>
				<meta
					name="description"
					content="Portal de notícias de Santa Catarina com foco em informação local, política, economia e opinião. Comprometido com a verdade e a transparência. Opine Agora SC - sua fonte confiável de notícias."
				/>
				<meta
					name="keywords"
					content="Opine Agora SC, Opine Agora, notícias Santa Catarina, jornalismo SC, política Santa Catarina, economia SC, Concórdia SC, notícias locais, portal de notícias, jornalismo online, opinião com credibilidade, Santa Catarina, SC, notícias em tempo real, política catarinense, economia catarinense"
				/>
				<meta name="author" content="Opine Agora SC" />
				<meta
					name="robots"
					content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
				/>
				<meta name="language" content="pt-BR" />
				<meta name="geo.region" content="BR-SC" />
				<meta
					name="geo.placename"
					content="Concórdia, Santa Catarina"
				/>
				<meta name="ICBM" content="-27.2344,-52.2752" />
				<link rel="canonical" href="https://opineagorasc.vercel.app" />

				{/* AI and Crawler Friendly */}
				<meta name="referrer" content="no-referrer-when-downgrade" />
				<meta name="format-detection" content="telephone=no" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="application-name" content="Opine Agora SC" />

				{/* AI Discovery */}
				<meta name="author" content="Opine Agora SC" />
				<meta name="publisher" content="Opine Agora SC" />
				<meta name="category" content="News, Journalism, Media" />
				<meta name="coverage" content="Worldwide" />
				<meta name="distribution" content="Global" />
				<meta name="rating" content="General" />

				{/* AI Friendly */}
				<meta
					name="ai-summary"
					content="Portal de notícias de Santa Catarina com foco em jornalismo local, política, economia e opinião. Comprometido com a verdade e transparência."
				/>
				<meta
					name="ai-context"
					content="Jornalismo, Notícias, Santa Catarina, Política, Economia, Sociedade, Esportes, Cultura, Educação, Saúde"
				/>

				{/* Open Graph */}
				<meta property="og:type" content="website" />
				<meta
					property="og:title"
					content="Opine Agora SC - Opinião com Credibilidade | Notícias de Santa Catarina"
				/>
				<meta
					property="og:description"
					content="Portal de notícias de Santa Catarina com foco em informação local, política, economia e opinião. Comprometido com a verdade e a transparência."
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
				<meta
					property="og:image:alt"
					content="Opine Agora SC - Portal de Notícias de Santa Catarina"
				/>
				<meta property="og:locale" content="pt_BR" />

				{/* Twitter Card */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta
					name="twitter:title"
					content="Opine Agora SC - Opinião com Credibilidade | Notícias de Santa Catarina"
				/>
				<meta
					name="twitter:description"
					content="Portal de notícias de Santa Catarina com foco em informação local, política, economia e opinião. Comprometido com a verdade e a transparência."
				/>
				<meta
					name="twitter:image"
					content="https://opineagorasc.vercel.app/ogimage-opineagorasc.png"
				/>
				<meta
					name="twitter:image:alt"
					content="Opine Agora SC - Portal de Notícias de Santa Catarina"
				/>

				{/* Schema.org Structured Data - Enhanced for AI */}
				<script type="application/ld+json">
					{JSON.stringify({
						"@context": "https://schema.org",
						"@type": "NewsMediaOrganization",
						name: "Opine Agora SC",
						alternateName: "Opine Agora",
						url: "https://opineagorasc.vercel.app",
						logo: {
							"@type": "ImageObject",
							url: "https://opineagorasc.vercel.app/ogimage-opineagorasc.png",
							width: 1200,
							height: 630,
						},
						description:
							"Portal de notícias de Santa Catarina com foco em informação local, política, economia e opinião. Comprometido com a verdade e a transparência.",
						sameAs: ["https://opineagorasc.com.br"],
						address: {
							"@type": "PostalAddress",
							addressLocality: "Concórdia",
							addressRegion: "SC",
							addressCountry: "BR",
						},
						contactPoint: {
							"@type": "ContactPoint",
							email: "contato@opineagora.com.br",
							contactType: "customer service",
						},
						areaServed: {
							"@type": "Place",
							name: "Santa Catarina, Brazil",
						},
						knowsAbout: [
							"Política de Santa Catarina",
							"Economia Catarinense",
							"Notícias Locais",
							"Jornalismo Online",
							"Sociedade Catarinense",
							"Esportes em SC",
							"Cultura em Santa Catarina",
							"Educação SC",
							"Saúde em Santa Catarina",
						],
						makesOffer: [
							{
								"@type": "Offer",
								itemOffered: {
									"@type": "Service",
									name: "Notícias e Jornalismo",
									description:
										"Conteúdo jornalístico sobre Santa Catarina",
								},
							},
						],
					})}
				</script>
			</Helmet>

			<Routes>
				{/* Auth Routes - Sem Header e Footer */}
				<Route
					path="/login"
					element={
						<PublicRoute>
							<Login />
						</PublicRoute>
					}
				/>

				{/* Admin Routes - Sem Header e Footer */}
				<Route
					path="/admin/*"
					element={
						<AdminRoute>
							<Routes>
								<Route path="/" element={<AdminDashboard />} />
								<Route path="posts" element={<ManagePosts />} />
								<Route
									path="posts/new"
									element={<PostForm />}
								/>
								<Route
									path="posts/edit/:id"
									element={<PostForm />}
								/>
								<Route path="ads" element={<ManageAds />} />
								<Route path="ads/new" element={<AdForm />} />
								<Route
									path="ads/edit/:id"
									element={<AdForm />}
								/>
								<Route
									path="comments"
									element={<ManageComments />}
								/>
								<Route
									path="newsletters"
									element={<ManageNewsletters />}
								/>
							</Routes>
						</AdminRoute>
					}
				/>

				{/* Public Routes - Com Header e Footer */}
				<Route
					path="/*"
					element={
						<>
							<Header />
							<main className="flex-1">
								<Routes>
									<Route path="/" element={<Home />} />
									<Route
										path="/categoria/:category"
										element={<Category />}
									/>
									<Route
										path="/eleicoes"
										element={<Eleicoes />}
									/>
									<Route
										path="/concordia"
										element={<Concordia />}
									/>
									<Route path="/sobre" element={<Sobre />} />
									<Route
										path="/categoria/todas"
										element={<TodasCategorias />}
									/>
									<Route
										path="/post/:slug"
										element={<Post />}
									/>
									<Route
										path="/search"
										element={<Search />}
									/>
									<Route
										path="/politica-privacidade"
										element={<PoliticaTermos />}
									/>
									<Route
										path="/termos-uso"
										element={<PoliticaTermos />}
									/>
									<Route
										path="/anuncios"
										element={<AllAds />}
									/>
									{/* Fallback */}
									<Route path="*" element={<Home />} />
								</Routes>
							</main>
							<Footer />
						</>
					}
				/>
			</Routes>

			{/* Toast Notifications */}
			<Toaster
				position="top-right"
				toastOptions={{
					duration: 4000,
					style: {
						background: "#363636",
						color: "#fff",
					},
					success: {
						duration: 3000,
						iconTheme: {
							primary: "#008080",
							secondary: "#fff",
						},
					},
					error: {
						duration: 5000,
						iconTheme: {
							primary: "#ff6b35",
							secondary: "#fff",
						},
					},
				}}
			/>
		</div>
	);
}

export default App;
