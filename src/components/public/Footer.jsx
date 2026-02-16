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
			{ name: "Termos de Uso", href: "/termos-uso" },
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
				text: "Concórdia, SC",
				href: "#",
			},
		],
	};

	const socialLinks = [
		{
			name: "Facebook",
			href: "https://www.facebook.com/share/18GTHnk7hp/",
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
			href: "https://www.instagram.com/opineagorasc.com.br?igsh=MWphcXI0dTNreDlyMw==",
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
		<footer className="bg-[var(--navy)] text-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{/* Logo e Descrição */}
					<div className="lg:col-span-1">
						<div className="flex flex-col space-y-4">
							<div className="flex items-center space-x-3">
								<div className="bg-white rounded-lg p-3 shadow-lg">
									<div className="flex flex-col items-start">
										<div className="flex items-center gap-0.5">
											<span className="font-montserrat text-xl font-black tracking-tight leading-none text-navy">
												OPINE
											</span>
											<span className="font-montserrat text-xl font-black tracking-tight leading-none text-orange-warm">
												AGORA
											</span>
											<span className="font-montserrat text-xs font-bold text-navy bg-cream px-1.5 py-0.5 rounded ml-1">
												SC
											</span>
										</div>
										<span className="font-montserrat text-xs text-navy tracking-widest uppercase font-semibold mt-1 block text-center">
											Opinião com Credibilidade
										</span>
									</div>
								</div>
							</div>

							<p className="text-gray-200 text-sm leading-relaxed mb-4 font-medium">
								Portal de notícias de Santa Catarina
								comprometido com a informação transparente,
								imparcial e de qualidade para a sociedade
								catarinense.
							</p>

							{/* Redes Sociais */}
							<div className="flex space-x-2">
								{socialLinks.map((social) => {
									const Icon = social.icon;
									return (
										<a
											key={social.name}
											href={social.href}
											className={`w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center transition-colors ${social.color}`}
											target="_blank"
											rel="noopener noreferrer"
											aria-label={social.name}
										>
											<Icon className="w-5 h-5 text-white" />
										</a>
									);
								})}
							</div>
						</div>
					</div>

					{/* Navegação Principal */}
					<div>
						<h4 className="text-base font-semibold mb-3 text-teal-300">
							Navegação
						</h4>
						<ul className="space-y-1">
							{navigation.principal.map((item) => (
								<li key={item.name}>
									<Link
										to={item.href}
										className="text-gray-200 hover:text-white transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-[var(--navy)] rounded"
									>
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Empresa */}
					<div>
						<h4 className="text-base font-semibold mb-3 text-teal-300">
							Empresa
						</h4>
						<ul className="space-y-1">
							{navigation.empresa.map((item) => (
								<li key={item.name}>
									<Link
										to={item.href}
										className="text-gray-200 hover:text-white transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-[var(--navy)] rounded"
									>
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contato */}
					<div>
						<h4 className="text-base font-semibold mb-3 text-teal-300">
							Contato
						</h4>
						<ul className="space-y-2">
							{navigation.contato.map((item, index) => {
								const Icon = item.icon;
								return (
									<li key={index}>
										<a
											href={item.href}
											className="flex items-center space-x-2 text-gray-200 hover:text-white transition-colors text-sm font-medium"
										>
											<Icon className="w-3 h-3 flex-shrink-0" />
											<span>{item.text}</span>
										</a>
									</li>
								);
							})}
						</ul>

						{/* Newsletter */}
						<div className="mt-4">
							<h5 className="text-sm font-semibold mb-2 text-teal-300">
								Newsletter
							</h5>
							<p className="text-sm text-gray-200 mb-2 font-medium">
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
									className="px-3 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm font-medium shadow-lg"
									required
									disabled={submitting}
								/>
								<button
									type="submit"
									disabled={submitting}
									className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
				<div className="border-t border-blue-800 mt-6 pt-6">
					<div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-200 font-medium">
						<p>
							{currentYear} Opine{" "}
							<span className="text-orange-warm">Agora</span> SC.
							Todos os direitos reservados. | opineagorasc.com.br
						</p>
						<div className="flex items-center space-x-3 mt-2 md:mt-0">
							<span>
								<a href="https://www.linkedin.com/in/pedroalves0/" target="_blank" rel="noopener noreferrer">Desenvolvido por <span className="text-orange-warm border-b-2">Pedro Alves</span></a>
							</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
