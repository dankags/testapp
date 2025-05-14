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
import AnimatedControlsMusicInfo from './MusicPlayerControls';
import AnimatedTrackSetter from './MusicFlatList';
import { usePlayerState } from '@/src/hooks/usePlayerState';
import { usePlayerGestures } from '@/src/hooks/usePlayerGesture';
import { useMiniPlayerAnimations } from '@/src/hooks/usePlayerAnimations';
import { cn } from '@/src/lib/utils';
import BottomSheet from './MiniPlayerSheet';

type DefaultMiniPlayerActionButtonsProps= {
  sharedHeight: SharedValue<number>;
  tabHeight:SharedValue<number>,
  safeAreaHeight:SharedValue<number>,
  handlePlayToggle: () => void;
  isPlaying: boolean;
}

const SNAP_BOTTOM = 80;
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');

export default function MiniPlayer({ sharedHeight }: { sharedHeight: SharedValue<number> }) {
  
  const startHeight = useSharedValue(SNAP_BOTTOM);
  const startTabHeight=useSharedValue(0)
  const tabsHeight=useSharedValue(0)
  const translatedX = useSharedValue(0);
  const safeAreaHeight = useSharedValue(0);

  // Expands the tab section by animating `tabsHeight` to fill the screen 
// minus 80px (reserved space like a player or safe area) over 300ms.
  const expandTab = useCallback(() => {
  
    tabsHeight.value = withTiming(safeAreaHeight.value - 80, { duration: 300 });
}, [tabsHeight,safeAreaHeight]);

// Resets the shared height to the bottom snap position (collapsed state)
// using a smooth animation over 600ms.
  const handleResetHeight = useCallback(() => {
    sharedHeight.value = withTiming(SNAP_BOTTOM, {
        duration:600
    });
  }, [sharedHeight]);

  // Expands the shared height to full screen height (expanded state)
// using a smooth animation over 600ms.
  const handleExpandHeight=useCallback(() => {
    sharedHeight.value = withTiming(SCREEN_HEIGHT, {
        duration:600
    });
  }, [sharedHeight]);

  // Mini-player actual state
  const { isPlaying, togglePlay, activeMusic, navigateTrack, setIsPlaying } = usePlayerState();

  // All mini-player Gestures
  const { verticalPanGesture, horizontalPanGesture,bottomSheetPanGesture } = usePlayerGestures(
    tabsHeight, safeAreaHeight, startTabHeight, sharedHeight, startHeight, translatedX, navigateTrack, setIsPlaying
  );

//All mini-player animations 
  const { containerStyle, navBarStyle, wrapperStyle,animatedHeightTab } = useMiniPlayerAnimations({
    sharedHeight, activeMusic, translatedX,safeAreaHeight,tabsHeight
  });

// set the safeArea height on safeArea layout change 
const handleSafeAreaHeight=useCallback((e:LayoutChangeEvent)=>{
    const { height } = e.nativeEvent.layout;
    safeAreaHeight.value=height
},[])

// 
const animateTextBottomSheetTabsStyle=useAnimatedStyle(()=>{
  const color=interpolateColor(tabsHeight.value,[safeAreaHeight.value*0.15,safeAreaHeight.value-80],["#a3a3a3","white"])
  return{
    color,
  }
})

// Animates the background color of the mini-player bottom sheet
// based on the current `tabsHeight` value.
const animateBottomSheetWrapper=useAnimatedStyle(()=>{
  const backgroundColor=interpolateColor(tabsHeight.value,[64,safeAreaHeight.value*0.4,safeAreaHeight.value-80],["transparent","#17171780","#17171780"])
  return{
    backgroundColor
  }
})

// Animates the vertical position of the player container
// - Slides it up from -46 to 0 as `sharedHeight` grows from 80 to full screen height.
const animatePlayerContainer=useAnimatedStyle(()=>{
 
    const translateY=interpolate(sharedHeight.value,[80,SCREEN_HEIGHT],[-46,0])
    return{
      transform:[{translateY}],
    }
})

  // === Render ===

  return (
    <GestureDetector gesture={verticalPanGesture}>
      <Animated.View
        entering={FadeIn.duration(300)}
        className={"w-full absolute bottom-20  z-10 "}
        style={[containerStyle]}
      >
          <SafeAreaView onLayout={(e)=>handleSafeAreaHeight(e)}  className="flex-1  bg-neutral-900/80">
           {/* player container */}
            <Animated.View className={cn('min-h-20 w-full flex-1 ')} style={[animatePlayerContainer]}>
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
            <DefaultMiniPlayerActionButtons
              handlePlayToggle={togglePlay}
              sharedHeight={sharedHeight}
              isPlaying={isPlaying}
              tabHeight={tabsHeight}
              safeAreaHeight={safeAreaHeight}
            />

         

          </Animated.View>

            {/* bottom sheet */}
           <BottomSheet
            activeMusic={activeMusic}
            animateBottomSheetWrapper={animateBottomSheetWrapper}
            animateTextBottomSheetTabsStyle={animateTextBottomSheetTabsStyle}
            animatedHeightTab={animatedHeightTab}
            bottomSheetPanGesture={bottomSheetPanGesture}
            expandTab={expandTab}
           />


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

const DefaultMiniPlayerActionButtons = ({
  sharedHeight,
  handlePlayToggle,
  isPlaying,
  tabHeight,
  safeAreaHeight,
}:DefaultMiniPlayerActionButtonsProps) => {
  // Animates the Mini Player's visibility, position, and display based on layout state.
  // when the sharedHeight and tabHeight changes
  const animatedMiniPlayerStyles = useAnimatedStyle(() => {
   if(sharedHeight.value<SCREEN_HEIGHT){ 
    const translateY=interpolate(
      sharedHeight.value,
      [80, SCREEN_HEIGHT],
      [12,0],
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
      [80, safeAreaHeight.value-80],
      [0,14],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      tabHeight.value,
      [64, safeAreaHeight.value * 0.5, safeAreaHeight.value-80],
      [0,0,1],
      Extrapolation.CLAMP
    );
    const display = tabHeight.value < safeAreaHeight.value*0.5 ? "none" : "flex";
    return { opacity, display,transform:[{translateY}] };

  });


  return (
    <Animated.View
      className="absolute  right-0 flex-1 w-3/12 flex-row items-center justify-end gap-3 px-2  "
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
