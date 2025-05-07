import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from "expo-router";
import { ActivityIndicator, useColorScheme } from "react-native";
import {  Roboto_300Light, Roboto_400Regular, Roboto_500Medium, Roboto_600SemiBold, Roboto_700Bold, Roboto_800ExtraBold } from '@expo-google-fonts/roboto';
import { useFonts } from "expo-font";
import "./global.css";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? "dark";
  const [fontsLoaded] = useFonts({
    Roboto_Light:Roboto_300Light, 
    Roboto_Regular:Roboto_400Regular, 
    Roboto_Medium:Roboto_500Medium, 
    Roboto_SemiBold:Roboto_600SemiBold, 
    Roboto_Bold:Roboto_700Bold, 
    Roboto_ExtraBold:Roboto_800ExtraBold, 
  });

  
 if(!fontsLoaded){
   return null
 }


  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}


