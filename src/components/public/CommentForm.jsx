import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, User, Mail, Send, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const CommentForm = ({ postId, onSubmit, submitting }) => {
	const [cooldownTime, setCooldownTime] = useState(0);
	const [showCooldownMessage, setShowCooldownMessage] = useState(false);
	const toastShownRef = useRef(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		content: "",
		// CAMPO HONEYPOT: Bots vão preencher isso, humanos não vão ver
		website: "",
	});

	// Verifica se o usuário está no período de "cooldown" de 5 minutos
	useEffect(() => {
		const lastComment = localStorage.getItem("lastCommentTime");

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
						`Aguarde ${minutesRemaining} minutos para comentar novamente.`,
						{
							duration: 5000, // 5 segundos
							position: "top-center",
						},
					);
				}
			} else {
				localStorage.removeItem("lastCommentTime");
				setShowCooldownMessage(false);
				toastShownRef.current = false; // Reset ref when cooldown expires
			}
		} else {
			setShowCooldownMessage(false);
			toastShownRef.current = false; // Reset ref when no cooldown
		}
	}, []);

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

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

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

		try {
			// Removemos o honeypot antes de enviar para a base de dados
			const { website, ...dataToSubmit } = formData;

			// Chama o hook e verifica se teve sucesso real
			const success = await onSubmit({
				post_id: postId,
				...dataToSubmit,
			});

			// Só mostra sucesso e ativa cooldown se realmente foi inserido no banco
			if (success) {
				// Salva o momento do comentário no navegador
				localStorage.setItem("lastCommentTime", Date.now().toString());
				setCooldownTime(5);
				setShowCooldownMessage(true); // Ativa a mensagem para próximos comentários

				// Reset form on success
				setFormData({
					name: "",
					email: "",
					content: "",
					website: "",
				});
			}
		} catch (error) {
			// Error é tratado no hook, mas mantemos try/catch por segurança
			console.error("Error in form submission:", error);
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

					{/* Botão desativado durante o cooldown */}
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
					{/* HONEYPOT INVISÍVEL (Importante: opacity-0 e h-0 para esconder sem usar display:none, pois alguns bots ignoram display:none) */}
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
							onChange={handleChange}
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
								<User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
								<input
									type="text"
									id="name"
									name="name"
									value={formData.name}
									onChange={handleChange}
									className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
									placeholder="Seu nome"
									required
									minLength={2}
									maxLength={100}
								/>
							</div>
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
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
								<input
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
									placeholder="seu@email.com"
									required
									minLength={5}
									maxLength={255}
								/>
							</div>
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
							onChange={handleChange}
							rows={4}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent resize-none"
							placeholder="Digite seu comentário aqui..."
							required
							minLength={10}
							maxLength={2000}
						/>
						<div className="text-right text-xs text-text-secondary mt-1">
							{formData.content.length}/2000 caracteres
						</div>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						disabled={submitting}
						className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{submitting ? (
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
