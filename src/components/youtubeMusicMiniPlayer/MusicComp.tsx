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
  safeAreaHeight:SharedValue<number>
}) => {

  // Animation for the entire music bar container based on scroll and height state
  const animatedMusicBarStyle = useAnimatedStyle(() => {
      const position = index * SCREEN_WIDTH;
    const inputRange = [position - SCREEN_WIDTH, position, position + SCREEN_WIDTH];

    // Scale and opacity change smoothly as user scrolls horizontally
    const scale = interpolate(scrollX.value, inputRange, [0.9, 1, 0.9], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.6, 1, 0.6], Extrapolation.CLAMP);
   
    // When player is not fullscreen
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

      // When player is fullscreen or expanded
    const height= interpolate(tabsHeight.value, [64,safeAreaHeight.value-80], [510, 60])
    return {
      opacity,
      scale,
      transform: [{ translateX: translatedX.value }],
      width: SCREEN_WIDTH,
      height,
    };
  });

// Animation for the outer image container wrapper (controls its size)
  const animatedImageContainerWrapper = useAnimatedStyle(() => {
    const width = interpolate(imageWidth.value, [60, SCREEN_WIDTH], [60, SCREEN_WIDTH - 24]);
    const height = interpolate(imageWidth.value, [60, SCREEN_WIDTH], [60, 510]);
    return { width, height };
  });

  
 // Animation for the inner image (album art), adjusting width and border radius
  const animatedImageContainer = useAnimatedStyle(() => {
   
    if(sharedHeight.value<SCREEN_HEIGHT){
      const width = interpolate(imageWidth.value, [60, SCREEN_WIDTH], [60, 460]);
      const borderRadius=interpolate(sharedHeight.value, [64, SCREEN_HEIGHT], [0, 12])
      return{
        width,
        aspectRatio:1,
        borderRadius,
      }  
    }else{
      const width = interpolate(imageWidth.value, [60, SCREEN_WIDTH], [50, 460]);
      const borderRadius=interpolate(tabsHeight.value, [64,safeAreaHeight.value-80], [12, 0])
      return { width, aspectRatio: 1,borderRadius };
    }
  });


// Animation for the song title/artist text info
  const animatedMusicInfo = useAnimatedStyle(() => {
    if(sharedHeight.value<SCREEN_HEIGHT){
      const translateY = interpolate(sharedHeight.value, [80, SCREEN_HEIGHT], [0, -100], Extrapolation.CLAMP);
      const opacity = interpolate(sharedHeight.value, [80, SCREEN_HEIGHT * 0.3, 100], [1, 0, 0], Extrapolation.CLAMP);
      const display = sharedHeight.value > 100 ? 'none' : 'flex';
      
      return { transform: [{ translateY }], opacity, display,gap:4 };
    }
    const display=tabsHeight.value>safeAreaHeight.value*0.833?"flex":"none"
    
    const translateY = interpolate(tabsHeight.value, [64, safeAreaHeight.value-80], [-10,0], Extrapolation.CLAMP);
    const opacity = interpolate(tabsHeight.value, [64,safeAreaHeight.value*0.833 ,safeAreaHeight.value-80], [0,0,1], Extrapolation.CLAMP);
    return { transform: [{ translateY }], opacity,display,gap:0 };
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
        <Animated.View className="h-20 w-9/12 justify-center  px-2" style={[animatedMusicInfo]}>
          <Text className="text-white  font-semibold">{music.name}</Text>
          <View className="flex-row  items-center">
            {music.artists.map((artist, index) => (
              <Text key={artist.id} className=" text-neutral-400">
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