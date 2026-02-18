import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Eye, EyeOff, LogIn, Shield, AlertCircle, Check } from "lucide-react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { getFieldError, translateSupabaseError } from "../lib/validation";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});
	const navigate = useNavigate();
	const location = useLocation();

	// Validação de campos em tempo real
	const validateField = (name, value) => {
		return getFieldError(name, value);
	};

	const handleFieldChange = (name, value) => {
		// Atualiza o valor do campo
		if (name === "email") setEmail(value);
		else if (name === "password") setPassword(value);

		// Valida o campo se já foi tocado
		if (touched[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: validateField(name, value),
			}));
		}
	};

	const handleFieldBlur = (name, value) => {
		// Marca o campo como tocado
		setTouched((prev) => ({
			...prev,
			[name]: true,
		}));

		// Valida o campo
		setErrors((prev) => ({
			...prev,
			[name]: validateField(name, value),
		}));
	};

	// Redirecionar se já estiver autenticado
	useEffect(() => {
		const checkAuth = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (session?.user) {
				const from = location.state?.from?.pathname || "/admin";
				navigate(from, { replace: true });
			}
		};

		checkAuth();
	}, [navigate, location.state]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Marca todos os campos como tocados
		setTouched({ email: true, password: true });

		// Valida todos os campos
		const emailError = validateField("email", email);
		const passwordError = validateField("password", password);

		const newErrors = {
			email: emailError,
			password: passwordError,
		};

		setErrors(newErrors);

		// Se houver erros, não envia o formulário
		if (emailError || passwordError) {
			toast.error("Por favor, corrija os erros no formulário.");
			return;
		}

		setLoading(true);

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) throw error;

			toast.success("Login realizado com sucesso!");

			// Redirecionar para a página que o usuário tentou acessar
			const from = location.state?.from?.pathname || "/admin";

			navigate(from, { replace: true });
		} catch (error) {
			console.error("Login error:", error);
			const translatedError = translateSupabaseError(error);
			toast.error(translatedError);
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

			<div className="min-h-screen bg-gradient-to-br from-navy to-teal-primary flex items-center justify-center px-4 fade-in">
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
									onChange={(e) =>
										handleFieldChange(
											"email",
											e.target.value,
										)
									}
									onBlur={(e) =>
										handleFieldBlur("email", e.target.value)
									}
									className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
										errors.email && touched.email
											? "border-red-500 focus:ring-red-500"
											: !errors.email && touched.email
												? "border-green-500 focus:ring-green-500"
												: "border-gray-300 focus:ring-teal-primary"
									}`}
									placeholder="seu@email.com"
									required
								/>
								{errors.email && touched.email && (
									<div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
										<AlertCircle className="w-4 h-4" />
										<span>{errors.email}</span>
									</div>
								)}
								{!errors.email && touched.email && email && (
									<div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
										<Check className="w-4 h-4" />
										<span>Email válido</span>
									</div>
								)}
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
											handleFieldChange(
												"password",
												e.target.value,
											)
										}
										onBlur={(e) =>
											handleFieldBlur(
												"password",
												e.target.value,
											)
										}
										className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
											errors.password && touched.password
												? "border-red-500 focus:ring-red-500"
												: !errors.password &&
													  touched.password
													? "border-green-500 focus:ring-green-500"
													: "border-gray-300 focus:ring-teal-primary"
										}`}
										placeholder="••••••••"
										required
									/>
									<button
										type="button"
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary z-20 p-1"
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
								{errors.password && touched.password && (
									<div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
										<AlertCircle className="w-4 h-4" />
										<span>{errors.password}</span>
									</div>
								)}
								{!errors.password &&
									touched.password &&
									password &&
									password.length >= 6 && (
										<div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
											<Check className="w-4 h-4" />
											<span>Senha válida</span>
										</div>
									)}
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
