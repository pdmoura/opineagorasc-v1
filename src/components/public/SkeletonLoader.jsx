import { Loader2 } from 'lucide-react'

const SkeletonLoader = ({ type = 'card' }) => {
	if (type === 'hero') {
		return (
			<div className="animate-pulse">
				<div className="h-96 bg-gray-300 rounded-lg mb-6"></div>
			</div>
		)
	}

	if (type === 'card') {
		return (
			<div className="animate-pulse">
				<div className="bg-white rounded-lg shadow-sm overflow-hidden">
					<div className="h-48 bg-gray-300"></div>
					<div className="p-4">
						<div className="h-4 bg-gray-300 rounded mb-2"></div>
						<div className="h-3 bg-gray-200 rounded mb-2"></div>
						<div className="h-3 bg-gray-200 rounded w-3/4"></div>
					</div>
				</div>
			</div>
		)
	}

	if (type === 'list') {
		return (
			<div className="animate-pulse space-y-4">
				{[1, 2, 3].map((i) => (
					<div key={i} className="flex space-x-4">
						<div className="w-20 h-20 bg-gray-300 rounded"></div>
						<div className="flex-1">
							<div className="h-4 bg-gray-300 rounded mb-2"></div>
							<div className="h-3 bg-gray-200 rounded"></div>
						</div>
					</div>
				))}
			</div>
		)
	}

	return (
		<div className="flex items-center justify-center py-12">
			<Loader2 className="w-8 h-8 animate-spin text-teal-primary" />
		</div>
	)
}

export default SkeletonLoader
