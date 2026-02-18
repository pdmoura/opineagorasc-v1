// Utilitário de validação para formulários
export const validateEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export const validatePassword = (password) => {
	// Mínimo 6 caracteres
	return password && password.length >= 6;
};

export const validateName = (name) => {
	// Mínimo 2 caracteres, máximo 100, permite letras, espaços e pontuação comum em nomes
	const nameRegex = /^[a-zA-ZÀ-ÿ\s.\-\']{2,100}$/;
	return name && nameRegex.test(name.trim());
};

export const validateComment = (comment) => {
	// Mínimo 10 caracteres, máximo 2000
	return (
		comment && comment.trim().length >= 10 && comment.trim().length <= 2000
	);
};

export const getFieldError = (fieldName, value) => {
	switch (fieldName) {
		case "email":
			if (!value) return "O email é obrigatório";
			if (!validateEmail(value)) return "Digite um email válido";
			return null;

		case "password":
			if (!value) return "A senha é obrigatória";
			if (!validatePassword(value))
				return "A senha deve ter pelo menos 6 caracteres";
			return null;

		case "name":
			if (!value || value.trim().length === 0)
				return "O nome é obrigatório";
			if (value.trim().length < 2)
				return "O nome deve ter pelo menos 2 caracteres";
			if (/\d/.test(value)) return "O nome não pode conter números";
			if (!validateName(value))
				return "O nome contém caracteres inválidos";
			return null;

		case "content":
			if (!value) return "O comentário é obrigatório";
			if (!validateComment(value))
				return "O comentário deve ter entre 10 e 2000 caracteres";
			return null;

		default:
			return null;
	}
};

// Tradução de mensagens de erro do Supabase
export const translateSupabaseError = (error) => {
	const errorMessage = error?.message || error?.error_description || "";

	if (errorMessage.includes("Invalid login credentials")) {
		return "Email ou senha incorretos. Verifique suas credenciais.";
	}

	if (errorMessage.includes("Email not confirmed")) {
		return "Por favor, confirme seu email antes de fazer login.";
	}

	if (errorMessage.includes("User not found")) {
		return "Usuário não encontrado. Verifique o email digitado.";
	}

	if (errorMessage.includes("Too many requests")) {
		return "Muitas tentativas de login. Aguarde alguns minutos e tente novamente.";
	}

	if (errorMessage.includes("Password should be at least")) {
		return "A senha deve ter pelo menos 6 caracteres.";
	}

	if (errorMessage.includes("Unable to validate email address")) {
		return "Email inválido. Verifique o formato do email.";
	}

	// Mensagens genéricas em português
	if (errorMessage.includes("invalid") || errorMessage.includes("Invalid")) {
		return "Dados inválidos. Verifique as informações e tente novamente.";
	}

	if (errorMessage.includes("network") || errorMessage.includes("Network")) {
		return "Erro de conexão. Verifique sua internet e tente novamente.";
	}

	if (errorMessage.includes("timeout") || errorMessage.includes("Timeout")) {
		return "Tempo esgotado. Tente novamente.";
	}

	// Retorna a mensagem original se não conseguir traduzir
	return errorMessage || "Ocorreu um erro inesperado. Tente novamente.";
};
