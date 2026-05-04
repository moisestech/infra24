import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Reads + writes `data/era-metrics.json`.
 *
 * GET  → current ladders (so the admin page can hydrate without bundling the JSON twice).
 * POST → expects `{ channels: EraMetricLadder[] }`; writes the file in dev. In production
 *        the filesystem is typically read-only on Vercel, so we 405 there and ask the user
 *        to copy the generated JSON manually.
 */

const DATA_PATH = path.join(process.cwd(), 'data', 'era-metrics.json');

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    return new NextResponse(raw, {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to read era-metrics.json', detail: String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      {
        error: 'Direct file write is disabled outside development',
        hint:
          'Copy the JSON from the admin page and paste into data/era-metrics.json, then redeploy.',
      },
      { status: 405 }
    );
  }
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object' || !Array.isArray(body.channels)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    await fs.writeFile(DATA_PATH, `${JSON.stringify(body, null, 2)}\n`, 'utf8');
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to write era-metrics.json', detail: String(err) },
      { status: 500 }
    );
  }
}
