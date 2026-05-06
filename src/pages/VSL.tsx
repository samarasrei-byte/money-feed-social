import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import ReactPlayer from "react-player";
import { Button } from "@/components/ui/button";
import { Loader2, Volume2, VolumeX, Play, Shield } from "lucide-react";
import { toast } from "sonner";

const Player = ReactPlayer as any;

interface VSLSettings {
  id: string;
  headline: string;
  subheadline: string;
  video_url: string;
  cta_text: string;
  cta_delay_seconds: number;
  autoplay: boolean;
}

export default function VSL() {
  const [settings, setSettings] = useState<VSLSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCTA, setShowCTA] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<any>(null);
  const [sessionId] = useState(crypto.randomUUID());

  useEffect(() => {
    fetchSettings();
    logEvent("view");
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("vsl_settings")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setSettings(data);
        if (data.autoplay) {
          setPlaying(true);
        }
      }
    } catch (error) {
      console.error("Error fetching VSL settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const logEvent = async (eventType: string, metadata: any = {}) => {
    if (!settings?.id) return;
    try {
      await supabase.from("vsl_analytics").insert({
        vsl_id: settings.id,
        event_type: eventType,
        session_id: sessionId,
        metadata: {
          ...metadata,
          url: window.location.href,
          userAgent: navigator.userAgent,
        },
      });
    } catch (error) {
      console.error("Error logging VSL event:", error);
    }
  };

  const handleProgress = (state: { playedSeconds: number; played: number; loadedSeconds: number; loaded: number }) => {
    setPlayedSeconds(state.playedSeconds);
    
    if (settings && state.playedSeconds >= settings.cta_delay_seconds && !showCTA) {
      setShowCTA(true);
    }

    // Log progress at 25%, 50%, 75%, 95%
    if (duration > 0) {
      const percent = (state.playedSeconds / duration) * 100;
      const markers = [25, 50, 75, 95];
      markers.forEach(marker => {
        const key = `progress_${marker}`;
        const hasLogged = sessionStorage.getItem(`${sessionId}_${key}`);
        if (percent >= marker && !hasLogged) {
          logEvent("video_progress", { percent: marker });
          sessionStorage.setItem(`${sessionId}_${key}`, "true");
        }
      });
    }
  };

  const handleCTAClick = () => {
    logEvent("cta_click");
    window.location.href = "/auth?redirect=/feed";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center space-y-4">
          <p className="text-xl">Nenhuma VSL ativa no momento.</p>
          <Button onClick={() => window.location.href = "/"} variant="outline">Voltar ao Início</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto pt-12 pb-20 px-4 flex flex-col items-center text-center space-y-8">
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
            {settings.headline}
          </h1>
          {settings.subheadline && (
            <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto font-medium">
              {settings.subheadline}
            </p>
          )}
        </div>

        {/* Video Player Container */}
        <div className="w-full relative aspect-video rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 bg-zinc-900 group">
          <Player
            ref={playerRef}
            url={settings.video_url}
            width="100%"
            height="100%"
            playing={playing}
            muted={muted}
            onProgress={handleProgress as any}
            onDuration={setDuration}
            playsinline
            config={{
              youtube: { playerVars: { rel: 0, showinfo: 0, controls: 0, modestbranding: 1 } },
              vimeo: { playerOptions: { background: true, transparent: false } }
            } as any}
            onEnded={() => logEvent("video_complete")}
          />

          {/* Unmute Overlay */}
          {muted && playing && (
            <div 
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer transition-all hover:bg-black/30"
              onClick={() => setMuted(false)}
            >
              <div className="bg-[#FE2C55] p-6 rounded-full shadow-2xl animate-pulse scale-110">
                <VolumeX className="h-10 w-10 text-white fill-current" />
              </div>
              <p className="mt-6 text-xl font-bold uppercase tracking-widest text-white drop-shadow-md">
                Clique para ativar o som
              </p>
            </div>
          )}

          {/* Initial Play Overlay */}
          {!playing && (
            <div 
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 cursor-pointer"
              onClick={() => { setPlaying(true); setMuted(false); }}
            >
              <div className="bg-[#FE2C55] p-6 rounded-full shadow-2xl transition-transform hover:scale-110">
                <Play className="h-10 w-10 text-white fill-current" />
              </div>
              <p className="mt-6 text-xl font-bold uppercase tracking-widest text-white">
                Assistir Agora
              </p>
            </div>
          )}
          
          {/* Custom Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 z-20">
            <div 
              className="h-full bg-[#FE2C55] transition-all duration-300 shadow-[0_0_10px_rgba(254,44,85,0.8)]"
              style={{ width: duration > 0 ? `${(playedSeconds / duration) * 100}%` : '0%' }}
            />
          </div>
        </div>

        {/* Dynamic CTA */}
        <div className={`w-full transition-all duration-700 transform ${showCTA ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
          <Button 
            size="lg"
            className="w-full max-w-md h-16 text-xl font-black uppercase tracking-wider bg-[#FE2C55] hover:bg-[#FE2C55]/90 hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(254,44,85,0.5)] rounded-xl"
            onClick={handleCTAClick}
          >
            {settings.cta_text}
          </Button>
          <div className="mt-4 flex items-center justify-center gap-2 text-white/50 text-sm">
            <Shield className="h-4 w-4" />
            <span>Compra 100% Segura & Acesso Imediato</span>
          </div>
        </div>
      </div>

      {/* Social Proof / Section 2 */}
      <div className="bg-zinc-950 py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">O que as pessoas estão dizendo...</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "Ricardo S.", text: "O Only Shop mudou minha forma de vender como afiliado. Em 2 semanas tripliquei meus resultados." },
              { name: "Amanda M.", text: "Finalmente uma plataforma que entende as necessidades de quem está começando e de quem já é profissional." },
              { name: "Gabriel L.", text: "A facilidade de encontrar produtos hypados é o grande diferencial. Recomendo muito!" },
              { name: "Beatriz V.", text: "O suporte e a comunidade são incríveis. Nunca me senti tão amparada em um negócio." }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white/5 p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                <p className="italic text-white/80 mb-6 text-lg">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-primary font-bold">
                    {testimonial.name[0]}
                  </div>
                  <p className="font-bold text-primary">{testimonial.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final Offer / Section 3 */}
      <div className="py-24 px-4 text-center">
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-zinc-900 to-black p-12 rounded-[2rem] border border-white/10 shadow-2xl">
          <h3 className="text-4xl font-black mb-6 uppercase tracking-tight">Comece sua jornada hoje</h3>
          <p className="text-xl text-white/60 mb-10">Junte-se a milhares de empreendedores que já estão lucrando com o Only Shop.</p>
          <Button 
            size="lg"
            className="w-full h-16 text-xl font-black uppercase tracking-wider bg-white text-black hover:bg-white/90 hover:scale-105 active:scale-95 transition-all rounded-xl"
            onClick={handleCTAClick}
          >
            {settings.cta_text}
          </Button>
          <p className="mt-8 text-xs text-white/30 uppercase tracking-widest font-bold">
            Garantia de satisfação incondicional
          </p>
        </div>
      </div>
    </div>
  );
}
