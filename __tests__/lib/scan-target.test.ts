import {
  getValidatedAnnouncementRedirectTarget,
  resolveScanDestination,
  announcementHasScannableDestination,
} from '@/lib/announcements/scan-target';

describe('scan-target', () => {
  it('accepts https URLs', () => {
    expect(getValidatedAnnouncementRedirectTarget('https://oolitearts.org/x')).toBe(
      'https://oolitearts.org/x'
    );
  });

  it('rejects javascript:', () => {
    expect(getValidatedAnnouncementRedirectTarget('javascript:alert(1)')).toBeNull();
  });

  it('rejects localhost', () => {
    expect(getValidatedAnnouncementRedirectTarget('http://localhost:3000/x')).toBeNull();
  });

  it('resolveScanDestination prefers qr over primary', () => {
    expect(
      resolveScanDestination('https://a.example/foo', 'https://b.example/bar')
    ).toBe('https://a.example/foo');
  });

  it('announcementHasScannableDestination', () => {
    expect(
      announcementHasScannableDestination({
        qr_destination_url: null,
        primary_link: 'https://ok.example',
      })
    ).toBe(true);
    expect(
      announcementHasScannableDestination({
        qr_destination_url: '',
        primary_link: '#',
      })
    ).toBe(false);
  });
});
