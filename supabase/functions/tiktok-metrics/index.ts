const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const TIKTOK_USERINFO_URL = 'https://open.tiktokapis.com/v2/user/info/';
const TIKTOK_VIDEO_LIST_URL = 'https://open.tiktokapis.com/v2/video/list/';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, access_token, cursor, max_count } = await req.json();

    if (!access_token) {
      return new Response(
        JSON.stringify({ success: false, error: 'Access token required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user stats
    if (action === 'user_stats') {
      const response = await fetch(
        `${TIKTOK_USERINFO_URL}?fields=open_id,avatar_url,display_name,username,follower_count,following_count,likes_count,video_count,is_verified`,
        { headers: { 'Authorization': `Bearer ${access_token}` } }
      );

      const data = await response.json();

      if (!response.ok) {
        return new Response(
          JSON.stringify({ success: false, error: data.error?.message || 'Failed to fetch user stats' }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, data: data.data?.user }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get video list with metrics
    if (action === 'video_list') {
      const response = await fetch(
        `${TIKTOK_VIDEO_LIST_URL}?fields=id,title,video_description,create_time,cover_image_url,share_url,duration,like_count,comment_count,share_count,view_count`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            max_count: max_count || 20,
            cursor: cursor || undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return new Response(
          JSON.stringify({ success: false, error: data.error?.message || 'Failed to fetch videos' }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          videos: data.data?.videos || [],
          cursor: data.data?.cursor,
          has_more: data.data?.has_more || false,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action. Use: user_stats, video_list' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('TikTok metrics error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
