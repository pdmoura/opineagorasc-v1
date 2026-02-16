// ==========================================
// MAIN PUBLIC - Entry Point for Public Site
// ==========================================

import { fetchPosts, fetchAds } from "./modules/api.js";
import {
	updateDate,
	initScrollEffects,
	initFadeAnimations,
} from "./modules/utils.js";
import {
	setPosts,
	setAds,
	renderAll,
	viewPost,
	toggleSearch,
	searchPosts,
	filterCategory,
	goHome,
	toggleMenu,
	closeMobileMenu,
	subscribeNewsletter,
	moveSlide,
	goToSlide,
	startCarousel,
	stopCarousel,
} from "./modules/ui-public.js";

// ===== INITIALIZATION =====

document.addEventListener("DOMContentLoaded", async function () {
	console.log("🌐 Iniciando site público...");

	// Atualiza data
	updateDate();

	// Fetch inicial de dados
	const postsData = await fetchPosts();
	const adsData = await fetchAds();

	setPosts(postsData);
	setAds(adsData);

	// Renderiza tudo
	renderAll();

	// Inicializa efeitos
	initScrollEffects();
	initFadeAnimations();

	// ===== EVENT LISTENERS =====

	// Search toggle
	const searchToggle = document.getElementById("searchToggle");
	const searchClose = document.getElementById("searchClose");
	if (searchToggle) searchToggle.addEventListener("click", toggleSearch);
	if (searchClose) searchClose.addEventListener("click", toggleSearch);

	// Hamburger menu
	const hamburger = document.getElementById("hamburger");
	const mobileOverlay = document.getElementById("mobileOverlay");
	if (hamburger) hamburger.addEventListener("click", toggleMenu);
	if (mobileOverlay) mobileOverlay.addEventListener("click", toggleMenu);

	// Logo/Home links
	const logoLink = document.getElementById("logoLink");
	const homeLink = document.getElementById("homeLink");
	if (logoLink)
		logoLink.addEventListener("click", (e) => {
			e.preventDefault();
			goHome();
		});
	if (homeLink)
		homeLink.addEventListener("click", (e) => {
			e.preventDefault();
			goHome();
		});

	// About link
	const aboutLink = document.getElementById("aboutLink");
	if (aboutLink) aboutLink.addEventListener("click", closeMobileMenu);

	// Category pills - use event delegation
	document.querySelectorAll(".category-pill").forEach((pill) => {
		pill.addEventListener("click", () => {
			const category = pill.dataset.category;
			filterCategory(category, pill);
		});
	});

	// Filter links in header/footer
	document.querySelectorAll(".filter-link").forEach((link) => {
		link.addEventListener("click", (e) => {
			e.preventDefault();
			const category = link.dataset.category;
			filterCategory(category);
			closeMobileMenu();
		});
	});

	// Newsletter form
	const newsletterForm = document.getElementById("newsletterForm");
	if (newsletterForm)
		newsletterForm.addEventListener("submit", subscribeNewsletter);

	// Search input
	const searchInput = document.getElementById("searchInput");
	if (searchInput) searchInput.addEventListener("input", searchPosts);

	// Back to top
	const backToTop = document.getElementById("backToTop");
	if (backToTop)
		backToTop.addEventListener("click", () => {
			window.scrollTo({ top: 0, behavior: "smooth" });
		});

	// Click on news cards - use event delegation
	document.addEventListener("click", (e) => {
		const card = e.target.closest("[data-post-id]");
		if (card && card.dataset.postId) {
			const postId = card.dataset.postId;
			viewPost(parseInt(postId));
		}
	});

	// Carousel controls - use event delegation since they're rendered dynamically
	document.addEventListener("click", (e) => {
		if (e.target.closest(".carousel-btn.prev")) {
			e.stopPropagation();
			moveSlide(-1);
		} else if (e.target.closest(".carousel-btn.next")) {
			e.stopPropagation();
			moveSlide(1);
		} else if (e.target.closest(".carousel-dot")) {
			e.stopPropagation();
			const dot = e.target.closest(".carousel-dot");
			if (dot && dot.dataset.slideIndex !== undefined) {
				goToSlide(parseInt(dot.dataset.slideIndex));
			}
		}
	});

	console.log("✅ Site público carregado com sucesso!");
});

// ===== KEYBOARD SHORTCUTS =====

document.addEventListener("keydown", function (e) {
	if (e.key === "Escape") {
		closeMobileMenu();

		const searchOverlay = document.getElementById("searchOverlay");
		if (searchOverlay && searchOverlay.classList.contains("active")) {
			toggleSearch();
		}
	}
});
