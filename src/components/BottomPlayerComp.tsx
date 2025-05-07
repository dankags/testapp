import { View, Dimensions, TouchableOpacity} from 'react-native';
import React, { useCallback, useState } from 'react';
import {  GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  FadeIn,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import CustomProgressBar from './customProgressBar';
import CustomIcon from './Customicon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dummyMusicData } from '../constants/data';
import AnimatedControlsMusicInfo from './AnimatedControlsMusicInfo';
import AnimatedTrackSetter from './AnimatedTrackSetter';
import { usePlayerState } from '../hooks/usePlayerState';
import { usePlayerGestures } from '../hooks/usePlayerGesture';
import { usePlayerAnimations } from '../hooks/usePlayerAnimations';

const SNAP_BOTTOM = 80;

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');
const { height: WINDOW_HEIGHT } = Dimensions.get('window');


const AnimatedMiniPlayer = ({
  sharedHeight,
  handlePlayToggle,
  isPlaying,
}: {
  sharedHeight: SharedValue<number>;
  handlePlayToggle: () => void;
  isPlaying: boolean;
}) => {
  const animatedMiniPlayerStyles = useAnimatedStyle(() => {
    const opacity = interpolate(
      sharedHeight.value,
      [80, SCREEN_HEIGHT * 0.2, SCREEN_HEIGHT],
      [1, 0.5, 0],
      Extrapolation.CLAMP
    );
    const display = sharedHeight.value > 200 ? "none" : "flex";
    return { opacity, display };
  });
  return (
    <Animated.View
      className="absolute top-1 right-0 h-20 w-3/12 flex-row items-center justify-end gap-3 px-3"
      style={animatedMiniPlayerStyles}
    >
      <TouchableOpacity className="p-2 rounded-full">
        <CustomIcon
          iconLibraryType="MaterialIcons"
          iconName="cast"
          size={24}
          color="white"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePlayToggle} className="p-2 rounded-full">
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

export default function BottomPlayerComp({ sharedHeight }: { sharedHeight: Animated.SharedValue<number> }) {
  
  const startHeight = useSharedValue(SNAP_BOTTOM);
  const translatedX = useSharedValue(0);

  const handleResetHeight = useCallback(() => {
    sharedHeight.value = withTiming(SNAP_BOTTOM, {
        duration:600
    });
  }, [sharedHeight]);

  // ==UseEffects==
  // useEffect(()=>{
  //    setIsPlaying(bufferingDuringPlay || false)
  // },[bufferingDuringPlay])

  const {
    isPlaying,
    togglePlay,
    activeMusic,
    navigateTrack,
    setIsPlaying,
  } = usePlayerState();

  const { verticalPanGesture, horizontalPanGesture } = usePlayerGestures(
    sharedHeight, startHeight, translatedX, navigateTrack, setIsPlaying
  );
  
  const { containerStyle, navBarStyle, wrapperStyle } = usePlayerAnimations({
    sharedHeight, activeMusic, translatedX
  });

  // === Render ===

  return (
    <GestureDetector gesture={verticalPanGesture}>
      <Animated.View
        entering={FadeIn.duration(300)}
        style={[
          {
            width: "100%",
            position: "absolute",
            zIndex: 10,
          },
          containerStyle,
        ]}
      >
        <View className="flex-1 relative justify-end bg-neutral-900/80">
          <SafeAreaView
            className="flex-1 relative"
            style={{ maxHeight: WINDOW_HEIGHT }}
          >
             {/* Top Nav */}
            <Animated.View
              className=" w-full flex-row items-center justify-between px-3 overflow-hidden"
              style={navBarStyle}
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
             activeMusic={activeMusic}
             handlePlayToggle={togglePlay}
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
            handleResetHeight={handleResetHeight}
            handleNext={()=>navigateTrack("next")}
            handlePrevious={()=>navigateTrack("prev")}
            handlePlayToggle={togglePlay}
           />

            {/* Mini Controls (bottom right corner) */}
            <AnimatedMiniPlayer
             handlePlayToggle={togglePlay}
             sharedHeight={sharedHeight}
             isPlaying={isPlaying}
            />
          </SafeAreaView>

          {/* Progress Bar */}
          <Animated.View
            className="absolute bottom-0 z-20"
            style={wrapperStyle}
          >
            <CustomProgressBar
              duration={activeMusic.duration * 1000}
              isPlaying={isPlaying}
              wrapperWidth={SCREEN_WIDTH}
              isActive
              activeMusic={activeMusic}
            />
          </Animated.View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
