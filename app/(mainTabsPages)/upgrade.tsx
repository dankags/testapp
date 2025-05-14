import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function UpgradeScreen() {
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
    
         
             <Text className='text-white'>This is the UpgradePage.</Text>
             
           </SafeAreaView>
       </>
  )
}