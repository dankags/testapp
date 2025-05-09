import { View, Dimensions, TouchableOpacity,  Text, Pressable, LayoutChangeEvent } from 'react-native';
import React, { useCallback, useState } from 'react';
import {   GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  FadeIn,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import CustomProgressBar from './customProgressBar';
import CustomIcon from '../Customicon';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedControlsMusicInfo from './AnimatedControlsMusicInfo';
import AnimatedTrackSetter from './AnimatedTrackSetter';
import { usePlayerState } from '@/src/hooks/usePlayerState';
import { usePlayerGestures } from '@/src/hooks/usePlayerGesture';
import { usePlayerAnimations } from '@/src/hooks/usePlayerAnimations';
import { cn } from '@/src/lib/utils';

const SNAP_BOTTOM = 80;
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');

export default function BottomPlayerComp({ sharedHeight }: { sharedHeight: SharedValue<number> }) {
  
  const startHeight = useSharedValue(SNAP_BOTTOM);
  const startTabHeight=useSharedValue(0)
  const tabsHeight=useSharedValue(0)
  const translatedX = useSharedValue(0);
  const [safeAreaHeight,setSafeAreHeight]=useState<number>(0)

  const expandTab = useCallback(() => {
  
    tabsHeight.value = withTiming(safeAreaHeight - 80, { duration: 300 });
}, [tabsHeight,safeAreaHeight]);

  const handleResetHeight = useCallback(() => {
    sharedHeight.value = withTiming(SNAP_BOTTOM, {
        duration:600
    });
  }, [sharedHeight]);

  const handleExpandHeight=useCallback(() => {
    sharedHeight.value = withTiming(SCREEN_HEIGHT, {
        duration:600
    });
  }, [sharedHeight]);

  const { isPlaying, togglePlay, activeMusic, navigateTrack, setIsPlaying } = usePlayerState();

  const { verticalPanGesture, horizontalPanGesture,bottomSheetPanGesture } = usePlayerGestures(
    tabsHeight, safeAreaHeight, startTabHeight, sharedHeight, startHeight, translatedX, navigateTrack, setIsPlaying
  );
  
  const { containerStyle, navBarStyle, wrapperStyle,animatedHeightTab } = usePlayerAnimations({
    sharedHeight, activeMusic, translatedX,safeAreaHeight,tabsHeight
  });

const handleSafeAreaHeight=useCallback((e:LayoutChangeEvent)=>{
    const { height } = e.nativeEvent.layout;
    setSafeAreHeight(height);
},[])

const animateTextBottomSheetTabsStyle=useAnimatedStyle(()=>{
  const color=interpolateColor(tabsHeight.value,[safeAreaHeight*0.15,safeAreaHeight-80],["#a3a3a3","white"])
  return{
    color,
  }
})

const animateBottomSheetWrapper=useAnimatedStyle(()=>{
  const backgroundColor=interpolateColor(tabsHeight.value,[64,safeAreaHeight*0.4,safeAreaHeight-80],["transparent","#17171780","#17171780"])
  return{
    backgroundColor
  }
})

  // === Render ===

  return (
    <GestureDetector gesture={verticalPanGesture}>
      <Animated.View
        entering={FadeIn.duration(300)}
        className={"w-full absolute bottom-20  z-10 "}
        // style={{bottom:100,backgroundColor:"#fcd34d",height:80,overflow:"hidden"}}
        style={[containerStyle]}
      >
        {/* <Text className='text-white flex-1'>hythgghg</Text>
      */}
          <SafeAreaView onLayout={(e)=>handleSafeAreaHeight(e)}  className="flex-1 relative bg-neutral-900/80">
           {/* player container */}
            <Animated.View className={cn('flex-1 min-h-fit w-full py-0 my-0')} >
            {/* Top Nav */}
            <Animated.View
              className=" w-full flex-row items-center justify-between px-3 "
              style={[navBarStyle]}
            >
              <TouchableOpacity
                className="p-2 rounded-full"
                onPress={handleResetHeight}
              >
                <CustomIcon
                  iconLibraryType="Feather"
                  iconName="chevron-down"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
              <View className="flex-row items-center justify-center gap-4">
                <TouchableOpacity className="p-2 rounded-full">
                  <CustomIcon
                    iconLibraryType="MaterialIcons"
                    iconName="cast"
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
                <TouchableOpacity className="p-2 rounded-full">
                  <CustomIcon
                    iconLibraryType="Feather"
                    iconName="more-vertical"
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Music Info and Album Art */}
            <AnimatedTrackSetter
              navigateTrack={(value) => navigateTrack(value)}
              activeMusic={activeMusic}
              tabsHeight={tabsHeight}
              safeAreaHeight={safeAreaHeight}
              handlePlayToggle={togglePlay}
              handleSheetExpansion={handleExpandHeight}
              horizontalPanGesture={horizontalPanGesture}
              isPlaying={isPlaying}
              translatedX={translatedX}
              sharedHeight={sharedHeight}
            />

            {/* Music player */}
            <AnimatedControlsMusicInfo
              activeMusic={activeMusic}
              isPlaying={isPlaying}
              sharedHeight={sharedHeight}
              tabsHeight={tabsHeight}
              safeAreaHeight={safeAreaHeight}
              handleResetHeight={handleResetHeight}
              handleNext={() => navigateTrack("next")}
              handlePrevious={() => navigateTrack("prev")}
              handlePlayToggle={togglePlay}
            />

            {/* </ScrollView> */}

            {/* Mini Controls (bottom right corner) */}
            <AnimatedMiniPlayer
              handlePlayToggle={togglePlay}
              sharedHeight={sharedHeight}
              isPlaying={isPlaying}
              tabHeight={tabsHeight}
              safeAreaHeight={safeAreaHeight}
            />

         

          </Animated.View>

<GestureDetector gesture={bottomSheetPanGesture}>
            <Animated.View className='w-full h-16 relative ' style={[animatedHeightTab]}>
           <Animated.View className='flex-1  rounded-xl' style={[animateBottomSheetWrapper]}>
              <View className="w-full flex-1 flex-row justify-center items-end absolute top-0">
            <Pressable  onPress={() => {
        // setActiveIndex(index);
        expandTab();
      }} className="w-4/12 px-3 py-4 flex-row justify-center items-center">
              <Animated.Text className="text-lg font-semibold "  style={[animateTextBottomSheetTabsStyle]}>
                UP NEXT
              </Animated.Text>
            </Pressable>
            <Pressable disabled={!activeMusic.lyrics}  onPress={() => {
             
        // setActiveIndex(index);
        expandTab();
      }} className="w-4/12  px-3 py-4 flex-row justify-center items-center">
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
            <Pressable  onPress={() => {
        // setActiveIndex(index);
        expandTab();
      }} className="w-4/12 px-3 py-4 flex-row justify-center items-center">
              <Animated.Text className="text-lg font-semibold " style={[animateTextBottomSheetTabsStyle]}>
                RELATED
              </Animated.Text>
            </Pressable>
          </View>
           </Animated.View>
            </Animated.View>       
</GestureDetector>
 {/* Progress Bar */}
          <Animated.View
            className="absolute bottom-0 z-20 flex-row items-center justify-start px-0"
            style={[wrapperStyle]}
          >
            <CustomProgressBar
              duration={activeMusic.duration * 1000}
              isPlaying={isPlaying}
              wrapperWidth={SCREEN_WIDTH}
              isActive
              activeMusic={activeMusic}
            />
          </Animated.View>
          </SafeAreaView>
       
      </Animated.View>
    </GestureDetector>
  );
}

const AnimatedMiniPlayer = ({
  sharedHeight,
  handlePlayToggle,
  isPlaying,
  tabHeight,
  safeAreaHeight,
}: {
  sharedHeight: SharedValue<number>;
  tabHeight:SharedValue<number>,
  safeAreaHeight:number,
  handlePlayToggle: () => void;
  isPlaying: boolean;
}) => {
  const animatedMiniPlayerStyles = useAnimatedStyle(() => {
   if(sharedHeight.value<SCREEN_HEIGHT){ 
    const translateY=interpolate(
      sharedHeight.value,
      [80, SCREEN_HEIGHT],
      [-30,0],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      sharedHeight.value,
      [80, SCREEN_HEIGHT * 0.2, SCREEN_HEIGHT],
      [1, 0.5, 0],
      Extrapolation.CLAMP
    );
    const display = sharedHeight.value > 200 ? "none" : "flex";
    return { opacity, display,transform:[{translateY}] };
  }

   const translateY=interpolate(
      tabHeight.value,
      [80, safeAreaHeight-80],
      [0,18],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      tabHeight.value,
      [64, safeAreaHeight * 0.5, safeAreaHeight-80],
      [0,0,1],
      Extrapolation.CLAMP
    );
    const display = tabHeight.value < safeAreaHeight*0.5 ? "none" : "flex";
    return { opacity, display,transform:[{translateY}] };

  });


  return (
    <Animated.View
      className="absolute  right-0 flex-1 w-3/12 flex-row items-center justify-end gap-3 px-3 overflow-hidden "
      style={[animatedMiniPlayerStyles]}
    >
      <TouchableOpacity className="p-2 rounded-full size-12 flex-row items-center justify-center">
        <CustomIcon
          iconLibraryType="MaterialIcons"
          iconName="cast"
          size={24}
          color="white"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePlayToggle} className="size-12 flex-row items-center justify-center p-2 rounded-full ">
        <CustomIcon
          iconLibraryType={isPlaying ? "Ionicons" : "Foundation"}
          iconName={isPlaying ? "pause" : "play"}
          size={24}
          color="white"
        />
      </TouchableOpacity>
    </Animated.View>
  );
};
