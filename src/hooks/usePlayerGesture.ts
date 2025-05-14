import { useMemo } from 'react';
import { Dimensions } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { SharedValue, clamp, withTiming, runOnJS } from 'react-native-reanimated';

const SNAP_BOTTOM = 80;

const { height: SCREEN_HEIGHT} = Dimensions.get('screen');
const SNAP_TOP = SCREEN_HEIGHT;

export function usePlayerGestures(tabsHeight:SharedValue<number>,safeAreaHeight:SharedValue<number>,startTabHeight:SharedValue<number>,sharedHeight: SharedValue<number>, startHeight: SharedValue<number>, translatedX: SharedValue<number>, onNavigate: (dir: 'prev' | 'next') => void, setIsPlaying: (val: boolean) => void) {
  // Vertical pan gesture to expand or collapse the shared main mini-player height
  const verticalPanGesture = useMemo(() =>
    Gesture.Pan()
  .activateAfterLongPress(200)// Waits 200ms before activating to prevent conflicts with flatlist swipe or scroll
  .onBegin(() => {
     // Capture current height when gesture starts
    startHeight.value = sharedHeight.value;
  })
  .onUpdate(e => {
     // Update height dynamically during gesture
    sharedHeight.value = clamp(
      startHeight.value - e.translationY,
      SNAP_BOTTOM,
      SNAP_TOP
    );
  })
  .onEnd(e => {
    // Determine gesture direction and apply snap logic
    const isFlickingUp = e.velocityY < -300;
    const isFlickingDown = e.velocityY > 300;

    const halfway = (SCREEN_HEIGHT) / 2;

    let finalSnapPoint = sharedHeight.value;

    if (isFlickingUp) {
      finalSnapPoint = SNAP_TOP;// Snap to full screen
    } else if (isFlickingDown) {
      finalSnapPoint = SNAP_BOTTOM;// Collapse
    } else {
       // Snap based on current height position
      finalSnapPoint = sharedHeight.value < halfway ? 80 : SNAP_TOP;
    }

    sharedHeight.value = withTiming(finalSnapPoint, { duration: 300 });
  }),
    [sharedHeight]
  );
  
// Horizontal pan gesture to navigate between items (e.g., songs/playlists)
// I did not use it since it does not match with the youtube music one
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

  // Bottom sheet gesture to expand/collapse tab height (Mini-player bottom sheet) (e.g. UpNext, lyrics, Related)
  const bottomSheetPanGesture = useMemo(() => (Gesture.Pan()
    .minDistance(5)
    .activateAfterLongPress(100)// Prevent conflicts with vertical pan gesture
    .onBegin(() => {
        // Store starting height
      startTabHeight.value = tabsHeight.value;
    })
    .onUpdate((e) => {
      // Adjust tab height during drag
      tabsHeight.value = clamp(
        startTabHeight.value - e.translationY,
        SNAP_BOTTOM,
        safeAreaHeight.value
      );
    })
     .onEnd((e)=>{
      // Determine if it's a flick or release, then snap accordingly
       const isFlickingUp = e.velocityY < -300;
    const isFlickingDown = e.velocityY > 300;
    const maxHeight = safeAreaHeight.value-70; 
    const halfway = maxHeight / 2;
  
    let finalSnapPoint = startTabHeight.value;
  
    if (isFlickingUp) {
      finalSnapPoint = maxHeight;// Expand fully
    } else if (isFlickingDown) {
      finalSnapPoint = 64;// Collapse to mini mode
    } else {
      // Snap to nearest height based on position
      finalSnapPoint = tabsHeight.value > halfway ? maxHeight : 64;
    }
  
    tabsHeight.value = withTiming(finalSnapPoint, { duration: 300 });
     })), [tabsHeight, startTabHeight, safeAreaHeight])

  return { verticalPanGesture, horizontalPanGesture,bottomSheetPanGesture };
}
