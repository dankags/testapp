import React, { memo, useEffect, useRef } from "react";
import { Animated,  View } from "react-native";


interface ProgressBarProps {
  duration: number; // in ms
  isActive: boolean;
  isPlaying: boolean;
  wrapperWidth: number;
  activeMusic:Music
}

const CustomProgressBar: React.FC<ProgressBarProps> = memo(({
  duration,
  isActive,
  isPlaying,
  wrapperWidth,
 activeMusic
}) => {
  

  const widthAnim = useRef(new Animated.Value(-wrapperWidth)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef<number>(0);



  useEffect(() => {
    if (isActive && isPlaying) {
      // Start animation from current progress
      const elapsedTime = elapsedRef.current;
      const remainingDuration = Math.max(duration - elapsedTime, 0);

      // Record the start time
      startTimeRef.current = Date.now() - elapsedTime;

      animationRef.current = Animated.timing(widthAnim, {
        toValue: 0,
        duration: remainingDuration,
        useNativeDriver: false,
      });

      animationRef.current.start(({ finished }) => {
        if (finished) {
          // Reset tracking when complete
          startTimeRef.current = null;
          elapsedRef.current = 0;
        }
      });
    }

    if (!isPlaying) {
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }

      const now = Date.now();
      if (startTimeRef.current !== null) {
        elapsedRef.current = now - startTimeRef.current;
      }
    }

    return () => {
      animationRef.current?.stop();
    };
  }, [isActive, isPlaying, wrapperWidth]);

  useEffect(() => {
    // Stop current animation
    animationRef.current?.stop();
    animationRef.current = null;
  
    // Reset animation state
    widthAnim.setValue(-wrapperWidth);
    elapsedRef.current = 0;
    startTimeRef.current = null;
  }, [activeMusic]);

  return (
    <View
      className="h-[2px] bg-white/30 mx-1 overflow-hidden rounded justify-center items-center"
      style={[{ width: wrapperWidth }]}
    >
      <Animated.View
        testID="progress-animated"
        style={{
          width: wrapperWidth,
          transform: [{ translateX: widthAnim }],
          backgroundColor:"white",
          height:3,
          borderRadius:6,
        }}
      />
    </View>
  );
});

 CustomProgressBar.displayName="CustomProgressBar"


export default CustomProgressBar;
