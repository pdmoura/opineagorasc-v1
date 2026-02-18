import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { secureValidateComment, checkRateLimit } from "../lib/security";

export const useComments = (postId, status = "approved") => {
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchComments = async () => {
			if (!postId) {
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				setError(null);

				const { data, error } = await supabase
					.from("comments")
					.select("*")
					.eq("post_id", postId)
					.eq("status", status)
					.order("created_at", { ascending: false });

				if (error) throw error;

				setComments(data || []);
			} catch (error) {
				console.error("Error fetching comments:", error);
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchComments();
	}, [postId, status]);

	return { comments, loading, error };
};

export const useSubmitComment = () => {
	const [submitting, setSubmitting] = useState(false);
	const submissionInProgress = useRef(false);

	const submitComment = async (commentData) => {
		// Prevenir envios duplicados
		if (submissionInProgress.current) {
			console.warn(
				"Submission already in progress, preventing duplicate",
			);
			return false;
		}

		try {
			submissionInProgress.current = true;
			setSubmitting(true);

			// Security validation with rate limiting and sanitization
			const validatedData = secureValidateComment(commentData);

			// Reverting to direct insert but handling RLS limitations
			// We cannot use .select() because the read policy only allows 'approved' comments
			const { error: insertError } = await supabase
				.from("comments")
				.insert({
					post_id: validatedData.post_id,
					name: validatedData.name,
					email: validatedData.email,
					content: validatedData.content,
					status: "pending",
					// IP will be added automatically by RLS policy
				});

			if (insertError) {
				console.error("Supabase error:", insertError);

				// Handle specific security errors
				if (
					insertError.code === "42501" ||
					insertError.message.includes("row-level security")
				) {
					throw new Error(
						"Não foi possível enviar o comentário. Tente novamente mais tarde.",
					);
				}

				// Handle rate limiting errors
				if (
					insertError.code === "23505" ||
					insertError.message.includes("duplicate key") ||
					insertError.message.includes("violates unique constraint")
				) {
					throw new Error(
						"Você já comentou recentemente. Aguarde alguns minutos para comentar novamente.",
					);
				}

				throw insertError;
			}

			// Success
			// Since we can't read the comment back (RLS), we construct a optimistic comment object
			// We use a temporary ID timestamp
			const comment = {
				id: Date.now(), // Temporary ID
				post_id: validatedData.post_id,
				name: validatedData.name,
				email: validatedData.email,
				content: validatedData.content,
				status: "pending",
				created_at: new Date().toISOString(),
			};

			toast.success("Comentário enviado para análise!");
			return comment;
		} catch (error) {
			console.error("Error submitting comment:", error);

			// Show the error message from security validation
			// If it's a known error, show it. Otherwise show generic error in prod.
			const isDev = import.meta.env.DEV;
			const isKnownError =
				error.message.includes("Validação") ||
				error.message.includes("Limite") ||
				error.message.includes("obrigatório") ||
				error.message.includes("inválido") ||
				error.message.includes("caracteres") ||
				error.message.includes("recentemente") ||
				error.message.includes("Não foi possível");

			if (isDev || isKnownError) {
				toast.error(error.message);
			} else {
				toast.error("Erro ao enviar comentário. Tente novamente.");
			}
			return false;
		} finally {
			setSubmitting(false);
			submissionInProgress.current = false;
		}
	};

	return { submitComment, submitting };
};

export const useAdminComments = () => {
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchComments = async (status = null) => {
		try {
			setLoading(true);
			setError(null);

			let query = supabase
				.from("comments")
				.select("*, posts(title)")
				.order("created_at", { ascending: false });

			if (status) {
				query = query.eq("status", status);
			}

			const { data, error } = await query;

			if (error) throw error;

			setComments(data || []);
		} catch (error) {
			console.error("Error fetching admin comments:", error);
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const approveComment = async (commentId) => {
		try {
			const { data, error } = await supabase
				.from("comments")
				.update({ status: "approved" })
				.eq("id", commentId)
				.select()
				.single();

			if (error) throw error;

			setComments((prev) =>
				prev.map((comment) =>
					comment.id === commentId
						? { ...comment, status: "approved" }
						: comment,
				),
			);

			toast.success("Comentário aprovado!");
			return data;
		} catch (error) {
			console.error("Error approving comment:", error);
			toast.error("Erro ao aprovar comentário.");
			return false;
		}
	};

	const rejectComment = async (commentId) => {
		try {
			const { error } = await supabase
				.from("comments")
				.delete()
				.eq("id", commentId);

			if (error) throw error;

			setComments((prev) =>
				prev.filter((comment) => comment.id !== commentId),
			);
			toast.success("Comentário rejeitado e removido!");
			return true;
		} catch (error) {
			console.error("Error rejecting comment:", error);
			toast.error("Erro ao rejeitar comentário.");
			return false;
		}
	};

	useEffect(() => {
		fetchComments();
	}, []);

	return {
		comments,
		loading,
		error,
		fetchComments,
		approveComment,
		rejectComment,
	};
};
