export interface Article {
  id: string;
  journalist: JournalistKey;
  journalist_name?: string;
  journalist_title?: string;
  headline: string;
  hook: string;
  body: string;
  category: Category;
  tags: string[];
  image_url: string | null;
  image_prompt: string;
  image_thumbnail_url?: string;
  image_hero_url?: string;
  sources: Source[];
  date: string;
  slug: string;
  read_time?: string;
  featured?: boolean;
  status?: string;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
}

export interface Source {
  title: string;
  url: string;
  name?: string;
}

export interface Newsletter {
  id: string;
  date: string;
  title: string;
  edition_number?: number;
  editorial_intro: string;
  lead_article_id: string;
  article_ids: string[];
  sections?: Record<string, unknown>[];
  html_content: string;
  slug: string;
  seo_title?: string;
  seo_description?: string;
  og_image?: string;
  status?: string;
  created_at: string;
}

export type JournalistKey =
  | "doom_cassandra"
  | "optimist_prime"
  | "tech_leads"
  | "strategy_desk"
  | "secretarial_pool"
  | "money_machine"
  | "saas_whisperer"
  | "creative_destruction"
  | "mr_deansgate";

export type Category =
  | "risks_warnings"
  | "opportunities_growth"
  | "technical_deep_dive"
  | "strategy_analysis"
  | "workplace_culture"
  | "finance_investment"
  | "saas_tools"
  | "creative_innovation"
  | "uk_tech_product_review";

export interface Journalist {
  key: JournalistKey;
  name: string;
  title: string;
  color: string;
  tailwindColor: string;
  icon: string;
  description: string;
}
