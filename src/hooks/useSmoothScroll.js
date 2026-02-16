import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useSmoothScroll = () => {
	const location = useLocation();

	useEffect(() => {
		// Scroll suave quando a rota muda
		const scrollToTop = () => {
			// Verifica se já está no topo para evitar scroll desnecessário
			if (window.pageYOffset <= 10) {
				return; // Já está no topo, não precisa fazer scroll
			}

			// Pausa muito curta para o navegador terminar sua operação inicial
			setTimeout(() => {
				// Scroll mais suave e natural com duração maior
				const startPosition = window.pageYOffset;
				const targetPosition = 0;
				const distance = targetPosition - startPosition;
				const duration = 800; // 800ms para transição suave e natural

				let start = null;

				const animation = (currentTime) => {
					if (start === null) start = currentTime;
					const timeElapsed = currentTime - start;
					const progress = Math.min(timeElapsed / duration, 1);

					// Função de easing para movimento mais natural (ease-in-out)
					const easeInOutQuad = (t) => {
						return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
					};

					const easeProgress = easeInOutQuad(progress);
					const currentPosition =
						startPosition + distance * easeProgress;

					// Força o scroll para nossa posição (evita conflito com navegador)
					window.scrollTo(0, currentPosition);

					if (timeElapsed < duration) {
						requestAnimationFrame(animation);
					}
				};

				requestAnimationFrame(animation);
			}, 50); // Pequeno delay apenas para sincronização
		};

		// Delay para garantir que a página foi completamente renderizada
		const timeoutId = setTimeout(scrollToTop, 150);

		return () => clearTimeout(timeoutId);
	}, [location.pathname]);
};
