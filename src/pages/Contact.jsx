import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { Send, Check, Mail, Phone, MapPin } from "lucide-react";
import { Helmet } from "react-helmet-async";

const Contact = () => {
	const [formData, setFormData] = useState({
		from_name: "",
		reply_to: "",
		message: "",
		honeypot: "", // Campo invisível para proteção contra spam
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [charCount, setCharCount] = useState(0);

	const MAX_CHARS = 1000;
	const DAILY_LIMIT = 10;

	// Atualiza o contador de caracteres
	useEffect(() => {
		setCharCount(formData.message.length);
	}, [formData.message]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const validateEmail = (email) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	const checkRateLimit = () => {
		const storageKey = "contact_form_usage";
		const now = new Date();
		const savedUsage = localStorage.getItem(storageKey);

		if (savedUsage) {
			const { count, date } = JSON.parse(savedUsage);
			const lastDate = new Date(date);

			// Se for o mesmo dia
			if (
				lastDate.getDate() === now.getDate() &&
				lastDate.getMonth() === now.getMonth() &&
				lastDate.getFullYear() === now.getFullYear()
			) {
				if (count >= DAILY_LIMIT) {
					return false;
				}
				return { count, date };
			}
		}

		// Se não houver registro ou for outro dia, reseta
		return { count: 0, date: now.toISOString() };
	};

	const updateRateLimit = (currentUsage) => {
		const storageKey = "contact_form_usage";
		const newUsage = {
			count: currentUsage.count + 1,
			date: currentUsage.date,
		};
		localStorage.setItem(storageKey, JSON.stringify(newUsage));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Verificação de Rate Limit
		const usage = checkRateLimit();
		if (usage === false) {
			toast.error(
				"A caixa de mensagens está cheia, tente novamente em 24h",
				{
					duration: 5000,
					icon: "🚫",
				},
			);
			return;
		}

		// Proteção Honeypot
		if (formData.honeypot) {
			console.log("Spam detectado!");
			return; // Falha silenciosa
		}

		// Validação
		if (!formData.from_name || !formData.reply_to || !formData.message) {
			toast.error("Por favor, preencha todos os campos obrigatórios.");
			return;
		}

		if (!validateEmail(formData.reply_to)) {
			toast.error("Por favor, insira um e-mail válido.");
			return;
		}

		setIsSubmitting(true);

		try {
			// Substitua pelos seus IDs do EmailJS
			// Recomendo usar variáveis de ambiente: import.meta.env.VITE_EMAILJS_SERVICE_ID
			const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
			const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
			const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

			if (!serviceID || !templateID || !publicKey) {
				throw new Error("Configuração de e-mail ausente.");
			}

			await emailjs.send(
				serviceID,
				templateID,
				{
					from_name: formData.from_name,
					reply_to: formData.reply_to,
					message: formData.message,
				},
				publicKey,
			);

			// Atualiza o contador de envios
			updateRateLimit(usage);

			setIsSuccess(true);
			toast.success("Mensagem enviada com sucesso!");
			setFormData({
				from_name: "",
				reply_to: "",
				message: "",
				honeypot: "",
			});

			// Reseta o estado de sucesso após 5 segundos
			setTimeout(() => {
				setIsSuccess(false);
			}, 5000);
		} catch (error) {
			console.error("Erro ao enviar e-mail:", error);
			toast.error(
				"Falha ao enviar mensagem. Tente novamente mais tarde.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="bg-gray-100 min-h-screen py-6 md:py-10 px-4 sm:px-6 lg:px-8 font-sans">
			<Helmet>
				<title>Contato | Opine Agora SC</title>
				<meta
					name="description"
					content="Entre em contato com a equipe do Opine Agora SC. Envie suas dúvidas, sugestões ou pautas."
				/>
			</Helmet>

			<div className="w-full max-w-7xl mx-auto">
				<div className="text-center mb-6 md:mb-10">
					<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-navy mb-3 md:mb-4 font-montserrat tracking-tight">
						Fale Conosco
					</h1>
					<div className="w-16 md:w-20 h-1.5 bg-teal-primary mx-auto mb-3 md:mb-4 rounded-full"></div>
					<p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed px-2">
						Envie suas dúvidas, sugestões de pauta ou feedback.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
					{/* Informações de Contato - Ocupa 4 colunas */}
					<div className="lg:col-span-4 flex flex-col h-full">
						<div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border-t-4 border-teal-primary h-full flex flex-col justify-center">
							<h3 className="text-lg md:text-xl font-bold text-navy mb-6 md:mb-8 font-montserrat">
								Canais de Atendimento
							</h3>

							<div className="space-y-6 md:space-y-8">
								<div className="flex items-start space-x-4 group">
									<div className="bg-teal-50 p-3 rounded-xl text-teal-primary group-hover:bg-teal-primary group-hover:text-white transition-colors duration-300">
										<Mail
											size={20}
											className="md:w-6 md:h-6"
										/>
									</div>
									<div className="flex-1">
										<p className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-1">
											E-mail
										</p>
										<a
											href="mailto:contato@opineagora.com.br"
											className="text-navy hover:text-orange-warm transition-colors font-semibold break-all text-sm md:text-base block"
										>
											contato@opineagora.com.br
										</a>
									</div>
								</div>

								<div className="flex items-start space-x-4 group">
									<div className="bg-teal-50 p-3 rounded-xl text-teal-primary group-hover:bg-teal-primary group-hover:text-white transition-colors duration-300">
										<Phone
											size={20}
											className="md:w-6 md:h-6"
										/>
									</div>
									<div className="flex-1">
										<p className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-1">
											WhatsApp
										</p>
										<a
											href="https://wa.me/554899999999"
											target="_blank"
											rel="noopener noreferrer"
											className="text-navy hover:text-orange-warm transition-colors font-semibold text-sm md:text-base block"
										>
											(48) 99999-9999
										</a>
									</div>
								</div>

								<div className="flex items-start space-x-4 group">
									<div className="bg-teal-50 p-3 rounded-xl text-teal-primary group-hover:bg-teal-primary group-hover:text-white transition-colors duration-300">
										<MapPin
											size={20}
											className="md:w-6 md:h-6"
										/>
									</div>
									<div className="flex-1">
										<p className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-1">
											Localização
										</p>
										<p className="text-navy font-semibold text-sm md:text-base block">
											Concórdia, SC
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Formulário de Contato - Ocupa 8 colunas */}
					<div className="lg:col-span-8">
						<div className="bg-white p-5 md:p-10 rounded-xl shadow-lg border border-gray-100 relative overflow-hidden h-full">
							<AnimatePresence>
								{isSuccess && (
									<motion.div
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.95 }}
										className="absolute inset-0 bg-white/98 z-10 flex flex-col items-center justify-center text-center p-8 backdrop-blur-sm"
									>
										<div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 md:mb-6 text-green-600 shadow-md">
											<Check
												size={32}
												className="md:w-10 md:h-10"
												strokeWidth={3}
											/>
										</div>
										<h3 className="text-xl md:text-2xl font-bold text-navy mb-2 md:mb-3 font-montserrat">
											Mensagem Enviada!
										</h3>
										<p className="text-text-secondary text-base md:text-lg">
											Obrigado! Responderemos o mais breve
											possível.
										</p>
									</motion.div>
								)}
							</AnimatePresence>

							<form
								onSubmit={handleSubmit}
								className="space-y-4 md:space-y-6"
							>
								{/* Honeypot Field (Invisível) */}
								<div className="hidden">
									<label htmlFor="honeypot">
										Não preencha este campo
									</label>
									<input
										type="text"
										id="honeypot"
										name="honeypot"
										value={formData.honeypot}
										onChange={handleChange}
										tabIndex="-1"
										autoComplete="off"
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
									<div className="col-span-1">
										<label
											htmlFor="from_name"
											className="block text-sm font-bold text-navy mb-1.5 md:mb-2 uppercase tracking-wide"
										>
											Nome Completo
										</label>
										<input
											type="text"
											id="from_name"
											name="from_name"
											value={formData.from_name}
											onChange={handleChange}
											required
											className="w-full px-4 py-3 md:px-5 md:py-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-primary focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white text-text-primary text-sm md:text-base"
											placeholder="Seu nome"
										/>
									</div>

									<div className="col-span-1">
										<label
											htmlFor="reply_to"
											className="block text-sm font-bold text-navy mb-1.5 md:mb-2 uppercase tracking-wide"
										>
											E-mail
										</label>
										<input
											type="email"
											id="reply_to"
											name="reply_to"
											value={formData.reply_to}
											onChange={handleChange}
											required
											className="w-full px-4 py-3 md:px-5 md:py-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-primary focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white text-text-primary text-sm md:text-base"
											placeholder="seu@email.com"
										/>
									</div>
								</div>

								<div>
									<label
										htmlFor="message"
										className="block text-sm font-bold text-navy mb-1.5 md:mb-2 uppercase tracking-wide"
									>
										Mensagem
									</label>
									<textarea
										id="message"
										name="message"
										value={formData.message}
										onChange={handleChange}
										required
										maxLength={MAX_CHARS}
										rows="6"
										className="w-full px-4 py-3 md:px-5 md:py-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-primary focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white resize-none text-text-primary text-sm md:text-base"
										placeholder="Escreva sua mensagem aqui..."
									></textarea>
									<div className="flex justify-end mt-1 md:mt-2">
										<span
											className={`text-[10px] md:text-xs font-semibold ${
												charCount > MAX_CHARS * 0.9
													? "text-red-500"
													: "text-text-secondary"
											}`}
										>
											{charCount}/{MAX_CHARS}
										</span>
									</div>
								</div>

								<div className="pt-2">
									<button
										type="submit"
										disabled={isSubmitting}
										className="w-full bg-teal-primary hover:bg-teal-900 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 md:space-x-3 uppercase tracking-wide text-sm md:text-base"
									>
										{isSubmitting ? (
											<>
												<div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
												<span>Enviando...</span>
											</>
										) : (
											<>
												<span>Enviar Mensagem</span>
												<Send
													size={18}
													className="md:w-5 md:h-5"
												/>
											</>
										)}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Contact;
