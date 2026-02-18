import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";

const PublicRoute = ({ children }) => {
	const { user, loading } = useAuth();
	const location = useLocation();

	// Log para debug
	useEffect(() => {}, [user, loading, location.pathname]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-primary mx-auto mb-4"></div>
					<p className="text-gray-600">Carregando...</p>
				</div>
			</div>
		);
	}

	// Se usuário já está autenticado e tenta acessar login, redirecionar para admin
	if (user && location.pathname === "/login") {
		return <Navigate to="/admin" replace />;
	}

	return children;
};

export default PublicRoute;
