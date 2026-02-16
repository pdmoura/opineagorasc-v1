// ==========================================
// UI ADMIN MODULE - Admin Dashboard Logic
// ==========================================

import {
	sb,
	savePost as apiSavePost,
	deletePost as apiDeletePost,
	saveAd as apiSaveAd,
	deleteAd as apiDeleteAd,
	uploadToCloudinary,
	fetchPendingComments,
	fetchApprovedComments,
	approveComment,
	rejectComment,
} from "./api.js";
import { formatDate, showToast } from "./utils.js";
import {
	getBlocksData,
	loadBlocksIntoEditor,
	clearEditor,
	renderBlocksView,
	extractFirstImage,
} from "./editor.js";

// ===== STATE MANAGEMENT =====
let posts = [];
let ads = [];

export function setPosts(data) {
	posts = data || [];
}

export function setAds(data) {
	ads = data || [];
}

export function getPosts() {
	return posts;
}

export function getAds() {
	return ads;
}

// ===== RENDERING FUNCTIONS =====

/**
 * Renderiza lista de posts no admin
 */
export function renderAdminPostList() {
	const container = document.getElementById("adminPostList");
	if (!container) return;

	if (posts.length === 0) {
		container.innerHTML = `
			<div class="empty-state">
				<div class="empty-state-icon">📰</div>
				<p class="empty-state-text">Nenhuma notícia publicada ainda.</p>
			</div>`;
		return;
	}

	let html = "";
	posts.forEach((post) => {
		html += `
			<div class="admin-post-item">
				<div class="admin-post-info">
					<div class="admin-post-title">${post.title}</div>
					<div class="admin-post-meta">${post.category} • ${formatDate(post.date)}</div>
				</div>
				<div class="admin-post-actions">
					<button class="btn-edit" onclick="editPost(${post.id})">✏️ Editar</button>
					<button class="btn-delete-small" onclick="deletePost(${post.id})">🗑️ Excluir</button>
				</div>
			</div>`;
	});
	container.innerHTML = html;
}

/**
 * Renderiza lista de anúncios no admin
 */
export function renderAdminAdList() {
	const container = document.getElementById("adminAdList");
	if (!container) return;

	if (ads.length === 0) {
		container.innerHTML = `
			<div class="empty-state">
				<div class="empty-state-icon">📢</div>
				<p class="empty-state-text">Nenhum anúncio publicado ainda.</p>
			</div>`;
		return;
	}

	let html = "";
	ads.forEach((ad) => {
		html += `
			<div class="admin-post-item">
				<div class="admin-post-info">
					<div class="admin-post-title">${ad.title}</div>
					<div class="admin-post-meta">${ad.category} • ${ad.contact}</div>
				</div>
				<div class="admin-post-actions">
					<button class="btn-edit" onclick="editAd(${ad.id})">✏️ Editar</button>
					<button class="btn-delete-small" onclick="deleteAd(${ad.id})">🗑️ Excluir</button>
				</div>
			</div>`;
	});
	container.innerHTML = html;
}

/**
 * Renderiza todas as listas admin
 */
export function renderAll() {
	renderAdminPostList();
	renderAdminAdList();
	renderAdminComments();
}

// ===== POST MANAGEMENT =====

/**
 * Salva post (novo ou editado)
 */
export async function savePost(e) {
	e.preventDefault();
	if (!sb) {
		showToast("❌ Erro: Não conectado.", "error");
		return;
	}

	const editId = document.getElementById("editPostId").value;
	const submitBtn = document.getElementById("postSubmitBtn");

	submitBtn.textContent = "⏳ Salvando...";
	submitBtn.disabled = true;

	// Get blocks data from editor
	const blocks = getBlocksData();
	const firstImage = extractFirstImage(blocks);

	const postData = {
		title: document.getElementById("postTitle").value,
		excerpt: document.getElementById("postExcerpt").value,
		content: JSON.stringify(blocks), // ← Save as JSON
		category: document.getElementById("postCategory").value,
		author: document.getElementById("postAuthor").value,
		image: firstImage || "", // ← Auto-extracted from blocks
		date: new Date().toISOString().split("T")[0],
		featured: false,
	};

	const { error } = await apiSavePost(postData, editId || null);

	submitBtn.disabled = false;

	if (error) {
		console.error(error);
		showToast("❌ Erro ao salvar.", "error");
		submitBtn.textContent = editId
			? "💾 Salvar Alterações"
			: "📝 Publicar Notícia";
	} else {
		showToast("✅ Sucesso!", "success");
		clearPostForm();
		window.dispatchEvent(new CustomEvent("dataChanged"));
		submitBtn.textContent = "📝 Publicar Notícia";
	}
}

/**
 * Deleta post
 */
export async function deletePost(id) {
	if (!sb) return;
	if (confirm("Excluir esta notícia?")) {
		const { error } = await apiDeletePost(id);
		if (error) showToast("❌ Erro ao excluir.", "error");
		else {
			showToast("🗑️ Excluído!", "success");
			window.dispatchEvent(new CustomEvent("dataChanged"));
		}
	}
}

/**
 * Edita post
 */
export function editPost(id) {
	const post = posts.find((p) => p.id === id);
	if (!post) return;

	switchTab("tabNewPost", document.querySelector(".admin-tab"));

	document.getElementById("editPostId").value = post.id;
	document.getElementById("postTitle").value = post.title;
	document.getElementById("postExcerpt").value = post.excerpt || "";
	document.getElementById("postCategory").value = post.category;
	document.getElementById("postAuthor").value = post.author;

	// Load blocks into editor
	try {
		const blocks = JSON.parse(post.content);
		loadBlocksIntoEditor(blocks);
	} catch (err) {
		// Fallback for old plain text posts
		const fallbackBlocks = [
			{ type: "text", data: { content: post.content } },
		];
		loadBlocksIntoEditor(fallbackBlocks);
	}

	document.getElementById("postSubmitBtn").textContent =
		"💾 Salvar Alterações";

	// Scroll to top
	window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Limpa formulário de post
 */
export function clearPostForm() {
	document.getElementById("postTitle").value = "";
	document.getElementById("postExcerpt").value = "";
	document.getElementById("postCategory").value = "";
	document.getElementById("postAuthor").value = "Cristiano Soares";

	clearEditor(); // Clear blocks

	document.getElementById("editPostId").value = "";
	document.getElementById("postSubmitBtn").textContent =
		"📝 Publicar Notícia";
}

// ===== AD MANAGEMENT =====

/**
 * Salva anúncio
 */
export async function saveAd(e) {
	e.preventDefault();
	if (!sb) return;

	const editId = document.getElementById("editAdId").value;
	const submitBtn = document.getElementById("adSubmitBtn");

	submitBtn.textContent = "⏳ Salvando...";
	submitBtn.disabled = true;

	const adData = {
		title: document.getElementById("adTitle").value,
		description: document.getElementById("adDescription").value,
		contact: document.getElementById("adContact").value,
		category: document.getElementById("adCategory").value,
		image: document.getElementById("adImage").value,
		date: new Date().toISOString().split("T")[0],
	};

	const { error } = await apiSaveAd(adData, editId || null);

	submitBtn.disabled = false;

	if (error) {
		showToast("❌ Erro ao salvar.", "error");
		submitBtn.textContent = editId
			? "💾 Salvar Alterações"
			: "📢 Publicar Anúncio";
	} else {
		showToast("✅ Sucesso!", "success");
		clearAdForm();
		window.dispatchEvent(new CustomEvent("dataChanged"));
		submitBtn.textContent = "📢 Publicar Anúncio";
	}
}

/**
 * Deleta anúncio
 */
export async function deleteAd(id) {
	if (!sb) return;
	if (confirm("Excluir este anúncio?")) {
		const { error } = await apiDeleteAd(id);
		if (error) showToast("❌ Erro ao excluir.", "error");
		else {
			showToast("🗑️ Excluído!", "success");
			window.dispatchEvent(new CustomEvent("dataChanged"));
		}
	}
}

/**
 * Edita anúncio
 */
export function editAd(id) {
	const ad = ads.find((a) => a.id === id);
	if (!ad) return;

	switchTab("tabNewAd", document.querySelectorAll(".admin-tab")[1]);

	document.getElementById("editAdId").value = ad.id;
	document.getElementById("adTitle").value = ad.title;
	document.getElementById("adDescription").value = ad.description;
	document.getElementById("adContact").value = ad.contact;
	document.getElementById("adCategory").value = ad.category;
	document.getElementById("adImage").value = ad.image || "";
	document.getElementById("adSubmitBtn").textContent = "💾 Salvar Alterações";

	if (ad.image) previewImage(ad.image, "adImagePreview");

	// Scroll to top
	window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Limpa formulário de anúncio
 */
export function clearAdForm() {
	document.getElementById("adTitle").value = "";
	document.getElementById("adDescription").value = "";
	document.getElementById("adContact").value = "";
	document.getElementById("adCategory").value = "Imóveis";
	document.getElementById("adImage").value = "";
	document.getElementById("adImagePreview").style.display = "none";
	document.getElementById("editAdId").value = "";
	document.getElementById("adSubmitBtn").textContent = "📢 Publicar Anúncio";
}

// ===== IMAGE MANAGEMENT =====

export async function uploadImage(fileInput) {
	const file = fileInput.files[0];
	if (!file) return;

	const submitBtn = document.getElementById("postSubmitBtn");
	submitBtn.textContent = "⏳ Enviando foto...";
	submitBtn.disabled = true;

	const url = await uploadToCloudinary(file);

	if (url) {
		showToast("✅ Foto enviada!", "success");
	} else {
		showToast("❌ Erro no envio", "error");
	}

	submitBtn.disabled = false;
	const isEditing = document.getElementById("editPostId").value !== "";
	submitBtn.textContent = isEditing
		? "💾 Salvar Alterações"
		: "📝 Publicar Notícia";
}

export function previewImage(url, previewId) {
	const img = document.getElementById(previewId);
	if (url) {
		img.src = url;
		img.style.display = "block";
	} else {
		img.style.display = "none";
	}
}

// ===== TAB CONTROLS =====

export function switchTab(tabId, btn) {
	document
		.querySelectorAll(".tab-content")
		.forEach((t) => t.classList.remove("active"));
	document
		.querySelectorAll(".admin-tab")
		.forEach((t) => t.classList.remove("active"));
	document.getElementById(tabId).classList.add("active");
	if (btn) btn.classList.add("active");
	if (tabId === "tabManage") {
		renderAdminPostList();
		renderAdminAdList();
	}
}

// ===== PREVIEW MODAL =====

/**
 * Visualiza preview da postagem
 */
export function previewPost() {
	const title = document.getElementById("postTitle").value;
	const category = document.getElementById("postCategory").value;
	const author = document.getElementById("postAuthor").value;
	const excerpt = document.getElementById("postExcerpt").value;

	if (!title) {
		showToast("⚠️ Preencha o título primeiro.", "warning");
		return;
	}

	// Get blocks data
	const blocks = getBlocksData();
	const blocksHtml = renderBlocksView(blocks);

	const previewContainer = document.getElementById("previewContainer");
	previewContainer.innerHTML = `
		<div class="post-view-body">
			<span class="post-view-category">${category || "Categoria"}</span>
			<h1 class="post-view-title">${title}</h1>
			<div class="post-view-meta">
				<span>Por <strong>${author}</strong></span>
				<span>•</span>
				<span>${new Date().toLocaleDateString("pt-BR")}</span>
			</div>
			${excerpt ? `<p style="font-size:1.1rem; color:var(--text-secondary); margin:16px 0;">${excerpt}</p>` : ""}
			<div class="post-view-text">${blocksHtml}</div>
		</div>
	`;

	document.getElementById("previewModal").classList.add("active");
	document.body.style.overflow = "hidden";
}

/**
 * Fecha preview modal
 */
export function closePreview() {
	document.getElementById("previewModal").classList.remove("active");
	document.body.style.overflow = "";
}

// ===== COMMENT MODERATION =====

/**
 * Renderiza lista de comentários pendentes e aprovados
 */
export async function renderAdminComments() {
	const pendingContainer = document.getElementById("adminPendingComments");
	const approvedContainer = document.getElementById("adminApprovedComments");

	if (!pendingContainer || !approvedContainer) return;

	// Show loading state
	pendingContainer.innerHTML =
		'<p style="text-align:center;color:#999;">⏳ Carregando comentários pendentes...</p>';
	approvedContainer.innerHTML =
		'<p style="text-align:center;color:#999;">⏳ Carregando comentários aprovados...</p>';

	// Fetch both pending and approved comments
	const [pendingComments, approvedComments] = await Promise.all([
		fetchPendingComments(),
		fetchApprovedComments(),
	]);

	// Update pending comments heading with count
	const pendingHeading = document.querySelector('h4[style*="#d97706"]');
	if (pendingHeading) {
		const count = pendingComments.length;
		const badge =
			count > 0
				? `<span style="background: #d97706; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.85rem; margin-left: 8px;">${count}</span>`
				: "";
		pendingHeading.innerHTML = `⏳ Pendentes (Aguardando Aprovação) ${badge}`;
	}

	// Render pending comments
	if (pendingComments.length === 0) {
		pendingContainer.innerHTML = `
			<div class="empty-state">
				<div class="empty-state-icon">💬</div>
				<p class="empty-state-text">Nenhum comentário pendente.</p>
			</div>`;
	} else {
		let html = "";
		pendingComments.forEach((comment) => {
			const postTitle = comment.posts?.title || "Post não encontrado";
			const date = new Date(comment.created_at).toLocaleDateString(
				"pt-BR",
				{
					day: "2-digit",
					month: "short",
					year: "numeric",
					hour: "2-digit",
					minute: "2-digit",
				},
			);

			html += `
				<div class="admin-post-item" style="border-left: 3px solid #d97706;">
					<div class="admin-post-info">
						<div class="admin-post-title" style="font-size: 0.95rem; margin-bottom: 8px;">
							📰 ${postTitle}
						</div>
						<div style="margin-bottom: 8px;">
							<strong style="color: var(--teal-primary);">${comment.name}</strong>
							<span style="color: var(--text-secondary); font-size: 0.85rem;"> (${comment.email})</span>
						</div>
						<p style="color: var(--text-secondary); font-size: 0.9rem; margin: 8px 0; padding: 8px; background: #f5f5f5; border-radius: 4px;">
							"${comment.content}"
						</p>
						<div class="admin-post-meta">${date}</div>
					</div>
					<div class="admin-post-actions">
						<button class="btn-edit" data-comment-id="${comment.id}" onclick="handleApproveComment(${comment.id})">
							✅ Aprovar
						</button>
						<button class="btn-delete-small" data-comment-id="${comment.id}" onclick="handleRejectComment(${comment.id})">
							🗑️ Rejeitar
						</button>
					</div>
				</div>`;
		});
		pendingContainer.innerHTML = html;
	}

	// Render approved comments
	if (approvedComments.length === 0) {
		approvedContainer.innerHTML = `
			<div class="empty-state">
				<div class="empty-state-icon">✅</div>
				<p class="empty-state-text">Nenhum comentário aprovado ainda.</p>
			</div>`;
	} else {
		let html = "";
		approvedComments.forEach((comment) => {
			const postTitle = comment.posts?.title || "Post não encontrado";
			const date = new Date(comment.created_at).toLocaleDateString(
				"pt-BR",
				{
					day: "2-digit",
					month: "short",
					year: "numeric",
					hour: "2-digit",
					minute: "2-digit",
				},
			);

			html += `
				<div class="admin-post-item" style="border-left: 3px solid var(--teal-primary);">
					<div class="admin-post-info">
						<div class="admin-post-title" style="font-size: 0.95rem; margin-bottom: 8px;">
							📰 ${postTitle}
						</div>
						<div style="margin-bottom: 8px;">
							<strong style="color: var(--teal-primary);">${comment.name}</strong>
							<span style="color: var(--text-secondary); font-size: 0.85rem;"> (${comment.email})</span>
						</div>
						<p style="color: var(--text-secondary); font-size: 0.9rem; margin: 8px 0; padding: 8px; background: #f5f5f5; border-radius: 4px;">
							"${comment.content}"
						</p>
						<div class="admin-post-meta">${date} • IP: ${comment.ip_address || "N/A"}</div>
					</div>
					<div class="admin-post-actions">
						<button class="btn-delete-small" data-comment-id="${comment.id}" onclick="handleDeleteApprovedComment(${comment.id})">
							🗑️ Remover
						</button>
					</div>
				</div>`;
		});
		approvedContainer.innerHTML = html;
	}
}

/**
 * Aprova um comentário
 */
window.handleApproveComment = async function (id) {
	try {
		await approveComment(id);
		showToast("✅ Comentário aprovado!", "success");
		renderAdminComments();
	} catch (error) {
		showToast("❌ Erro ao aprovar comentário", "error");
	}
};

/**
 * Rejeita (deleta) um comentário pendente
 */
window.handleRejectComment = async function (id) {
	if (confirm("Tem certeza que deseja rejeitar e deletar este comentário?")) {
		try {
			await rejectComment(id);
			showToast("🗑️ Comentário rejeitado!", "success");
			renderAdminComments();
		} catch (error) {
			showToast("❌ Erro ao rejeitar comentário", "error");
		}
	}
};

/**
 * Remove (deleta) um comentário aprovado
 */
window.handleDeleteApprovedComment = async function (id) {
	if (
		confirm(
			"Tem certeza que deseja remover este comentário publicado? Esta ação não pode ser desfeita.",
		)
	) {
		try {
			await rejectComment(id); // Reuse the same delete function
			showToast("🗑️ Comentário removido!", "success");
			renderAdminComments();
		} catch (error) {
			showToast("❌ Erro ao remover comentário", "error");
		}
	}
};
