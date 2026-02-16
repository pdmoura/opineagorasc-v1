import { Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Toaster } from "react-hot-toast";

// Pages
import Home from "./pages/Home";
import Post from "./pages/Post";
import Category from "./pages/Category";
import Eleicoes from "./pages/Eleicoes";
import Sobre from "./pages/Sobre";
import TodasCategorias from "./pages/TodasCategorias";
import Search from "./pages/Search";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import Login from "./pages/Login";
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
				<title>Opine Agora SC - Opinião com Credibilidade</title>
				<meta
					name="description"
					content="Portal de notícias de Santa Catarina com foco em informação local, política, economia e opinião. Comprometido com a verdade e a transparência."
				/>
				<meta
					name="keywords"
					content="notícias, santa catarina, política, economia, opinião, jornalismo"
				/>
				<meta name="author" content="Opine Agora SC" />
				<meta
					property="og:title"
					content="Opine Agora SC - Opinião com Credibilidade"
				/>
				<meta
					property="og:description"
					content="Portal de notícias de Santa Catarina com foco em informação local, política, economia e opinião."
				/>
				<meta property="og:type" content="website" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta
					name="twitter:title"
					content="Opine Agora SC - Opinião com Credibilidade"
				/>
				<meta
					name="twitter:description"
					content="Portal de notícias de Santa Catarina com foco em informação local, política, economia e opinião."
				/>
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
										element={<PoliticaPrivacidade />}
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
