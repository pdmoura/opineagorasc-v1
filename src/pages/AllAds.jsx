import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Megaphone, ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabase";

const AllAds = () => {
	const [ads, setAds] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAds = async () => {
			try {
				const { data, error } = await supabase
					.from("ads")
					.select("*")
					.eq("status", "approved")
					.order("created_at", { ascending: false });

				if (error) throw error;
				setAds(data || []);
			} catch (error) {
				console.error("Error fetching ads:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchAds();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-primary"></div>
			</div>
		);
	}

	return (
		<>
			<Helmet>
				<title>Parceiros e Anunciantes - Opine Agora SC</title>
				<meta
					name="description"
					content="Conheça os parceiros e anunciantes do Opine Agora SC. Empresas que apoiam o jornalismo independente."
				/>
			</Helmet>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Back Button */}
				<Link
					to="/"
					className="inline-flex items-center space-x-2 text-teal-primary hover:text-teal-900 mb-6 font-medium"
				>
					<ArrowLeft className="w-4 h-4" />
					<span>Voltar</span>
				</Link>

				<div className="section-header mb-8">
					<h1 className="text-3xl font-bold text-navy flex items-center space-x-3">
						<Megaphone className="w-8 h-8 text-teal-primary" />
						<span>
							Nossos{" "}
							<span className="text-orange-warm">Parceiros</span>
						</span>
					</h1>
					<p className="text-text-secondary mt-2 text-lg">
						Empresas que apoiam o jornalismo sério e comprometido
						com a verdade.
					</p>
				</div>

				{ads.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{ads.map((ad) => (
							<div
								key={ad.id}
								className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
							>
								{/* Ad Image */}
								{ad.image_url ? (
									<a
										href={ad.link_url}
										target="_blank"
										rel="noopener noreferrer"
										className="aspect-video bg-gray-100 block"
									>
										<img
											src={ad.image_url}
											alt={ad.title}
											className="w-full h-full object-cover"
										/>
									</a>
								) : (
									<div className="aspect-video bg-gray-100 flex items-center justify-center">
										<Megaphone className="w-12 h-12 text-gray-400" />
									</div>
								)}

								{/* Ad Content */}
								<div className="p-4">
									{ad.link_url ? (
										<a
											href={ad.link_url}
											target="_blank"
											rel="noopener noreferrer"
											className="font-semibold text-navy mb-2 line-clamp-2 block hover:text-teal-primary transition-colors"
										>
											{ad.title}
										</a>
									) : (
										<h3 className="font-semibold text-navy mb-2 line-clamp-2">
											{ad.title}
										</h3>
									)}
									<p className="text-sm text-text-secondary line-clamp-3 mb-3">
										{ad.content}
									</p>
									{ad.link_url && (
										<a
											href={ad.link_url}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm font-medium text-teal-primary hover:text-teal-900"
										>
											Saiba mais →
										</a>
									)}
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-16 bg-gray-50 rounded-xl">
						<Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-navy mb-2">
							Nenhum anúncio disponível no momento
						</h3>
						<p className="text-text-secondary max-w-md mx-auto">
							Estamos atualizando nossa lista de parceiros. Volte
							em breve para conferir as novidades.
						</p>
					</div>
				)}

				<div className="mt-12 bg-teal-primary text-white rounded-xl p-8 text-center">
					<h2 className="text-2xl font-bold mb-4">
						Quer anunciar sua empresa aqui?
					</h2>
					<p className="text-lg mb-6 opacity-90">
						Alcance milhares de leitores em Santa Catarina e
						fortaleça sua marca com o Opine Agora SC.
					</p>
					<button className="bg-white text-teal-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
						Entre em contato
					</button>
				</div>
			</div>
		</>
	);
};

export default AllAds;
