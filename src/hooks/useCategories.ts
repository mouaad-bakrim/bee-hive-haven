import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export const categoriesQueryKey = ["categories"] as const;

async function fetchCategories(): Promise<CategoryItem[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export function useCategories() {
  return useQuery({
    queryKey: categoriesQueryKey,
    queryFn: fetchCategories,
    staleTime: 2 * 60 * 1000,
  });
}
