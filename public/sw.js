const CACHE_NAME = "opine-agora-v2";
const STATIC_CACHE = "opine-agora-static-v2";
const API_CACHE = "opine-agora-api-v2";

// URLs para cache estático - atualizadas para nova estrutura
const STATIC_URLS = [
	"/",
	"/manifest.json",
	"/favicon.ico",
	"/favicon.svg",
	"/apple-touch-icon.png",
	"/ogimage-opineagorasc.png",
];

// Cache strategy: stale-while-revalidate
const CACHE_STRATEGIES = {
	STATIC: "cache-first",
	API: "stale-while-revalidate",
};

// TTL em segundos
const CACHE_TTL = {
	STATIC: 24 * 60 * 60, // 24 horas
	API: 5 * 60, // 5 minutos
};

// Install event
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(STATIC_CACHE).then((cache) => {
			// Adicionar URLs uma por uma com tratamento de erro
			return Promise.allSettled(
				STATIC_URLS.map((url) => {
					return fetch(url)
						.then((response) => {
							if (response.ok) {
								return cache.put(url, response);
							}
							console.warn(`Failed to cache: ${url}`);
						})
						.catch((error) => {
							console.warn(`Error caching ${url}:`, error);
						});
				}),
			);
		}),
	);
});

// Fetch event com estratégias diferentes
self.addEventListener("fetch", (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Ignorar requisições não-GET
	if (request.method !== "GET") {
		return fetch(request);
	}

	// Não interceptar rotas admin - deixar o React Router lidar
	if (isAdminRoute(url.pathname)) {
		return fetch(request);
	}

	// Estratégia para conteúdo estático
	if (isStaticAsset(url.pathname)) {
		event.respondWith(handleStaticRequest(request));
		return;
	}

	// Estratégia para API
	if (isApiRequest(url.pathname)) {
		event.respondWith(handleApiRequest(request));
		return;
	}

	// Default: network-first
	event.respondWith(fetch(request));
});

// Determinar se é asset estático
const isStaticAsset = (pathname) => {
	return (
		pathname.includes("/assets/") ||
		pathname.endsWith(".js") ||
		pathname.endsWith(".css") ||
		pathname.endsWith(".png") ||
		pathname.endsWith(".jpg") ||
		pathname.endsWith(".svg") ||
		pathname.endsWith(".ico") ||
		pathname.endsWith(".webp") ||
		pathname.endsWith(".woff") ||
		pathname.endsWith(".woff2")
	);
};

// Determinar se é requisição de API
const isApiRequest = (pathname) => {
	return pathname.startsWith("/rest/v1/") || pathname.includes("/api/");
};

// Determinar se é rota admin (não deve ser interceptada pelo SW)
const isAdminRoute = (pathname) => {
	return pathname.startsWith("/admin/");
};

// Handle requisições estáticas (cache-first)
const handleStaticRequest = async (request) => {
	const cache = await caches.open(STATIC_CACHE);
	const cached = await cache.match(request);

	if (cached && !isExpired(cached, CACHE_TTL.STATIC)) {
		return cached;
	}

	try {
		const response = await fetch(request);
		if (response.ok) {
			const responseClone = response.clone();
			await cache.put(request, responseClone);
		}
		return response;
	} catch {
		return cached || new Response("Offline", { status: 503 });
	}
};

// Handle requisições de API (stale-while-revalidate)
const handleApiRequest = async (request) => {
	const cache = await caches.open(API_CACHE);
	const cached = await cache.match(request);

	// Retornar cache imediatamente (stale)
	if (cached) {
		// Buscar nova versão em background
		fetch(request)
			.then((response) => {
				if (response.ok) {
					const responseClone = response.clone();
					cache.put(request, responseClone);
				}
			})
			.catch(() => {}); // Ignorar erros de background fetch

		return cached;
	}

	// Se não tem cache, buscar da rede
	try {
		const response = await fetch(request);
		if (response.ok) {
			const responseClone = response.clone();
			await cache.put(request, responseClone);
		}
		return response;
	} catch {
		return new Response("Offline", { status: 503 });
	}
};

// Verificar se cache está expirado
const isExpired = (cached, ttl) => {
	if (!cached || !cached.timestamp) return true;
	return Date.now() - cached.timestamp > ttl * 1000;
};

// Activate event - limpar caches antigos
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames
					.filter(
						(name) => name !== STATIC_CACHE && name !== API_CACHE,
					)
					.map((name) => caches.delete(name)),
			);
		}),
	);

	// Forçar imediata ativação do novo SW
	self.clients.claim();
});
