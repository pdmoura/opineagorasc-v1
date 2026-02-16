import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const AdminRoute = ({ children }) => {
	const { user, loading } = useAuth();
	const location = useLocation();

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-primary mx-auto mb-4"></div>
					<p className="text-gray-600">
						Verificando permissões de administrador...
					</p>
				</div>
			</div>
		);
	}

	// Verificar se usuário está autenticado
	if (!user) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	// Verificar se usuário é admin (email específico)
	const adminEmail = "cristiano@opineagorasc.com.br";
	const isAdmin = user?.email === adminEmail;

	if (!isAdmin) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return children;
};

export default AdminRoute;
