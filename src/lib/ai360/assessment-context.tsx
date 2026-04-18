"use client";

import { createContext, useContext } from "react";
import { AI360StatusType } from "./types";

export interface AssessmentContextType {
  id: string;
  name: string;
  orgName: string;
  status: AI360StatusType;
  overallScore: number | null;
  completionRate: number;
  reload: () => void;
}

export const AssessmentCtx = createContext<AssessmentContextType>({
  id: "",
  name: "",
  orgName: "",
  status: "DRAFT",
  overallScore: null,
  completionRate: 0,
  reload: () => {},
});

export const useAssessment = () => useContext(AssessmentCtx);
