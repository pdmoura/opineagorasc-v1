import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar categorias únicas na tabela posts
        const { data, error } = await supabase
          .from("posts")
          .select("category")
          .eq("status", "published")
          .not("category", "is", null);

        if (error) throw error;

        // Extrair categorias únicas
        const uniqueCategories = [...new Set(data?.map(post => post.category).filter(Boolean))];
        
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};
