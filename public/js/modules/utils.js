// ==========================================
// UTILS MODULE - Pure utility functions
// ==========================================

/**
 * Formata data para pt-BR
 */
export function formatDate(dateStr) {
	if (!dateStr) return "";
	const date = new Date(dateStr + "T12:00:00");
	const options = { day: "2-digit", month: "short", year: "numeric" };
	return date.toLocaleDateString("pt-BR", options);
}

/**
 * Obtém iniciais de um nome
 */
export function getInitials(name) {
	return name
		? name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: "CS";
}

/**
 * Atualiza a data no topo da página
 */
export function updateDate() {
	const options = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	const date = new Date().toLocaleDateString("pt-BR", options);
	const displayElement = document.getElementById("dateDisplay");
	if (displayElement) {
		displayElement.textContent =
			date.charAt(0).toUpperCase() + date.slice(1);
	}
}

/**
 * Mostra toast de notificação
 */
export function showToast(message, type = "success") {
	const toast = document.getElementById("toast");
	if (!toast) return;

	toast.textContent = message;
	toast.className = `toast ${type} show`;
	setTimeout(() => {
		toast.classList.remove("show");
	}, 3500);
}

/**
 * Inicializa efeitos de scroll (header e back-to-top)
 */
export function initScrollEffects() {
	const header = document.getElementById("header");
	const backToTop = document.getElementById("backToTop");

	window.addEventListener("scroll", () => {
		if (window.scrollY > 50) {
			header?.classList.add("scrolled");
		} else {
			header?.classList.remove("scrolled");
		}

		if (window.scrollY > 400) {
			backToTop?.classList.add("visible");
		} else {
			backToTop?.classList.remove("visible");
		}
	});
}

/**
 * Inicializa animações fade-in com Intersection Observer
 */
export function initFadeAnimations() {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("visible");
				}
			});
		},
		{ threshold: 0.1 },
	);

	document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
}
