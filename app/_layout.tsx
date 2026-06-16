import { authClient } from "@/lib/auth-client";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'), // Commented out as I don't have this font file
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#000000', // Default to black to prevent flashes
  },
};

import { ConvexReactClient } from 'convex/react';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

import { api } from "@/convex/_generated/api";
import { useAuthenticatedQuery } from '@/hooks/use-authenticated-query';

function RootLayoutNav() {
  const { data: session, isPending } = authClient.useSession();

  const isAuthenticated = !isPending && !!session?.user;
  const hasUsername = !isPending && !!(session?.user as any)?.username;
  const isFullyOnboarded = isAuthenticated && hasUsername;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={CustomTheme}>
        <ConvexBetterAuthProvider client={convex} authClient={authClient}>
          <StackNavigator isAuthenticated={isAuthenticated} hasUsername={hasUsername} isFullyOnboarded={isFullyOnboarded} />
        </ConvexBetterAuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function StackNavigator({ isAuthenticated, hasUsername, isFullyOnboarded }: { isAuthenticated: boolean; hasUsername: boolean; isFullyOnboarded: boolean }) {
  const hasCompletedToday = useAuthenticatedQuery(api.quests.hasCompletedTodaysQuest, {});

  return (
    <Stack>
      {/* Initial Loading Screen */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Onboarding Flow - Accessible anytime during onboarding */}
      <Stack.Screen name="onboarding/splash" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="onboarding/email" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="onboarding/otp" options={{ headerShown: false, gestureEnabled: false }} />

      {/* Username Setup - Only when authenticated but no username */}
      <Stack.Protected guard={isAuthenticated && !hasUsername}>
        <Stack.Screen name="onboarding/username" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="onboarding/permissions" options={{ headerShown: false, gestureEnabled: false }} />
      </Stack.Protected>

      {/* Quest Locked - Show only gate/archive when quest not completed */}
      <Stack.Protected guard={isFullyOnboarded && !hasCompletedToday}>
        <Stack.Screen name="gate" options={{ headerShown: false }} />
        <Stack.Screen name="camera" options={{ headerShown: false }} />
        <Stack.Screen name="uploading" options={{ headerShown: false }} />
        <Stack.Screen name="archive" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* Quest Unlocked - Show all screens when quest completed */}
      <Stack.Protected guard={isFullyOnboarded && hasCompletedToday === true}>
        <Stack.Screen name="lobby" options={{ headerShown: false }} />
        <Stack.Screen name="feed" options={{ headerShown: false, animation: 'slide_from_right', gestureEnabled: true }} />
        <Stack.Screen name="submission" options={{ headerShown: false, presentation: 'transparentModal', animation: 'fade' }} />
        <Stack.Screen name="wrap" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* Modals - Accessible anytime */}
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
