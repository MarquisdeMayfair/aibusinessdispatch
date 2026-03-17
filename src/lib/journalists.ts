import { Journalist, JournalistKey } from "./types";

export const JOURNALISTS: Record<JournalistKey, Journalist> = {
  doom_cassandra: {
    key: "doom_cassandra",
    name: "Dr. Cassandra Voss",
    title: "Chief Risk Correspondent",
    color: "#E63946",
    tailwindColor: "accent-doom",
    icon: "AlertTriangle",
    description:
      "Specialises in AI risks, regulatory threats, and worst-case scenarios. If it can go wrong, she's already written the post-mortem.",
  },
  optimist_prime: {
    key: "optimist_prime",
    name: "Marcus Chen-Ramirez",
    title: "Growth & Opportunity Editor",
    color: "#2EC4B6",
    tailwindColor: "accent-optimist",
    icon: "TrendingUp",
    description:
      "Finds the billion-dollar opportunities others miss. Backed by data, never by hope.",
  },
  tech_leads: {
    key: "tech_leads",
    name: "Priya Kapoor",
    title: "Technical Architecture Correspondent",
    color: "#9B5DE5",
    tailwindColor: "accent-tech",
    icon: "Cpu",
    description:
      "Translates bleeding-edge AI research into business-actionable technical insight.",
  },
  strategy_desk: {
    key: "strategy_desk",
    name: "James Whitfield-Sterling",
    title: "Chief Strategy Analyst",
    color: "#1D3557",
    tailwindColor: "accent-strategy",
    icon: "Target",
    description:
      "Decodes competitive moves, market positioning, and the chess games played in boardrooms.",
  },
  secretarial_pool: {
    key: "secretarial_pool",
    name: "Sarah Kim",
    title: "Workplace Transformation Editor",
    color: "#457B9D",
    tailwindColor: "accent-secretarial",
    icon: "Users",
    description:
      "Covers the human side of AI adoption\u2014workforce shifts, culture change, and what it means for your Monday morning.",
  },
  money_machine: {
    key: "money_machine",
    name: "Victoria Ashworth",
    title: "AI Finance & Investment Correspondent",
    color: "#E9C46A",
    tailwindColor: "accent-finance",
    icon: "DollarSign",
    description:
      "Follows the money. Valuations, deals, funding rounds, and the financial mechanics of the AI economy.",
  },
  saas_whisperer: {
    key: "saas_whisperer",
    name: "Diego Fernandez",
    title: "Enterprise SaaS & Tooling Editor",
    color: "#F77F00",
    tailwindColor: "accent-saas",
    icon: "Box",
    description:
      "Tests, ranks, and reviews AI tools so you don't waste your budget on demos that disappoint.",
  },
  creative_destruction: {
    key: "creative_destruction",
    name: "Zara Okafor-Williams",
    title: "Creative & Cultural Impact Correspondent",
    color: "#D62828",
    tailwindColor: "accent-creative",
    icon: "Zap",
    description:
      "Explores how AI reshapes creativity, media, design, and the cultural landscape of business.",
  },
  mr_deansgate: {
    key: "mr_deansgate",
    name: "Mr Deansgate",
    title: "UK Tech & Product Review Correspondent",
    color: "#1E6F5C",
    tailwindColor: "accent-deansgate",
    icon: "Globe",
    description:
      "Veteran technologist and serial entrepreneur reviews UK tech products, SaaS tools, and agentic AI with a marketing brain and 25 years of battle scars.",
  },
};

export const JOURNALIST_LIST = Object.values(JOURNALISTS);
