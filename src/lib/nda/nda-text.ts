/**
 * Mutual Non-Disclosure Agreement
 *
 * Single source of truth for the NDA text presented at step 1 of the
 * onboarding flow. Versioned so we can detect when a returning client
 * needs to re-sign because terms changed.
 *
 * Rendered today by:
 *   - src/app/onboarding/[id]/OnboardingClient.tsx (StepNDA)
 *
 * Future renderers (PDF for client records, email confirmations) read
 * the same structured document.
 */

export interface NdaSection {
  /** Section number as displayed (e.g., "1", "2", "9.1"). */
  number: string;
  title: string;
  /** Body text. Plain prose; the renderer handles formatting. */
  body: string;
}

export interface NdaDocument {
  /** Bumped any time the substantive terms change. */
  version: string;
  title: string;
  preamble: string;
  sections: NdaSection[];
  /** Closing paragraph shown above the signature block. */
  closing: string;
}

export const NDA_VERSION = "2026.04";

export const TECHFIDES_MUTUAL_NDA: NdaDocument = {
  version: NDA_VERSION,
  title: "MUTUAL NON-DISCLOSURE AGREEMENT",
  preamble:
    "This Mutual Non-Disclosure Agreement (\u201CAgreement\u201D) is entered into by and between TechFides LLC, a Texas limited liability company (\u201CTechFides\u201D), and the undersigned party (\u201CClient\u201D), collectively referred to as the \u201CParties.\u201D Each Party may disclose Confidential Information to the other in connection with evaluating or performing services together. This Agreement governs how that information is handled.",
  sections: [
    {
      number: "1",
      title: "Definition of Confidential Information",
      body:
        "\u201CConfidential Information\u201D means any non-public, proprietary, or trade secret information disclosed by either Party, whether disclosed in writing, orally, electronically, or by inspection, including but not limited to: business strategies, financial data, technical architectures, AI model configurations, training data, prompt libraries, hardware specifications, deployment methodologies, client lists, pricing structures, source code, and any information marked or identified as \u201Cconfidential,\u201D or that a reasonable person would understand to be confidential under the circumstances. Information disclosed orally and identified as confidential at the time of disclosure is also Confidential Information.",
    },
    {
      number: "2",
      title: "Obligations of Receiving Party",
      body:
        "Each Party agrees to: (a) hold all Confidential Information in strict confidence; (b) not disclose Confidential Information to any third party without prior written consent of the disclosing Party, except as expressly permitted in Section 3; (c) use Confidential Information solely for the purpose of evaluating or performing services under the business relationship between the Parties; (d) protect Confidential Information using no less than reasonable care, and in no event less than the care it uses to protect its own confidential information of similar importance; (e) limit access to Confidential Information to personnel with a bona fide need to know who are bound by confidentiality obligations no less restrictive than those in this Agreement.",
    },
    {
      number: "3",
      title: "Permitted Disclosures",
      body:
        "Notwithstanding Section 2, the receiving Party may disclose Confidential Information: (a) to its affiliates, employees, contractors, and professional advisors (including legal, accounting, and tax advisors) who have a need to know and are bound by confidentiality obligations no less restrictive than those in this Agreement; (b) as required by applicable law, regulation, court order, or governmental authority, provided that, where legally permitted, the receiving Party gives the disclosing Party prompt written notice and reasonable cooperation to seek a protective order or other appropriate remedy; (c) in connection with the enforcement of this Agreement or any rights arising under it.",
    },
    {
      number: "4",
      title: "Exclusions",
      body:
        "Confidential Information does not include information that: (a) is or becomes publicly available through no act or omission of the receiving Party; (b) was already known to the receiving Party prior to disclosure, as evidenced by written records; (c) is independently developed by the receiving Party without use of or reference to the disclosing Party's Confidential Information; (d) is rightfully received from a third party without restriction and without breach of any confidentiality obligation.",
    },
    {
      number: "5",
      title: "Term and Survival",
      body:
        "This Agreement is effective on the date of execution and remains in effect for three (3) years. The obligation to protect Confidential Information disclosed during the term shall survive expiration or termination for an additional two (2) years, except that obligations relating to information that constitutes a trade secret under applicable law shall continue for as long as such information remains a trade secret.",
    },
    {
      number: "6",
      title: "Return or Destruction of Materials",
      body:
        "Upon expiration, termination, or written request of the disclosing Party, the receiving Party shall promptly return or destroy all Confidential Information in its possession, including all copies, summaries, and derivatives, and shall certify such return or destruction in writing within ten (10) business days. The receiving Party may retain one archival copy in secure storage solely for the purpose of demonstrating compliance with this Agreement and to satisfy legal, regulatory, or bona fide internal record-retention requirements; any such retained copy remains subject to the obligations of this Agreement for as long as it is retained.",
    },
    {
      number: "7",
      title: "No License Granted",
      body:
        "All Confidential Information remains the property of the disclosing Party. Nothing in this Agreement is intended to grant, by implication, estoppel, or otherwise, any license or other right under any patent, copyright, trade secret, trademark, or other intellectual property right of the disclosing Party. Disclosure of Confidential Information does not constitute a representation or warranty of accuracy or fitness for any particular purpose.",
    },
    {
      number: "8",
      title: "Representations",
      body:
        "Each Party represents and warrants that: (a) it has the full right and authority to enter into this Agreement; (b) it has the right to disclose any Confidential Information it provides to the other Party; and (c) entering into this Agreement does not breach any other agreement to which it is a party.",
    },
    {
      number: "9",
      title: "Defend Trade Secrets Act Notice",
      body:
        "Pursuant to 18 U.S.C. \u00A7 1833(b), each Party is hereby notified that an individual shall not be held criminally or civilly liable under any federal or state trade secret law for the disclosure of a trade secret that: (i) is made (A) in confidence to a federal, state, or local government official, either directly or indirectly, or to an attorney; and (B) solely for the purpose of reporting or investigating a suspected violation of law; or (ii) is made in a complaint or other document filed in a lawsuit or other proceeding, if such filing is made under seal. An individual who files a lawsuit for retaliation by an employer for reporting a suspected violation of law may disclose the trade secret to the attorney of the individual and use the trade secret information in the court proceeding, if the individual files any document containing the trade secret under seal and does not disclose the trade secret, except pursuant to court order.",
    },
    {
      number: "10",
      title: "Governing Law and Venue",
      body:
        "This Agreement shall be governed by and construed in accordance with the laws of the State of Texas, without regard to its conflict of laws principles. The Parties consent to the exclusive jurisdiction and venue of the state and federal courts located in Collin County, Texas for any dispute arising out of or relating to this Agreement.",
    },
    {
      number: "11",
      title: "Remedies",
      body:
        "Each Party acknowledges that a breach of this Agreement may cause irreparable harm for which monetary damages would be inadequate. Accordingly, the non-breaching Party shall be entitled to seek injunctive relief and any other equitable remedies, in addition to any other remedies available at law or in equity, without the requirement of posting a bond or proving actual damages.",
    },
    {
      number: "12",
      title: "Notices",
      body:
        "All notices required or permitted under this Agreement shall be in writing and delivered by email with confirmation of receipt or by recognized overnight courier to the email and physical addresses provided by each Party at signature. Notices are effective upon receipt. Each Party shall promptly update the other if its notice address changes.",
    },
    {
      number: "13",
      title: "General Provisions",
      body:
        "(a) Severability. If any provision of this Agreement is held invalid or unenforceable, the remaining provisions shall remain in full force and effect, and the invalid or unenforceable provision shall be modified to the minimum extent necessary to make it valid and enforceable. (b) Entire Agreement. This Agreement constitutes the entire agreement between the Parties regarding confidentiality and supersedes all prior or contemporaneous oral or written communications on the subject. (c) Amendment. This Agreement may be amended only by a written instrument signed by both Parties. (d) Assignment. Neither Party may assign this Agreement without the prior written consent of the other, except in connection with a merger, acquisition, or sale of substantially all of its assets. This Agreement binds and benefits the Parties and their permitted successors and assigns. (e) No Third-Party Beneficiaries. This Agreement is for the sole benefit of the Parties and creates no rights in any third party. (f) Counterparts and Electronic Signature. This Agreement may be executed in counterparts and by electronic signature, each of which shall be deemed an original and together shall constitute one instrument. (g) Waiver. No waiver of any breach is a waiver of any subsequent breach. (h) Headings. Section headings are for convenience only and do not affect interpretation.",
    },
  ],
  closing:
    "By signing below, each Party acknowledges that it has read this Agreement, understands it, and agrees to be bound by its terms.",
};

/**
 * Optional industry-specific addenda. Surface these in the onboarding flow
 * when the lead's vertical is detected.
 */
export const NDA_ADDENDA = {
  HIPAA:
    "If Client is a HIPAA-covered entity or business associate and TechFides will access, create, receive, maintain, or transmit Protected Health Information (PHI) under any engagement, the Parties shall execute a separate HIPAA Business Associate Agreement prior to any such access. This Agreement does not authorize the disclosure of PHI.",
  LEGAL_PRIVILEGE:
    "Nothing in this Agreement shall waive, limit, or otherwise affect any attorney-client privilege, work product doctrine, or other applicable legal privilege held by Client. The Parties shall cooperate in good faith to preserve any such privilege.",
} as const;

export type NdaAddendumKey = keyof typeof NDA_ADDENDA;
