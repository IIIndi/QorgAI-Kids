CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.child_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  age TEXT NOT NULL DEFAULT '8-9',
  lang TEXT NOT NULL DEFAULT 'ru',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.child_profiles TO authenticated;
GRANT ALL ON public.child_profiles TO service_role;
ALTER TABLE public.child_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own child profile" ON public.child_profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER child_profiles_updated_at BEFORE UPDATE ON public.child_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.lesson_progress (
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  stars INTEGER NOT NULL DEFAULT 0,
  correct INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_step INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, lesson_id),
  CONSTRAINT lesson_progress_status_check CHECK (status IN ('not_started','in_progress','completed'))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_progress TO authenticated;
GRANT ALL ON public.lesson_progress TO service_role;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own lesson progress" ON public.lesson_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER lesson_progress_updated_at BEFORE UPDATE ON public.lesson_progress FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  coins INTEGER NOT NULL DEFAULT 0,
  total_stars INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  last_day DATE,
  safety_score INTEGER NOT NULL DEFAULT 0,
  percent INTEGER NOT NULL DEFAULT 0,
  current_lesson_id INTEGER NOT NULL DEFAULT 1,
  achievements JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_stats TO authenticated;
GRANT ALL ON public.user_stats TO service_role;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own user stats" ON public.user_stats FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER user_stats_updated_at BEFORE UPDATE ON public.user_stats FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();