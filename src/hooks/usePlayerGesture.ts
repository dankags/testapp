import { useMemo } from 'react';
import { Dimensions } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { SharedValue, clamp, withTiming, runOnJS } from 'react-native-reanimated';

const SNAP_BOTTOM = 80;

const { height: SCREEN_HEIGHT} = Dimensions.get('screen');
const SNAP_TOP = SCREEN_HEIGHT;

export function usePlayerGestures(tabsHeight:SharedValue<number>,safeAreaHeight:SharedValue<number>,startTabHeight:SharedValue<number>,sharedHeight: SharedValue<number>, startHeight: SharedValue<number>, translatedX: SharedValue<number>, onNavigate: (dir: 'prev' | 'next') => void, setIsPlaying: (val: boolean) => void) {
  const verticalPanGesture = useMemo(() =>
    Gesture.Pan()
  .activateAfterLongPress(200)
  .onBegin(() => {
    startHeight.value = sharedHeight.value;
  })
  .onUpdate(e => {
    sharedHeight.value = clamp(
      startHeight.value - e.translationY,
      SNAP_BOTTOM,
      SNAP_TOP
    );
  })
  .onEnd(e => {
    const isFlickingUp = e.velocityY < -300;
    const isFlickingDown = e.velocityY > 300;

    const halfway = (SCREEN_HEIGHT) / 2;

    let finalSnapPoint = sharedHeight.value;

    if (isFlickingUp) {
      finalSnapPoint = SNAP_TOP;
    } else if (isFlickingDown) {
      finalSnapPoint = SNAP_BOTTOM;
    } else {
      finalSnapPoint = sharedHeight.value > halfway ? 60 : SNAP_BOTTOM;
    }

    sharedHeight.value = withTiming(finalSnapPoint, { duration: 300 });
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

  const bottomSheetPanGesture = useMemo(() => (Gesture.Pan()
    .minDistance(5)
    .activateAfterLongPress(100)
    .onBegin(() => {
      startTabHeight.value = tabsHeight.value;
    })
    .onUpdate((e) => {
      tabsHeight.value = clamp(
        startTabHeight.value - e.translationY,
        SNAP_BOTTOM,
        safeAreaHeight.value
      );
    })
     .onEnd((e)=>{
       const isFlickingUp = e.velocityY < -300;
    const isFlickingDown = e.velocityY > 300;
    const maxHeight = safeAreaHeight.value-70; // use derived or constant if needed
    const halfway = maxHeight / 2;
  
    let finalSnapPoint = startTabHeight.value;
  
    if (isFlickingUp) {
      finalSnapPoint = maxHeight;
    } else if (isFlickingDown) {
      finalSnapPoint = 64;
    } else {
      finalSnapPoint = tabsHeight.value > halfway ? maxHeight : 64;
    }
  
    tabsHeight.value = withTiming(finalSnapPoint, { duration: 300 });
     })), [tabsHeight, startTabHeight, safeAreaHeight])

  return { verticalPanGesture, horizontalPanGesture,bottomSheetPanGesture };
}
