import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const useNewsletters = () => {
	const [newsletters, setNewsletters] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchNewsletters();
	}, []);

	const fetchNewsletters = async () => {
		try {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase
				.from("newsletter_subscriptions")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) throw error;

			setNewsletters(data || []);
		} catch (error) {
			console.error("Error fetching newsletters:", error);
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const addNewsletter = async (email) => {
		try {
			// Obter IP do cliente (simplificado)
			const clientIP = "127.0.0.1"; // Fallback para desenvolvimento

			// Verificar rate limit
			const { data: rateLimitCheck, error: rateLimitError } =
				await supabase.rpc("check_newsletter_rate_limit", {
					ip_param: clientIP,
				});

			if (rateLimitError) {
				console.error("Rate limit check error:", rateLimitError);
			} else if (!rateLimitCheck) {
				throw new Error(
					"Limite de inscrições excedido. Tente novamente mais tarde.",
				);
			}

			// Verificar se email já existe
			const { data: emailCheck, error: emailCheckError } =
				await supabase.rpc("check_email_exists", {
					email_param: email.trim().toLowerCase(),
				});

			if (emailCheckError) {
				console.error("Email check error:", emailCheckError);
			} else if (!emailCheck) {
				throw new Error("Este email já está inscrito na newsletter.");
			}

			// Inserir email
			const { data, error } = await supabase
				.from("newsletter_subscriptions")
				.insert({
					email: email.trim().toLowerCase(),
					status: "active",
				})
				.select()
				.single();

			if (error) {
				if (error.code === "23505") {
					throw new Error(
						"Este email já está inscrito na newsletter.",
					);
				} else {
					throw new Error(
						"Erro ao adicionar email. Tente novamente.",
					);
				}
			}

			await fetchNewsletters(); // Refresh the list
			return data;
		} catch (error) {
			console.error("Error adding newsletter:", error);
			throw error;
		}
	};

	const deleteNewsletter = async (id) => {
		try {
			console.log("Attempting to delete newsletter with ID:", id);

			const { data, error } = await supabase
				.from("newsletter_subscriptions")
				.delete()
				.eq("id", id)
				.select();

			console.log("Delete response:", { data, error });

			if (error) {
				console.error("Supabase delete error:", error);
				throw error;
			}

			console.log("Newsletter deleted successfully");
			await fetchNewsletters(); // Refresh the list
		} catch (error) {
			console.error("Error deleting newsletter:", error);
			throw error;
		}
	};

	const getNewsletterCount = async () => {
		try {
			const { count, error } = await supabase
				.from("newsletter_subscriptions")
				.select("id", { count: "exact", head: true });

			if (error) throw error;
			return count || 0;
		} catch (error) {
			console.error("Error getting newsletter count:", error);
			return 0;
		}
	};

	return {
		newsletters,
		loading,
		error,
		fetchNewsletters,
		addNewsletter,
		deleteNewsletter,
		getNewsletterCount,
	};
};
