
-- 1) Enable required extensions (safe if already enabled)
create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron with schema extensions;

-- 2) Helper enum for interactions
do $$
begin
  if not exists (select 1 from pg_type where typname = 'product_interaction_type') then
    create type public.product_interaction_type as enum ('view','favorite','inquiry');
  end if;
end$$;

-- 3) Tables used by the existing edge function (to avoid runtime failures)
create table if not exists public.site_settings (
  setting_key text primary key,
  setting_value text,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'site_settings' and policyname = 'Admin can manage site settings'
  ) then
    create policy "Admin can manage site settings"
      on public.site_settings
      for all
      using (is_admin())
      with check (is_admin());
  end if;
end $$;
-- Allow read access for all (sitemap timestamp etc. is non-sensitive)
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'site_settings' and policyname = 'Anyone can read site settings'
  ) then
    create policy "Anyone can read site settings"
      on public.site_settings
      for select
      using (true);
  end if;
end $$;

create table if not exists public.seo_metrics (
  id uuid primary key default gen_random_uuid(),
  metric_name text unique not null,
  metric_value text,
  updated_at timestamptz not null default now()
);
alter table public.seo_metrics enable row level security;
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'seo_metrics' and policyname = 'Admin can manage seo metrics'
  ) then
    create policy "Admin can manage seo metrics"
      on public.seo_metrics
      for all
      using (is_admin())
      with check (is_admin());
  end if;
end $$;
-- Read-only for public (OK for non-sensitive aggregates)
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'seo_metrics' and policyname = 'Anyone can read seo metrics'
  ) then
    create policy "Anyone can read seo metrics"
      on public.seo_metrics
      for select
      using (true);
  end if;
end $$;

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  activity_type text not null,
  description text,
  metadata jsonb,
  created_at timestamptz not null default now()
);
alter table public.activity_logs enable row level security;
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'activity_logs' and policyname = 'Admin can manage activity logs'
  ) then
    create policy "Admin can manage activity logs"
      on public.activity_logs
      for all
      using (is_admin())
      with check (is_admin());
  end if;
end $$;
-- Optional read for all (harmless), otherwise comment out next block
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'activity_logs' and policyname = 'Anyone can read activity logs'
  ) then
    create policy "Anyone can read activity logs"
      on public.activity_logs
      for select
      using (true);
  end if;
end $$;

-- 4) Basic user analytics to fix build error and support admin analytics
create table if not exists public.user_analytics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  session_id text,
  event_type text, -- e.g. 'page_view', 'product_view', 'favorite', 'inquiry'
  page_url text,
  page_title text,
  referrer text,
  device text,
  country text,
  city text,
  user_agent text,
  product_id uuid references public.products(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.user_analytics enable row level security;
-- Allow anonymous insert so we can track traffic even without login
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'user_analytics' and policyname = 'Anyone can insert analytics events'
  ) then
    create policy "Anyone can insert analytics events"
      on public.user_analytics
      for insert
      with check (true);
  end if;
end $$;
-- Only admins can read analytics data
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'user_analytics' and policyname = 'Admin can read analytics'
  ) then
    create policy "Admin can read analytics"
      on public.user_analytics
      for select
      using (is_admin());
  end if;
end $$;

create index if not exists idx_user_analytics_created_at on public.user_analytics (created_at desc);
create index if not exists idx_user_analytics_product on public.user_analytics (product_id);
create index if not exists idx_user_analytics_user on public.user_analytics (user_id);

-- 5) Favorites (heart) + interactions (for suggestions)
create table if not exists public.product_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);
alter table public.product_favorites enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'product_favorites' and policyname = 'Users manage own favorites'
  ) then
    create policy "Users manage own favorites"
      on public.product_favorites
      for all
      using (auth.uid() = user_id or is_admin())
      with check (auth.uid() = user_id or is_admin());
  end if;
end $$;

-- Interactions to power suggestions (view/favorite/inquiry)
create table if not exists public.product_interactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  session_id text,
  product_id uuid not null references public.products(id) on delete cascade,
  interaction_type public.product_interaction_type not null,
  weight int not null default 1, -- can be tuned (view=1, favorite=3, inquiry=5)
  created_at timestamptz not null default now()
);
alter table public.product_interactions enable row level security;
-- Allow anonymous inserts (session-based tracking)
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'product_interactions' and policyname = 'Anyone can insert interactions'
  ) then
    create policy "Anyone can insert interactions"
      on public.product_interactions
      for insert
      with check (true);
  end if;
end $$;
-- Admin can read
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'product_interactions' and policyname = 'Admin can read interactions'
  ) then
    create policy "Admin can read interactions"
      on public.product_interactions
      for select
      using (is_admin());
  end if;
end $$;
-- Users can read their own
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'product_interactions' and policyname = 'Users can read own interactions'
  ) then
    create policy "Users can read own interactions"
      on public.product_interactions
      for select
      using (auth.uid() = user_id);
  end if;
end $$;

create index if not exists idx_product_interactions_user on public.product_interactions (user_id);
create index if not exists idx_product_interactions_session on public.product_interactions (session_id);
create index if not exists idx_product_interactions_product on public.product_interactions (product_id);
create index if not exists idx_product_interactions_created_at on public.product_interactions (created_at desc);

-- 6) Rajasthan Portfolio (dynamic content)
create table if not exists public.rajasthan_crops (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  season text,              -- e.g. Kharif/Rabi
  duration_days int,        -- crop duration
  description text,
  image_url text,
  region text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.rajasthan_crops enable row level security;
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'rajasthan_crops' and policyname = 'Admin can manage crops'
  ) then
    create policy "Admin can manage crops"
      on public.rajasthan_crops
      for all
      using (is_admin())
      with check (is_admin());
  end if;
end $$;
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'rajasthan_crops' and policyname = 'Anyone can view active crops'
  ) then
    create policy "Anyone can view active crops"
      on public.rajasthan_crops
      for select
      using (is_active = true);
  end if;
end $$;
create index if not exists idx_rajasthan_crops_active_order on public.rajasthan_crops (is_active, sort_order);

create table if not exists public.rajasthan_stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  hero_image_url text,
  gallery jsonb,            -- array of images
  village text,
  district text,
  video_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.rajasthan_stories enable row level security;
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'rajasthan_stories' and policyname = 'Admin can manage stories'
  ) then
    create policy "Admin can manage stories"
      on public.rajasthan_stories
      for all
      using (is_admin())
      with check (is_admin());
  end if;
end $$;
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'rajasthan_stories' and policyname = 'Anyone can view active stories'
  ) then
    create policy "Anyone can view active stories"
      on public.rajasthan_stories
      for select
      using (is_active = true);
  end if;
end $$;
create index if not exists idx_rajasthan_stories_active_order on public.rajasthan_stories (is_active, sort_order);

create table if not exists public.rajasthan_portfolio_sections (
  id uuid primary key default gen_random_uuid(),
  section_type text not null,     -- 'hero','gallery','stats','cta','timeline' etc.
  title text,
  content text,
  image_url text,
  gallery jsonb,
  metadata jsonb,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.rajasthan_portfolio_sections enable row level security;
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'rajasthan_portfolio_sections' and policyname = 'Admin can manage portfolio sections'
  ) then
    create policy "Admin can manage portfolio sections"
      on public.rajasthan_portfolio_sections
      for all
      using (is_admin())
      with check (is_admin());
  end if;
end $$;
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'rajasthan_portfolio_sections' and policyname = 'Anyone can view active portfolio sections'
  ) then
    create policy "Anyone can view active portfolio sections"
      on public.rajasthan_portfolio_sections
      for select
      using (is_active = true);
  end if;
end $$;

-- 7) Dynamic Footer Pages (CMS)
create table if not exists public.footer_pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  content text, -- can be HTML/MD/JSON
  is_active boolean not null default true,
  sort_order int not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.footer_pages enable row level security;
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'footer_pages' and policyname = 'Admin can manage footer pages'
  ) then
    create policy "Admin can manage footer pages"
      on public.footer_pages
      for all
      using (is_admin())
      with check (is_admin());
  end if;
end $$;
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'footer_pages' and policyname = 'Anyone can view active footer pages'
  ) then
    create policy "Anyone can view active footer pages"
      on public.footer_pages
      for select
      using (is_active = true);
  end if;
end $$;

-- 8) Updated_at triggers for new tables
do $$ begin
  perform 1;
exception when undefined_function then
  -- handle_updated_at already exists per provided schema
  raise notice 'Trigger function handle_updated_at missing';
end $$;

-- Attach triggers (safe: IF NOT EXISTS not supported for triggers, so check with DO block)
do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'set_timestamp_rajasthan_crops') then
    create trigger set_timestamp_rajasthan_crops
      before update on public.rajasthan_crops
      for each row
      execute procedure public.handle_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_timestamp_rajasthan_stories') then
    create trigger set_timestamp_rajasthan_stories
      before update on public.rajasthan_stories
      for each row
      execute procedure public.handle_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_timestamp_rajasthan_portfolio_sections') then
    create trigger set_timestamp_rajasthan_portfolio_sections
      before update on public.rajasthan_portfolio_sections
      for each row
      execute procedure public.handle_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_timestamp_footer_pages') then
    create trigger set_timestamp_footer_pages
      before update on public.footer_pages
      for each row
      execute procedure public.handle_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_timestamp_seo_metrics') then
    create trigger set_timestamp_seo_metrics
      before update on public.seo_metrics
      for each row
      execute procedure public.handle_updated_at();
  end if;
end $$;

-- 9) Cron job to invoke the edge function every 12 hours
-- Note: replace ANON_KEY below only if your project's anon key changes.
select
  cron.schedule(
    'auto-refresh-every-12h',
    '0 */12 * * *',
    $$
    select
      net.http_post(
        url := 'https://zlylzlmavxhgbjxuuseo.supabase.co/functions/v1/auto-refresh',
        headers := jsonb_build_object(
          'Content-Type','application/json',
          'Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpseWx6bG1hdnhoZ2JqeHV1c2VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNTM2MTIsImV4cCI6MjA3MTkyOTYxMn0.2xX1w3cMr_bsRyPROFXE7UwcOr5rJsWA7CYjzBuCPXw'
        ),
        body := jsonb_build_object('ts', now())
      ) as request_id;
    $$
  );
