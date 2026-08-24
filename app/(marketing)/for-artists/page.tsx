import { redirect } from 'next/navigation';

export default function ForArtistsRedirectPage() {
  redirect('/network/signup?pathway=index');
}
