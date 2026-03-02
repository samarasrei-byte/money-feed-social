
-- Gamification points tracking table
CREATE TABLE public.gamification_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'post', 'comment', 'like', 'lesson_complete', 'help_member', 'daily_login', 'streak_bonus'
  points INTEGER NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for fast aggregation
CREATE INDEX idx_gamification_user_id ON public.gamification_points(user_id);
CREATE INDEX idx_gamification_created_at ON public.gamification_points(created_at);
CREATE INDEX idx_gamification_action ON public.gamification_points(action);

-- Enable RLS
ALTER TABLE public.gamification_points ENABLE ROW LEVEL SECURITY;

-- Everyone can view points (needed for rankings)
CREATE POLICY "Points are viewable by everyone"
ON public.gamification_points
FOR SELECT
USING (true);

-- Users can only insert their own points
CREATE POLICY "Users can earn points"
ON public.gamification_points
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- User levels table for caching level/XP
CREATE TABLE public.user_levels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  level TEXT NOT NULL DEFAULT 'bronze',
  streak_days INTEGER NOT NULL DEFAULT 0,
  streak_last_date DATE,
  weekly_xp INTEGER NOT NULL DEFAULT 0,
  monthly_xp INTEGER NOT NULL DEFAULT 0,
  week_start DATE,
  month_start DATE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_levels_total_xp ON public.user_levels(total_xp DESC);
CREATE INDEX idx_user_levels_weekly_xp ON public.user_levels(weekly_xp DESC);
CREATE INDEX idx_user_levels_monthly_xp ON public.user_levels(monthly_xp DESC);

ALTER TABLE public.user_levels ENABLE ROW LEVEL SECURITY;

-- Everyone can view levels (needed for rankings)
CREATE POLICY "Levels are viewable by everyone"
ON public.user_levels
FOR SELECT
USING (true);

-- Users can insert their own level row
CREATE POLICY "Users can create own level"
ON public.user_levels
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own level
CREATE POLICY "Users can update own level"
ON public.user_levels
FOR UPDATE
USING (auth.uid() = user_id);

-- Function to add XP and update level
CREATE OR REPLACE FUNCTION public.add_gamification_points(
  _user_id UUID,
  _action TEXT,
  _points INTEGER,
  _metadata JSONB DEFAULT '{}'
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _total INTEGER;
  _level TEXT;
  _current_week DATE;
  _current_month DATE;
BEGIN
  -- Insert point record
  INSERT INTO public.gamification_points (user_id, action, points, metadata)
  VALUES (_user_id, _action, _points, _metadata);

  _current_week := date_trunc('week', now())::date;
  _current_month := date_trunc('month', now())::date;

  -- Upsert user level
  INSERT INTO public.user_levels (user_id, total_xp, weekly_xp, monthly_xp, week_start, month_start, updated_at)
  VALUES (_user_id, _points, _points, _points, _current_week, _current_month, now())
  ON CONFLICT (user_id) DO UPDATE SET
    total_xp = user_levels.total_xp + _points,
    weekly_xp = CASE WHEN user_levels.week_start = _current_week THEN user_levels.weekly_xp + _points ELSE _points END,
    monthly_xp = CASE WHEN user_levels.month_start = _current_month THEN user_levels.monthly_xp + _points ELSE _points END,
    week_start = _current_week,
    month_start = _current_month,
    updated_at = now();

  -- Calculate new level
  SELECT total_xp INTO _total FROM public.user_levels WHERE user_id = _user_id;
  
  _level := CASE
    WHEN _total >= 10000 THEN 'elite'
    WHEN _total >= 5000 THEN 'diamante'
    WHEN _total >= 2000 THEN 'ouro'
    WHEN _total >= 500 THEN 'prata'
    ELSE 'bronze'
  END;

  UPDATE public.user_levels SET level = _level WHERE user_id = _user_id;
END;
$$;
