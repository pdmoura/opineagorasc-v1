// ==========================================
// MAIN - Entry Point
// ==========================================

import { initializeSupabase, fetchPosts, fetchAds } from "./modules/api.js";
import { adminLogin, adminLogout, checkSession } from "./modules/auth.js";
import {
	updateDate,
	initScrollEffects,
	initFadeAnimations,
} from "./modules/utils.js";
import {
	addBlock,
	moveBlockUp,
	moveBlockDown,
	deleteBlock,
	uploadBlockImage,
} from "./modules/editor.js";
import {
	setPosts,
	setAds,
	renderAll,
	savePost,
	deletePost,
	editPost,
	clearPostForm,
	saveAd,
	deleteAd,
	editAd,
	clearAdForm,
	openAdminModal,
	closeAdminModal,
	switchTab,
	viewPost,
	closePostView,
	handleImageUrl,
	uploadImage,
	removePostImage,
	previewImage,
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
} from "./modules/ui.js";

// ===== EXPOSE FUNCTIONS TO WINDOW FOR ONCLICK HANDLERS =====

// Block Editor - addBlock might still be used in HTML
window.addBlock = addBlock;

// Authentication
window.adminLogin = adminLogin;
window.adminLogout = adminLogout;

window.savePost = savePost;
window.deletePost = deletePost;
window.editPost = editPost;
window.clearPostForm = clearPostForm;

window.saveAd = saveAd;
window.deleteAd = deleteAd;
window.editAd = editAd;
window.clearAdForm = clearAdForm;

window.openAdminModal = openAdminModal;
window.closeAdminModal = closeAdminModal;
window.switchTab = switchTab;

window.viewPost = viewPost;
window.closePostView = closePostView;

window.handleImageUrl = handleImageUrl;
window.uploadToCloudinary = uploadImage;
window.removePostImage = removePostImage;
window.previewImage = previewImage;

window.toggleSearch = toggleSearch;
window.searchPosts = searchPosts;

window.filterCategory = filterCategory;
window.goHome = goHome;

window.toggleMenu = toggleMenu;
window.closeMobileMenu = closeMobileMenu;

window.subscribeNewsletter = subscribeNewsletter;

window.moveSlide = moveSlide;
window.goToSlide = goToSlide;
window.startCarousel = startCarousel;
window.stopCarousel = stopCarousel;

// ===== INITIALIZATION =====

document.addEventListener("DOMContentLoaded", async function () {
	console.log("Iniciando carregamento...");

	// Verifica se Supabase SDK foi carregado
	if (typeof window.supabase === "undefined") {
		console.error("ERRO: A biblioteca do Supabase não foi encontrada.");
		alert(
			"Erro: A biblioteca do Supabase não carregou. Verifique o <head> do seu index.html.",
		);
		return;
	}

	// Inicializa Supabase
	const client = initializeSupabase();
	if (!client) return;

	// Atualiza data
	updateDate();

	// Verifica sessão ativa
	await checkSession();

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

	console.log("✅ Aplicação carregada com sucesso!");
});

// ===== EVENT LISTENERS =====

// Re-fetch quando dados mudarem
window.addEventListener("dataChanged", async function () {
	const postsData = await fetchPosts();
	const adsData = await fetchAds();
	setPosts(postsData);
	setAds(adsData);
	renderAll();
});

// Re-render quando autenticação mudar
window.addEventListener("authStateChanged", function () {
	renderAll();
});

// Modal close on background click
document.addEventListener("DOMContentLoaded", function () {
	const adminModal = document.getElementById("adminModal");
	const postViewModal = document.getElementById("postViewModal");

	if (adminModal) {
		adminModal.addEventListener("click", function (e) {
			if (e.target === this) closeAdminModal();
		});
	}

	if (postViewModal) {
		postViewModal.addEventListener("click", function (e) {
			if (e.target === this) closePostView();
		});
	}

	// ===== BLOCK EDITOR EVENT DELEGATION =====

	// Click events for block controls
	document.addEventListener("click", (e) => {
		// Move block up
		const btnUp = e.target.closest(".action-move-up");
		if (btnUp && btnUp.dataset.index !== undefined) {
			e.preventDefault();
			moveBlockUp(parseInt(btnUp.dataset.index));
			return;
		}

		// Move block down
		const btnDown = e.target.closest(".action-move-down");
		if (btnDown && btnDown.dataset.index !== undefined) {
			e.preventDefault();
			moveBlockDown(parseInt(btnDown.dataset.index));
			return;
		}

		// Delete block
		const btnDelete = e.target.closest(".action-delete");
		if (btnDelete && btnDelete.dataset.index !== undefined) {
			e.preventDefault();
			deleteBlock(parseInt(btnDelete.dataset.index));
			return;
		}
	});

	// Change events for image uploads
	document.addEventListener("change", (e) => {
		const uploadInput = e.target.closest(".action-upload-image");
		if (uploadInput && uploadInput.dataset.blockIndex !== undefined) {
			const blockIndex = parseInt(uploadInput.dataset.blockIndex);
			const fieldName = uploadInput.dataset.fieldName;
			uploadBlockImage(uploadInput, blockIndex, fieldName);
		}
	});
});

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
	if (e.key === "Escape") {
		closeAdminModal();
		closePostView();
		closeMobileMenu();

		const searchOverlay = document.getElementById("searchOverlay");
		if (searchOverlay && searchOverlay.classList.contains("active")) {
			toggleSearch();
		}
	}
});
