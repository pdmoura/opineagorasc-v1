// ==========================================
// AUTH MODULE - Authentication logic
// ==========================================

import { sb } from "./api.js";
import { showToast } from "./utils.js";

// Estado de autenticação
export let isAdminLogged = false;

/**
 * Realiza logout do administrador
 */
export async function adminLogout() {
	if (sb) await sb.auth.signOut();

	isAdminLogged = false;

	showToast("👋 Saiu com sucesso!", "success");

	// Redireciona para página de login
	setTimeout(() => {
		window.location.href = "/login";
	}, 500);
}

/**
 * Verifica sessão ativa ao carregar página
 * Retorna a sessão se existir, null caso contrário
 */
export async function checkSession() {
	if (!sb) return null;

	try {
		const {
			data: { session },
		} = await sb.auth.getSession();
		if (session) {
			console.log("Usuário logado encontrado.");
			isAdminLogged = true;
			return session;
		}
		return null;
	} catch (err) {
		console.warn("Erro ao verificar sessão:", err);
		return null;
	}
}
