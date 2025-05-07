import { useMemo } from 'react';
import { Dimensions } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { SharedValue, clamp, withTiming, runOnJS } from 'react-native-reanimated';

const SNAP_BOTTOM = 80;

const { height: SCREEN_HEIGHT} = Dimensions.get('screen');
const SNAP_TOP = SCREEN_HEIGHT;

export function usePlayerGestures(sharedHeight: SharedValue<number>, startHeight: SharedValue<number>, translatedX: SharedValue<number>, onNavigate: (dir: 'prev' | 'next') => void, setIsPlaying: (val: boolean) => void) {
  const verticalPanGesture = useMemo(() =>
    Gesture.Pan()
      .activateAfterLongPress(300)
      .minVelocityY(20)
      .onBegin(() => {
        startHeight.value = sharedHeight.value;
      })
      .onUpdate(e => {
        sharedHeight.value = clamp(startHeight.value - e.translationY, SNAP_BOTTOM, SNAP_TOP);
      })
      .onEnd(e => {
        const shouldExpand = e.velocityY < -200 || sharedHeight.value > SCREEN_HEIGHT / 2;
        sharedHeight.value = withTiming(shouldExpand ? SNAP_TOP : SNAP_BOTTOM, { duration: 400 });
      }),
    [sharedHeight]
  );

  const horizontalPanGesture = useMemo(() =>
    Gesture.Pan()
      .onUpdate(e => {
        translatedX.value = e.translationX;
      })
      .onEnd(() => {
        if (translatedX.value > 100) runOnJS(onNavigate)("prev");
        else if (translatedX.value < -100) runOnJS(onNavigate)("next");
        translatedX.value = 0;
        runOnJS(setIsPlaying)(false);
      }),
    [onNavigate]
  );

  return { verticalPanGesture, horizontalPanGesture };
}
