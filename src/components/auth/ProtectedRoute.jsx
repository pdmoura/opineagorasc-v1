import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
	const { user, loading } = useAuth();
	const location = useLocation();

	// Log para debug
	useEffect(() => {
		console.log("🔐 ProtectedRoute - User:", user);
		console.log("🔐 ProtectedRoute - Loading:", loading);
		console.log("🔐 ProtectedRoute - Path:", location.pathname);
	}, [user, loading, location.pathname]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-primary mx-auto mb-4"></div>
					<p className="text-gray-600">Verificando autenticação...</p>
				</div>
			</div>
		);
	}

	if (!user) {
		console.log("🚫 ProtectedRoute - No user, redirecting to login");
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	console.log("✅ ProtectedRoute - User authenticated, allowing access");
	return children;
};

export default ProtectedRoute;
