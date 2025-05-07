import { Link } from "expo-router";
import { Dimensions, Text, View } from "react-native";
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle, useDerivedValue } from "react-native-reanimated";
import { GestureDetector, PanGesture } from "react-native-gesture-handler";
import { Image } from "expo-image";



const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');

const AnimatedTrackSetter=({sharedHeight,activeMusic,translatedX,horizontalPanGesture}:{sharedHeight: SharedValue<number>,translatedX: SharedValue<number>,activeMusic:Music,horizontalPanGesture: PanGesture,handlePlayToggle:()=>void,isPlaying:boolean})=>{
  const imageWidth = useDerivedValue(() =>
    interpolate(sharedHeight.value, [80, SCREEN_HEIGHT], [60, SCREEN_WIDTH - 48], Extrapolation.CLAMP)
  );

  const animatedMusicBarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translatedX.value }],
  }));

  const animatedImageWrapper = useAnimatedStyle(() => {
    const translateX = interpolate(sharedHeight.value, [80, SCREEN_HEIGHT], [0, (SCREEN_WIDTH - (imageWidth.value + 24)) / 2], Extrapolation.CLAMP);
    // const translateY = interpolate(sharedHeight.value,[200,SCREEN_HEIGHT],[0,100])
    const borderRadius=interpolate(sharedHeight.value,[80,SCREEN_HEIGHT],[0,12])
    return {
      width: imageWidth.value,
      aspectRatio: 1,
      transform: [
        { translateX: translateX },
        // { translateY: translateY }
      ],
      borderRadius,
    };
  });

  const animatedMusicInfo = useAnimatedStyle(() => {
    const translateY = interpolate(sharedHeight.value, [80, SCREEN_HEIGHT], [0, -100], Extrapolation.CLAMP);
    const opacity = interpolate(sharedHeight.value, [80, SCREEN_HEIGHT * 0.3, 100], [1, 0, 0], Extrapolation.CLAMP);
    const display = sharedHeight.value > 100 ? 'none' : 'flex';
    return { transform: [{ translateY }], opacity, display };
  });


  return(
    <View className="flex-1 ">
    <GestureDetector gesture={horizontalPanGesture}>
      <Animated.View
        className="flex-1 px-3 flex-row items-center justify-start "
        style={animatedMusicBarStyle}
      >
        <View className="flex-row items-center  ">
          <Animated.View
            className="bg-red-300 flex-row justify-center items-center  overflow-hidden"
            style={animatedImageWrapper}
          >
            <Image
              source={activeMusic.coverImage}
              contentFit="cover"
              style={{ width: "100%", height: "100%" }}
            />
          </Animated.View>
          <Animated.View
            className="h-20 w-9/12 justify-center gap-1 px-2 "
            style={animatedMusicInfo}
          >
            <Text className="text-white text-lg font-semibold">
              {activeMusic.name}
            </Text>
            <View className="flex-row items-center">
              {activeMusic.artists.map((artist, index) => (
                <Text key={artist.id} className="text-neutral-400">
                  <Link href={`/`}>{artist.name}</Link>
                  {index < activeMusic.artists.length - 1 && " • "}
                </Text>
              ))}
            </View>
          </Animated.View>
        </View>
      </Animated.View>
    </GestureDetector>
  </View>
  )
}

export default AnimatedTrackSetter