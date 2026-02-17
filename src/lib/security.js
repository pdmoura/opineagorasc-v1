// Security utilities for client-side Supabase operations

// Rate limiting in localStorage (client-side backup)
const RATE_LIMIT_KEY = 'comment_rate_limit';
const MAX_COMMENTS_PER_HOUR = 3;
const HOUR_IN_MS = 60 * 60 * 1000;

// Content sanitization
export const sanitizeComment = (content) => {
	if (!content || typeof content !== 'string') return '';
	
	// Remove HTML tags
	let clean = content.replace(/<[^>]*>/g, '');
	
	// Remove excessive whitespace
	clean = clean.replace(/\s+/g, ' ').trim();
	
	// Remove potentially dangerous patterns
	clean = clean.replace(/javascript:/gi, '');
	clean = clean.replace(/on\w+\s*=/gi, '');
	
	return clean;
};

export const sanitizeName = (name) => {
	if (!name || typeof name !== 'string') return '';
	
	// Remove HTML and special characters
	let clean = name.replace(/<[^>]*>/g, '');
	clean = clean.replace(/[<>]/g, '');
	
	// Remove excessive whitespace
	return clean.replace(/\s+/g, ' ').trim();
};

export const sanitizeEmail = (email) => {
	if (!email || typeof email !== 'string') return '';
	
	// Basic email sanitization
	let clean = email.toLowerCase().trim();
	clean = clean.replace(/<[^>]*>/g, '');
	
	return clean;
};

// Client-side rate limiting check
export const checkRateLimit = () => {
	const now = Date.now();
	const rateData = localStorage.getItem(RATE_LIMIT_KEY);
	
	if (!rateData) {
		// First time commenting
		const newRateData = {
			count: 1,
			firstComment: now,
			lastReset: now
		};
		localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(newRateData));
		return { allowed: true, remaining: MAX_COMMENTS_PER_HOUR - 1 };
	}
	
	const parsed = JSON.parse(rateData);
	const timeSinceFirst = now - parsed.firstComment;
	const hoursPassed = Math.floor(timeSinceFirst / HOUR_IN_MS);
	
	// Reset counter if hour has passed
	if (hoursPassed >= 1) {
		const newRateData = {
			count: 1,
			firstComment: now,
			lastReset: now
		};
		localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(newRateData));
		return { allowed: true, remaining: MAX_COMMENTS_PER_HOUR - 1 };
	}
	
	// Check if under limit
	if (parsed.count >= MAX_COMMENTS_PER_HOUR) {
		const timeUntilReset = HOUR_IN_MS - (now - parsed.lastReset);
		const minutesUntilReset = Math.ceil(timeUntilReset / (60 * 1000));
		
		return { 
			allowed: false, 
			remaining: 0,
			resetIn: minutesUntilReset 
		};
	}
	
	// Increment counter
	parsed.count += 1;
	localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(parsed));
	
	return { 
		allowed: true, 
		remaining: MAX_COMMENTS_PER_HOUR - parsed.count 
	};
};

// Honeypot validation (server-side backup)
export const validateHoneypot = (formData) => {
	// Check for common bot patterns
	const suspiciousPatterns = [
		/https?:\/\//i,           // URLs in name fields
		/<a\s+href=/i,          // HTML links
		/\[url=.*\]/i,           // BBCode links
		/www\./i,                // Website mentions
		/http:\/\//i,             // HTTP protocols
	];
	
	// Check form fields for bot patterns
	for (const [key, value] of Object.entries(formData)) {
		if (!value || typeof value !== 'string') continue;
		
		for (const pattern of suspiciousPatterns) {
			if (pattern.test(value)) {
				return { 
					isBot: true, 
					reason: `Suspicious pattern detected in ${key}: ${pattern}` 
				};
			}
		}
	}
	
	// Check timing (too fast submission is suspicious)
	const submissionTime = localStorage.getItem('last_submission_time');
	const now = Date.now();
	
	if (submissionTime) {
		const timeDiff = now - parseInt(submissionTime);
		// If submitted in less than 2 seconds, likely a bot
		if (timeDiff < 2000) {
			return { 
				isBot: true, 
				reason: 'Submission too fast - likely automated' 
			};
		}
	}
	
	localStorage.setItem('last_submission_time', now.toString());
	
	return { isBot: false };
};

// Enhanced validation with security checks
export const secureValidateComment = (formData) => {
	// First, run honeypot validation
	const honeypotCheck = validateHoneypot(formData);
	if (honeypotCheck.isBot) {
		throw new Error('Security validation failed. Please try again.');
	}
	
	// Then, run rate limiting
	const rateLimit = checkRateLimit();
	if (!rateLimit.allowed) {
		throw new Error(
			`Rate limit exceeded. Please wait ${rateLimit.resetIn} minutes before commenting again.`
		);
	}
	
	// Sanitize all inputs
	const sanitizedData = {
		post_id: formData.post_id,
		name: sanitizeName(formData.name),
		email: sanitizeEmail(formData.email),
		content: sanitizeComment(formData.content)
	};
	
	// Basic validation after sanitization
	if (!sanitizedData.name || sanitizedData.name.length < 2) {
		throw new Error('Nome é obrigatório e deve ter pelo menos 2 caracteres.');
	}
	
	if (!sanitizedData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedData.email)) {
		throw new Error('Email inválido.');
	}
	
	if (!sanitizedData.content || sanitizedData.content.length < 10) {
		throw new Error('Comentário deve ter pelo menos 10 caracteres.');
	}
	
	if (sanitizedData.content.length > 2000) {
		throw new Error('Comentário deve ter no máximo 2000 caracteres.');
	}
	
	return sanitizedData;
};
