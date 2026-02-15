const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const TIKTOK_AUTH_URL = 'https://www.tiktok.com/v2/auth/authorize/';
const TIKTOK_TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/';
const TIKTOK_USERINFO_URL = 'https://open.tiktokapis.com/v2/user/info/';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientKey = Deno.env.get('TIKTOK_CLIENT_KEY');
    const clientSecret = Deno.env.get('TIKTOK_CLIENT_SECRET');

    if (!clientKey || !clientSecret) {
      return new Response(
        JSON.stringify({ success: false, error: 'TikTok credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, code, redirect_uri, state } = await req.json();

    // Step 1: Generate auth URL
    if (action === 'get_auth_url') {
      const scopes = 'user.info.basic,user.info.stats,video.publish,video.list';
      const csrfState = crypto.randomUUID();

      const authUrl = `${TIKTOK_AUTH_URL}?client_key=${clientKey}&scope=${scopes}&response_type=code&redirect_uri=${encodeURIComponent(redirect_uri)}&state=${csrfState}`;

      return new Response(
        JSON.stringify({ success: true, auth_url: authUrl, state: csrfState }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 2: Exchange code for token
    if (action === 'exchange_token') {
      if (!code) {
        return new Response(
          JSON.stringify({ success: false, error: 'Authorization code required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const tokenResponse = await fetch(TIKTOK_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_key: clientKey,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirect_uri || '',
        }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || tokenData.error) {
        console.error('Token exchange error:', tokenData);
        return new Response(
          JSON.stringify({ success: false, error: tokenData.error_description || 'Token exchange failed' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Fetch user info
      const userResponse = await fetch(
        `${TIKTOK_USERINFO_URL}?fields=open_id,union_id,avatar_url,display_name,username,follower_count,following_count,likes_count,video_count,is_verified`,
        {
          headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
        }
      );

      const userData = await userResponse.json();
      const userInfo = userData.data?.user || {};

      return new Response(
        JSON.stringify({
          success: true,
          tokens: {
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            expires_in: tokenData.expires_in,
            open_id: tokenData.open_id,
            scope: tokenData.scope,
          },
          user: {
            tiktok_user_id: tokenData.open_id,
            tiktok_username: userInfo.username || null,
            display_name: userInfo.display_name || null,
            avatar_url: userInfo.avatar_url || null,
            followers_count: userInfo.follower_count || 0,
            following_count: userInfo.following_count || 0,
            likes_count: userInfo.likes_count || 0,
            video_count: userInfo.video_count || 0,
            is_verified: userInfo.is_verified || false,
          },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 3: Refresh token
    if (action === 'refresh_token') {
      const { refresh_token } = await req.json();

      const refreshResponse = await fetch(TIKTOK_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_key: clientKey,
          client_secret: clientSecret,
          grant_type: 'refresh_token',
          refresh_token,
        }),
      });

      const refreshData = await refreshResponse.json();

      if (!refreshResponse.ok) {
        return new Response(
          JSON.stringify({ success: false, error: 'Token refresh failed' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, tokens: refreshData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action. Use: get_auth_url, exchange_token, refresh_token' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('TikTok auth error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
