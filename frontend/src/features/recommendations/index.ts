import { httpClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import { Product } from "@/features/catalog/types";

export const recommendationsApi = {
  getFeed: async (): Promise<Product[]> => {
    const { data } = await httpClient.get<Product[]>(API_ENDPOINTS.RECOMMENDATIONS.FEED);
    return data;
  },

  trackEvent: async (eventType: string, targetId: string): Promise<void> => {
    await httpClient.post(API_ENDPOINTS.RECOMMENDATIONS.TRACK_EVENT, {
      event_type: eventType,
      target_id: targetId,
    });
  },
};
