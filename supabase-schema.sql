-- ============================================
-- AI Business Dispatch — Supabase Schema
-- ============================================
-- Run this in Supabase > SQL Editor > New Query
-- ============================================

-- Articles table
create table if not exists articles (
  id text primary key,
  journalist text not null,
  journalist_name text,
  journalist_title text,
  headline text not null,
  hook text,
  body text not null,
  category text,
  tags jsonb default '[]'::jsonb,
  image_url text,
  image_prompt text,
  image_thumbnail_url text,
  image_hero_url text,
  sources jsonb default '[]'::jsonb,
  date date not null default current_date,
  slug text unique not null,
  read_time text,
  featured boolean default false,
  status text default 'published',
  meta_title text,
  meta_description text,
  created_at timestamptz default now()
);

-- Newsletters table
create table if not exists newsletters (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  title text not null,
  edition_number integer,
  editorial_intro text,
  lead_article_id text references articles(id),
  article_ids jsonb default '[]'::jsonb,
  sections jsonb default '[]'::jsonb,
  html_content text,
  slug text unique not null,
  seo_title text,
  seo_description text,
  og_image text,
  status text default 'published',
  created_at timestamptz default now()
);

-- Subscribers table
create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  subscribed_at timestamptz default now(),
  status text default 'active'
);

-- Cron logs table
create table if not exists cron_logs (
  id uuid primary key default gen_random_uuid(),
  job text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  duration_ms integer,
  status text not null,
  journalist text,
  article_id text,
  headline text,
  detail jsonb default '{}'::jsonb,
  error text
);

-- Indexes for common queries
create index if not exists idx_articles_date on articles(date desc);
create index if not exists idx_articles_slug on articles(slug);
create index if not exists idx_articles_journalist on articles(journalist);
create index if not exists idx_articles_featured on articles(featured) where featured = true;
create index if not exists idx_articles_status on articles(status);
create index if not exists idx_newsletters_date on newsletters(date desc);
create index if not exists idx_newsletters_slug on newsletters(slug);
create index if not exists idx_subscribers_email on subscribers(email);
create index if not exists idx_cron_logs_job on cron_logs(job);
create index if not exists idx_cron_logs_started on cron_logs(started_at desc);

-- Row Level Security
alter table articles enable row level security;
alter table newsletters enable row level security;
alter table subscribers enable row level security;

-- Public read access (anon key can read published articles)
create policy "Public can read published articles"
  on articles for select
  using (status = 'published');

create policy "Public can read published newsletters"
  on newsletters for select
  using (status = 'published');

-- Service role has full access (used by API routes)
create policy "Service role full access to articles"
  on articles for all
  using (true)
  with check (true);

create policy "Service role full access to newsletters"
  on newsletters for all
  using (true)
  with check (true);

create policy "Service role full access to subscribers"
  on subscribers for all
  using (true)
  with check (true);

alter table cron_logs enable row level security;

create policy "Service role full access to cron_logs"
  on cron_logs for all
  using (true)
  with check (true);
