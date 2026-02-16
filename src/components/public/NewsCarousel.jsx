import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const NewsCarousel = ({ posts, title, className = "" }) => {
	const [swiper, setSwiper] = useState(null);

	if (!posts || posts.length === 0) {
		return null;
	}

	return (
		<div className={`news-carousel ${className}`}>
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl md:text-3xl font-black text-navy">
					{title}
				</h2>
				<div className="flex gap-2">
					<button
						onClick={() => swiper?.slidePrev()}
						className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={!swiper}
					>
						<ChevronLeft className="w-5 h-5 text-teal-primary" />
					</button>
					<button
						onClick={() => swiper?.slideNext()}
						className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={!swiper}
					>
						<ChevronRight className="w-5 h-5 text-teal-primary" />
					</button>
				</div>
			</div>

			<Swiper
				modules={[Navigation, Pagination, Autoplay]}
				spaceBetween={20}
				slidesPerView={1}
				breakpoints={{
					640: {
						slidesPerView: 2,
					},
					768: {
						slidesPerView: 2,
					},
					1024: {
						slidesPerView: 3,
					},
				}}
				navigation={false}
				pagination={{
					clickable: true,
					bulletClass: "swiper-pagination-bullet !bg-teal-primary",
					bulletActiveClass:
						"swiper-pagination-bullet-active !bg-teal-900",
				}}
				autoplay={{
					delay: 5000,
					disableOnInteraction: false,
					pauseOnMouseEnter: true,
				}}
				loop={posts.length > 3}
				onSwiper={setSwiper}
				className="!pb-12"
			>
				{posts.map((post) => (
					<SwiperSlide key={post.id}>
						<Link
							to={`/post/${post.slug}`}
							className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
						>
							{post.image ? (
								<div className="aspect-video overflow-hidden">
									<img
										src={post.image}
										alt={post.title}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
									/>
								</div>
							) : (
								<div className="aspect-video overflow-hidden bg-gradient-to-br from-teal-primary to-teal-900 flex items-center justify-center">
									<Newspaper className="w-12 h-12 text-white/50" />
								</div>
							)}
							<div className="p-6">
								<div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
									<span className="flex items-center gap-1">
										<Calendar className="w-4 h-4" />
										{new Date(post.date).toLocaleDateString(
											"pt-BR",
										)}
									</span>
									{post.category && (
										<span className="px-2 py-1 bg-teal-primary/10 text-teal-primary rounded-full text-xs font-semibold">
											{post.category}
										</span>
									)}
								</div>
								<h3 className="font-bold text-lg text-navy mb-2 line-clamp-2 group-hover:text-teal-primary transition-colors">
									{post.title}
								</h3>
								<p className="text-gray-800 text-sm line-clamp-3 mb-4">
									{post.excerpt}
								</p>
								<div className="flex items-center justify-between">
									<span className="text-xs text-gray-500 flex items-center gap-1">
										<Clock className="w-3 h-3" />
										{Math.ceil(
											(post.content || post.excerpt || "")
												?.length / 200,
										) || 1}{" "}
										min de leitura
									</span>
									<span className="text-teal-primary text-sm font-semibold group-hover:text-teal-900 transition-colors">
										Ler mais →
									</span>
								</div>
							</div>
						</Link>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
};

export default NewsCarousel;
