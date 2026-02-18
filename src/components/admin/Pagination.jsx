import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
	currentPage,
	totalPages,
	onPageChange,
	totalItems,
	itemsPerPage,
	itemName = "item",
	itemNamePlural = "itens",
}) => {
	if (totalPages <= 1) return null;

	const startItem = (currentPage - 1) * itemsPerPage + 1;
	const endItem = Math.min(currentPage * itemsPerPage, totalItems);

	// Calculate Previous Range
	const prevStart = (currentPage - 2) * itemsPerPage + 1;
	const prevEnd = (currentPage - 1) * itemsPerPage;

	// Calculate Next Range
	const nextStart = endItem + 1;
	const nextEnd = Math.min((currentPage + 1) * itemsPerPage, totalItems);

	return (
		<div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
			{/* Left side info */}
			{totalItems !== undefined && (
				<div className="flex-1">
					<p className="text-sm text-text-secondary">
						Mostrando{" "}
						<span className="font-medium">{startItem}</span> a{" "}
						<span className="font-medium">{endItem}</span> de{" "}
						<span className="font-medium">{totalItems}</span>{" "}
						{totalItems === 1 ? itemName : itemNamePlural}
					</p>
				</div>
			)}

			{/* Navigation Buttons */}
			<div className="flex space-x-3">
				<button
					onClick={() => onPageChange(Math.max(1, currentPage - 1))}
					disabled={currentPage === 1}
					className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					<ChevronLeft className="h-4 w-4 mr-1" />
					{currentPage > 1
						? `Anterior ${prevStart}-${prevEnd}`
						: "Anterior"}
				</button>

				<button
					onClick={() =>
						onPageChange(Math.min(totalPages, currentPage + 1))
					}
					disabled={currentPage === totalPages}
					className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{currentPage < totalPages
						? `Próxima ${nextStart}-${nextEnd}`
						: "Próxima"}
					<ChevronRight className="h-4 w-4 ml-1" />
				</button>
			</div>
		</div>
	);
};

export default Pagination;
