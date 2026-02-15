import { supabase } from '@/integrations/supabase/client';

type TikTokResponse<T = any> = {
  success: boolean;
  error?: string;
  data?: T;
  [key: string]: any;
};

export const tiktokApi = {
  // ===== AUTH =====
  async getAuthUrl(redirectUri: string): Promise<TikTokResponse> {
    const { data, error } = await supabase.functions.invoke('tiktok-auth', {
      body: { action: 'get_auth_url', redirect_uri: redirectUri },
    });
    if (error) return { success: false, error: error.message };
    return data;
  },

  async exchangeToken(code: string, redirectUri: string): Promise<TikTokResponse> {
    const { data, error } = await supabase.functions.invoke('tiktok-auth', {
      body: { action: 'exchange_token', code, redirect_uri: redirectUri },
    });
    if (error) return { success: false, error: error.message };
    return data;
  },

  async refreshToken(refreshToken: string): Promise<TikTokResponse> {
    const { data, error } = await supabase.functions.invoke('tiktok-auth', {
      body: { action: 'refresh_token', refresh_token: refreshToken },
    });
    if (error) return { success: false, error: error.message };
    return data;
  },

  // ===== METRICS =====
  async getUserStats(accessToken: string): Promise<TikTokResponse> {
    const { data, error } = await supabase.functions.invoke('tiktok-metrics', {
      body: { action: 'user_stats', access_token: accessToken },
    });
    if (error) return { success: false, error: error.message };
    return data;
  },

  async getVideoList(accessToken: string, cursor?: string): Promise<TikTokResponse> {
    const { data, error } = await supabase.functions.invoke('tiktok-metrics', {
      body: { action: 'video_list', access_token: accessToken, cursor },
    });
    if (error) return { success: false, error: error.message };
    return data;
  },

  // ===== POSTING =====
  async publishVideo(accessToken: string, videoUrl: string, caption: string, privacyLevel?: string): Promise<TikTokResponse> {
    const { data, error } = await supabase.functions.invoke('tiktok-post', {
      body: { action: 'publish_video', access_token: accessToken, video_url: videoUrl, caption, privacy_level: privacyLevel },
    });
    if (error) return { success: false, error: error.message };
    return data;
  },

  async getPublishStatus(accessToken: string, publishId: string): Promise<TikTokResponse> {
    const { data, error } = await supabase.functions.invoke('tiktok-post', {
      body: { action: 'publish_status', access_token: accessToken, publish_id: publishId },
    });
    if (error) return { success: false, error: error.message };
    return data;
  },

  // ===== SHOP =====
  async getShopInfo(accessToken: string): Promise<TikTokResponse> {
    const { data, error } = await supabase.functions.invoke('tiktok-shop', {
      body: { action: 'shop_info', access_token: accessToken },
    });
    if (error) return { success: false, error: error.message };
    return data;
  },

  async getOrders(accessToken: string, startTime?: number, endTime?: number, cursor?: string): Promise<TikTokResponse> {
    const { data, error } = await supabase.functions.invoke('tiktok-shop', {
      body: { action: 'orders', access_token: accessToken, start_time: startTime, end_time: endTime, cursor },
    });
    if (error) return { success: false, error: error.message };
    return data;
  },

  async getOrderDetail(accessToken: string, orderId: string): Promise<TikTokResponse> {
    const { data, error } = await supabase.functions.invoke('tiktok-shop', {
      body: { action: 'order_detail', access_token: accessToken, order_id: orderId },
    });
    if (error) return { success: false, error: error.message };
    return data;
  },
};
