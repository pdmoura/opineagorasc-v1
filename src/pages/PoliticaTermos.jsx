import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
	FileText,
	CheckCircle,
	X,
	AlertCircle,
	ExternalLink,
	Gavel,
	Shield,
	Users,
	Mail,
	MapPin,
	Eye,
	Trash2,
	Edit,
} from "lucide-react";

const PoliticaTermos = () => {
	// Scroll to top when page loads
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	return (
		<>
			<Helmet>
				<title>
					Política de Privacidade e Termos de Uso - Opine Agora SC |
					Portal de Notícias SC
				</title>
				<meta
					name="description"
					content="Leia a Política de Privacidade e Termos de Uso do Opine Agora SC. Proteção de dados conforme LGPD, direitos dos usuários, condições de acesso e uso do portal de notícias de Santa Catarina."
				/>
				<meta
					name="keywords"
					content="Política de Privacidade, Termos de Uso, Opine Agora SC, LGPD, proteção de dados, direitos do usuário, portal de notícias, Santa Catarina, jornalismo SC, Concórdia SC, termos legais, privacidade online"
				/>
				<meta name="robots" content="index, follow, max-snippet:-1" />
				<meta name="language" content="pt-BR" />
				<link
					rel="canonical"
					href="https://opineagorasc.com.br/politica-privacidade"
				/>

				{/* Open Graph */}
				<meta property="og:type" content="article" />
				<meta
					property="og:title"
					content="Política de Privacidade e Termos de Uso - Opine Agora SC"
				/>
				<meta
					property="og:description"
					content="Leia a Política de Privacidade e Termos de Uso do Opine Agora SC. Proteção de dados conforme LGPD, direitos dos usuários, condições de acesso e uso do portal de notícias de Santa Catarina."
				/>
				<meta
					property="og:url"
					content="https://opineagorasc.com.br/politica-privacidade"
				/>
				<meta property="og:site_name" content="Opine Agora SC" />
				<meta
					property="og:image"
					content="https://opineagorasc.com.br/ogimage-opineagorasc.png"
				/>
				<meta property="og:locale" content="pt_BR" />

				{/* Twitter Card */}
				<meta name="twitter:card" content="summary" />
				<meta
					name="twitter:title"
					content="Política de Privacidade e Termos de Uso - Opine Agora SC"
				/>
				<meta
					name="twitter:description"
					content="Leia a Política de Privacidade e Termos de Uso do Opine Agora SC. Proteção de dados conforme LGPD, direitos dos usuários, condições de acesso e uso."
				/>
				<meta
					name="twitter:image"
					content="https://opineagorasc.com.br/ogimage-opineagorasc.png"
				/>
			</Helmet>

			<div className="min-h-screen bg-gray-50">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					{/* Header */}
					<div className="text-center mb-12">
						<div className="w-16 h-16 bg-teal-primary rounded-full flex items-center justify-center mx-auto mb-6">
							<FileText className="w-8 h-8 text-white" />
						</div>
						<h1 className="text-4xl font-bold text-navy mb-4">
							Política de Privacidade e Termos de Uso
						</h1>
						<p className="text-lg text-text-secondary max-w-2xl mx-auto">
							Última atualização: 16 de fevereiro de 2026
						</p>
					</div>

					{/* Introdução */}
					<div className="bg-white rounded-xl shadow-sm p-8 mb-8">
						<p className="text-gray-700 leading-relaxed mb-4">
							O <strong>Opine Agora SC</strong>, disponível em{" "}
							<a
								href="https://opineagorasc.com.br"
								target="_blank"
								rel="noopener noreferrer"
								className="text-teal-primary hover:text-teal-900 underline"
							>
								opineagorasc.com.br
							</a>
							, tem como compromisso a transparência e a proteção
							dos dados dos seus usuários, em conformidade com a{" "}
							<strong>
								Lei Geral de Proteção de Dados (Lei nº
								13.709/2018 – LGPD)
							</strong>
							.
						</p>
						<p className="text-gray-700 leading-relaxed">
							Ao acessar o site <strong>Opine Agora SC</strong>, o
							usuário concorda com os presentes Termos de Uso e
							Política de Privacidade.
						</p>
					</div>

					{/* POLÍTICA DE PRIVACIDADE */}
					<div className="bg-gradient-to-r from-teal-primary to-navy text-white rounded-xl p-8 mb-8">
						<h2 className="text-3xl font-bold mb-6 flex items-center">
							<Shield className="w-8 h-8 mr-3" />
							Política de Privacidade
						</h2>
						<p className="text-lg text-gray-100">
							Compromisso com a transparência e proteção de dados
							dos usuários
						</p>
					</div>

					{/* Seção 1 - Coleta de Informações */}
					<div className="bg-white rounded-xl shadow-sm p-8 mb-8">
						<h3 className="text-2xl font-bold text-navy mb-6 flex items-center">
							<Mail className="w-6 h-6 mr-3 text-teal-primary" />
							1. Coleta de Informações
						</h3>
						<p className="text-gray-700 leading-relaxed mb-4">
							Atualmente, o Opine Agora SC:
						</p>
						<div className="space-y-3 mb-6">
							<div className="flex items-start">
								<X className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
								<p className="text-gray-700">
									Não coleta dados pessoais automaticamente
									por meio de cookies próprios.
								</p>
							</div>
							<div className="flex items-start">
								<X className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
								<p className="text-gray-700">
									Não exige cadastro para leitura das
									notícias.
								</p>
							</div>
							<div className="flex items-start">
								<CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
								<p className="text-gray-700">
									Pode coletar informações fornecidas
									voluntariamente pelo usuário, como:
								</p>
							</div>
						</div>

						<div className="bg-gray-50 rounded-lg p-6">
							<ul className="space-y-2">
								<li className="flex items-center">
									<div className="w-2 h-2 bg-teal-primary rounded-full mr-3"></div>
									<span>Nome</span>
								</li>
								<li className="flex items-center">
									<div className="w-2 h-2 bg-teal-primary rounded-full mr-3"></div>
									<span>Endereço de e-mail</span>
								</li>
								<li className="flex items-center">
									<div className="w-2 h-2 bg-teal-primary rounded-full mr-3"></div>
									<span>
										Mensagens enviadas via formulário de
										contato ou newsletter
									</span>
								</li>
							</ul>
						</div>

						<p className="text-gray-700 leading-relaxed">
							Esses dados são utilizados exclusivamente para
							responder solicitações, enviar newsletter e melhorar
							a comunicação.
						</p>
					</div>

					{/* Seção 2 - Cookies e Tecnologias */}
					<div className="bg-white rounded-xl shadow-sm p-8 mb-8">
						<h3 className="text-2xl font-bold text-navy mb-6 flex items-center">
							<Eye className="w-6 h-6 mr-3 text-teal-primary" />
							2. Cookies e Tecnologias de Terceiros
						</h3>
						<p className="text-gray-700 leading-relaxed mb-4">
							Atualmente, o site não utiliza cookies próprios para
							rastreamento.
						</p>
						<p className="text-gray-700 leading-relaxed mb-4">
							Futuramente, poderemos utilizar serviços como{" "}
							<strong>Google AdSense</strong>, que podem coletar
							informações por meio de cookies para exibição de
							anúncios personalizados.
						</p>
						<a
							href="https://policies.google.com/technologies/ads"
							target="_blank"
							rel="noopener noreferrer"
							className="text-teal-primary hover:text-teal-900 underline inline-flex items-center"
						>
							https://policies.google.com/technologies/ads
						</a>
					</div>

					{/* Seção 3 - Compartilhamento de Dados */}
					<div className="bg-white rounded-xl shadow-sm p-8 mb-8">
						<h3 className="text-2xl font-bold text-navy mb-6 flex items-center">
							<Shield className="w-6 h-6 mr-3 text-teal-primary" />
							3. Compartilhamento de Dados
						</h3>
						<div className="space-y-3">
							<div className="flex items-start">
								<X className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
								<p className="text-gray-700">
									Não vende dados pessoais;
								</p>
							</div>
							<div className="flex items-start">
								<X className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
								<p className="text-gray-700">
									Não compartilha dados com terceiros, exceto
									para cumprimento de obrigação legal ou
									prestadores de serviço.
								</p>
							</div>
						</div>
					</div>

					{/* Seção 4 - Direitos do Usuário (LGPD) */}
					<div className="bg-white rounded-xl shadow-sm p-8 mb-8">
						<h3 className="text-2xl font-bold text-navy mb-6 flex items-center">
							<CheckCircle className="w-6 h-6 mr-3 text-teal-primary" />
							4. Direitos do Usuário (LGPD)
						</h3>
						<div className="grid md:grid-cols-2 gap-4 mb-6">
							<div className="flex items-start bg-gray-50 rounded-lg p-4">
								<Eye className="w-5 h-5 text-teal-primary mr-3 mt-0.5 flex-shrink-0" />
								<p className="font-medium text-gray-800">
									Confirmação e acesso aos dados;
								</p>
							</div>
							<div className="flex items-start bg-gray-50 rounded-lg p-4">
								<Edit className="w-5 h-5 text-teal-primary mr-3 mt-0.5 flex-shrink-0" />
								<p className="font-medium text-gray-800">
									Correção de dados incompletos;
								</p>
							</div>
							<div className="flex items-start bg-gray-50 rounded-lg p-4">
								<Trash2 className="w-5 h-5 text-teal-primary mr-3 mt-0.5 flex-shrink-0" />
								<p className="font-medium text-gray-800">
									Exclusão de dados pessoais;
								</p>
							</div>
							<div className="flex items-start bg-gray-50 rounded-lg p-4">
								<X className="w-5 h-5 text-teal-primary mr-3 mt-0.5 flex-shrink-0" />
								<p className="font-medium text-gray-800">
									Revogação do consentimento.
								</p>
							</div>
						</div>

						<div className="bg-teal-primary text-white rounded-lg p-6 text-center">
							<p className="text-lg font-medium mb-2">
								Solicitações podem ser feitas pelo e-mail:
							</p>
							<a
								href="mailto:contato@opineagora.com.br"
								className="inline-flex items-center text-xl font-bold hover:underline"
							>
								<Mail className="w-6 h-6 mr-2" />
								contato@opineagora.com.br
							</a>
						</div>
					</div>

					{/* TERMOS DE USO */}
					<div className="bg-gradient-to-r from-navy to-teal-primary text-white rounded-xl p-8 mb-8">
						<h2 className="text-3xl font-bold mb-6 flex items-center">
							<Gavel className="w-8 h-8 mr-3" />
							Termos de Uso
						</h2>
						<p className="text-lg text-gray-100">
							Condições de acesso e utilização do portal de
							notícias
						</p>
					</div>

					{/* Seção 5 - Objetivo do Site */}
					<div className="bg-white rounded-xl shadow-sm p-8 mb-8">
						<h3 className="text-2xl font-bold text-navy mb-6 flex items-center">
							<AlertCircle className="w-6 h-6 mr-3 text-teal-primary" />
							5. Objetivo do Site
						</h3>
						<p className="text-gray-700 leading-relaxed mb-4">
							O <strong>Opine Agora SC</strong> é um portal de
							notícias com foco em informações sobre Santa
							Catarina, abrangendo:
						</p>

						<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
							<div className="bg-gray-50 rounded-lg p-3 text-center">
								<span className="text-gray-700 text-sm">
									Política
								</span>
							</div>
							<div className="bg-gray-50 rounded-lg p-3 text-center">
								<span className="text-gray-700 text-sm">
									Economia
								</span>
							</div>
							<div className="bg-gray-50 rounded-lg p-3 text-center">
								<span className="text-gray-700 text-sm">
									Sociedade
								</span>
							</div>
							<div className="bg-gray-50 rounded-lg p-3 text-center">
								<span className="text-gray-700 text-sm">
									Tecnologia
								</span>
							</div>
							<div className="bg-gray-50 rounded-lg p-3 text-center">
								<span className="text-gray-700 text-sm">
									Cultura
								</span>
							</div>
							<div className="bg-gray-50 rounded-lg p-3 text-center">
								<span className="text-gray-700 text-sm">
									Esportes
								</span>
							</div>
							<div className="bg-gray-50 rounded-lg p-3 text-center">
								<span className="text-gray-700 text-sm">
									Educação
								</span>
							</div>
							<div className="bg-gray-50 rounded-lg p-3 text-center">
								<span className="text-gray-700 text-sm">
									Saúde
								</span>
							</div>
						</div>

						<div className="bg-teal-primary text-white rounded-lg p-4 text-center">
							<p className="font-medium">
								O conteúdo publicado tem caráter informativo e
								opinativo.
							</p>
						</div>
					</div>

					{/* Seção 6 - Uso do Conteúdo */}
					<div className="bg-white rounded-xl shadow-sm p-8 mb-8">
						<h3 className="text-2xl font-bold text-navy mb-6 flex items-center">
							<Shield className="w-6 h-6 mr-3 text-teal-primary" />
							6. Uso do Conteúdo
						</h3>
						<p className="text-gray-700 leading-relaxed mb-6">
							Todo o conteúdo é protegido por direitos autorais.
						</p>

						<div className="grid md:grid-cols-2 gap-6">
							<div className="bg-green-50 border border-green-200 rounded-lg p-6">
								<div className="flex items-center mb-4">
									<CheckCircle className="w-5 h-5 text-green-500 mr-2" />
									<h4 className="font-semibold text-green-800">
										É permitido:
									</h4>
								</div>
								<ul className="space-y-2">
									<li className="flex items-start">
										<div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
										<span>
											Compartilhar links das matérias;
										</span>
									</li>
									<li className="flex items-start">
										<div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
										<span>
											Citar trechos com indicação da
											fonte.
										</span>
									</li>
								</ul>
							</div>

							<div className="bg-red-50 border border-red-200 rounded-lg p-6">
								<div className="flex items-center mb-4">
									<X className="w-5 h-5 text-red-500 mr-2" />
									<h4 className="font-semibold text-red-800">
										É proibido:
									</h4>
								</div>
								<ul className="space-y-2">
									<li className="flex items-start">
										<div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></div>
										<span>
											Copiar integralmente matérias;
										</span>
									</li>
									<li className="flex items-start">
										<div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></div>
										<span>
											Reproduzir para fins comerciais.
										</span>
									</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Seção 7 - Responsabilidade */}
					<div className="bg-white rounded-xl shadow-sm p-8 mb-8">
						<h3 className="text-2xl font-bold text-navy mb-6 flex items-center">
							<AlertCircle className="w-6 h-6 mr-3 text-teal-primary" />
							7. Responsabilidade
						</h3>
						<div className="space-y-3">
							<div className="flex items-start bg-gray-50 rounded-lg p-4">
								<X className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
								<p className="text-gray-700">
									Não se responsabiliza por eventuais erros ou
									omissões;
								</p>
							</div>
							<div className="flex items-start bg-gray-50 rounded-lg p-4">
								<X className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
								<p className="text-gray-700">
									Não garante disponibilidade ininterrupta do
									site;
								</p>
							</div>
							<div className="flex items-start bg-gray-50 rounded-lg p-4">
								<X className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
								<p className="text-gray-700">
									Não se responsabiliza por decisões tomadas
									com base nas informações.
								</p>
							</div>
						</div>
					</div>

					{/* Seção 8 - Comentários e Interações */}
					<div className="bg-white rounded-xl shadow-sm p-8 mb-8">
						<h3 className="text-2xl font-bold text-navy mb-6 flex items-center">
							<Users className="w-6 h-6 mr-3 text-teal-primary" />
							8. Comentários e Interações
						</h3>
						<div className="space-y-4">
							<div className="bg-gray-50 rounded-lg p-4">
								<p className="text-gray-700 font-medium">
									O usuário será responsável pelo conteúdo
									publicado;
								</p>
							</div>
							<div className="bg-gray-50 rounded-lg p-4">
								<p className="text-gray-700 font-medium">
									Não serão permitidos conteúdos ofensivos,
									ilegais ou discriminatórios;
								</p>
							</div>
							<div className="bg-gray-50 rounded-lg p-4">
								<p className="text-gray-700 font-medium">
									A administração poderá remover comentários
									que violem estes termos.
								</p>
							</div>
						</div>
					</div>

					{/* Seção 9 - Publicidade e Links */}
					<div className="bg-white rounded-xl shadow-sm p-8 mb-8">
						<h3 className="text-2xl font-bold text-navy mb-6 flex items-center">
							<ExternalLink className="w-6 h-6 mr-3 text-teal-primary" />
							9. Publicidade e Links Externos
						</h3>
						<p className="text-gray-700 leading-relaxed mb-4">
							O site poderá exibir anúncios publicitários,
							inclusive por meio de redes como o{" "}
							<strong>Google AdSense</strong>.
						</p>
						<p className="text-gray-700 leading-relaxed mb-4">
							O <strong>Opine Agora SC</strong> não se
							responsabiliza por produtos, serviços ou ofertas
							divulgadas por terceiros.
						</p>
						<p className="text-gray-700 leading-relaxed">
							O site pode conter links para sites externos. Não
							nos responsabilizamos pelas políticas de privacidade
							ou conteúdos desses sites.
						</p>
					</div>

					{/* Seção 10 - Modificações e Foro */}
					<div className="bg-white rounded-xl shadow-sm p-8 mb-8">
						<h3 className="text-2xl font-bold text-navy mb-6 flex items-center">
							<FileText className="w-6 h-6 mr-3 text-teal-primary" />
							10. Modificações e Foro
						</h3>
						<p className="text-gray-700 leading-relaxed mb-4">
							Os presentes Termos e Política podem ser alterados a
							qualquer momento, sendo responsabilidade do usuário
							consultá-los periodicamente.
						</p>
						<div className="bg-teal-primary text-white rounded-lg p-6 text-center">
							<p className="text-lg font-medium">
								Fica eleito o foro da Comarca de{" "}
								<strong>Concórdia– SC</strong> para dirimir
								quaisquer controvérsias.
							</p>
						</div>
					</div>

					{/* Contato */}
					<div className="bg-white rounded-xl shadow-sm p-8 mb-8">
						<h3 className="text-2xl font-bold text-navy mb-6 flex items-center">
							<Mail className="w-6 h-6 mr-3 text-teal-primary" />
							Contato
						</h3>
						<p className="text-gray-700 leading-relaxed mb-6">
							Em caso de dúvidas sobre esta Política e Termos:
						</p>

						<div className="grid md:grid-cols-2 gap-6">
							<div className="flex items-center bg-gray-50 rounded-lg p-6">
								<Mail className="w-6 h-6 text-teal-primary mr-4 flex-shrink-0" />
								<div>
									<p className="font-medium text-gray-800">
										E-mail
									</p>
									<a
										href="mailto:contato@opineagora.com.br"
										className="text-teal-primary hover:text-teal-900"
									>
										contato@opineagora.com.br
									</a>
								</div>
							</div>
							<div className="flex items-center bg-gray-50 rounded-lg p-6">
								<MapPin className="w-6 h-6 text-teal-primary mr-4 flex-shrink-0" />
								<div>
									<p className="font-medium text-gray-800">
										Localização
									</p>
									<p className="text-gray-700">
										Concórdia– SC
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Footer Actions */}
					<div className="mt-12 text-center">
						<Link
							to="/"
							className="btn-primary inline-flex items-center"
						>
							Voltar para a página inicial
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default PoliticaTermos;
