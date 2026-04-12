/**
 * Shared Airtable REST helpers (v0 API).
 * PAT and base/table IDs stay server-side only.
 */

export interface AirtableRecord {
  id: string;
  createdTime?: string;
  fields: Record<string, unknown>;
}

interface AirtableListResponse {
  records: AirtableRecord[];
  offset?: string;
}

export function isAirtableConnectionConfigured(opts: {
  apiKey: string | undefined;
  baseId: string | undefined;
  tableId: string | undefined;
}): boolean {
  return Boolean(
    opts.apiKey?.trim() && opts.baseId?.trim() && opts.tableId?.trim()
  );
}

export type ListRecordsOptions = {
  filterFormula?: string;
  /** Airtable view id or name; scopes list to that view */
  viewId?: string;
};

/**
 * Fetch all records from a table with pagination.
 * Fourth argument may be a filter formula string (legacy) or options.
 */
export async function fetchAllRecords(
  baseId: string,
  tableId: string,
  apiKey: string,
  options?: string | ListRecordsOptions
): Promise<AirtableRecord[]> {
  const filterFormula =
    typeof options === 'string' ? options : options?.filterFormula;
  const viewId = typeof options === 'string' ? undefined : options?.viewId;

  const allRecords: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(
      `https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(tableId)}`
    );
    if (filterFormula) url.searchParams.set('filterByFormula', filterFormula);
    if (viewId) url.searchParams.set('view', viewId);
    if (offset) url.searchParams.set('offset', offset);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Airtable API error ${res.status}: ${text}`);
    }

    const data: AirtableListResponse = await res.json();
    allRecords.push(...data.records);
    offset = data.offset;
  } while (offset);

  return allRecords;
}

/**
 * PATCH a single record (partial field update).
 */
export async function patchAirtableRecord(
  baseId: string,
  tableId: string,
  apiKey: string,
  recordId: string,
  fields: Record<string, unknown>
): Promise<AirtableRecord> {
  const res = await fetch(
    `https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(tableId)}/${encodeURIComponent(recordId)}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable PATCH error ${res.status}: ${text}`);
  }

  return res.json() as Promise<AirtableRecord>;
}
