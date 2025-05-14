import { Stack } from "expo-router";
import { StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
  <>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor:"#0a0a0a"
        }}
      >
        <Stack.Screen options={{
          presentation:"formSheet",
          sheetAllowedDetents:"fitToContents",
          contentStyle:{
            backgroundColor:"red"
          }
        }}/>
    
        <Text className='text-white'>This is the HomePage.</Text>
        
      </SafeAreaView>
  </>
  );
}
