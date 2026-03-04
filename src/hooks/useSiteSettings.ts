import { useQuery } from "@tanstack/react-query";
import { getSettings } from "@/features/settings/settings.api";

export const siteSettingsQueryKey = ["site_settings"] as const;

export function useSiteSettings() {
  return useQuery({
    queryKey: siteSettingsQueryKey,
    queryFn: getSettings,
    staleTime: 5 * 60 * 1000,
  });
}

