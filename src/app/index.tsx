import { Redirect } from 'expo-router';

/** App entry point — redirects straight to the campaigns list (skip auth for MVP) */
export default function Index() {
  return <Redirect href="/(main)/campaigns" />;
}
