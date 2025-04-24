import React from 'react'
import { Stack } from "expo-router";

export default function RootLayout() {
  // global provider define here for the application

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="screen/FilterModal" options={{ presentation: 'modal', headerTitle: "Filter" }} />
      <Stack.Screen name="screen/SortingScreen" options={{ presentation: 'modal', headerTitle: "Sorting" }} />
    </Stack>
  )
}
