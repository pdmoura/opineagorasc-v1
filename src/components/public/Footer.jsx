import { Link } from "react-router-dom";
import { useState } from "react";
import {
	Facebook,
	MessageSquare,
	Send,
	Mail,
	Phone,
	MapPin,
	Instagram,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNewsletters } from "../../hooks/useNewsletters";

// Componente SVG personalizado do Twitter
const TwitterIcon = () => (
	<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
		<path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
	</svg>
);

// Componente SVG personalizado do WhatsApp
const WhatsAppIcon = ({ className }) => (
	<svg className={className} viewBox="0 0 24 24" fill="currentColor">
		<path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
	</svg>
);

const Footer = () => {
	const currentYear = new Date().getFullYear();
	const [newsletterEmail, setNewsletterEmail] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const { addNewsletter } = useNewsletters();

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

	const navigation = {
		principal: [
			{ name: "Início", href: "/" },
			{ name: "Política", href: "/categoria/Política" },
			{ name: "Economia", href: "/categoria/Economia" },
			{ name: "Sociedade", href: "/categoria/Sociedade" },
			{ name: "Esportes", href: "/categoria/Esportes" },
			{ name: "Cultura", href: "/categoria/Cultura" },
			{ name: "Tecnologia", href: "/categoria/Tecnologia" },
			{ name: "Saúde", href: "/categoria/Saúde" },
			{ name: "Educação", href: "/categoria/Educação" },
		],
		empresa: [
			{ name: "Sobre Nós", href: "/sobre" },
			{ name: "Contato", href: "/contato" },
			{ name: "Área Administrativa", href: "/login" },
			{ name: "Política de Privacidade", href: "/politica-privacidade" },
			{ name: "Termos de Uso", href: "/termos" },
		],
		contato: [
			{
				icon: Mail,
				text: "contato@opineagora.com.br",
				href: "mailto:contato@opineagora.com.br",
			},
			{
				icon: Phone,
				text: "(48) 99999-9999",
				href: "tel:+48999999999",
			},
			{
				icon: MapPin,
				text: "Florianópolis, SC",
				href: "#",
			},
		],
	};

	const socialLinks = [
		{
			name: "Facebook",
			href: "#",
			icon: Facebook,
			color: "hover:bg-blue-600",
		},
		{
			name: "Twitter",
			href: "#",
			icon: TwitterIcon,
			color: "hover:bg-sky-500",
		},
		{
			name: "Instagram",
			href: "#",
			icon: Instagram,
			color: "hover:bg-pink-600",
		},
		{
			name: "WhatsApp",
			href: "https://wa.me/554899999999",
			icon: WhatsAppIcon,
			color: "hover:bg-green-600",
		},
		{
			name: "Telegram",
			href: "#",
			icon: Send,
			color: "hover:bg-blue-500",
		},
	];

	return (
		<footer className="bg-navy text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Logo e Descrição */}
					<div className="lg:col-span-1">
						<div className="flex items-center space-x-3 mb-4">
							<div className="w-10 h-10 bg-teal-primary rounded-lg flex items-center justify-center">
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
								<h3 className="text-xl font-bold">
									Opine{" "}
									<span className="text-orange-warm">
										Agora
									</span>{" "}
									SC
								</h3>
								<p className="text-sm text-gray-300">
									Opinião com Credibilidade
								</p>
							</div>
						</div>
						<p className="text-gray-300 text-sm leading-relaxed mb-6">
							Portal de notícias de Santa Catarina comprometido
							com a informação transparente, imparcial e de
							qualidade para a sociedade catarinense.
						</p>

						{/* Redes Sociais */}
						<div className="flex space-x-3">
							{socialLinks.map((social) => {
								const Icon = social.icon;
								return (
									<a
										key={social.name}
										href={social.href}
										className={`w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center transition-colors ${social.color}`}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={social.name}
									>
										<Icon className="w-5 h-5" />
									</a>
								);
							})}
						</div>
					</div>

					{/* Navegação Principal */}
					<div>
						<h4 className="text-lg font-semibold mb-4 text-teal-primary">
							Navegação
						</h4>
						<ul className="space-y-2">
							{navigation.principal.map((item) => (
								<li key={item.name}>
									<Link
										to={item.href}
										className="text-gray-300 hover:text-white transition-colors text-sm"
									>
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Empresa */}
					<div>
						<h4 className="text-lg font-semibold mb-4 text-teal-primary">
							Empresa
						</h4>
						<ul className="space-y-2">
							{navigation.empresa.map((item) => (
								<li key={item.name}>
									<Link
										to={item.href}
										className="text-gray-300 hover:text-white transition-colors text-sm"
									>
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contato */}
					<div>
						<h4 className="text-lg font-semibold mb-4 text-teal-primary">
							Contato
						</h4>
						<ul className="space-y-3">
							{navigation.contato.map((item, index) => {
								const Icon = item.icon;
								return (
									<li key={index}>
										<a
											href={item.href}
											className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors text-sm"
										>
											<Icon className="w-4 h-4 flex-shrink-0" />
											<span>{item.text}</span>
										</a>
									</li>
								);
							})}
						</ul>

						{/* Newsletter */}
						<div className="mt-6">
							<h5 className="text-sm font-semibold mb-2 text-teal-primary">
								Newsletter
							</h5>
							<p className="text-xs text-gray-300 mb-3">
								Receba as principais notícias no seu e-mail.
							</p>
							<form
								className="flex flex-col space-y-2"
								onSubmit={handleNewsletterSubmit}
							>
								<input
									type="email"
									placeholder="Seu e-mail"
									value={newsletterEmail}
									onChange={(e) =>
										setNewsletterEmail(e.target.value)
									}
									className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent text-sm"
									required
									disabled={submitting}
								/>
								<button
									type="submit"
									disabled={submitting}
									className="px-4 py-2 bg-teal-primary text-white rounded-md hover:bg-teal-900 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
								>
									{submitting ? (
										<>
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
											<span>Inscrevendo...</span>
										</>
									) : (
										<>
											<Mail className="w-4 h-4" />
											<span>Inscrever-se</span>
										</>
									)}
								</button>
							</form>
						</div>
					</div>
				</div>

				{/* Copyright */}
				<div className="border-t border-gray-700 mt-8 pt-8">
					<div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
						<p>
							© {currentYear} Opine{" "}
							<span className="text-orange-warm">Agora</span> SC.
							Todos os direitos reservados. | opineagorasc.com.br
						</p>
						<div className="flex items-center space-x-4 mt-4 md:mt-0">
							<span>Desenvolvido com ❤️ para Santa Catarina</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
