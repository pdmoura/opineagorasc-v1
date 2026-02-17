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

			// Insert comment with RLS (status will be 'pending' by default due to RLS)
			const { data: comment, error: insertError } = await supabase
				.from("comments")
				.insert({
					post_id: validatedData.post_id,
					name: validatedData.name,
					email: validatedData.email,
					content: validatedData.content,
					// IP will be added automatically by RLS policy
				})
				.select()
				.single();

			if (insertError) {
				console.error("Supabase error:", insertError);

				// Handle specific security errors
				if (
					insertError.code === "42501" ||
					insertError.message.includes("row-level security")
				) {
					throw new Error(
						"Não foi possível enviar o comentário. Verifique as permissões da tabela comments no Supabase.",
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

			// Success - but don't show success message for pending comments
			toast.success("Comentário enviado para análise!");
			return comment;
		} catch (error) {
			console.error("Error submitting comment:", error);

			// Show the error message from security validation
			toast.error(error.message);
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
