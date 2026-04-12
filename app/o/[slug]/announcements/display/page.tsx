'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { ArrowLeft, Eye, List, EyeOff, Settings2, Copy, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { DisplayProgramOrchestrator } from '@/components/display/DisplayProgramOrchestrator';
import { Announcement } from '@/types/announcement';
import { OrganizationLogo } from '@/components/ui/OrganizationLogo';
import type { WorkshopGridItem, ArtistGridItem } from '@/components/display/DisplayGrid';
import {
  DEFAULT_DISPLAY_PROGRAM,
  loadDisplayProgram,
  saveDisplayProgram,
  tryParseDisplayProgramJson,
  encodeDisplayProgramForUrl,
  parseDisplayViewParam,
  buildSingleSegmentPreviewProgram,
  previewLabelForViewKind,
  type DisplayProgram,
} from '@/lib/display/display-program';
import { studioNumberFromArtistPayload } from '@/lib/display/artist-studio-number';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
}

function AnnouncementDisplayPageInner() {
  const { isLoaded } = useUser();
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [workshops, setWorkshops] = useState<WorkshopGridItem[]>([]);
  const [artists, setArtists] = useState<ArtistGridItem[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNavigation, setShowNavigation] = useState(true);
  const [cleanViewMode, setCleanViewMode] = useState(false);

  const [program, setProgram] = useState<DisplayProgram>(DEFAULT_DISPLAY_PROGRAM);
  const [programJson, setProgramJson] = useState(() => JSON.stringify(DEFAULT_DISPLAY_PROGRAM, null, 2));
  const [programEditorOpen, setProgramEditorOpen] = useState(false);
  const [programError, setProgramError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const loaded = loadDisplayProgram(slug);
    setProgram(loaded);
    setProgramJson(JSON.stringify(loaded, null, 2));
  }, [slug]);

  function inferAnnouncementType(announcement: Record<string, unknown>): string {
    if ((announcement.priority as number) > 3) return 'urgent';
    if (announcement.starts_at || announcement.scheduled_at) return 'event';
    const tags = (announcement.tags as string[]) || [];
    const tagString = tags.join(' ').toLowerCase();
    if (tagString.includes('workshop') || tagString.includes('exhibition') || tagString.includes('performance')) {
      return 'event';
    }
    if (tagString.includes('job') || tagString.includes('opportunity') || tagString.includes('call')) {
      return 'opportunity';
    }
    if (tagString.includes('maintenance') || tagString.includes('facility') || tagString.includes('cleaning')) {
      return 'facility';
    }
    if (tagString.includes('survey') || tagString.includes('policy') || tagString.includes('deadline')) {
      return 'administrative';
    }
    return 'event';
  }

  function inferAnnouncementSubType(announcement: Record<string, unknown>): string {
    const tags = (announcement.tags as string[]) || [];
    const tagString = tags.join(' ').toLowerCase();
    const title = String(announcement.title || '').toLowerCase();
    const body = String(announcement.body || '').toLowerCase();
    const combined = `${title} ${body} ${tagString}`;

    if (combined.includes('exhibition') || combined.includes('show')) return 'exhibition';
    if (combined.includes('workshop') || combined.includes('class')) return 'workshop';
    if (combined.includes('talk') || combined.includes('lecture') || combined.includes('presentation')) return 'talk';
    if (combined.includes('social') || combined.includes('party') || combined.includes('gathering')) return 'social';
    if (combined.includes('performance') || combined.includes('concert')) return 'performance';
    if (combined.includes('open studio') || combined.includes('open studios')) return 'open_studios';
    if (combined.includes('closure') || combined.includes('closed')) return 'closure';
    if (combined.includes('weather') || combined.includes('storm') || combined.includes('hurricane')) return 'weather';
    if (combined.includes('safety') || combined.includes('emergency')) return 'safety';
    if (combined.includes('parking') || combined.includes('park')) return 'parking';
    if (combined.includes('maintenance') || combined.includes('repair')) return 'maintenance';
    if (combined.includes('cleaning') || combined.includes('clean')) return 'cleaning';
    if (combined.includes('storage') || combined.includes('store')) return 'storage';
    if (combined.includes('renovation') || combined.includes('renovate')) return 'renovation';
    if (combined.includes('open call') || combined.includes('call for')) return 'open_call';
    if (combined.includes('job') || combined.includes('position') || combined.includes('hiring')) return 'job';
    if (combined.includes('commission') || combined.includes('commissioned')) return 'commission';
    if (combined.includes('residency') || combined.includes('resident')) return 'residency';
    if (combined.includes('funding') || combined.includes('grant') || combined.includes('fund')) return 'funding';
    if (combined.includes('survey') || combined.includes('questionnaire')) return 'survey';
    if (combined.includes('document') || combined.includes('form')) return 'document';
    if (combined.includes('deadline') || combined.includes('due')) return 'deadline';
    if (combined.includes('policy') || combined.includes('rule')) return 'policy';

    switch (announcement.type) {
      case 'event':
        return 'exhibition';
      case 'urgent':
        return 'closure';
      case 'facility':
        return 'maintenance';
      case 'opportunity':
        return 'open_call';
      case 'administrative':
        return 'survey';
      default:
        return 'exhibition';
    }
  }

  useEffect(() => {
    async function loadData() {
      if (!params.slug) return;

      try {
        const slugParam = params.slug as string;
        const [annRes, wsRes, artRes] = await Promise.all([
          fetch(`/api/organizations/by-slug/${slugParam}/announcements/public`),
          fetch(`/api/organizations/by-slug/${slugParam}/workshops/public`),
          fetch(`/api/organizations/by-slug/${slugParam}/artists/public`),
        ]);

        if (!annRes.ok) throw new Error('Failed to load announcements');

        const announcementsData = await annRes.json();
        setOrganization(announcementsData.organization);

        const publishedAnnouncements = (announcementsData.announcements || [])
          .filter((announcement: { is_active?: boolean }) => announcement.is_active === true)
          .map((announcement: Record<string, unknown>) => {
            const mapped = {
              ...announcement,
              body: (announcement.body as string) || (announcement.content as string) || '',
              status: (announcement.status as string) || 'published',
              type: (announcement.type as string) || inferAnnouncementType(announcement),
              sub_type: (announcement.sub_type as string) || inferAnnouncementSubType(announcement),
              image_url: (announcement.image_url as string) || (announcement.imageUrl as string) || null,
              image_layout: (announcement.image_layout as string) || (announcement.imageLayout as string) || null,
              people: (announcement.people as unknown[]) || (announcement.key_people as unknown[]) || [],
            } as Announcement;
            if (!mapped.image_url) {
              console.warn('⚠️ Announcement missing image_url:', { title: mapped.title });
            }
            return mapped;
          });

        console.log('📋 Display Page:', { totalAnnouncements: publishedAnnouncements.length });

        setAnnouncements(publishedAnnouncements);

        if (wsRes.ok) {
          const wsData = await wsRes.json();
          const wsList = (wsData.workshops || []) as Record<string, unknown>[];
          setWorkshops(
            wsList.map((w) => {
              const meta = (w.metadata as Record<string, unknown>) || null;
              const scheduleDetail =
                (typeof meta?.displaySchedule === 'string' && meta.displaySchedule.trim()) ||
                (typeof meta?.schedule === 'string' && meta.schedule.trim()) ||
                null;
              return {
                id: String(w.id),
                title: String(w.title || ''),
                description: scheduleDetail ? null : (w.description as string) || null,
                image_url: (w.image_url as string) || null,
                category: (w.category as string) || null,
                schedule_detail: scheduleDetail,
              };
            })
          );
        } else {
          setWorkshops([]);
        }

        if (artRes.ok) {
          const artData = await artRes.json();
          const arList = (artData.artists || []) as Record<string, unknown>[];
          setArtists(
            arList.map((a) => {
              const meta = (a.metadata as Record<string, unknown>) || null;
              const studioNum = studioNumberFromArtistPayload({
                studio_location: (a.studio_location as string) || null,
                metadata: meta,
              });
              return {
                id: String(a.id),
                name: String(a.name || ''),
                bio: (a.bio as string) || null,
                profile_image: (a.profile_image as string) || null,
                studio_type: (a.studio_type as string) || null,
                studio_number: studioNum || null,
                metadata: meta,
              };
            })
          );
        } else {
          setArtists([]);
        }
      } catch (e) {
        console.error('Error loading data:', e);
        setError(e instanceof Error ? e.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded) {
      loadData();
    }
  }, [isLoaded, params.slug]);

  const applyProgramJson = useCallback(() => {
    if (!slug) return;
    const parsed = tryParseDisplayProgramJson(programJson);
    if (!parsed) {
      setProgramError('Invalid display program JSON (version 1, segments with id/kind/durationMs ≥ 3000).');
      return;
    }
    setProgramError(null);
    setProgram(parsed);
    saveDisplayProgram(slug, parsed);
  }, [programJson, slug]);

  const resetProgram = useCallback(() => {
    if (!slug) return;
    setProgram(DEFAULT_DISPLAY_PROGRAM);
    setProgramJson(JSON.stringify(DEFAULT_DISPLAY_PROGRAM, null, 2));
    setProgramError(null);
    saveDisplayProgram(slug, DEFAULT_DISPLAY_PROGRAM);
  }, [slug]);

  const copyProgramUrl = useCallback(() => {
    const parsed = tryParseDisplayProgramJson(programJson) ?? program;
    const enc = encodeDisplayProgramForUrl(parsed);
    if (!enc || typeof window === 'undefined') return;
    const url = `${window.location.origin}${window.location.pathname}?program=${enc}`;
    void navigator.clipboard.writeText(url);
  }, [programJson, program]);

  const searchQs = searchParams.toString();
  const previewKind = useMemo(
    () => parseDisplayViewParam(searchQs ? `?${searchQs}` : ''),
    [searchQs]
  );

  const effectiveProgram = useMemo(() => {
    if (!previewKind) return program;
    const q = new URLSearchParams(searchQs);
    const aid = q.get('announcementId')?.trim();
    return buildSingleSegmentPreviewProgram(previewKind, {
      announcementId: aid || undefined,
    });
  }, [previewKind, program, searchQs]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading display…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Link
              href={`/o/${params.slug}`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Organization
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900">
      <div
        className={`absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm transition-all duration-300 ${
          showNavigation && !cleanViewMode ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href={`/o/${slug}`}
                className="inline-flex items-center px-3 py-2 text-white hover:text-white/80 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Link>

              <div className="hidden md:flex items-center space-x-4 text-white/80">
                <div className="flex items-center space-x-3">
                  {organization && (
                    <OrganizationLogo
                      organizationSlug={organization.slug}
                      size="md"
                      variant="horizontal"
                      className="h-8"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link
                href={`/o/${slug}/announcements`}
                className="inline-flex items-center px-3 py-2 text-white hover:text-white/80 transition-colors"
              >
                <List className="w-4 h-4 mr-2" />
                List View
              </Link>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setCleanViewMode(!cleanViewMode);
          if (!cleanViewMode) {
            setShowNavigation(false);
            setProgramEditorOpen(false);
          }
        }}
        className={`fixed top-4 right-4 z-50 inline-flex items-center justify-center w-12 h-12 bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-all duration-300 rounded-lg border border-white/20 ${
          cleanViewMode ? 'opacity-100' : 'opacity-70 hover:opacity-100'
        }`}
        title={cleanViewMode ? 'Exit clean view' : 'Enter clean view'}
      >
        {cleanViewMode ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
      </button>

      <button
        type="button"
        onClick={() => setProgramEditorOpen((o) => !o)}
        className="fixed top-4 right-[4.5rem] z-50 inline-flex items-center justify-center w-12 h-12 bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-all duration-300 rounded-lg border border-white/20 opacity-70 hover:opacity-100"
        title="Display program (JSON)"
      >
        <Settings2 className="w-5 h-5" />
      </button>

      {programEditorOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[45vh] flex flex-col bg-zinc-950/95 text-white border-t border-white/10 shadow-2xl">
          <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-white/10">
            <span className="text-sm font-medium">Display program (localStorage + optional ?program=)</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={applyProgramJson}
                className="px-3 py-1.5 rounded-md bg-cyan-600 text-sm font-medium hover:bg-cyan-500"
              >
                Apply & save
              </button>
              <button
                type="button"
                onClick={resetProgram}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-white/10 text-sm hover:bg-white/15"
              >
                <RotateCcw className="w-4 h-4" />
                Reset default
              </button>
              <button
                type="button"
                onClick={copyProgramUrl}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-white/10 text-sm hover:bg-white/15"
              >
                <Copy className="w-4 h-4" />
                Copy URL
              </button>
              <button
                type="button"
                onClick={() => setProgramEditorOpen(false)}
                className="px-3 py-1.5 rounded-md bg-white/10 text-sm hover:bg-white/15"
              >
                Close
              </button>
            </div>
          </div>
          {programError && <p className="px-4 py-2 text-sm text-red-300">{programError}</p>}
          <textarea
            className="flex-1 min-h-[120px] w-full bg-black/40 font-mono text-xs p-3 resize-y outline-none border-0 text-white/90"
            value={programJson}
            onChange={(e) => setProgramJson(e.target.value)}
            spellCheck={false}
          />
        </div>
      )}

      {previewKind && !cleanViewMode && (
        <div className="fixed bottom-6 left-4 right-4 z-40 flex justify-center pointer-events-none">
          <div className="pointer-events-auto flex max-w-2xl flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-2xl border border-white/10 bg-zinc-950/90 px-4 py-3 text-center text-sm text-white/90 shadow-2xl backdrop-blur-md">
            <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs font-semibold text-cyan-100/95">
              Preview
            </span>
            <span className="text-white/85">{previewLabelForViewKind(previewKind)}</span>
            <span className="hidden sm:inline text-white/40" aria-hidden>
              ·
            </span>
            <span className="text-white/55">
              Remove the <span className="text-cyan-200/90">view</span> query to run your saved program.
            </span>
            <Link
              href={`/o/${slug}/announcements/display`}
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white hover:bg-white/18"
            >
              Full program
            </Link>
          </div>
        </div>
      )}

      <DisplayProgramOrchestrator
        orgSlug={slug}
        program={effectiveProgram}
        allAnnouncements={announcements}
        workshops={workshops}
        artists={artists}
        cleanViewMode={cleanViewMode}
      />
    </div>
  );
}

export default function AnnouncementDisplayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      }
    >
      <AnnouncementDisplayPageInner />
    </Suspense>
  );
}
