import { useAnimatedStyle, interpolate, interpolateColor, Extrapolation, SharedValue } from 'react-native-reanimated';
import { Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('screen');

export function usePlayerAnimations({sharedHeight, activeMusic, translatedX}:{sharedHeight:SharedValue<number>,activeMusic:Music,translatedX:SharedValue<number>}) {
  const containerStyle = useAnimatedStyle(() => ({
    height: sharedHeight.value,
    bottom: interpolate(sharedHeight.value, [80, SCREEN_HEIGHT], [60, 0]),
    backgroundColor: interpolateColor(
      sharedHeight.value,
      [80, 120, SCREEN_HEIGHT],
      ["#171717", activeMusic?.musicVibrantColor || "#171717", activeMusic?.musicVibrantColor || "#171717"]
    )
  }));

  const navBarStyle = useAnimatedStyle(() => {
    const height = interpolate(sharedHeight.value, [120, SCREEN_HEIGHT], [10, 80]);
    const opacity = interpolate(sharedHeight.value, [SCREEN_HEIGHT * 0.75, SCREEN_HEIGHT], [0, 1], Extrapolation.CLAMP);
    const display = sharedHeight.value < 120 ? 'none' : 'flex';
    const translateY = interpolate(sharedHeight.value, [80, SCREEN_HEIGHT], [-100, 0]);

    return { height, opacity, transform: [{ translateY }], display };
  });

  const wrapperStyle = useAnimatedStyle(() => ({
    opacity: interpolate(sharedHeight.value, [80, 88, SCREEN_HEIGHT], [1, 0, 0], Extrapolation.CLAMP)
  }));

  return { containerStyle, navBarStyle, wrapperStyle };
}
