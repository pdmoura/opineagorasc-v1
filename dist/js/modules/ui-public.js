// ==========================================
// UI PUBLIC MODULE - Public Site Rendering
// ==========================================

import { formatDate, getInitials } from "./utils.js";
import { renderBlocksView } from "./editor.js";

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
 * Renderiza todos os elementos da página pública
 */
export function renderAll() {
	renderHero();
	renderNewsGrid();
	renderMoreNews();
	renderMostRead();
	renderOpinions();
	renderAds();
}

/**
 * Renderiza o hero carousel
 */
export function renderHero() {
	const heroSection = document.getElementById("heroSection");
	if (!heroSection) return;

	const featured = posts.filter((p) => p.featured).slice(0, 5);
	const slidesData = featured.length > 0 ? featured : posts.slice(0, 5);

	if (slidesData.length === 0) {
		heroSection.innerHTML = "";
		return;
	}

	let slidesHtml = "";
	let indicatorsHtml = "";

	slidesData.forEach((post, index) => {
		slidesHtml += `
			<div class="carousel-slide" data-post-id="${post.id}">
				<img src="${post.image || "https://images.unsplash.com/photo-1504711434969-e33886168d1c?w=800&h=500&fit=crop"}" alt="${post.title}">
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

	heroSection.innerHTML = carouselHtml;

	// Add event listeners after injecting HTML
	const carouselElement = document.querySelector(".hero-carousel");
	if (carouselElement) {
		carouselElement.addEventListener("mouseenter", stopCarousel);
		carouselElement.addEventListener("mouseleave", startCarousel);
	}

	currentSlide = 0;
	startCarousel();
}

/**
 * Renderiza grid de notícias
 */
export function renderNewsGrid() {
	const newsGrid = document.getElementById("newsGrid");
	if (!newsGrid) return;

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
	newsGrid.innerHTML = html;
}

/**
 * Renderiza mais notícias (horizontal cards)
 */
export function renderMoreNews() {
	const moreNews = document.getElementById("moreNews");
	if (!moreNews) return;

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
				<img src="${post.image || "https://via.placeholder.com/400"}" alt="${post.title}">
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
	moreNews.innerHTML = html;
}

/**
 * Cria um card de notícia
 */
export function createNewsCard(post) {
	return `
	<div class="news-card" data-post-id="${post.id}">
		<div class="news-card-image">
			<img src="${post.image || "https://via.placeholder.com/400"}" alt="${post.title}">
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
	</div>`;
}

/**
 * Renderiza "Mais Lidas"
 */
export function renderMostRead() {
	const mostRead = document.getElementById("mostRead");
	if (!mostRead) return;

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
	mostRead.innerHTML = html;
}

/**
 * Renderiza seção de opinião
 */
export function renderOpinions() {
	const opinionGrid = document.getElementById("opinionGrid");
	if (!opinionGrid) return;

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
	opinionGrid.innerHTML = html;
}

/**
 * Renderiza anúncios
 */
export function renderAds() {
	const adsGrid = document.getElementById("adsGrid");
	if (!adsGrid) return;

	let html = "";
	ads.forEach((ad) => {
		html += `
		<div class="ad-card">
			${ad.image ? `<div class="ad-card-image"><img src="${ad.image}" alt="${ad.title}"></div>` : ""}
			<div class="ad-card-body">
				<span class="ad-card-label">Anúncio • ${ad.category}</span>
				<h3 class="ad-card-title">${ad.title}</h3>
				<p class="ad-card-text">${ad.description}</p>
				<p class="ad-card-contact">📞 ${ad.contact}</p>
			</div>
		</div>`;
	});
	adsGrid.innerHTML = html;
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

// ===== POST VIEW MODAL =====

export function viewPost(id) {
	window.location.href = `/post/${id}`;
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
	// TODO: Implement newsletter subscription logic
	alert("Obrigado por se inscrever! (Funcionalidade em desenvolvimento)");
	e.target.reset();
}
