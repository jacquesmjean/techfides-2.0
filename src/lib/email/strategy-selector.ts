/**
 * Strategy Selector — Tiered Angle Selection + Pivot Logic
 *
 * Determines which outreach strategy angle to use for a lead:
 * - Tier 2 ($150K-$5M): STRATEGIC_ALIGNMENT → pivot to AEGIS_GOVERNANCE
 * - Tier 1 ($10K-$60K): COST_RECOVERY → pivot to SUBSCRIPTION_REDUCTION
 *
 * Auto-pivots if no heat score increase after configurable step threshold.
 */

import type { StrategyAngle } from "@prisma/client";

export interface StrategySelection {
  angle: StrategyAngle;
  sequenceStep: number;
  isPivot: boolean;
  pivotedFrom: StrategyAngle | null;
}

export interface LeadContext {
  tier: "TIER_1" | "TIER_2" | "UNKNOWN" | "REJECTED";
  heatScore: number;
  heatScoreAtSequenceStart: number;
  currentAngle: StrategyAngle | null;
  currentStep: number;
  pivotAfterStep: number;
}

/**
 * Determine the strategy angle and step for a lead.
 */
export function selectStrategy(ctx: LeadContext): StrategySelection {
  // First-touch: no existing sequence
  if (!ctx.currentAngle) {
    return {
      angle: getDefaultAngle(ctx.tier),
      sequenceStep: 1,
      isPivot: false,
      pivotedFrom: null,
    };
  }

  const nextStep = ctx.currentStep + 1;

  // Check if pivot is needed: past threshold step with no engagement increase
  if (
    ctx.currentStep >= ctx.pivotAfterStep &&
    ctx.heatScore <= ctx.heatScoreAtSequenceStart &&
    !isPivotAngle(ctx.currentAngle)
  ) {
    const pivotAngle = getPivotAngle(ctx.currentAngle);
    return {
      angle: pivotAngle,
      sequenceStep: ctx.currentStep, // restart at same step with new angle
      isPivot: true,
      pivotedFrom: ctx.currentAngle,
    };
  }

  // Continue current sequence
  return {
    angle: ctx.currentAngle,
    sequenceStep: Math.min(nextStep, 5),
    isPivot: false,
    pivotedFrom: null,
  };
}

/**
 * Detect objection keywords in a reply and suggest a pivot.
 */
export function detectObjection(
  replyText: string,
  currentAngle: StrategyAngle,
  tier: "TIER_1" | "TIER_2" | "UNKNOWN" | "REJECTED"
): { shouldPivot: boolean; suggestedAngle: StrategyAngle; reason: string } | null {
  const lower = replyText.toLowerCase();

  const objectionPatterns = [
    { pattern: /not ready|too early|not looking|not right now/i, reason: "Not ready for AI" },
    { pattern: /too expensive|budget|can't afford|cost/i, reason: "Cost concern" },
    { pattern: /already have|using .*(salesforce|hubspot|openai)/i, reason: "Existing solution" },
    { pattern: /don't need|not interested|no need/i, reason: "No perceived need" },
  ];

  for (const { pattern, reason } of objectionPatterns) {
    if (pattern.test(lower)) {
      const suggestedAngle =
        reason === "Cost concern"
          ? tier === "TIER_2" ? "SUBSCRIPTION_REDUCTION" as StrategyAngle : "COST_RECOVERY" as StrategyAngle
          : getPivotAngle(currentAngle);

      return {
        shouldPivot: true,
        suggestedAngle,
        reason,
      };
    }
  }

  return null;
}

function getDefaultAngle(tier: string): StrategyAngle {
  if (tier === "TIER_2") return "STRATEGIC_ALIGNMENT";
  return "COST_RECOVERY";
}

function getPivotAngle(angle: StrategyAngle): StrategyAngle {
  switch (angle) {
    case "STRATEGIC_ALIGNMENT":
      return "AEGIS_GOVERNANCE";
    case "COST_RECOVERY":
      return "SUBSCRIPTION_REDUCTION";
    case "AEGIS_GOVERNANCE":
      return "STRATEGIC_ALIGNMENT"; // cycle back
    case "SUBSCRIPTION_REDUCTION":
      return "COST_RECOVERY"; // cycle back
    default:
      return "COST_RECOVERY";
  }
}

function isPivotAngle(angle: StrategyAngle): boolean {
  return angle === "AEGIS_GOVERNANCE" || angle === "SUBSCRIPTION_REDUCTION";
}
