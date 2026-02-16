import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getClientIP } from "../lib/utils";
import toast from "react-hot-toast";

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

	const submitComment = async (commentData) => {
		const { post_id, name, email, content } = commentData;

		// Validation
		if (!post_id || !name || !email || !content) {
			toast.error("Todos os campos são obrigatórios.");
			return false;
		}

		if (name.trim().length < 2) {
			toast.error("O nome deve ter pelo menos 2 caracteres.");
			return false;
		}

		if (name.trim().length > 100) {
			toast.error("O nome deve ter no máximo 100 caracteres.");
			return false;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			toast.error("Por favor, insira um e-mail válido.");
			return false;
		}

		if (content.trim().length < 10) {
			toast.error("O comentário deve ter pelo menos 10 caracteres.");
			return false;
		}

		if (content.trim().length > 2000) {
			toast.error("O comentário deve ter no máximo 2000 caracteres.");
			return false;
		}

		try {
			setSubmitting(true);

			// Insert comment with pending status
			const { data: comment, error: insertError } = await supabase
				.from("comments")
				.insert({
					post_id,
					name: name.trim(),
					email: email.trim().toLowerCase(),
					content: content.trim(),
					status: "pending",
				})
				.select()
				.single();

			if (insertError) throw insertError;

			toast.success("Comentário enviado para análise!");
			return comment;
		} catch (error) {
			console.error("Error submitting comment:", error);
			toast.error("Erro ao salvar comentário. Tente novamente.");
			return false;
		} finally {
			setSubmitting(false);
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
