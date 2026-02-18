import React, { useState, useEffect, useRef } from "react";
import {
	MessageSquare,
	User,
	Mail,
	Send,
	AlertCircle,
	Check,
} from "lucide-react";
import toast from "react-hot-toast";
import { getFieldError, validateEmail } from "../../lib/validation";

const CommentForm = ({ postId, onSubmit, submitting }) => {
	const [cooldownTime, setCooldownTime] = useState(0);
	const [showCooldownMessage, setShowCooldownMessage] = useState(false);
	const toastShownRef = useRef(false);
	const submissionLock = useRef(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		content: "",
		// CAMPO HONEYPOT: Bots vão preencher isso, humanos não vão ver
		website: "",
	});

	// Verifica se o usuário está no período de "cooldown" de 5 minutos
	useEffect(() => {
		const lastComment = localStorage.getItem(`lastCommentTime_${postId}`);

		if (lastComment) {
			const timePassed = Date.now() - parseInt(lastComment);
			const cooldown = 5 * 60 * 1000; // 5 minutos em milissegundos

			if (timePassed < cooldown) {
				const minutesRemaining = Math.ceil(
					(cooldown - timePassed) / 60000,
				);

				// Força atualização do estado
				setCooldownTime(minutesRemaining);
				setShowCooldownMessage(true);

				// Mostra toast apenas uma vez por período de cooldown
				if (!toastShownRef.current) {
					toastShownRef.current = true;
					toast.error(
						`Aguarde ${minutesRemaining} minutos para comentar novamente neste post.`,
						{
							duration: 5000, // 5 segundos
							position: "top-center",
						},
					);
				}
			} else {
				localStorage.removeItem(`lastCommentTime_${postId}`);
				setShowCooldownMessage(false);
				toastShownRef.current = false; // Reset ref when cooldown expires
			}
		} else {
			setShowCooldownMessage(false);
			toastShownRef.current = false; // Reset ref when no cooldown
		}
	}, [postId]);

	// Countdown do cooldown
	useEffect(() => {
		if (cooldownTime > 0) {
			const timer = setTimeout(() => {
				setCooldownTime((prev) => prev - 1);
			}, 60000); // 1 minuto

			return () => clearTimeout(timer);
		} else {
			// Quando o cooldown acabar, esconde a mensagem
			setShowCooldownMessage(false);
		}
	}, [cooldownTime]);

	// Validação de campos em tempo real
	const validateField = (name, value) => {
		return getFieldError(name, value);
	};

	const handleFieldChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

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

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Debug log
		console.log("handleSubmit called", {
			isSubmitting,
			submitting,
			lock: submissionLock.current,
			timestamp: Date.now(),
		});

		// Prevenir envios duplicados no formulário
		if (isSubmitting || submitting || submissionLock.current) {
			console.warn("Form submission prevented: already in progress");
			return;
		}

		// 1. PROTEÇÃO HONEYPOT: Se o campo oculto foi preenchido, é um BOT!
		if (formData.website !== "") {
			console.warn("Bot detectado pelo Honeypot!");
			toast.success("Comentário enviado com sucesso!"); // Fingimos sucesso para enganar o bot
			return;
		}

		// 2. PROTEÇÃO DE SPAM FRONTEND: Verifica limite de tempo apenas se já comentou antes
		if (showCooldownMessage && cooldownTime > 0) {
			return;
		}

		// 3. VALIDAÇÃO DOS CAMPOS
		// Marca todos os campos como tocados
		setTouched({ name: true, email: true, content: true });

		// Valida todos os campos
		const nameError = validateField("name", formData.name);
		const emailError = validateField("email", formData.email);
		const contentError = validateField("content", formData.content);

		const newErrors = {
			name: nameError,
			email: emailError,
			content: contentError,
		};

		setErrors(newErrors);

		// Se houver erros, não envia o formulário
		if (nameError || emailError || contentError) {
			toast.error("Por favor, corrija os erros no formulário.");
			return;
		}

		try {
			// Lock submission immediately
			toastShownRef.current = "submitting";
			submissionLock.current = true;
			setIsSubmitting(true);

			// Removemos o honeypot antes de enviar para a base de dados
			const { website, ...dataToSubmit } = formData;

			// Chama o hook e verifica se teve sucesso real
			const result = await onSubmit({
				post_id: postId,
				...dataToSubmit,
			});

			// Verifica se o resultado é truthy (comentário inserido com sucesso)
			if (result) {
				// Salva o momento do comentário no navegador
				localStorage.setItem(
					`lastCommentTime_${postId}`,
					Date.now().toString(),
				);
				setCooldownTime(5);
				setShowCooldownMessage(true); // Ativa a mensagem para próximos comentários
				// Keep toastShownRef as true for cooldown message
				toastShownRef.current = true;

				// Reset form on success
				setFormData({
					name: "",
					email: "",
					content: "",
					website: "",
				});
				// Reset errors e touched
				setErrors({});
				setTouched({});
			} else {
				// If result is false (failed), reset the lock
				toastShownRef.current = false;
			}
		} catch (error) {
			// Error é tratado no hook, mas mantemos try/catch por segurança
			console.error("Error in form submission:", error);
			toastShownRef.current = false;
		} finally {
			setIsSubmitting(false);
			submissionLock.current = false;
			console.log("Submission finished, lock released");

			// Fix toastShownRef state if it was stuck in submitting
			if (toastShownRef.current === "submitting") {
				toastShownRef.current = false;
			}
		}
	};

	return (
		<div className="bg-gray-50 rounded-lg p-6 mb-8">
			<h3 className="text-lg font-semibold text-navy mb-4 flex items-center space-x-2">
				<MessageSquare className="w-5 h-5 text-teal-primary" />
				<span>Deixe seu comentário</span>
			</h3>

			{cooldownTime > 0 ? (
				<>
					<div className="bg-orange-50 text-orange-800 p-4 rounded-lg flex items-start space-x-3 mb-4">
						<AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
						<div>
							<p className="font-medium">
								Limite de comentários atingido
							</p>
							<p className="text-sm mt-1">
								Para evitar spam, permitimos um comentário a
								cada 5 minutos. Por favor, aguarde cerca de{" "}
								<strong>{cooldownTime} minutos</strong> para
								enviar novamente.
							</p>
						</div>
					</div>

					<button
						type="button"
						disabled={true}
						className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<AlertCircle className="w-4 h-4" />
						<span>Aguarde {cooldownTime} minutos</span>
					</button>
				</>
			) : (
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* HONEYPOT INVISÍVEL */}
					<div
						className="opacity-0 absolute h-0 w-0 overflow-hidden"
						aria-hidden="true"
					>
						<label htmlFor="website">
							Website (Deixe em branco se for humano)
						</label>
						<input
							type="text"
							id="website"
							name="website"
							value={formData.website}
							onChange={handleFieldChange}
							tabIndex="-1"
							autoComplete="off"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Name */}
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-text-primary mb-2"
							>
								Nome *
							</label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary z-20 pointer-events-none" />
								<input
									type="text"
									id="name"
									name="name"
									value={formData.name}
									onChange={handleFieldChange}
									onBlur={(e) =>
										handleFieldBlur("name", e.target.value)
									}
									className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
										errors.name && touched.name
											? "border-red-500 focus:ring-red-500"
											: !errors.name && touched.name
												? "border-green-500 focus:ring-green-500"
												: "border-gray-300 focus:ring-teal-primary"
									}`}
									placeholder="Seu nome"
									required
									minLength={2}
									maxLength={100}
								/>
							</div>
							{errors.name && touched.name && (
								<div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
									<AlertCircle className="w-4 h-4" />
									<span>{errors.name}</span>
								</div>
							)}
							{!errors.name &&
								touched.name &&
								formData.name &&
								formData.name.length >= 2 && (
									<div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
										<Check className="w-4 h-4" />
										<span>Nome válido</span>
									</div>
								)}
						</div>

						{/* Email */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-text-primary mb-2"
							>
								Email *
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary z-20 pointer-events-none" />
								<input
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleFieldChange}
									onBlur={(e) =>
										handleFieldBlur("email", e.target.value)
									}
									className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
										errors.email && touched.email
											? "border-red-500 focus:ring-red-500"
											: !errors.email && touched.email
												? "border-green-500 focus:ring-green-500"
												: "border-gray-300 focus:ring-teal-primary"
									}`}
									placeholder="seu@email.com"
									required
									minLength={5}
									maxLength={255}
								/>
							</div>
							{errors.email && touched.email && (
								<div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
									<AlertCircle className="w-4 h-4" />
									<span>{errors.email}</span>
								</div>
							)}
							{!errors.email &&
								touched.email &&
								formData.email &&
								validateEmail(formData.email) && (
									<div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
										<Check className="w-4 h-4" />
										<span>Email válido</span>
									</div>
								)}
						</div>
					</div>

					{/* Comment */}
					<div>
						<label
							htmlFor="content"
							className="block text-sm font-medium text-text-primary mb-2"
						>
							Comentário *
						</label>
						<textarea
							id="content"
							name="content"
							value={formData.content}
							onChange={handleFieldChange}
							onBlur={(e) =>
								handleFieldBlur("content", e.target.value)
							}
							rows={4}
							className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none transition-colors ${
								errors.content && touched.content
									? "border-red-500 focus:ring-red-500"
									: !errors.content && touched.content
										? "border-green-500 focus:ring-green-500"
										: "border-gray-300 focus:ring-teal-primary"
							}`}
							placeholder="Digite seu comentário aqui..."
							required
							minLength={10}
							maxLength={2000}
						/>
						{errors.content && touched.content && (
							<div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
								<AlertCircle className="w-4 h-4" />
								<span>{errors.content}</span>
							</div>
						)}
						{!errors.content &&
							touched.content &&
							formData.content &&
							formData.content.length >= 10 && (
								<div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
									<Check className="w-4 h-4" />
									<span>Comentário válido</span>
								</div>
							)}
						<div className="text-right text-xs text-text-secondary mt-1">
							{formData.content.length}/2000 caracteres
						</div>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						disabled={submitting || isSubmitting}
						className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{submitting || isSubmitting ? (
							<>
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
								<span>Enviando...</span>
							</>
						) : (
							<>
								<Send className="w-4 h-4" />
								<span>Enviar comentário</span>
							</>
						)}
					</button>
				</form>
			)}
		</div>
	);
};

export default CommentForm;
