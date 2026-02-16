// ==========================================
// MAIN ADMIN - Entry Point for Admin Dashboard
// ==========================================

import { fetchPosts, fetchAds, sb } from "./modules/api.js";
import { adminLogout, checkSession } from "./modules/auth.js";
import { updateDate, showToast } from "./modules/utils.js";
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
	switchTab,
	previewImage,
	uploadImage,
	previewPost,
	closePreview,
} from "./modules/ui-admin.js";

// ===== INITIALIZATION =====

document.addEventListener("DOMContentLoaded", async function () {
	console.log("🎛️ Iniciando dashboard administrativo...");

	// Verifica sessão ativa
	const session = await checkSession();
	if (!session) {
		console.log("❌ Usuário não autenticado. Redirecionando...");
		window.location.href = "/login";
		return;
	}

	console.log("✅ Usuário autenticado.");
	document.body.style.opacity = "1";

	// Atualiza data
	updateDate();

	// Fetch inicial de dados
	const postsData = await fetchPosts();
	const adsData = await fetchAds();

	setPosts(postsData);
	setAds(adsData);

	// Renderiza listas admin
	renderAll();

	// ===== EVENT LISTENERS =====

	// Tab switching
	document.querySelectorAll(".admin-tab").forEach((tab) => {
		tab.addEventListener("click", () => {
			const tabId = tab.dataset.tab;
			switchTab(tabId, tab);
		});
	});

	// Forms
	const postForm = document.getElementById("postForm");
	const adForm = document.getElementById("adForm");
	if (postForm) postForm.addEventListener("submit", savePost);
	if (adForm) adForm.addEventListener("submit", saveAd);

	// Block add buttons - use event delegation for dynamically added blocks
	document.addEventListener("click", (e) => {
		const blockBtn = e.target.closest(".btn-block-add");
		if (blockBtn) {
			const blockType = blockBtn.dataset.blockType;
			addBlock(blockType);
		}

		// Block movement and deletion
		const btnUp = e.target.closest(".action-move-up");
		if (btnUp && btnUp.dataset.index !== undefined) {
			e.preventDefault();
			moveBlockUp(parseInt(btnUp.dataset.index));
		}

		const btnDown = e.target.closest(".action-move-down");
		if (btnDown && btnDown.dataset.index !== undefined) {
			e.preventDefault();
			moveBlockDown(parseInt(btnDown.dataset.index));
		}

		const btnDelete = e.target.closest(".action-delete");
		if (btnDelete && btnDelete.dataset.index !== undefined) {
			e.preventDefault();
			deleteBlock(parseInt(btnDelete.dataset.index));
		}

		// Edit/Delete post buttons in admin list - use event delegation
		if (e.target.closest(".btn-edit")) {
			const button = e.target.closest(".btn-edit");
			// Check if it's a post edit button (check parent structure)
			const postItem = button.closest(".admin-post-item");
			if (postItem && postItem.querySelector("h4")) {
				// This is a bit hacky, but we need to extract post ID
				// The better way is to add data-post-id to the buttons in renderAdminPostList
				// For now, we'll rely on the global window functions still being there
			}
		}
	});

	// Image upload event delegation
	document.addEventListener("change", (e) => {
		if (e.target.classList.contains("action-upload-image")) {
			const index = parseInt(e.target.dataset.index);
			const fieldName = e.target.dataset.fieldName;
			uploadBlockImage(e.target, index, fieldName);
		}
	});

	// Preview button
	const previewBtn = document.getElementById("previewBtn");
	if (previewBtn) previewBtn.addEventListener("click", previewPost);

	// Preview close button
	const previewCloseBtn = document.getElementById("previewCloseBtn");
	if (previewCloseBtn)
		previewCloseBtn.addEventListener("click", closePreview);

	// Logout button
	const logoutBtn = document.getElementById("logoutBtn");
	if (logoutBtn) logoutBtn.addEventListener("click", adminLogout);

	// Ad image preview
	const adImage = document.getElementById("adImage");
	if (adImage)
		adImage.addEventListener("input", (e) => {
			previewImage(e.target.value, "adImagePreview");
		});

	// Close preview on background click
	const previewModal = document.getElementById("previewModal");
	if (previewModal) {
		previewModal.addEventListener("click", function (e) {
			if (e.target === this) closePreview();
		});
	}

	console.log("✅ Dashboard administrativo carregado com sucesso!");
});

// ===== GLOBAL WINDOW FUNCTIONS (TEMPORARY - for edit/delete buttons) =====
// These are still needed because edit/delete buttons in renderAdminPostList/ui-admin.js use onclick
// TODO: Update ui-admin.js to use data attributes instead

window.editPost = editPost;
window.deletePost = deletePost;
window.editAd = editAd;
window.deleteAd = deleteAd;

// ===== DATA CHANGE LISTENER =====

// Re-fetch quando dados mudarem
window.addEventListener("dataChanged", async function () {
	const postsData = await fetchPosts();
	const adsData = await fetchAds();
	setPosts(postsData);
	setAds(adsData);
	renderAll();
});

// ===== KEYBOARD SHORTCUTS =====

document.addEventListener("keydown", function (e) {
	if (e.key === "Escape") {
		closePreview();
	}
});
