import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useSmoothScroll = () => {
	const location = useLocation();

	useEffect(() => {
		// Desabilita a restauração automática de scroll do navegador
		if ("scrollRestoration" in window.history) {
			window.history.scrollRestoration = "manual";
		}

		// Pulo imediato para o topo quando a rota muda
		window.scrollTo(0, 0);
	}, [location.pathname]);
};
