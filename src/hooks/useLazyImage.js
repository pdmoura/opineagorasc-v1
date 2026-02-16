import { useState, useEffect, useRef } from 'react'

export const useLazyImage = (src, options = {}) => {
	const [imageSrc, setImageSrc] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const imgRef = useRef()
	const observerRef = useRef()

	const {
		threshold = 0.1,
		rootMargin = '50px',
		placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="250"%3E%3Crect width="400" height="250" fill="%23e5e7eb"/%3E%3C/svg%3E'
	} = options

	useEffect(() => {
		if (!src) return

		const img = imgRef.current
		if (!img) return

		// Se já estiver visível, carregar imediatamente
		if (isElementInViewport(img)) {
			loadImage()
			return
		}

		// Criar Intersection Observer para lazy loading
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						loadImage()
						observer.unobserve(entry.target)
					}
				})
			},
			{ threshold, rootMargin }
		)

		observer.observe(img)
		observerRef.current = observer

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect()
			}
		}
	}, [src, threshold, rootMargin])

	const isElementInViewport = (el) => {
		const rect = el.getBoundingClientRect()
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		)
	}

	const loadImage = () => {
		setLoading(true)
		setError(null)

		const img = new Image()
		img.src = src

		img.onload = () => {
			setImageSrc(src)
			setLoading(false)
		}

		img.onerror = () => {
			setError(true)
			setLoading(false)
		}
	}

	return {
		ref: imgRef,
		src: imageSrc || placeholder,
		loading,
		error,
		isLoaded: !!imageSrc
	}
}
