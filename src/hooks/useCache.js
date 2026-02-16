import { useState, useEffect, useCallback } from 'react'

// Cache simples em memória com TTL
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

export const useCache = (key, fetcher, ttl = CACHE_TTL) => {
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const fetchData = useCallback(async () => {
		// Verificar cache
		const cached = cache.get(key)
		if (cached && Date.now() - cached.timestamp < ttl) {
			setData(cached.data)
			return cached.data
		}

		// Buscar novos dados
		setLoading(true)
		setError(null)

		try {
			const result = await fetcher()
			
			// Salvar no cache
			cache.set(key, {
				data: result,
				timestamp: Date.now()
			})
			
			setData(result)
			return result
		} catch (err) {
			setError(err.message)
			throw err
		} finally {
			setLoading(false)
		}
	}, [key, fetcher, ttl])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const invalidateCache = useCallback(() => {
		cache.delete(key)
	}, [key])

	const clearAllCache = useCallback(() => {
		cache.clear()
	}, [])

	return {
		data,
		loading,
		error,
		refetch: fetchData,
		invalidateCache,
		clearAllCache
	}
}

// Limpar cache antigo periodicamente
setInterval(() => {
	const now = Date.now()
	for (const [key, value] of cache.entries()) {
		if (now - value.timestamp > CACHE_TTL) {
			cache.delete(key)
		}
	}
}, CACHE_TTL)
