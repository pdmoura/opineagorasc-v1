import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Globe, Users, Award } from "lucide-react";

const Sobre = () => {
	return (
		<>
			<Helmet>
				<title>Sobre - Opine Agora SC</title>
				<meta
					name="description"
					content="Conheça o Opine Agora SC, seu portal de notícias e opiniões com credibilidade em Santa Catarina."
				/>
			</Helmet>

			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Page Header */}
				<div className="bg-gradient-to-r from-teal-primary to-navy text-white rounded-xl p-8 mb-8">
					<h1 className="text-3xl md:text-4xl font-bold mb-4">
						Sobre o Opine Agora SC
					</h1>
					<p className="text-lg text-gray-100">
						Opinião com Credibilidade - Seu portal de notícias e
						análises de Santa Catarina
					</p>
				</div>

				{/* Main Content */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-8">
						{/* About Section */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<h2 className="text-2xl font-bold text-navy mb-4 flex items-center">
								<Users className="w-6 h-6 mr-2 text-teal-primary" />
								Nossa História
							</h2>
							<div className="prose prose-lg text-gray-700">
								<p className="mb-4">
									O <strong>Opine Agora SC</strong> nasceu da
									necessidade de oferecer à população
									catarinense um portal de notícias confiável,
									com jornalismo sério e opiniões bem
									fundamentadas.
								</p>
								<p className="mb-4">
									Nosso foco principal é compartilhar notícias
									sobre <strong>Concórdia</strong> e região,
									mas pontualmente também abordamos temas
									relevantes de{" "}
									<strong>toda Santa Catarina</strong>, sempre
									com o mesmo compromisso com a apuração dos
									fatos e o respeito à diversidade de
									pensamentos.
								</p>
								<p>
									Desde nossa fundação, trabalhamos para ser
									referência em cobertura jornalística local,
									priorizando a informação de qualidade e
									contribuindo para uma sociedade mais crítica
									e participativa.
								</p>
							</div>
						</div>

						{/* Values Section */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<h2 className="text-2xl font-bold text-navy mb-4 flex items-center">
								<Award className="w-6 h-6 mr-2 text-teal-primary" />
								Nossos Valores
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="p-4 bg-teal-50 rounded-lg">
									<h3 className="font-semibold text-teal-primary mb-2">
										Credibilidade
									</h3>
									<p className="text-sm text-gray-700">
										Compromisso com a verdade e apuração
										rigorosa dos fatos.
									</p>
								</div>
								<div className="p-4 bg-blue-50 rounded-lg">
									<h3 className="font-semibold text-blue-600 mb-2">
										Ética
									</h3>
									<p className="text-sm text-gray-700">
										Jornalismo responsável e respeito aos
										princípios editoriais.
									</p>
								</div>
								<div className="p-4 bg-green-50 rounded-lg">
									<h3 className="font-semibold text-green-600 mb-2">
										Diversidade
									</h3>
									<p className="text-sm text-gray-700">
										Espaço para múltiplas vozes e
										perspectivas.
									</p>
								</div>
								<div className="p-4 bg-orange-50 rounded-lg">
									<h3 className="font-semibold text-orange-600 mb-2">
										Independência
									</h3>
									<p className="text-sm text-gray-700">
										Liberdade editorial e autonomia para
										investigar e opinar.
									</p>
								</div>
							</div>
						</div>

						{/* Mission Section */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<h2 className="text-2xl font-bold text-navy mb-4">
								Nossa Missão
							</h2>
							<div className="prose prose-lg text-gray-700">
								<p className="mb-4">
									Ser o principal portal de notícias e
									opiniões de Santa Catarina, oferecendo
									conteúdo de qualidade que informe, eduque e
									inspire nossos leitores a participarem
									ativamente da sociedade.
								</p>
								<p>
									Acreditamos no poder da informação bem
									trabalhada e na importância do debate
									respeitoso para a construção de uma
									cidadania mais consciente e engajada.
								</p>
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Contact Info */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<h3 className="text-xl font-bold text-navy mb-4">
								Entre em Contato
							</h3>
							<div className="space-y-4">
								<div className="flex items-start space-x-3">
									<Mail className="w-5 h-5 text-teal-primary mt-0.5" />
									<div>
										<p className="text-sm text-gray-600">
											E-mail
										</p>
										<p className="font-medium break-all">
											contato@opineagorasc.com.br
										</p>
									</div>
								</div>
								<div className="flex items-start space-x-3">
									<Phone className="w-5 h-5 text-teal-primary mt-0.5" />
									<div>
										<p className="text-sm text-gray-600">
											Telefone
										</p>
										<p className="font-medium">
											(48) 9999-9999
										</p>
									</div>
								</div>
								<div className="flex items-start space-x-3">
									<MapPin className="w-5 h-5 text-teal-primary mt-0.5" />
									<div>
										<p className="text-sm text-gray-600">
											Localização
										</p>
										<p className="font-medium">
											Florianópolis, SC
										</p>
									</div>
								</div>
								<div className="flex items-start space-x-3">
									<Globe className="w-5 h-5 text-teal-primary mt-0.5" />
									<div>
										<p className="text-sm text-gray-600">
											Website
										</p>
										<p className="font-medium break-all">
											www.opineagorasc.com.br
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Quick Links */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<h3 className="text-xl font-bold text-navy mb-4">
								Links Rápidos
							</h3>
							<div className="space-y-2">
								<Link
									to="/"
									className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
								>
									← Página Inicial
								</Link>
								<Link
									to="/categoria/todas"
									className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
								>
									← Todas as Categorias
								</Link>
								<Link
									to="/eleicoes"
									className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
								>
									← Eleições 2024
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Sobre;
