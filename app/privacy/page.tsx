import { redirect } from 'next/navigation';

export default function OldPrivacyRedirect() {
  redirect('/legal/privacy');
}