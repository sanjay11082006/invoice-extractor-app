import LandingPage from '@/components/LandingPage';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { userId } = await auth();

  // If the user is already logged in, send them straight to the app
  if (userId) {
    redirect('/dashboard');
  }

  return <LandingPage />;
}
