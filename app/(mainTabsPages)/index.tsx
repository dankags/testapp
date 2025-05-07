import { Stack } from "expo-router";
import { StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
  <>
    {/* <StatusBar backgroundColor={"rgb(255,255,25)"} barStyle={"dark-content"}/> */}
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
    
        <Text className='text-white'>Edit app/index.tsx to edit this screen.</Text>
        
      </SafeAreaView>
  </>
  );
}
