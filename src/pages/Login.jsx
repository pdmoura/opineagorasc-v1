import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Eye, EyeOff, LogIn, Shield } from "lucide-react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	// Redirecionar se já estiver autenticado
	useEffect(() => {
		const checkAuth = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (session?.user) {
				console.log(
					"🔑 Login - User already authenticated, redirecting",
				);
				const from = location.state?.from?.pathname || "/admin";
				navigate(from, { replace: true });
			}
		};

		checkAuth();
	}, [navigate, location.state]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!email || !password) {
			toast.error("Por favor, preencha todos os campos.");
			return;
		}

		setLoading(true);

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) throw error;

			console.log("✅ Login - Authentication successful");
			toast.success("Login realizado com sucesso!");

			// Redirecionar para a página que o usuário tentou acessar
			const from = location.state?.from?.pathname || "/admin";
			console.log("🔑 Login - Redirecting to:", from);
			navigate(from, { replace: true });
		} catch (error) {
			console.error("Login error:", error);
			toast.error(
				error.message ||
					"Erro ao fazer login. Verifique suas credenciais.",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Helmet>
				<title>Login - Opine Agora SC</title>
				<meta
					name="description"
					content="Área administrativa do portal Opine Agora SC"
				/>
			</Helmet>

			<div className="min-h-screen bg-gradient-to-br from-navy to-teal-primary flex items-center justify-center px-4">
				<div className="max-w-md w-full">
					{/* Logo */}
					<div className="text-center mb-8">
						<div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
							<span className="text-teal-primary font-bold text-2xl">
								OA
							</span>
						</div>
						<h1 className="text-3xl font-bold text-white mb-2">
							Opine Agora SC
						</h1>
						<p className="text-gray-200">Painel Administrativo</p>
					</div>

					{/* Login Form */}
					<div className="bg-white rounded-xl shadow-2xl p-8">
						<div className="text-center mb-6">
							<div className="w-12 h-12 bg-teal-primary rounded-full flex items-center justify-center mx-auto mb-3">
								<Shield className="w-6 h-6 text-white" />
							</div>
							<h2 className="text-2xl font-bold text-navy mb-2">
								Acesso Restrito
							</h2>
							<p className="text-text-secondary text-sm">
								Entre com suas credenciais para acessar o painel
								administrativo
							</p>
						</div>

						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Email */}
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-text-primary mb-2"
								>
									E-mail
								</label>
								<input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
									placeholder="seu@email.com"
									required
								/>
							</div>

							{/* Password */}
							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-text-primary mb-2"
								>
									Senha
								</label>
								<div className="relative">
									<input
										id="password"
										type={
											showPassword ? "text" : "password"
										}
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
										placeholder="••••••••"
										required
									/>
									<button
										type="button"
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
										aria-label={
											showPassword
												? "Ocultar senha"
												: "Mostrar senha"
										}
									>
										{showPassword ? (
											<EyeOff className="w-5 h-5" />
										) : (
											<Eye className="w-5 h-5" />
										)}
									</button>
								</div>
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								disabled={loading}
								className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? (
									<>
										<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
										<span>Entrando...</span>
									</>
								) : (
									<>
										<LogIn className="w-5 h-5" />
										<span>Entrar</span>
									</>
								)}
							</button>
						</form>

						{/* Back to Site */}
						<div className="mt-6 text-center">
							<Link
								to="/"
								className="text-teal-primary hover:text-teal-900 font-medium text-sm flex items-center justify-center space-x-1"
							>
								<span>Voltar para o site</span>
							</Link>
						</div>
					</div>

					{/* Security Notice */}
					<div className="mt-8 text-center">
						<p className="text-gray-300 text-xs">
							Área restrita a usuários autorizados. Todas as
							atividades são registradas.
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;
