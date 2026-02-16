import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, User, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const { user, signOut } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();

	const navigation = [
		{ name: "Início", href: "/" },
		{ name: "Eleições", href: "/eleicoes" },
		{ name: "Sobre", href: "/sobre" },
		{ name: "Categorias", href: "/categoria/todas" },
	];

	const isActive = (path) => {
		if (path === "/") {
			return location.pathname === "/";
		}
		return location.pathname.startsWith(path);
	};

	const handleSignOut = async () => {
		try {
			await signOut();
			setIsMenuOpen(false);
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
			setIsSearchOpen(false);
		}
	};

	return (
		<header className="bg-white shadow-md sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<Link to="/" className="flex items-center space-x-3">
						<div className="w-10 h-10 bg-teal-primary rounded-lg flex items-center justify-center shadow-lg">
							<span
								className="text-white font-bold text-xl"
								style={{
									fontFamily: "Arial, sans-serif",
									fontWeight: "900",
									letterSpacing: "-0.05em",
									textShadow: "0 1px 2px rgba(0,0,0,0.3)",
									transform: "scale(1.1)",
								}}
							>
								OA
							</span>
						</div>
						<div>
							<h1 className="text-xl font-bold">
								Opine{" "}
								<span className="text-orange-warm">Agora</span>{" "}
								<span className="text-orange-warm">OA</span> SC
							</h1>
							<p className="text-xs text-text-secondary">
								Opinião com Credibilidade
							</p>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-8">
						{navigation.map((item) => (
							<Link
								key={item.name}
								to={item.href}
								className={`text-sm font-medium transition-colors hover:text-teal-primary ${
									isActive(item.href)
										? "text-teal-primary"
										: "text-text-primary"
								}`}
							>
								{item.name}
							</Link>
						))}
					</nav>

					{/* Right side - Search (desktop only) */}
					<div className="hidden md:flex items-center space-x-4">
						{/* Search */}
						<button
							onClick={() => setIsSearchOpen(true)}
							className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
							title="Buscar"
						>
							<Search className="w-5 h-5 text-text-secondary" />
						</button>
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden flex items-center space-x-2">
						{/* Mobile search */}
						<button
							onClick={() => setIsSearchOpen(true)}
							className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
							aria-label="Buscar"
						>
							<Search className="w-5 h-5 text-text-primary" />
						</button>
						{/* Mobile menu toggle */}
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
							aria-label="Menu"
						>
							{isMenuOpen ? (
								<X className="w-6 h-6 text-text-primary" />
							) : (
								<Menu className="w-6 h-6 text-text-primary" />
							)}
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<div className="md:hidden border-t border-gray-200">
						<div className="px-2 pt-2 pb-3 space-y-1">
							{navigation.map((item) => (
								<Link
									key={item.name}
									to={item.href}
									onClick={() => setIsMenuOpen(false)}
									className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
										isActive(item.href)
											? "text-teal-primary bg-teal-50"
											: "text-text-primary hover:bg-gray-100"
									}`}
								>
									{item.name}
								</Link>
							))}

							{user ? (
								<>
									<Link
										to="/admin"
										onClick={() => setIsMenuOpen(false)}
										className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:bg-gray-100"
									>
										<div className="flex items-center space-x-2">
											<User className="w-4 h-4" />
											<span>Painel Admin</span>
										</div>
									</Link>
									<button
										onClick={handleSignOut}
										className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-text-primary hover:bg-gray-100"
									>
										<div className="flex items-center space-x-2">
											<LogOut className="w-4 h-4" />
											<span>Sair</span>
										</div>
									</button>
								</>
							) : (
								<Link
									to="/login"
									onClick={() => setIsMenuOpen(false)}
									className="block px-3 py-2 rounded-md text-base font-medium text-white bg-teal-primary hover:bg-teal-900"
								>
									Entrar
								</Link>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Search Modal */}
			{isSearchOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
					<div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
						<form onSubmit={handleSearch} className="p-4">
							<div className="flex items-center space-x-3">
								<Search className="w-5 h-5 text-text-secondary" />
								<input
									type="text"
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
									placeholder="Buscar notícias..."
									className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
									autoFocus
								/>
								<button
									type="button"
									onClick={() => setIsSearchOpen(false)}
									className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
								>
									<X className="w-5 h-5 text-text-primary" />
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;
