import { Image } from "expo-image";
import { memo } from "react";
import { Dimensions, Text, View } from "react-native";
import Animated, { DerivedValue, Extrapolation, interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');

const MusicComponent = memo(({
  music,
  sharedHeight,
  translatedX,
  imageWidth,
  index,
  tabsHeight,
  scrollX,
  safeAreaHeight,
}: {
  music: Music;
  index: number;
  imageWidth: DerivedValue<number>;
  sharedHeight: SharedValue<number>;
  translatedX: SharedValue<number>;
  scrollX: SharedValue<number>;
  tabsHeight:SharedValue<number>
  safeAreaHeight:number
}) => {
  const animatedMusicBarStyle = useAnimatedStyle(() => {
      const position = index * SCREEN_WIDTH;
    const inputRange = [position - SCREEN_WIDTH, position, position + SCREEN_WIDTH];
    const scale = interpolate(scrollX.value, inputRange, [0.9, 1, 0.9], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.6, 1, 0.6], Extrapolation.CLAMP);
    // const translateY = interpolate(scrollX.value, inputRange, [20, 0, 20], Extrapolation.CLAMP);
    // const translateY = interpolate(scrollX.value, inputRange, [20, 0, 20], Extrapolation.CLAMP);
    if(sharedHeight.value<SCREEN_HEIGHT){
      const height=interpolate(imageWidth.value, [60, SCREEN_WIDTH], [60, 510])
     return {
       opacity,
       scale,
       transform: [{ translateX: translatedX.value }],
       width: SCREEN_WIDTH,
       height,
     };
    }
    const height= interpolate(tabsHeight.value, [64,safeAreaHeight-80], [510, 60])
    return {
      opacity,
      scale,
      transform: [{ translateX: translatedX.value }],
      width: SCREEN_WIDTH,
      height,
    };
  });


  const animatedImageContainerWrapper = useAnimatedStyle(() => {
    const width = interpolate(imageWidth.value, [60, SCREEN_WIDTH], [60, SCREEN_WIDTH - 24]);
    const height = interpolate(imageWidth.value, [60, SCREEN_WIDTH], [60, 510]);
    return { width, height };
  });

  

  const animatedImageContainer = useAnimatedStyle(() => {
    const width = interpolate(imageWidth.value, [60, SCREEN_WIDTH], [60, 460]);
    let borderRadius:number = 0
    if(sharedHeight.value===SCREEN_HEIGHT){
      borderRadius=interpolate(tabsHeight.value, [64,safeAreaHeight-80], [12, 0])
     
    }else{
       borderRadius=interpolate(sharedHeight.value, [64,safeAreaHeight-80], [0 ,12])
    }
    return { width, aspectRatio: 1,borderRadius };
  });



  const animatedMusicInfo = useAnimatedStyle(() => {
    if(sharedHeight.value<SCREEN_HEIGHT){
      const translateY = interpolate(sharedHeight.value, [80, SCREEN_HEIGHT], [0, -100], Extrapolation.CLAMP);
      const opacity = interpolate(sharedHeight.value, [80, SCREEN_HEIGHT * 0.3, 100], [1, 0, 0], Extrapolation.CLAMP);
      const display = sharedHeight.value > 100 ? 'none' : 'flex';
      
      return { transform: [{ translateY }], opacity, display };
    }
    const display=tabsHeight.value>safeAreaHeight*0.833?"flex":"none"
    const translateY = interpolate(tabsHeight.value, [64, safeAreaHeight-80], [-10,0], Extrapolation.CLAMP);
    const opacity = interpolate(tabsHeight.value, [64,safeAreaHeight*0.833 ,safeAreaHeight-80], [0,0,1], Extrapolation.CLAMP);
    return { transform: [{ translateY }], opacity,display };
  });

 

  return (
    <Animated.View className="px-3 flex-row items-center  " style={[animatedMusicBarStyle]}>
      <View className="flex-1 flex-row items-center ">
        <Animated.View className="flex-row justify-center items-center overflow-hidden" style={[animatedImageContainerWrapper]}>
          <Animated.View className="overflow-hidden" style={[animatedImageContainer]}>
            <Image
              source={music.coverImage}
              contentFit="cover"
              style={{ width: "100%", height: "100%" }}
            />
          </Animated.View>
        </Animated.View>
        <Animated.View className="h-20 w-9/12 justify-center gap-1 px-2" style={[animatedMusicInfo]}>
          <Text className="text-white text-lg font-semibold">{music.name}</Text>
          <View className="flex-row items-center">
            {music.artists.map((artist, index) => (
              <Text key={artist.id} className="text-neutral-400">
                {artist.name}
                {index < music.artists.length - 1 && " • "}
              </Text>
            ))}
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );
});

MusicComponent.displayName="MusicComponent"

export default MusicComponent