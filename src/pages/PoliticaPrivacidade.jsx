import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
	Mail,
	MapPin,
	Shield,
	Eye,
	Trash2,
	Edit,
	X,
	CheckCircle,
} from "lucide-react";

const PoliticaPrivacidade = () => {
	// Scroll to top when page loads
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	return (
		<>
			<Helmet>
				<title>Política de Privacidade - Opine Agora SC</title>
				<meta
					name="description"
					content="Política de Privacidade do Opine Agora SC - Compromisso com a transparência e proteção de dados dos usuários conforme a LGPD."
				/>
				<meta
					name="keywords"
					content="política de privacidade, LGPD, proteção de dados, opine agora sc, santa catarina"
				/>
			</Helmet>

			<div className="min-h-screen bg-gray-50">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					{/* Header */}
					<div className="text-center mb-12">
						<div className="w-16 h-16 bg-teal-primary rounded-full flex items-center justify-center mx-auto mb-6">
							<Shield className="w-8 h-8 text-white" />
						</div>
						<h1 className="text-4xl font-bold text-navy mb-4">
							Política de Privacidade
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
							Esta Política de Privacidade explica como tratamos
							as informações dos visitantes do site.
						</p>
					</div>

					{/* Seção 1 - Coleta de Informações */}
					<div className="bg-white rounded-xl shadow-sm p-8 mb-8">
						<h2 className="text-2xl font-bold text-navy mb-6 flex items-center">
							<Mail className="w-6 h-6 mr-3 text-teal-primary" />
							1. Coleta de Informações
						</h2>
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
							Esses dados são utilizados exclusivamente para:
						</p>

						<ul className="space-y-2 mt-4">
							<li className="flex items-start">
								<div className="w-2 h-2 bg-teal-primary rounded-full mr-3 mt-2"></div>
								<span>
									Responder solicitações enviadas pelo
									usuário;
								</span>
							</li>
							<li className="flex items-start">
								<div className="w-2 h-2 bg-teal-primary rounded-full mr-3 mt-2"></div>
								<span>
									Enviar newsletter, quando solicitado;
								</span>
							</li>
							<li className="flex items-start">
								<div className="w-2 h-2 bg-teal-primary rounded-full mr-3 mt-2"></div>
								<span>
									Melhorar a comunicação com os leitores.
								</span>
							</li>
						</ul>
					</div>

					{/* Seção 2 - Cookies e Tecnologias de Terceiros */}
					<div className="bg-white rounded-xl shadow-sm p-8 mb-8">
						<h2 className="text-2xl font-bold text-navy mb-6 flex items-center">
							<Eye className="w-6 h-6 mr-3 text-teal-primary" />
							2. Cookies e Tecnologias de Terceiros
						</h2>
						<p className="text-gray-700 leading-relaxed mb-4">
							Atualmente, o site não utiliza cookies próprios para
							rastreamento.
						</p>
						<p className="text-gray-700 leading-relaxed mb-4">
							No entanto, futuramente, poderemos utilizar serviços
							de terceiros, como o <strong>Google AdSense</strong>
							, que podem coletar informações por meio de cookies
							para exibição de anúncios personalizados.
						</p>
						<p className="text-gray-700 leading-relaxed mb-4">
							O Google poderá utilizar:
						</p>

						<div className="bg-gray-50 rounded-lg p-6">
							<ul className="space-y-2">
								<li className="flex items-center">
									<div className="w-2 h-2 bg-teal-primary rounded-full mr-3"></div>
									<span>Cookies</span>
								</li>
								<li className="flex items-center">
									<div className="w-2 h-2 bg-teal-primary rounded-full mr-3"></div>
									<span>Web beacons</span>
								</li>
								<li className="flex items-center">
									<div className="w-2 h-2 bg-teal-primary rounded-full mr-3"></div>
									<span>Tecnologias semelhantes</span>
								</li>
							</ul>
						</div>

						<p className="text-gray-700 leading-relaxed mb-4">
							Para mais informações sobre como o Google utiliza
							dados, consulte:
						</p>
						<a
							href="https://policies.google.com/technologies/ads"
							target="_blank"
							rel="noopener noreferrer"
							className="text-teal-primary hover:text-teal-900 underline inline-flex items-center"
						>
							https://policies.google.com/technologies/ads
						</a>

						<p className="text-gray-700 leading-relaxed mt-4">
							Quando esses serviços forem ativados, esta Política
							será atualizada e poderá ser implementado aviso de
							consentimento de cookies, conforme exigido pela
							legislação.
						</p>
					</div>

					{/* Seção 3 - Compartilhamento de Dados */}
					<div className="bg-white rounded-xl shadow-sm p-8 mb-8">
						<h2 className="text-2xl font-bold text-navy mb-6 flex items-center">
							<Shield className="w-6 h-6 mr-3 text-teal-primary" />
							3. Compartilhamento de Dados
						</h2>
						<p className="text-gray-700 leading-relaxed mb-4">
							O Opine Agora SC:
						</p>
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
									quando necessário para:
								</p>
							</div>
						</div>

						<ul className="space-y-2 mt-4">
							<li className="flex items-start">
								<div className="w-2 h-2 bg-teal-primary rounded-full mr-3 mt-2"></div>
								<span>Cumprimento de obrigação legal;</span>
							</li>
							<li className="flex items-start">
								<div className="w-2 h-2 bg-teal-primary rounded-full mr-3 mt-2"></div>
								<span>
									Prestadores de serviço (como plataformas de
									e-mail marketing), quando aplicável.
								</span>
							</li>
						</ul>
					</div>

					{/* Seção 4 - Direitos do Usuário (LGPD) */}
					<div className="bg-white rounded-xl shadow-sm p-8 mb-8">
						<h2 className="text-2xl font-bold text-navy mb-6 flex items-center">
							<CheckCircle className="w-6 h-6 mr-3 text-teal-primary" />
							4. Direitos do Usuário (LGPD)
						</h2>
						<p className="text-gray-700 leading-relaxed mb-4">
							Nos termos da LGPD, o usuário pode solicitar:
						</p>

						<div className="grid md:grid-cols-2 gap-4 mb-6">
							<div className="flex items-start bg-gray-50 rounded-lg p-4">
								<Eye className="w-5 h-5 text-teal-primary mr-3 mt-0.5 flex-shrink-0" />
								<div>
									<p className="font-medium text-gray-800">
										Confirmação da existência de tratamento
										de dados;
									</p>
								</div>
							</div>
							<div className="flex items-start bg-gray-50 rounded-lg p-4">
								<Eye className="w-5 h-5 text-teal-primary mr-3 mt-0.5 flex-shrink-0" />
								<div>
									<p className="font-medium text-gray-800">
										Acesso aos dados;
									</p>
								</div>
							</div>
							<div className="flex items-start bg-gray-50 rounded-lg p-4">
								<Edit className="w-5 h-5 text-teal-primary mr-3 mt-0.5 flex-shrink-0" />
								<div>
									<p className="font-medium text-gray-800">
										Correção de dados incompletos ou
										incorretos;
									</p>
								</div>
							</div>
							<div className="flex items-start bg-gray-50 rounded-lg p-4">
								<Trash2 className="w-5 h-5 text-teal-primary mr-3 mt-0.5 flex-shrink-0" />
								<div>
									<p className="font-medium text-gray-800">
										Exclusão de dados pessoais;
									</p>
								</div>
							</div>
							<div className="flex items-start bg-gray-50 rounded-lg p-4">
								<X className="w-5 h-5 text-teal-primary mr-3 mt-0.5 flex-shrink-0" />
								<div>
									<p className="font-medium text-gray-800">
										Revogação do consentimento.
									</p>
								</div>
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

					{/* Seção 5 - Segurança das Informações */}
					<div className="bg-white rounded-xl shadow-sm p-8 mb-8">
						<h2 className="text-2xl font-bold text-navy mb-6 flex items-center">
							<Shield className="w-6 h-6 mr-3 text-teal-primary" />
							5. Segurança das Informações
						</h2>
						<p className="text-gray-700 leading-relaxed">
							Adotamos medidas técnicas e organizacionais
							razoáveis para proteger as informações fornecidas
							contra acesso não autorizado, perda ou uso indevido.
						</p>
					</div>

					{/* Seção 6 - Alterações nesta Política */}
					<div className="bg-white rounded-xl shadow-sm p-8 mb-8">
						<h2 className="text-2xl font-bold text-navy mb-6 flex items-center">
							<Edit className="w-6 h-6 mr-3 text-teal-primary" />
							6. Alterações nesta Política
						</h2>
						<p className="text-gray-700 leading-relaxed">
							Esta Política poderá ser atualizada a qualquer
							momento para refletir mudanças legais ou
							operacionais. Recomendamos a revisão periódica desta
							página.
						</p>
					</div>

					{/* Seção 7 - Contato */}
					<div className="bg-white rounded-xl shadow-sm p-8">
						<h2 className="text-2xl font-bold text-navy mb-6 flex items-center">
							<Mail className="w-6 h-6 mr-3 text-teal-primary" />
							7. Contato
						</h2>
						<p className="text-gray-700 leading-relaxed mb-6">
							Em caso de dúvidas sobre esta Política de
							Privacidade:
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

export default PoliticaPrivacidade;
