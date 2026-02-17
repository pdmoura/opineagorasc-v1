import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Define development mode
const isDev = process.env.NODE_ENV !== "production";

// Initialize Supabase client (server-side)
const supabase = createClient(
	process.env.VITE_SUPABASE_URL,
	process.env.VITE_SUPABASE_ANON_KEY,
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure EJS - REMOVIDO para deploy React
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// Serve static files - Apontando para pasta dist do Vite
app.use(express.static(path.join(__dirname, "dist")));

// Helper function to extract YouTube ID
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

// Helper function to render blocks as HTML
function renderBlocksHTML(blocks) {
	if (!blocks || !Array.isArray(blocks))
		return "<p>Sem conteúdo disponível.</p>";

	return blocks
		.map((block) => {
			const { type, data } = block;

			switch (type) {
				case "capa":
					if (!data.imageUrl || data.showInBody === false) return "";
					return `<div class="block-capa"><img src="${data.imageUrl}" alt="${data.alt || ""}" style="width:100%;border-radius:12px;margin-bottom:20px;" loading="lazy"></div>`;

				case "imageText":
					if (!data.imageUrl && !data.text) return "";
					return `<div class="block-image-text align-${data.align || "left"}">
						${data.imageUrl ? `<img src="${data.imageUrl}" alt="" style="max-width:300px;border-radius:8px;" loading="lazy">` : ""}
						${data.text ? `<div class="block-text-content"><p>${data.text.replace(/\n/g, "<br>")}</p></div>` : ""}
					</div>`;

				case "fullImage":
					if (!data.imageUrl) return "";
					return `<div class="block-full-image">
						<img src="${data.imageUrl}" alt="" loading="lazy">
						${data.caption ? `<p class="block-caption">${data.caption}</p>` : ""}
					</div>`;

				case "video":
					const videoId = extractYouTubeId(data.videoUrl);
					if (!videoId) return "";
					return `<div class="block-video" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin-bottom: 20px; border-radius: 8px;">
						<iframe src="https://www.youtube.com/embed/${videoId}" 
								style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
								frameborder="0" 
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
								allowfullscreen loading="lazy">
						</iframe>
					</div>`;

				case "text":
					if (!data.content) return "";
					return `<div class="block-text"><p>${data.content.replace(/\n/g, "<br>")}</p></div>`;

				case "button":
					if (!data.text || !data.url) return "";
					return `<div class="block-button-container" style="margin: 20px 0;">
						<a href="${data.url}" class="block-button block-button-${data.style || "primary"}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; background: var(--teal-primary, #008080); color: white; text-decoration: none; border-radius: 4px;">
							${data.text}
						</a>
					</div>`;

				case "ad":
					if (!data.code) return "";
					return `<div class="block-ad" style="margin: 20px 0; padding: 10px; background: #f5f5f5; text-align: center;">${data.code}</div>`;

				default:
					return "";
			}
		})
		.join("");
}

// ===== API ROUTES =====

// POST /api/comments - Submit new comment with IP rate limiting
app.post("/api/comments", async (req, res) => {
	try {
		const { post_id, name, email, content } = req.body;

		// Validate required fields
		if (!post_id || !name || !email || !content) {
			return res
				.status(400)
				.json({ error: "Todos os campos são obrigatórios." });
		}

		// Validate name length (2-100 characters)
		if (name.trim().length < 2) {
			return res
				.status(400)
				.json({ error: "O nome deve ter pelo menos 2 caracteres." });
		}
		if (name.trim().length > 100) {
			return res
				.status(400)
				.json({ error: "O nome deve ter no máximo 100 caracteres." });
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res
				.status(400)
				.json({ error: "Por favor, insira um e-mail válido." });
		}
		if (email.length > 255) {
			return res.status(400).json({ error: "O e-mail é muito longo." });
		}

		// Validate content length (10-2000 characters)
		if (content.trim().length < 10) {
			return res.status(400).json({
				error: "O comentário deve ter pelo menos 10 caracteres.",
			});
		}
		if (content.trim().length > 2000) {
			return res.status(400).json({
				error: "O comentário deve ter no máximo 2000 caracteres.",
			});
		}

		// Validate post_id is a number
		const postIdNum = parseInt(post_id);
		if (isNaN(postIdNum)) {
			return res.status(400).json({ error: "ID do post inválido." });
		}

		// Extract IP address
		const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

		// Check rate limit: max 10 comments per IP in last 24 hours
		const twentyFourHoursAgo = new Date(
			Date.now() - 24 * 60 * 60 * 1000,
		).toISOString();

		const { data: recentComments, error: countError } = await supabase
			.from("comments")
			.select("id")
			.eq("ip_address", ip)
			.gte("created_at", twentyFourHoursAgo);

		if (countError) {
			console.error("Error checking rate limit:", countError);
			return res.status(500).json({
				error: "Erro ao verificar limite de comentários. Tente novamente.",
			});
		}

		if (recentComments && recentComments.length >= 10) {
			return res.status(429).json({
				error: "Você atingiu o limite de 10 comentários em 24 horas. Por favor, tente novamente mais tarde.",
			});
		}

		// Sanitize inputs
		const sanitizedName = name.trim();
		const sanitizedEmail = email.trim().toLowerCase();
		const sanitizedContent = content.trim();

		// Insert comment with pending status
		const { data: comment, error: insertError } = await supabase
			.from("comments")
			.insert({
				post_id: postIdNum,
				name: sanitizedName,
				email: sanitizedEmail,
				content: sanitizedContent,
				status: "pending",
				ip_address: ip,
			})
			.select()
			.single();

		if (insertError) {
			console.error("Error inserting comment:", insertError);
			return res
				.status(500)
				.json({ error: "Erro ao salvar comentário. Tente novamente." });
		}

		res.status(201).json({
			success: true,
			message: "Comentário enviado para análise!",
			comment,
		});
	} catch (error) {
		console.error("Error in POST /api/comments:", error);
		res.status(500).json({ error: "Erro ao processar comentário" });
	}
});

// GET /api/comments - Fetch comments (with optional status filter)
app.get("/api/comments", async (req, res) => {
	try {
		const { status, post_id } = req.query;

		let query = supabase
			.from("comments")
			.select("*, posts(title)")
			.order("created_at", { ascending: false });

		if (status) {
			query = query.eq("status", status);
		}

		if (post_id) {
			query = query.eq("post_id", post_id);
		}

		const { data: comments, error } = await query;

		if (error) {
			console.error("Error fetching comments:", error);
			return res
				.status(500)
				.json({ error: "Erro ao buscar comentários" });
		}

		res.json(comments || []);
	} catch (error) {
		console.error("Error in GET /api/comments:", error);
		res.status(500).json({ error: "Erro ao buscar comentários" });
	}
});

// GET /api/admin/comments/approved - Fetch approved comments for admin
app.get("/api/admin/comments/approved", async (req, res) => {
	try {
		const { data: comments, error } = await supabase
			.from("comments")
			.select("*, posts(title)")
			.eq("status", "approved")
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Error fetching approved comments:", error);
			return res
				.status(500)
				.json({ error: "Erro ao buscar comentários aprovados" });
		}

		res.json(comments || []);
	} catch (error) {
		console.error("Error in GET /api/admin/comments/approved:", error);
		res.status(500).json({ error: "Erro ao buscar comentários aprovados" });
	}
});

// PUT /api/comments/:id/approve - Approve a comment
app.put("/api/comments/:id/approve", async (req, res) => {
	try {
		const { id } = req.params;

		const { data: comment, error } = await supabase
			.from("comments")
			.update({ status: "approved" })
			.eq("id", id)
			.select()
			.single();

		if (error) {
			console.error("Error approving comment:", error);
			return res
				.status(500)
				.json({ error: "Erro ao aprovar comentário" });
		}

		res.json({ success: true, message: "Comentário aprovado!", comment });
	} catch (error) {
		console.error("Error in PUT /api/comments/:id/approve:", error);
		res.status(500).json({ error: "Erro ao aprovar comentário" });
	}
});

// DELETE /api/comments/:id - Delete a comment (reject)
app.delete("/api/comments/:id", async (req, res) => {
	try {
		const { id } = req.params;

		const { error } = await supabase.from("comments").delete().eq("id", id);

		if (error) {
			console.error("Error deleting comment:", error);
			return res
				.status(500)
				.json({ error: "Erro ao deletar comentário" });
		}

		res.json({
			success: true,
			message: "Comentário rejeitado e removido!",
		});
	} catch (error) {
		console.error("Error in DELETE /api/comments/:id:", error);
		res.status(500).json({ error: "Erro ao deletar comentário" });
	}
});

// ===== HEALTH CHECK ROUTE =====

// Health Check route para monitoramento (UptimeRobot / Cron-job.org)
app.get("/health", (req, res) => {
	res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ===== PAGE ROUTES =====

app.get("/post/:id", async (req, res) => {
	try {
		const { id } = req.params;

		// Fetch post from Supabase
		const { data: post, error } = await supabase
			.from("posts")
			.select("*")
			.eq("id", id)
			.single();

		if (error || !post) {
			return res.status(404).send("Notícia não encontrada");
		}

		// Parse blocks from JSON content
		let blocks = [];
		try {
			blocks = JSON.parse(post.content);
		} catch (e) {
			// Fallback for old plain text posts
			blocks = [{ type: "text", data: { content: post.content } }];
		}

		// Render blocks as HTML
		const postContent = renderBlocksHTML(blocks);

		// Fetch approved comments for this post
		const { data: comments } = await supabase
			.from("comments")
			.select("*")
			.eq("post_id", id)
			.eq("status", "approved")
			.order("created_at", { ascending: false });

		res.render("pages/post", {
			post,
			postContent,
			comments: comments || [],
			title: post.title + " - Opine Agora SC",
			description: post.excerpt || post.title,
			image: post.image || "",
			url: req.protocol + "://" + req.get("host") + req.originalUrl,
			isDev,
		});
	} catch (error) {
		console.error("Error fetching post:", error);
		res.status(500).send("Erro ao carregar notícia");
	}
});

// ===== CATCH-ALL ROUTE PARA REACT =====
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start server
app.listen(port, () => {
	console.log(`🚀 Servidor rodando em http://localhost:${port}`);
	console.log(`📄 Site público: http://localhost:${port}/`);
	console.log(`🔐 Login: http://localhost:${port}/login`);
	console.log(`🎛️ Admin: http://localhost:${port}/admin`);
	console.log(`Para parar o servidor, pressione Ctrl + C`);
});

// Exporta o app para a Vercel usar no formato Serverless
export default app;
