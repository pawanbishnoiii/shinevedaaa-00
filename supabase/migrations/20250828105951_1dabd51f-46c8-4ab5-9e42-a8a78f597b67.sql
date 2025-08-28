
-- 1) Ensure helpful extensions for scheduling and HTTP
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net;

-- 2) Speed up Featured section and detail lookups
create index if not exists idx_products_featured_active on public.products (is_featured, is_active, sort_order);
create index if not exists idx_products_slug on public.products (slug);

-- 3) Enforce data integrity for favorites and interactions
-- 3a) Unique pair so a product can't be favorited twice by same user
create unique index if not exists ux_product_favorites_user_product
  on public.product_favorites (user_id, product_id);

-- 3b) Add FK from favorites.product_id -> products.id
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'fk_product_favorites_product'
  ) then
    alter table public.product_favorites
      add constraint fk_product_favorites_product
      foreign key (product_id) references public.products(id) on delete cascade;
  end if;
end $$;

-- 3c) Add FK from product_interactions.product_id -> products.id
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'fk_product_interactions_product'
  ) then
    alter table public.product_interactions
      add constraint fk_product_interactions_product
      foreign key (product_id) references public.products(id) on delete cascade;
  end if;
end $$;

-- 4) Make category join reliable (FK from products.category_id -> categories.id)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'fk_products_category'
  ) then
    alter table public.products
      add constraint fk_products_category
      foreign key (category_id) references public.categories(id) on delete set null;
  end if;
end $$;

-- 5) Keep updated_at in sync on edits across key tables
-- Function handle_updated_at() already exists in your DB.
-- Add triggers if missing.
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'trg_products_updated_at'
  ) then
    create trigger trg_products_updated_at
      before update on public.products
      for each row execute function public.handle_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'trg_categories_updated_at'
  ) then
    create trigger trg_categories_updated_at
      before update on public.categories
      for each row execute function public.handle_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'trg_footer_pages_updated_at'
  ) then
    create trigger trg_footer_pages_updated_at
      before update on public.footer_pages
      for each row execute function public.handle_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'trg_rajasthan_crops_updated_at'
  ) then
    create trigger trg_rajasthan_crops_updated_at
      before update on public.rajasthan_crops
      for each row execute function public.handle_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'trg_rajasthan_stories_updated_at'
  ) then
    create trigger trg_rajasthan_stories_updated_at
      before update on public.rajasthan_stories
      for each row execute function public.handle_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'trg_rajasthan_portfolio_sections_updated_at'
  ) then
    create trigger trg_rajasthan_portfolio_sections_updated_at
      before update on public.rajasthan_portfolio_sections
      for each row execute function public.handle_updated_at();
  end if;
end $$;

-- 6) Helpful analytics indices
create index if not exists idx_product_interactions_user
  on public.product_interactions (user_id, product_id, interaction_type);

create index if not exists idx_user_analytics_event
  on public.user_analytics (event_type, created_at);

-- 7) Schedule auto-refresh every 12 hours (calls your existing edge function)
-- Replace ANON_KEY below if you rotate keys.
select
  cron.schedule(
    'auto-refresh-12h',
    '0 */12 * * *',
    $$
    select
      net.http_post(
        url := 'https://zlylzlmavxhgbjxuuseo.supabase.co/functions/v1/auto-refresh',
        headers := '{
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpseWx6bG1hdnhoZ2JqeHV1c2VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNTM2MTIsImV4cCI6MjA3MTkyOTYxMn0.2xX1w3cMr_bsRyPROFXE7UwcOr5rJsWA7CYjzBuCPXw",
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpseWx6bG1hdnhoZ2JqeHV1c2VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNTM2MTIsImV4cCI6MjA3MTkyOTYxMn0.2xX1w3cMr_bsRyPROFXE7UwcOr5rJsWA7CYjzBuCPXw"
        }'::jsonb,
        body := '{}'::jsonb
      ) as request_id;
    $$
  );
