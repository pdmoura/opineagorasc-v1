// ==========================================
// MAIN LOGIN - Entry Point for Login Page
// ==========================================

import { sb } from "./modules/api.js";
import { checkSession } from "./modules/auth.js";
import { showToast } from "./modules/utils.js";

// ===== INITIALIZATION =====

document.addEventListener("DOMContentLoaded", async function () {
	console.log("🔐 Iniciando página de login...");

	// Verifica se já está autenticado
	const session = await checkSession();
	if (session) {
		console.log("✅ Usuário já autenticado. Redirecionando...");
		window.location.href = "/admin";
		return;
	}

	// Setup do formulário de login
	const loginForm = document.getElementById("loginForm");
	if (loginForm) {
		loginForm.addEventListener("submit", handleLogin);
	}

	console.log("✅ Página de login carregada!");
});

// ===== LOGIN HANDLER =====

async function handleLogin(e) {
	e.preventDefault();

	if (!sb) {
		showToast("❌ Erro: Não conectado ao banco.", "error");
		return;
	}

	const email = document.getElementById("loginEmail").value;
	const password = document.getElementById("loginPassword").value;

	const { data, error } = await sb.auth.signInWithPassword({
		email: email,
		password: password,
	});

	if (error) {
		const errorElement = document.getElementById("loginError");
		if (errorElement) {
			errorElement.classList.add("show");
			errorElement.innerText = "Erro: " + error.message;
		}
		showToast("❌ Falha no login!", "error");
	} else {
		showToast("✅ Login realizado com sucesso!", "success");
		// Aguarda um momento para o toast aparecer
		setTimeout(() => {
			window.location.href = "/admin";
		}, 500);
	}
}
