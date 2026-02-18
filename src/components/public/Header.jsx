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
		{ name: "Concórdia", href: "/concordia" },
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
			// Rolar para o topo da página
			window.scrollTo(0, 0);
		}
	};

	return (
		<header className="bg-white shadow-md sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<Link to="/" className="flex items-center space-x-3">
						<div className="flex flex-col items-start">
							<div className="flex items-center gap-0.5">
								<span className="font-montserrat text-xl sm:text-2xl md:text-2xl lg:text-3xl font-black tracking-tight leading-none text-navy">
									OPINE
								</span>
								<span className="font-montserrat text-xl sm:text-2xl md:text-2xl lg:text-3xl font-black tracking-tight leading-none text-orange-600">
									AGORA
								</span>
								<span className="font-montserrat text-xs sm:text-sm font-bold text-navy bg-cream px-1.5 py-0.5 rounded ml-1">
									SC
								</span>
							</div>
							<span className="font-montserrat text-[10px] sm:text-xs text-navy tracking-widest uppercase font-semibold mt-1 block">
								Opinião com Credibilidade
							</span>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center md:space-x-4 lg:space-x-6 xl:space-x-8">
						{navigation.map((item) => (
							<Link
								key={item.name}
								to={item.href}
								className={`relative pb-1 md:text-sm lg:text-base xl:text-lg font-bold transition-colors hover:text-orange-600 ${
									isActive(item.href)
										? "text-orange-600"
										: "text-navy"
								}`}
							>
								{item.name}
								{isActive(item.href) && (
									<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-orange-600 rounded-full" />
								)}
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
							<Search className="w-6 h-6 text-text-secondary" />
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
							<Menu className="w-6 h-6 text-text-primary" />
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				<div
					className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ease-in-out ${
						isMenuOpen
							? "opacity-100 pointer-events-auto"
							: "opacity-0 pointer-events-none"
					}`}
				>
					{/* Backdrop */}
					<div
						className="absolute inset-0 bg-black/50"
						onClick={() => setIsMenuOpen(false)}
					/>

					{/* Menu Panel */}
					<div
						className={`absolute top-0 left-0 bottom-0 w-[280px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
							isMenuOpen ? "translate-x-0" : "-translate-x-full"
						}`}
					>
						{/* Menu Header with Logo and Close Button */}
						<div className="flex items-center justify-between p-4 border-b border-gray-100">
							<div className="flex flex-col items-start">
								<div className="flex items-center gap-0.5">
									<span className="font-montserrat text-lg font-black tracking-tight leading-none text-navy">
										OPINE
									</span>
									<span className="font-montserrat text-lg font-black tracking-tight leading-none text-orange-600">
										AGORA
									</span>
									<span className="font-montserrat text-[10px] font-bold text-navy bg-cream px-1 py-0.5 rounded ml-1">
										SC
									</span>
								</div>
							</div>
							<button
								onClick={() => setIsMenuOpen(false)}
								className="p-1 rounded-full hover:bg-gray-100 transition-colors"
							>
								<X className="w-6 h-6 text-text-primary" />
							</button>
						</div>

						{/* Menu Links */}
						<div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
							{navigation.map((item) => (
								<Link
									key={item.name}
									to={item.href}
									onClick={() => setIsMenuOpen(false)}
									className={`block px-3 py-3 rounded-md text-base font-semibold transition-colors ${
										isActive(item.href)
											? "text-orange-600 bg-orange-50"
											: "text-navy hover:bg-gray-50"
									}`}
								>
									{item.name}
								</Link>
							))}

							{user && (
								<>
									<div className="my-2 border-t border-gray-100" />
									<Link
										to="/admin"
										onClick={() => setIsMenuOpen(false)}
										className="block px-3 py-3 rounded-md text-base font-medium text-navy hover:bg-gray-50"
									>
										<div className="flex items-center space-x-3">
											<User className="w-5 h-5" />
											<span>Painel Admin</span>
										</div>
									</Link>
									<button
										onClick={handleSignOut}
										className="w-full text-left px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
									>
										<div className="flex items-center space-x-3">
											<LogOut className="w-5 h-5" />
											<span>Sair</span>
										</div>
									</button>
								</>
							)}
						</div>

						{/* Menu Footer */}
						<div className="p-4 border-t border-gray-100 bg-gray-50">
							<p className="text-xs text-center text-text-secondary">
								&copy; {new Date().getFullYear()} Opine Agora SC
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Search Modal */}
			{isSearchOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20"
					onClick={() => setIsSearchOpen(false)}
				>
					<div
						className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4"
						onClick={(e) => e.stopPropagation()}
					>
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
