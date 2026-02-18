import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CarouselPreview = ({ images }) => {
	const [currentSlide, setCurrentSlide] = useState(0);

	const validImages = images?.filter((img) => img.url) || [];
	if (validImages.length === 0) return null;

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % validImages.length);
	};

	const prevSlide = () => {
		setCurrentSlide(
			(prev) => (prev - 1 + validImages.length) % validImages.length,
		);
	};

	return (
		<div className="my-6">
			<div className="relative overflow-hidden rounded-lg shadow-md group">
				<div className="relative h-96">
					{validImages.map((image, imgIndex) => (
						<div
							key={imgIndex}
							className={`absolute inset-0 transition-opacity duration-500 ${
								imgIndex === currentSlide
									? "opacity-100"
									: "opacity-0"
							}`}
						>
							{image.link ? (
								<a
									href={image.link}
									target="_blank"
									rel="noopener noreferrer"
									className="block w-full h-full"
								>
									<img
										src={image.url}
										alt={image.alt || ""}
										className="w-full h-full object-cover"
									/>
								</a>
							) : (
								<img
									src={image.url}
									alt={image.alt || ""}
									className="w-full h-full object-cover"
								/>
							)}
						</div>
					))}
				</div>

				{/* Navigation */}
				{validImages.length > 1 && (
					<>
						<button
							onClick={prevSlide}
							className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<ChevronLeft className="w-5 h-5" />
						</button>
						<button
							onClick={nextSlide}
							className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<ChevronRight className="w-5 h-5" />
						</button>
					</>
				)}

				{/* Indicators */}
				{validImages.length > 1 && (
					<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
						{validImages.map((_, imgIndex) => (
							<button
								key={imgIndex}
								onClick={() => setCurrentSlide(imgIndex)}
								className={`w-2 h-2 rounded-full transition-colors ${
									imgIndex === currentSlide
										? "bg-white"
										: "bg-white bg-opacity-50"
								}`}
							/>
						))}
					</div>
				)}

				{/* Caption */}
				{validImages[currentSlide]?.caption && (
					<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
						<p className="text-white text-sm">
							{validImages[currentSlide].caption}
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default CarouselPreview;
