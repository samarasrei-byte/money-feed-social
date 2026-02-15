const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const TIKTOK_PUBLISH_URL = 'https://open.tiktokapis.com/v2/post/publish/video/init/';
const TIKTOK_PUBLISH_STATUS_URL = 'https://open.tiktokapis.com/v2/post/publish/status/fetch/';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, access_token, video_url, caption, publish_id, privacy_level } = await req.json();

    if (!access_token) {
      return new Response(
        JSON.stringify({ success: false, error: 'Access token required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize video publish (URL-based upload)
    if (action === 'publish_video') {
      if (!video_url) {
        return new Response(
          JSON.stringify({ success: false, error: 'Video URL required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const response = await fetch(TIKTOK_PUBLISH_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_info: {
            title: caption || '',
            privacy_level: privacy_level || 'SELF_ONLY',
            disable_duet: false,
            disable_comment: false,
            disable_stitch: false,
          },
          source_info: {
            source: 'PULL_FROM_URL',
            video_url: video_url,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('TikTok publish error:', data);
        return new Response(
          JSON.stringify({ success: false, error: data.error?.message || 'Failed to publish video' }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          publish_id: data.data?.publish_id,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check publish status
    if (action === 'publish_status') {
      if (!publish_id) {
        return new Response(
          JSON.stringify({ success: false, error: 'Publish ID required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const response = await fetch(TIKTOK_PUBLISH_STATUS_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publish_id }),
      });

      const data = await response.json();

      return new Response(
        JSON.stringify({
          success: true,
          status: data.data?.status,
          video_id: data.data?.publicaly_available_post_id?.[0],
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action. Use: publish_video, publish_status' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('TikTok post error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
