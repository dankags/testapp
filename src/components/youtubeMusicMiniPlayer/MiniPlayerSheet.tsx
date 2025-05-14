import { View, Text, Pressable, GestureResponderEvent } from 'react-native'
import React from 'react'
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { cn } from '@/src/lib/utils';

type BottomSheetProps={
    bottomSheetPanGesture:any;
    animatedHeightTab:any;
    animateBottomSheetWrapper:any;
    animateTextBottomSheetTabsStyle:any;
    activeMusic:Music,
    expandTab:()=>void;
}

const MiniPlayerBottomSheet = ({activeMusic,animateBottomSheetWrapper,animateTextBottomSheetTabsStyle,animatedHeightTab,bottomSheetPanGesture,expandTab}:BottomSheetProps) => {
    const handleTabPress=({e,tab}:{e:GestureResponderEvent,tab:"lyrics"|"upNext"|"related"})=>{
        expandTab()
    }
  return (
    <GestureDetector gesture={bottomSheetPanGesture}>
            <Animated.View className='w-full absolute bottom-0 ' style={[animatedHeightTab]}>
               {/* <Animated.View className='w-full absolute bottom-0 min-h-[60px] bg-amber-500' > */}
           <Animated.View className='flex-1 relative rounded-xl' style={[animateBottomSheetWrapper]}>
              <View className="w-full flex-1 flex-row justify-center items-end absolute top-0">
            <Pressable  onPress={(e)=>handleTabPress({e, tab: "upNext"})} className="w-4/12 px-3 py-4 flex-row justify-center items-center">
              <Animated.Text className="text-lg font-semibold "  style={[animateTextBottomSheetTabsStyle]}>
                UP NEXT
              </Animated.Text>
            </Pressable>
            <Pressable disabled={!activeMusic.lyrics}  onPress={(e)=>handleTabPress({e, tab: "lyrics"})} className="w-4/12  px-3 py-4 flex-row justify-center items-center">
              {activeMusic.lyrics?
              <Animated.Text
                className={cn(
                  "text-lg font-semibold text-neutral-600",
                  activeMusic.lyrics && "text-neutral-400"
                )}
                 style={[animateTextBottomSheetTabsStyle]}
              >
                LYRICS
              </Animated.Text>
              :
                <Text
                className={cn(
                  "text-lg font-semibold text-neutral-600",
                )}
              >
                LYRICS
              </Text>
              }
            </Pressable>
            <Pressable  onPress={(e)=>handleTabPress({e, tab: "related"})} className="w-4/12 px-3 py-4 flex-row justify-center items-center">
              <Animated.Text className="text-lg font-semibold " style={[animateTextBottomSheetTabsStyle]}>
                RELATED
              </Animated.Text>
            </Pressable>
          </View>
           </Animated.View>
            </Animated.View>       
</GestureDetector>
  )
}

export default MiniPlayerBottomSheet