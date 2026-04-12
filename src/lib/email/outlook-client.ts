/**
 * Microsoft Graph API Client for Outlook 365
 *
 * Creates, sends, and manages email drafts in Outlook via the
 * Microsoft Graph REST API. Handles token refresh for scheduled
 * background jobs that run without a user session.
 */

const GRAPH_BASE = "https://graph.microsoft.com/v1.0";

const MOCK_MODE = !process.env.MICROSOFT_CLIENT_ID;

export interface OutlookDraftInput {
  subject: string;
  bodyHtml: string;
  toName: string;
  toEmail: string;
}

export interface OutlookDraftResult {
  outlookDraftId: string;
  outlookMessageId: string;
}

/**
 * Create a draft email in Outlook.
 */
export async function createOutlookDraft(
  accessToken: string,
  draft: OutlookDraftInput
): Promise<OutlookDraftResult> {
  if (MOCK_MODE) {
    const mockId = `mock_draft_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    return { outlookDraftId: mockId, outlookMessageId: mockId };
  }

  const response = await fetch(`${GRAPH_BASE}/me/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subject: draft.subject,
      body: {
        contentType: "HTML",
        content: draft.bodyHtml,
      },
      toRecipients: [
        {
          emailAddress: {
            name: draft.toName,
            address: draft.toEmail,
          },
        },
      ],
      isDraft: true,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Outlook draft creation failed: ${response.status} ${text}`);
  }

  const data = (await response.json()) as { id: string };
  return {
    outlookDraftId: data.id,
    outlookMessageId: data.id,
  };
}

/**
 * Send an existing draft email via Outlook.
 */
export async function sendOutlookDraft(
  accessToken: string,
  outlookMessageId: string
): Promise<void> {
  if (MOCK_MODE) {
    console.log(`[outlook-mock] Would send draft: ${outlookMessageId}`);
    return;
  }

  const response = await fetch(
    `${GRAPH_BASE}/me/messages/${outlookMessageId}/send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Length": "0",
      },
    }
  );

  if (!response.ok && response.status !== 202) {
    const text = await response.text();
    throw new Error(`Outlook send failed: ${response.status} ${text}`);
  }
}

/**
 * Delete a draft email from Outlook.
 */
export async function deleteOutlookDraft(
  accessToken: string,
  outlookMessageId: string
): Promise<void> {
  if (MOCK_MODE) {
    console.log(`[outlook-mock] Would delete draft: ${outlookMessageId}`);
    return;
  }

  const response = await fetch(
    `${GRAPH_BASE}/me/messages/${outlookMessageId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok && response.status !== 204) {
    const text = await response.text();
    throw new Error(`Outlook delete failed: ${response.status} ${text}`);
  }
}

/**
 * Refresh the Microsoft OAuth2 access token.
 * Used by scheduled workers that run without a browser session.
 */
export async function refreshMicrosoftToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}> {
  const tenantId = process.env.MICROSOFT_TENANT_ID || "common";
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "MICROSOFT_CLIENT_ID and MICROSOFT_CLIENT_SECRET required for token refresh"
    );
  }

  const response = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
        scope: "openid profile email Mail.ReadWrite Mail.Send offline_access",
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token refresh failed: ${response.status} ${text}`);
  }

  const data = (await response.json()) as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
  };
}

/**
 * Get the current Microsoft access token for the admin user,
 * refreshing if expired. Reads from the Account table.
 */
export async function getOutlookAccessToken(): Promise<string> {
  if (MOCK_MODE) return "mock_access_token";

  // Import db lazily to avoid circular deps
  const { db } = await import("@/lib/db");

  const account = await db.account.findFirst({
    where: { provider: "microsoft-entra-id" },
    orderBy: { userId: "asc" },
  });

  if (!account?.access_token || !account?.refresh_token) {
    throw new Error(
      "No Microsoft account linked. Sign in with Microsoft via /login first."
    );
  }

  // Check if token is expired (with 5-min buffer)
  const now = Math.floor(Date.now() / 1000);
  if (account.expires_at && account.expires_at > now + 300) {
    return account.access_token;
  }

  // Refresh
  const refreshed = await refreshMicrosoftToken(account.refresh_token);

  await db.account.update({
    where: { id: account.id },
    data: {
      access_token: refreshed.accessToken,
      refresh_token: refreshed.refreshToken,
      expires_at: refreshed.expiresAt,
    },
  });

  return refreshed.accessToken;
}
