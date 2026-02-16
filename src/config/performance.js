// Configurações de otimização de performance

// Lazy Loading para imagens
export const LAZY_LOADING_CONFIG = {
	threshold: 0.1,
	rootMargin: '50px',
	loading: 'lazy'
}

// Configurações de imagem otimizadas
export const IMAGE_CONFIG = {
	// Tamanhos padrão para diferentes breakpoints
	sizes: {
		thumbnail: { width: 150, height: 100 },
		card: { width: 400, height: 250 },
		featured: { width: 800, height: 450 },
		hero: { width: 1200, height: 600 }
	},
	
	// Qualidade e formato
	quality: 'auto',
	format: 'auto',
	crop: 'fill',
	
	// Placeholder enquanto carrega
	placeholder: {
		width: 20,
		height: 20,
		quality: 1,
		blur: 1000
	}
}

// Configurações de cache
export const CACHE_CONFIG = {
	// TTL em milissegundos
	ttl: 5 * 60 * 1000, // 5 minutos
	
	// Máximo de itens no cache
	maxSize: 100,
	
	// Chaves que não devem ser cacheadas
	excludeKeys: ['admin', 'private'],
	
	// Estratégia de cache
	strategy: 'cache-first' // 'cache-first' | 'network-first' | 'cache-only'
}

// Configurações de API
export const API_CONFIG = {
	// Timeout para requisições
	timeout: 10000, // 10 segundos
	
	// Retry attempts
	retryAttempts: 3,
	
	// Delay entre retries
	retryDelay: 1000, // 1 segundo
	
	// Batch size para múltiplas requisições
	batchSize: 10
}

// Configurações de animação
export const ANIMATION_CONFIG = {
	// Duração das transições
	duration: {
		fast: 150,
		normal: 300,
		slow: 500
	},
	
	// Easing functions
	easing: {
		linear: 'linear',
		ease: 'ease',
		easeIn: 'ease-in',
		easeOut: 'ease-out',
		easeInOut: 'ease-in-out'
	}
}

// Configurações de SEO
export const SEO_CONFIG = {
	// Meta tags padrão
	defaultTitle: 'Opine Agora SC - Notícias de Santa Catarina',
	defaultDescription: 'Portal de notícias de Santa Catarina com foco em informação local, política, economia e opinião.',
	siteName: 'Opine Agora SC',
	siteUrl: 'https://opineagorasc.com.br',
	
	// Open Graph
	ogImage: '/ogimage-opineagorasc.png',
	ogType: 'website',
	ogLocale: 'pt_BR',
	
	// Twitter Card
	twitterCard: 'summary_large_image',
	twitterSite: '@opineagorasc',
	
	// Structured Data
	organization: {
		name: 'Opine Agora SC',
		url: 'https://opineagorasc.com.br',
		logo: '/logo-opineagora.png',
		description: 'Portal de notícias de Santa Catarina'
	}
}

export default {
	LAZY_LOADING_CONFIG,
	IMAGE_CONFIG,
	CACHE_CONFIG,
	API_CONFIG,
	ANIMATION_CONFIG,
	SEO_CONFIG
}
