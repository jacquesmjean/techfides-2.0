/**
 * Apollo.io API client for lead enrichment.
 *
 * Endpoint reference: https://apolloio.github.io/apollo-api-docs/
 *
 * In mock mode (no API key), returns deterministic stub data so the
 * enrichment worker can be developed and tested without paying for Apollo.
 */

const MOCK_MODE = process.env.APOLLO_MOCK_MODE === "true";
const API_KEY = process.env.APOLLO_API_KEY || "";
const BASE_URL = "https://api.apollo.io/api/v1";

export interface ApolloEnrichmentInput {
  email?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  linkedinUrl?: string;
}

export interface ApolloEnrichmentResult {
  // Person data
  personTitle?: string;
  personSeniority?: string;
  personDepartment?: string;
  personLinkedinUrl?: string;

  // Company data
  companyName?: string;
  companyIndustry?: string;
  companyEmployees?: number;
  companyRevenue?: string;
  companyTechStack?: string[];
  companyWebsite?: string;
  companyLinkedinUrl?: string;

  // Raw response from Apollo for audit
  raw: Record<string, unknown>;
}

export async function enrichLead(
  input: ApolloEnrichmentInput
): Promise<ApolloEnrichmentResult> {
  if (MOCK_MODE) {
    return mockEnrichLead(input);
  }

  if (!API_KEY) {
    throw new Error("APOLLO_API_KEY not set and APOLLO_MOCK_MODE=false");
  }

  const response = await fetch(`${BASE_URL}/people/match`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({
      email: input.email,
      first_name: input.firstName,
      last_name: input.lastName,
      organization_name: input.company,
      linkedin_url: input.linkedinUrl,
      reveal_personal_emails: false,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Apollo enrichment failed: ${response.status} ${text}`);
  }

  const data = (await response.json()) as {
    person?: {
      title?: string;
      seniority?: string;
      departments?: string[];
      linkedin_url?: string;
      organization?: {
        name?: string;
        industry?: string;
        estimated_num_employees?: number;
        annual_revenue_printed?: string;
        technology_names?: string[];
        website_url?: string;
        linkedin_url?: string;
      };
    };
  };

  const person = data.person;
  const org = person?.organization;

  return {
    personTitle: person?.title,
    personSeniority: person?.seniority,
    personDepartment: person?.departments?.[0],
    personLinkedinUrl: person?.linkedin_url,
    companyName: org?.name,
    companyIndustry: org?.industry,
    companyEmployees: org?.estimated_num_employees,
    companyRevenue: org?.annual_revenue_printed,
    companyTechStack: org?.technology_names || [],
    companyWebsite: org?.website_url,
    companyLinkedinUrl: org?.linkedin_url,
    raw: data as Record<string, unknown>,
  };
}

/**
 * Classify a lead into Tier 1, Tier 2, or REJECTED based on company revenue.
 */
export function classifyTier(
  revenue: string | undefined
): "TIER_1" | "TIER_2" | "REJECTED" | "UNKNOWN" {
  if (!revenue) return "UNKNOWN";

  // Apollo returns strings like "$1.2M", "$250M", "$1.5B"
  const match = revenue.match(/^\$?([\d.]+)([KMB])$/i);
  if (!match) return "UNKNOWN";

  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  const usd =
    unit === "K"
      ? value * 1_000
      : unit === "M"
        ? value * 1_000_000
        : value * 1_000_000_000;

  if (usd < 250_000) return "REJECTED";
  if (usd < 250_000_000) return "TIER_1";
  if (usd < 2_000_000_000) return "TIER_2";
  return "REJECTED";
}

/**
 * Map an Apollo industry string to a TechFides vertical.
 */
export function mapVertical(
  industry: string | undefined
): "LEGAL" | "MEDICAL" | "AUTO" | "TRADES" | "PROPERTY_MANAGEMENT" | "OTHER" {
  if (!industry) return "OTHER";
  const lower = industry.toLowerCase();
  if (lower.includes("law") || lower.includes("legal")) return "LEGAL";
  if (
    lower.includes("medic") ||
    lower.includes("health") ||
    lower.includes("hospital") ||
    lower.includes("clinic")
  )
    return "MEDICAL";
  if (lower.includes("auto") || lower.includes("dealer")) return "AUTO";
  if (
    lower.includes("construction") ||
    lower.includes("contractor") ||
    lower.includes("hvac") ||
    lower.includes("plumb") ||
    lower.includes("electric")
  )
    return "TRADES";
  if (lower.includes("real estate") || lower.includes("property"))
    return "PROPERTY_MANAGEMENT";
  return "OTHER";
}

/**
 * Mock response for dev mode.
 */
function mockEnrichLead(
  input: ApolloEnrichmentInput
): ApolloEnrichmentResult {
  const company = input.company || "Acme Corp";
  return {
    personTitle: "VP of Operations",
    personSeniority: "vp",
    personDepartment: "operations",
    personLinkedinUrl: input.linkedinUrl,
    companyName: company,
    companyIndustry: "Healthcare",
    companyEmployees: 250,
    companyRevenue: "$50M",
    companyTechStack: ["[MOCK] Salesforce", "[MOCK] Office 365", "[MOCK] AWS"],
    companyWebsite: `https://${company.toLowerCase().replace(/\s+/g, "")}.com`,
    raw: {
      _mock: true,
      _note: "APOLLO_MOCK_MODE=true. Set to false and provide APOLLO_API_KEY to use real data.",
    },
  };
}
