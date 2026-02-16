// ==========================================
// UI MODULE - Rendering & Modal Control
// ==========================================

import {
	sb,
	savePost as apiSavePost,
	deletePost as apiDeletePost,
	saveAd as apiSaveAd,
	deleteAd as apiDeleteAd,
	uploadToCloudinary,
	getCloudinaryUrl,
} from "./api.js";
import { isAdminLogged } from "./auth.js";
import { formatDate, getInitials, showToast } from "./utils.js";
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
let currentSlide = 0;
let carouselInterval = null;

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
 * Renderiza todos os elementos da página
 */
export function renderAll() {
	renderHero();
	renderNewsGrid();
	renderMoreNews();
	renderMostRead();
	renderOpinions();
	renderAds();

	if (isAdminLogged) {
		renderAdminPostList();
		renderAdminAdList();
	}
}

/**
 * Renderiza o hero carousel
 */
export function renderHero() {
	const featured = posts.filter((p) => p.featured).slice(0, 5);
	const slidesData = featured.length > 0 ? featured : posts.slice(0, 5);

	if (slidesData.length === 0) {
		document.getElementById("heroSection").innerHTML = "";
		return;
	}

	let slidesHtml = "";
	let indicatorsHtml = "";

	slidesData.forEach((post, index) => {
		slidesHtml += `
            <div class="carousel-slide" data-post-id="${post.id}">
                <img src="${getCloudinaryUrl(post.image, "banner") || "https://images.unsplash.com/photo-1504711434969-e33886168d1c?w=800&h=500&fit=crop"}" alt="${post.title}">
                <div class="carousel-overlay">
                    <span class="hero-category">${post.category}</span>
                    <h1 class="hero-title">${post.title}</h1>
                    <div class="hero-meta">
                        <span>Por ${post.author}</span> • <span>${formatDate(post.date)}</span>
                    </div>
                </div>
            </div>
        `;

		indicatorsHtml += `<button class="carousel-dot ${index === 0 ? "active" : ""}" data-slide-index="${index}"></button>`;
	});

	const carouselHtml = `
        <div class="hero-carousel">
            <div class="carousel-track" id="track">
                ${slidesHtml}
            </div>
            
            <button class="carousel-btn prev">&#10094;</button>
            <button class="carousel-btn next">&#10095;</button>
            
            <div class="carousel-indicators">
                ${indicatorsHtml}
            </div>
        </div>
    `;

	document.getElementById("heroSection").innerHTML = carouselHtml;

	currentSlide = 0;
	startCarousel();
}

/**
 * Renderiza grid de notícias
 */
export function renderNewsGrid() {
	const featuredIds = posts
		.filter((p) => p.featured)
		.slice(0, 3)
		.map((p) => p.id);
	const newsPosts = posts
		.filter((p) => !featuredIds.includes(p.id))
		.slice(0, 4);

	let html = "";
	newsPosts.forEach((post) => {
		html += createNewsCard(post);
	});
	document.getElementById("newsGrid").innerHTML = html;
}

/**
 * Renderiza mais notícias (horizontal cards)
 */
export function renderMoreNews() {
	const featuredIds = posts
		.filter((p) => p.featured)
		.slice(0, 3)
		.map((p) => p.id);
	const gridIds = posts
		.filter((p) => !featuredIds.includes(p.id))
		.slice(0, 4)
		.map((p) => p.id);
	const morePosts = posts.filter(
		(p) => !featuredIds.includes(p.id) && !gridIds.includes(p.id),
	);

	let html = "";
	morePosts.forEach((post) => {
		html += `
        <div class="news-card-horizontal" data-post-id="${post.id}">
            <div class="news-card-image">
                <img src="${getCloudinaryUrl(post.image, "thumbnail") || "https://via.placeholder.com/400"}" alt="${post.title}" loading="lazy">
            </div>
            <div class="news-card-body">
                <span class="news-card-category" style="position:static;margin-bottom:8px;display:inline-block;">${post.category}</span>
                <h3 class="news-card-title">${post.title}</h3>
                <p class="news-card-excerpt">${post.excerpt || ""}</p>
                <div class="news-card-meta">
                    <div class="news-card-author">
                        <div class="author-avatar-sm">CS</div>
                        <span>${post.author}</span>
                    </div>
                    <span>${formatDate(post.date)}</span>
                </div>
            </div>
        </div>`;
	});
	document.getElementById("moreNews").innerHTML = html;
}

/**
 * Cria um card de notícia
 */
export function createNewsCard(post) {
	return `
    <div class="news-card" data-post-id="${post.id}">
        <div class="news-card-image">
            <img src="${getCloudinaryUrl(post.image, "thumbnail") || "https://via.placeholder.com/400"}" alt="${post.title}" loading="lazy">
            <span class="news-card-category">${post.category}</span>
        </div>
        <div class="news-card-body">
            <h3 class="news-card-title">${post.title}</h3>
            <p class="news-card-excerpt">${post.excerpt || ""}</p>
            <div class="news-card-meta">
                <div class="news-card-author">
                    <div class="author-avatar-sm">CS</div>
                    <span>${post.author}</span>
                </div>
                <span>${formatDate(post.date)}</span>
            </div>
        </div>
        <div class="card-admin-actions ${isAdminLogged ? "show" : ""}">
            <button class="btn-edit" onclick="event.stopPropagation();editPost(${post.id})">✏️ Editar</button>
            <button class="btn-danger" onclick="event.stopPropagation();deletePost(${post.id})">🗑️ Excluir</button>
        </div>
    </div>`;
}

/**
 * Renderiza "Mais Lidas"
 */
export function renderMostRead() {
	const sorted = posts.slice(0, 5);
	let html = "";
	sorted.forEach((post, index) => {
		html += `
        <div class="most-read-item" data-post-id="${post.id}">
            <span class="most-read-number">${String(index + 1).padStart(2, "0")}</span>
            <div class="most-read-text">
                <h4>${post.title}</h4>
                <span>${post.category} • ${formatDate(post.date)}</span>
            </div>
        </div>`;
	});
	document.getElementById("mostRead").innerHTML = html;
}

/**
 * Renderiza seção de opinião
 */
export function renderOpinions() {
	const opinions = posts.filter((p) => p.category === "Opinião").slice(0, 3);
	let html = "";
	opinions.forEach((post) => {
		html += `
        <div class="opinion-card" data-post-id="${post.id}">
            <div class="opinion-card-header">
                <div class="opinion-avatar">${getInitials(post.author)}</div>
                <div>
                    <div class="opinion-author-name">${post.author}</div>
                    <div class="opinion-author-role">Colunista</div>
                </div>
            </div>
            <h3 class="opinion-card-title">${post.title}</h3>
            <p class="opinion-card-text">${post.excerpt || ""}</p>
        </div>`;
	});
	document.getElementById("opinionGrid").innerHTML = html;
}

/**
 * Renderiza anúncios
 */
export function renderAds() {
	let html = "";
	ads.forEach((ad) => {
		html += `
        <div class="ad-card">
            ${ad.image ? `<div class="ad-card-image"><img src="${ad.image}" alt="${ad.title}" loading="lazy"></div>` : ""}
            <div class="ad-card-body">
                <span class="ad-card-label">Anúncio • ${ad.category}</span>
                <h3 class="ad-card-title">${ad.title}</h3>
                <p class="ad-card-text">${ad.description}</p>
                <p class="ad-card-contact">📞 ${ad.contact}</p>
                ${
					isAdminLogged
						? `
                    <div style="display:flex;gap:6px;margin-top:12px;">
                        <button class="btn-edit" onclick="editAd(${ad.id})">✏️ Editar</button>
                        <button class="btn-danger" onclick="deleteAd(${ad.id})">🗑️ Excluir</button>
                    </div>
                `
						: ""
				}
            </div>
        </div>`;
	});
	document.getElementById("adsGrid").innerHTML = html;
}

/**
 * Renderiza lista de posts no admin
 */
export function renderAdminPostList() {
	let html = "";
	posts.forEach((post) => {
		html += `
        <div class="admin-post-item">
            <div class="admin-post-info">
                <h4>${post.title}</h4>
                <span>${post.category} • ${formatDate(post.date)}</span>
            </div>
            <div class="admin-post-actions">
                <button class="btn-edit" onclick="editPost(${post.id})">✏️ Editar</button>
                <button class="btn-danger" onclick="deletePost(${post.id})">🗑️ Excluir</button>
            </div>
        </div>`;
	});
	document.getElementById("adminPostList").innerHTML =
		html || "<p>Nenhuma notícia encontrada.</p>";
}

/**
 * Renderiza lista de anúncios no admin
 */
export function renderAdminAdList() {
	let html = "";
	ads.forEach((ad) => {
		html += `
        <div class="admin-post-item">
            <div class="admin-post-info">
                <h4>${ad.title}</h4>
                <span>${ad.category} • ${ad.contact}</span>
            </div>
            <div class="admin-post-actions">
                <button class="btn-edit" onclick="editAd(${ad.id})">✏️ Editar</button>
                <button class="btn-danger" onclick="deleteAd(${ad.id})">🗑️ Excluir</button>
            </div>
        </div>`;
	});
	document.getElementById("adminAdList").innerHTML =
		html || "<p>Nenhum anúncio encontrado.</p>";
}

// ===== CAROUSEL CONTROLS =====

export function updateCarousel() {
	const track = document.getElementById("track");
	const dots = document.querySelectorAll(".carousel-dot");

	if (!track) return;

	track.style.transform = `translateX(-${currentSlide * 100}%)`;

	dots.forEach((dot, index) => {
		if (index === currentSlide) dot.classList.add("active");
		else dot.classList.remove("active");
	});
}

export function moveSlide(direction) {
	const totalSlides = document.querySelectorAll(".carousel-slide").length;

	currentSlide += direction;

	if (currentSlide >= totalSlides) {
		currentSlide = 0;
	} else if (currentSlide < 0) {
		currentSlide = totalSlides - 1;
	}

	updateCarousel();
}

export function goToSlide(index) {
	currentSlide = index;
	updateCarousel();
}

export function startCarousel() {
	stopCarousel();
	carouselInterval = setInterval(() => {
		moveSlide(1);
	}, 5000);
}

export function stopCarousel() {
	clearInterval(carouselInterval);
}

// ===== POST & AD MANAGEMENT =====

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

	openAdminModal();
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

	openAdminModal();
	switchTab("tabNewAd", document.querySelectorAll(".admin-tab")[1]);

	document.getElementById("editAdId").value = ad.id;
	document.getElementById("adTitle").value = ad.title;
	document.getElementById("adDescription").value = ad.description;
	document.getElementById("adContact").value = ad.contact;
	document.getElementById("adCategory").value = ad.category;
	document.getElementById("adImage").value = ad.image || "";
	document.getElementById("adSubmitBtn").textContent = "💾 Salvar Alterações";

	if (ad.image) previewImage(ad.image, "adImagePreview");
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
}

// ===== IMAGE MANAGEMENT =====

export function handleImageUrl(url) {
	if (!url) return;

	document.getElementById("postImage").value = url;
	document.getElementById("postImagePreview").src = url;
	document.getElementById("imagePreviewContainer").style.display = "block";
	document.getElementById("postImageFile").value = "";
}

export async function uploadImage(fileInput) {
	const file = fileInput.files[0];
	if (!file) return;

	const submitBtn = document.getElementById("postSubmitBtn");
	submitBtn.textContent = "⏳ Enviando foto...";
	submitBtn.disabled = true;

	const url = await uploadToCloudinary(file);

	if (url) {
		document.getElementById("postImage").value = url;
		document.getElementById("postImageUrl").value = url;
		document.getElementById("postImagePreview").src = url;
		document.getElementById("imagePreviewContainer").style.display =
			"block";
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

export function removePostImage() {
	document.getElementById("postImage").value = "";
	document.getElementById("postImageFile").value = "";
	document.getElementById("postImageUrl").value = "";
	document.getElementById("imagePreviewContainer").style.display = "none";
	document.getElementById("postImagePreview").src = "";
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

// ===== MODAL CONTROLS =====

export function openAdminModal() {
	document.getElementById("adminModal").classList.add("active");
	document.body.style.overflow = "hidden";
	if (isAdminLogged) {
		renderAdminPostList();
		renderAdminAdList();
	}
}

export function closeAdminModal() {
	document.getElementById("adminModal").classList.remove("active");
	document.body.style.overflow = "";
}

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

export function viewPost(id) {
	// Navigate to dedicated post page instead of modal
	window.location.href = `/post/${id}`;
	return;

	// Old modal code below (keeping for reference, but not executed)
	/*
	const post = posts.find((p) => p.id === id);
	if (!post) return;

	// Parse blocks from JSON
	let blocks = [];
	try {
		blocks = JSON.parse(post.content);
	} catch (err) {
		// Fallback for old plain text posts
		blocks = [{ type: "text", data: { content: post.content } }];
	}

	const blocksHtml = renderBlocksView(blocks);

	document.getElementById("postViewContent").innerHTML = `
    <div style="position:relative;">
        <button class="post-view-close" onclick="closePostView()">✕</button>
        <div class="post-view-body">
            <span class="post-view-category">${post.category}</span>
            <h1 class="post-view-title">${post.title}</h1>
            <div class="post-view-meta">
                <span>Por <strong>${post.author}</strong></span>
                <span>•</span>
                <span>${formatDate(post.date)}</span>
            </div>
            <div class="post-view-text">${blocksHtml}</div>
        </div>
    </div>`;

	document.getElementById("postViewModal").classList.add("active");
	document.body.style.overflow = "hidden";
	*/
}

export function closePostView() {
	document.getElementById("postViewModal").classList.remove("active");
	document.body.style.overflow = "";
}

// ===== SEARCH & FILTER =====

export function toggleSearch() {
	const overlay = document.getElementById("searchOverlay");
	overlay.classList.toggle("active");
	if (overlay.classList.contains("active")) {
		document.getElementById("searchInput").focus();
		document.body.style.overflow = "hidden";
	} else {
		document.body.style.overflow = "";
	}
}

export function searchPosts() {
	const query = document.getElementById("searchInput").value.toLowerCase();
	if (query.length < 2) return;

	const results = posts.filter(
		(p) =>
			p.title.toLowerCase().includes(query) ||
			(p.excerpt && p.excerpt.toLowerCase().includes(query)) ||
			p.category.toLowerCase().includes(query),
	);

	document.getElementById("heroSection").innerHTML = "";
	let html = "";
	results.forEach((post) => {
		html += createNewsCard(post);
	});
	document.getElementById("newsGrid").innerHTML =
		html ||
		'<p style="padding:40px;text-align:center;">Nenhum resultado.</p>';
	document.getElementById("moreNews").innerHTML = "";
	toggleSearch();
}

export function filterCategory(category, pill) {
	if (typeof stopCarousel === "function") stopCarousel();

	document
		.querySelectorAll(".category-pill")
		.forEach((p) => p.classList.remove("active"));
	if (pill) pill.classList.add("active");
	closeMobileMenu();

	if (category === "all") {
		renderAll();
		window.scrollTo({ top: 0, behavior: "smooth" });
		return;
	}

	if (category === "Anúncio") {
		document.getElementById("newsGrid").innerHTML = "";
		document.getElementById("heroSection").innerHTML = "";
		document.getElementById("moreNews").innerHTML =
			'<p style="padding:20px;text-align:center;">Veja os classificados abaixo.</p>';
		window.scrollTo({
			top: document.querySelector(".ads-section").offsetTop,
			behavior: "smooth",
		});
		return;
	}

	const filtered = posts.filter((p) => p.category === category);
	document.getElementById("heroSection").innerHTML = "";
	let html = "";
	filtered.forEach((post) => {
		html += createNewsCard(post);
	});
	document.getElementById("newsGrid").innerHTML =
		html ||
		'<p style="padding:40px;text-align:center;grid-column:1/-1;">Nenhuma notícia encontrada nesta categoria.</p>';
	document.getElementById("moreNews").innerHTML = "";
	window.scrollTo({ top: 0, behavior: "smooth" });
}

export function goHome() {
	document
		.querySelectorAll(".category-pill")
		.forEach((p) => p.classList.remove("active"));
	document.querySelector(".category-pill").classList.add("active");
	renderAll();
	window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===== NAVIGATION =====

export function toggleMenu() {
	document.getElementById("navMenu").classList.toggle("open");
	document.getElementById("hamburger").classList.toggle("active");
	document.getElementById("mobileOverlay").classList.toggle("active");
}

export function closeMobileMenu() {
	document.getElementById("navMenu").classList.remove("open");
	document.getElementById("hamburger").classList.remove("active");
	document.getElementById("mobileOverlay").classList.remove("active");
	document.body.style.overflow = "";
}

// ===== NEWSLETTER =====

export function subscribeNewsletter(e) {
	e.preventDefault();
	showToast("✅ Obrigado por se inscrever!", "success");
	e.target.reset();
}
