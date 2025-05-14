import { useAnimatedStyle, interpolate, interpolateColor, Extrapolation, SharedValue } from 'react-native-reanimated';
import { Dimensions } from 'react-native';

type useMiniPlayerAnimationsProps= { 
    sharedHeight: SharedValue<number>,
     activeMusic: Music,
      translatedX: SharedValue<number>,
      tabsHeight:SharedValue<number>,
      safeAreaHeight:SharedValue<number>
}

const { height: SCREEN_HEIGHT } = Dimensions.get('screen');

export function useMiniPlayerAnimations({
  sharedHeight,
   activeMusic,
   translatedX, 
   tabsHeight,
   safeAreaHeight
  }:useMiniPlayerAnimationsProps) {

  // Animates the main container (Mini-player) background color and vertical position  
  const containerStyle = useAnimatedStyle(() => ({
    overflow:"hidden",
    height: sharedHeight.value,
    bottom: interpolate(sharedHeight.value, [80, SCREEN_HEIGHT], [60, 0]),
    backgroundColor: interpolateColor(
      sharedHeight.value,
      [80, 120, SCREEN_HEIGHT],
      ["#171717", activeMusic?.musicVibrantColor || "#171717", activeMusic?.musicVibrantColor || "#171717"]
    )
  }));

  // Animates the mini-player navigation bar's position, height, opacity, and visibility based on sharedHeight or tabsHeight
  const navBarStyle = useAnimatedStyle(() => {
    if(sharedHeight.value<SCREEN_HEIGHT){
      const height = interpolate(sharedHeight.value, [120, SCREEN_HEIGHT], [10, 60]);
    const opacity = interpolate(sharedHeight.value, [SCREEN_HEIGHT * 0.75, SCREEN_HEIGHT], [0, 1], Extrapolation.CLAMP);
    const display = sharedHeight.value < 120 ? 'none' : 'flex';
    const translateY = interpolate(sharedHeight.value, [80, SCREEN_HEIGHT], [-100, 0]);

    return { 
      height,
      opacity,
      transform: [{ translateY }],
      display 
    };
  }

    const translateY=interpolate(tabsHeight.value,[64,safeAreaHeight.value-80],[0,-160])
    const opacity=interpolate(tabsHeight.value,[64,safeAreaHeight.value*0.4,safeAreaHeight.value-80],[1,0.2,0])
    
    return{
      transform:[{translateY}],
      opacity,
    }

  });

  // Controls the opacity of a wrapper view based on sharedHeight (useful for fade out transitions)
  const wrapperStyle = useAnimatedStyle(() => ({
    opacity: interpolate(sharedHeight.value, [80, 88, SCREEN_HEIGHT], [1, 0, 0], Extrapolation.CLAMP)
  }));

  // Animates the height, corner radius, and background of the expanding tab view (Mini-player bottom sheet)
  const animatedHeightTab = useAnimatedStyle(() => {
    const height = interpolate(
      tabsHeight.value,
      [64, safeAreaHeight.value],
      [60, safeAreaHeight.value - 50],
      Extrapolation.CLAMP
    )
    const borderTopLeftRadius=interpolate(
      tabsHeight.value,
      [64, safeAreaHeight.value],
      [0, 12],
      Extrapolation.CLAMP
    )
    const borderTopRightRadius=interpolate(
      tabsHeight.value,
      [64, safeAreaHeight.value],
      [0, 12],
      Extrapolation.CLAMP
    )
    const backgroundColor=interpolateColor(
      tabsHeight.value,
      [64, safeAreaHeight.value/2,safeAreaHeight.value],
      ["transparent", activeMusic.musicVibrantColor ?? '#000000',activeMusic.musicVibrantColor ?? '#000000'],
    )
      const isVisible = sharedHeight.value > SCREEN_HEIGHT * 0.95;
    return {
      height,
      borderTopRightRadius,
      borderTopLeftRadius,
      display:isVisible ? "flex" : "none",
      backgroundColor,
      
    }
  });

  return { containerStyle, navBarStyle, wrapperStyle,animatedHeightTab };
}
