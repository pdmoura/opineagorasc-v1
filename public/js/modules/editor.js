// ==========================================
// EDITOR MODULE - Block-Based CMS
// ==========================================

import { uploadToCloudinary } from "./api.js";
import { showToast } from "./utils.js";

// Editor state
let editorBlocks = [];

// ===== BLOCK MANAGEMENT =====

/**
 * Get all blocks data
 */
export function getBlocksData() {
	return editorBlocks
		.map((block, index) => {
			const container = document.querySelector(
				`[data-block-index="${index}"]`,
			);
			if (!container) return null;

			const type = container.dataset.blockType;
			const data = extractBlockData(container, type);

			return { type, data };
		})
		.filter(Boolean);
}

/**
 * Extract data from block DOM
 */
function extractBlockData(container, type) {
	const data = {};

	switch (type) {
		case "capa":
			data.imageUrl =
				container.querySelector('[data-field="imageUrl"]')?.value || "";
			data.alt =
				container.querySelector('[data-field="alt"]')?.value || "";
			data.showInBody =
				container.querySelector('[data-field="showInBody"]')?.checked ??
				true;
			break;

		case "imageText":
			data.imageUrl =
				container.querySelector('[data-field="imageUrl"]')?.value || "";
			data.text =
				container.querySelector('[data-field="text"]')?.value || "";
			data.align =
				container.querySelector('[data-field="align"]')?.value ||
				"left";
			break;

		case "fullImage":
			data.imageUrl =
				container.querySelector('[data-field="imageUrl"]')?.value || "";
			data.caption =
				container.querySelector('[data-field="caption"]')?.value || "";
			break;

		case "video":
			data.videoUrl =
				container.querySelector('[data-field="videoUrl"]')?.value || "";
			break;

		case "text":
			data.content =
				container.querySelector('[data-field="content"]')?.value || "";
			break;

		case "button":
			data.text =
				container.querySelector('[data-field="text"]')?.value || "";
			data.url =
				container.querySelector('[data-field="url"]')?.value || "";
			data.style =
				container.querySelector('[data-field="style"]')?.value ||
				"primary";
			break;

		case "ad":
			data.code =
				container.querySelector('[data-field="code"]')?.value || "";
			break;
	}

	return data;
}

/**
 * Save current data from all blocks in the DOM
 */
function saveCurrentBlocksData() {
	editorBlocks = editorBlocks.map((block, index) => {
		const container = document.querySelector(
			`[data-block-index="${index}"]`,
		);
		if (!container) return block;

		const type = container.dataset.blockType;
		const data = extractBlockData(container, type);

		return { type, data };
	});
}

/**
 * Load blocks into editor
 */
export function loadBlocksIntoEditor(blocks) {
	editorBlocks = blocks || [];
	renderEditor();
}

/**
 * Add new block
 */
export function addBlock(type) {
	// Save current data before re-rendering
	saveCurrentBlocksData();

	editorBlocks.push({ type, data: {} });
	renderEditor();
}

/**
 * Move block up
 */
export function moveBlockUp(index) {
	if (index <= 0) return;

	// Save current data before re-rendering
	saveCurrentBlocksData();

	[editorBlocks[index - 1], editorBlocks[index]] = [
		editorBlocks[index],
		editorBlocks[index - 1],
	];
	renderEditor();
}

/**
 * Move block down
 */
export function moveBlockDown(index) {
	if (index >= editorBlocks.length - 1) return;

	// Save current data before re-rendering
	saveCurrentBlocksData();

	[editorBlocks[index], editorBlocks[index + 1]] = [
		editorBlocks[index + 1],
		editorBlocks[index],
	];
	renderEditor();
}

/**
 * Delete block
 */
export function deleteBlock(index) {
	// Save current data before re-rendering
	saveCurrentBlocksData();

	editorBlocks.splice(index, 1);
	renderEditor();
}

/**
 * Clear editor
 */
export function clearEditor() {
	editorBlocks = [];
	renderEditor();
}

/**
 * Upload image for a block
 */
export async function uploadBlockImage(fileInput, blockIndex, fieldName) {
	const file = fileInput.files[0];
	if (!file) return;

	// Show loading state
	const container = document.querySelector(
		`[data-block-index="${blockIndex}"]`,
	);
	if (!container) return;

	const urlField = container.querySelector(`[data-field="${fieldName}"]`);
	if (!urlField) return;

	urlField.value = "⏳ Enviando...";
	urlField.disabled = true;

	try {
		// Upload to Cloudinary
		const uploadedUrl = await uploadToCloudinary(file);

		if (uploadedUrl) {
			urlField.value = uploadedUrl;
			urlField.disabled = false;

			// Re-render to show preview
			const currentData = extractBlockData(
				container,
				container.dataset.blockType,
			);
			editorBlocks[blockIndex].data = currentData;
			renderEditor();

			showToast("✅ Imagem enviada!", "success");
		} else {
			urlField.value = "";
			urlField.disabled = false;
			showToast("❌ Erro no envio", "error");
		}
	} catch (error) {
		console.error("Upload error:", error);
		urlField.value = "";
		urlField.disabled = false;
		showToast("❌ Erro no envio", "error");
	}

	// Clear file input
	fileInput.value = "";
}

// ===== EDITOR RENDERING =====

/**
 * Render editor with all blocks
 */
function renderEditor() {
	const container = document.getElementById("blocksContainer");
	if (!container) return;

	if (editorBlocks.length === 0) {
		container.innerHTML =
			'<p style="text-align:center;color:#999;padding:40px;">Nenhum bloco adicionado. Use os botões acima para adicionar conteúdo.</p>';
		return;
	}

	container.innerHTML = editorBlocks
		.map((block, index) => createBlockEditor(block.type, block.data, index))
		.join("");
}

/**
 * Create editor interface for specific block type
 */
function createBlockEditor(type, data, index) {
	const controls = `
        <div class="block-controls">
            <button type="button" class="btn-block-control action-move-up" data-index="${index}" ${index === 0 ? "disabled" : ""}>
                ↑
            </button>
            <button type="button" class="btn-block-control action-move-down" data-index="${index}" ${index === editorBlocks.length - 1 ? "disabled" : ""}>
                ↓
            </button>
            <button type="button" class="btn-block-control btn-danger action-delete" data-index="${index}">
                🗑️ Excluir
            </button>
        </div>
    `;

	let content = "";

	switch (type) {
		case "capa":
			content = `
                <h4 class="block-title">📷 Bloco Capa</h4>
                ${controls}
                <div class="form-group">
                    <label>Upload de Imagem</label>
                    <input type="file" accept="image/*" class="block-image-upload action-upload-image" data-index="${index}" data-field-name="imageUrl">
                    <small style="color:#999;display:block;margin-top:4px;">Ou</small>
                </div>
                <div class="form-group">
                    <label>URL da Imagem</label>
                    <input type="url" data-field="imageUrl" value="${data.imageUrl || ""}" placeholder="https://...">
                </div>
                <div class="form-group">
                    <label>Texto Alternativo</label>
                    <input type="text" data-field="alt" value="${data.alt || ""}" placeholder="Descrição da imagem">
                </div>
                <div class="form-group" style="display:flex;align-items:center;gap:8px;">
                    <input type="checkbox" data-field="showInBody" id="showInBody_${index}" ${data.showInBody !== false ? "checked" : ""}>
                    <label for="showInBody_${index}" style="margin:0;cursor:pointer;">Mostrar imagem no corpo da notícia</label>
                </div>
                ${data.imageUrl ? `<img src="${data.imageUrl}" style="max-width:200px;border-radius:8px;margin-top:8px;">` : ""}
            `;
			break;

		case "imageText":
			content = `
                <h4 class="block-title">🖼️ Bloco Imagem + Texto</h4>
                ${controls}
                <div class="form-group">
                    <label>Upload de Imagem</label>
                    <input type="file" accept="image/*" class="block-image-upload action-upload-image" data-index="${index}" data-field-name="imageUrl">
                    <small style="color:#999;display:block;margin-top:4px;">Ou</small>
                </div>
                <div class="form-group">
                    <label>URL da Imagem</label>
                    <input type="url" data-field="imageUrl" value="${data.imageUrl || ""}" placeholder="https://...">
                </div>
                <div class="form-group">
                    <label>Texto</label>
                    <textarea data-field="text" rows="4" placeholder="Digite o texto...">${data.text || ""}</textarea>
                </div>
                <div class="form-group">
                    <label>Alinhamento da Imagem</label>
                    <select data-field="align">
                        <option value="left" ${data.align === "left" ? "selected" : ""}>Esquerda</option>
                        <option value="right" ${data.align === "right" ? "selected" : ""}>Direita</option>
                    </select>
                </div>
                ${data.imageUrl ? `<img src="${data.imageUrl}" style="max-width:200px;border-radius:8px;margin-top:8px;">` : ""}
            `;
			break;

		case "fullImage":
			content = `
                <h4 class="block-title">🖼️ Bloco Imagem Full</h4>
                ${controls}
                <div class="form-group">
                    <label>Upload de Imagem</label>
                    <input type="file" accept="image/*" class="block-image-upload action-upload-image" data-index="${index}" data-field-name="imageUrl">
                    <small style="color:#999;display:block;margin-top:4px;">Ou</small>
                </div>
                <div class="form-group">
                    <label>URL da Imagem</label>
                    <input type="url" data-field="imageUrl" value="${data.imageUrl || ""}" placeholder="https://...">
                </div>
                <div class="form-group">
                    <label>Legenda (opcional)</label>
                    <input type="text" data-field="caption" value="${data.caption || ""}" placeholder="Legenda da imagem">
                </div>
                ${data.imageUrl ? `<img src="${data.imageUrl}" style="max-width:200px;border-radius:8px;margin-top:8px;">` : ""}
            `;
			break;

		case "video":
			content = `
                <h4 class="block-title">🎥 Bloco Vídeo (YouTube)</h4>
                ${controls}
                <div class="form-group">
                    <label>URL do YouTube *</label>
                    <input type="url" data-field="videoUrl" value="${data.videoUrl || ""}" placeholder="https://www.youtube.com/watch?v=...">
                    <small style="color:#999;">Cole a URL completa do vídeo do YouTube</small>
                </div>
            `;
			break;

		case "text":
			content = `
                <h4 class="block-title">📝 Bloco Texto</h4>
                ${controls}
                <div class="form-group">
                    <label>Conteúdo</label>
                    <textarea data-field="content" rows="6" placeholder="Digite o texto...">${data.content || ""}</textarea>
                </div>
            `;
			break;

		case "button":
			content = `
                <h4 class="block-title">🔘 Bloco Botão</h4>
                ${controls}
                <div class="form-group">
                    <label>Texto do Botão *</label>
                    <input type="text" data-field="text" value="${data.text || ""}" placeholder="Clique aqui">
                </div>
                <div class="form-group">
                    <label>URL de Destino *</label>
                    <input type="url" data-field="url" value="${data.url || ""}" placeholder="https://...">
                </div>
                <div class="form-group">
                    <label>Estilo</label>
                    <select data-field="style">
                        <option value="primary" ${data.style === "primary" ? "selected" : ""}>Primary</option>
                        <option value="secondary" ${data.style === "secondary" ? "selected" : ""}>Secondary</option>
                    </select>
                </div>
            `;
			break;

		case "ad":
			content = `
                <h4 class="block-title">📢 Bloco Anúncio</h4>
                ${controls}
                <div class="form-group">
                    <label>Código HTML/AdSense</label>
                    <textarea data-field="code" rows="4" placeholder="Cole o código do anúncio aqui...">${data.code || ""}</textarea>
                    <small style="color:#999;">Cole o código HTML do seu anúncio ou AdSense</small>
                </div>
            `;
			break;
	}

	return `
        <div class="block-editor-item" data-block-index="${index}" data-block-type="${type}">
            ${content}
        </div>
    `;
}

// ===== PUBLIC VIEW RENDERING =====

/**
 * Render blocks for public view
 */
export function renderBlocksView(blocks) {
	if (!blocks || blocks.length === 0) {
		return "<p>Sem conteúdo disponível.</p>";
	}

	return blocks.map((block) => renderBlockPublic(block)).join("");
}

/**
 * Render individual block for public view
 */
function renderBlockPublic(block) {
	const { type, data } = block;

	switch (type) {
		case "capa":
			// Only show if showInBody is true (default is true for backward compatibility)
			if (!data.imageUrl || data.showInBody === false) return "";
			return `
                <div class="block-capa">
                    <img src="${data.imageUrl}" alt="${data.alt || ""}" style="width:100%;border-radius:12px;margin-bottom:20px;">
                </div>
            `;

		case "imageText":
			if (!data.imageUrl && !data.text) return "";
			return `
                <div class="block-image-text align-${data.align || "left"}">
                    ${data.imageUrl ? `<img src="${data.imageUrl}" alt="" style="width:300px;border-radius:8px;">` : ""}
                    ${data.text ? `<div class="block-text-content"><p>${data.text.replace(/\n/g, "<br>")}</p></div>` : ""}
                </div>
            `;

		case "fullImage":
			if (!data.imageUrl) return "";
			return `
                <div class="block-full-image">
                    <img src="${data.imageUrl}" alt="">
                    ${data.caption ? `<p class="block-caption">${data.caption}</p>` : ""}
                </div>
            `;

		case "video":
			const videoId = extractYouTubeId(data.videoUrl);
			if (!videoId) return "";
			return `
                <div class="block-video">
                    <iframe src="https://www.youtube.com/embed/${videoId}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                    </iframe>
                </div>
            `;

		case "text":
			if (!data.content) return "";
			return `
                <div class="block-text">
                    <p>${data.content.replace(/\n/g, "<br>")}</p>
                </div>
            `;

		case "button":
			if (!data.text || !data.url) return "";
			return `
                <div class="block-button-container">
                    <a href="${data.url}" class="block-button block-button-${data.style || "primary"}" target="_blank" rel="noopener noreferrer">
                        ${data.text}
                    </a>
                </div>
            `;

		case "ad":
			if (!data.code) return "";
			return `
                <div class="block-ad">
                    ${data.code}
                </div>
            `;

		default:
			return "";
	}
}

/**
 * Extract YouTube video ID from URL
 */
function extractYouTubeId(url) {
	if (!url) return null;

	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
		/youtube\.com\/embed\/([^&\n?#]+)/,
	];

	for (const pattern of patterns) {
		const match = url.match(pattern);
		if (match && match[1]) {
			return match[1];
		}
	}

	return null;
}

/**
 * Extract first image from blocks for card cover
 */
export function extractFirstImage(blocks) {
	if (!blocks || blocks.length === 0) return null;

	for (const block of blocks) {
		if (block.type === "capa" && block.data.imageUrl) {
			return block.data.imageUrl;
		}
		if (block.type === "imageText" && block.data.imageUrl) {
			return block.data.imageUrl;
		}
		if (block.type === "fullImage" && block.data.imageUrl) {
			return block.data.imageUrl;
		}
	}

	return null;
}
