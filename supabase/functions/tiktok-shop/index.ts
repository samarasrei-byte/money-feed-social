const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// TikTok Shop API base (v2)
const TIKTOK_SHOP_BASE = 'https://open-api.tiktokglobalshop.com';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientKey = Deno.env.get('TIKTOK_CLIENT_KEY');
    const clientSecret = Deno.env.get('TIKTOK_CLIENT_SECRET');

    if (!clientKey || !clientSecret) {
      return new Response(
        JSON.stringify({ success: false, error: 'TikTok Shop credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, access_token, shop_id, order_id, start_time, end_time, cursor, page_size } = await req.json();

    if (!access_token) {
      return new Response(
        JSON.stringify({ success: false, error: 'Access token required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const headers = {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
      'x-tts-access-token': access_token,
    };

    // Get shop info
    if (action === 'shop_info') {
      const response = await fetch(`${TIKTOK_SHOP_BASE}/api/shop/get_authorized_shop`, {
        headers,
      });
      const data = await response.json();

      return new Response(
        JSON.stringify({ success: true, shops: data.data?.shop_list || [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get orders (for commission tracking)
    if (action === 'orders') {
      const params = new URLSearchParams({
        page_size: String(page_size || 20),
        sort_by: 'CREATE_TIME',
        sort_type: '2', // DESC
      });

      if (cursor) params.append('cursor', cursor);
      if (start_time) params.append('create_time_ge', String(start_time));
      if (end_time) params.append('create_time_lt', String(end_time));

      const response = await fetch(`${TIKTOK_SHOP_BASE}/api/orders/search?${params}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });

      const data = await response.json();

      return new Response(
        JSON.stringify({
          success: true,
          orders: data.data?.order_list || [],
          total: data.data?.total || 0,
          next_cursor: data.data?.next_cursor,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get order details
    if (action === 'order_detail') {
      if (!order_id) {
        return new Response(
          JSON.stringify({ success: false, error: 'Order ID required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const response = await fetch(`${TIKTOK_SHOP_BASE}/api/orders/detail/query`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ order_id_list: [order_id] }),
      });

      const data = await response.json();

      return new Response(
        JSON.stringify({
          success: true,
          orders: data.data?.order_list || [],
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get affiliate commission summary
    if (action === 'commission_summary') {
      // This aggregates data from orders for affiliate tracking
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Commission summary - integrate with your affiliate_links and sales tables for full tracking',
          note: 'Use webhooks for real-time order updates',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action. Use: shop_info, orders, order_detail, commission_summary' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('TikTok Shop error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
