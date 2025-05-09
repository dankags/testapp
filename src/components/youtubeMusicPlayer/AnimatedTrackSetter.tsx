import {
  Dimensions,
  FlatList,
} from "react-native";
import Animated, {
  DerivedValue,
  Extrapolation,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import {
  PanGesture,
  Pressable,
} from "react-native-gesture-handler";
import { dummyMusicData } from "@/src/constants/data";
import { useCallback, useEffect, useRef, useState } from "react";
import MusicComponent from "@/src/components/youtubeMusicPlayer/MusicComp";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("screen");

const AnimatedTrackSetter = ({
  sharedHeight,
  activeMusic,
  translatedX,
  tabsHeight,
  safeAreaHeight,
  navigateTrack,
  handleSheetExpansion,
}: {
  navigateTrack: (trackDirection: "prev" | "next") => void;
  sharedHeight: SharedValue<number>;
  translatedX: SharedValue<number>;
  activeMusic: Music;
  horizontalPanGesture: PanGesture;
  handlePlayToggle: () => void;
  isPlaying: boolean;
  tabsHeight: SharedValue<number>;
  safeAreaHeight: SharedValue<number>;
  handleSheetExpansion: () => void;
}) => {
  const imageWidth = useDerivedValue(() => {
    const isExpanded = sharedHeight.value < SCREEN_HEIGHT;
    const source = isExpanded ? sharedHeight.value : tabsHeight.value;

    return interpolate(
      source,
      isExpanded ? [80, SCREEN_HEIGHT] : [64, safeAreaHeight.value - 80],
      isExpanded ? [60, SCREEN_WIDTH] : [SCREEN_WIDTH, 60],
      Extrapolation.CLAMP
    );
  });

  const animatedActiveMusicContainer = useAnimatedStyle(() => {
    if (sharedHeight.value < SCREEN_HEIGHT) {
      const translateY = interpolate(
        sharedHeight.value,
        [80, SCREEN_HEIGHT],
        [-20, 0],
        Extrapolation.CLAMP
      );
      const height = interpolate(
        sharedHeight.value,
        [80, SCREEN_HEIGHT],
        [80, 510],
        Extrapolation.CLAMP
      );
      return {
        transform: [{ translateY }],
        height,
        width: SCREEN_WIDTH,
      };
    }

    const translateY = interpolate(
      tabsHeight.value,
      [64, safeAreaHeight.value - 80],
      [0, -84],
      Extrapolation.CLAMP
    );
    const height = interpolate(
      tabsHeight.value,
      [64, safeAreaHeight.value - 80],
      [510, 80],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY }],
      height,
    };
  });

  return (
    <Animated.View
      className="flex-row items-center"
      style={[animatedActiveMusicContainer]}
    >
      {/* <GestureList 
      imageWidth={imageWidth}
         sharedHeight={sharedHeight}
         activeMusic={activeMusic}
         translatedX={translatedX}
         horizontalPanGesture={horizontalPanGesture}
      /> */}

      <Pressable onPress={handleSheetExpansion} className="flex-1">
        <QueueFlatlist
          tabsHeight={tabsHeight}
          // imageWidthDepTabHeight={imageWidth}
          activeMusic={activeMusic}
          queueList={dummyMusicData}
          imageWidth={imageWidth}
          safeAreaheight={safeAreaHeight}
          sharedHeight={sharedHeight}
          translatedX={translatedX}
          navigateTrack={(value) => navigateTrack(value)}
        />
      </Pressable>
    </Animated.View>
  );
};

const QueueFlatlist = ({
  activeMusic,
  queueList,
  imageWidth,
  sharedHeight,
  translatedX,
  tabsHeight,
  // imageWidthDepTabHeight,
  navigateTrack,
  safeAreaheight,
}: {
  navigateTrack: (trackDirection: "prev" | "next") => void;
  queueList: Music[];
  activeMusic: Music;
  sharedHeight: SharedValue<number>;
  translatedX: SharedValue<number>;
  imageWidth: DerivedValue<number>;
  // imageWidthDepTabHeight:DerivedValue<number>,
  tabsHeight: SharedValue<number>;
  safeAreaheight: SharedValue<number>;
}) => {
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeIndex = queueList.findIndex((item) => item.id === activeMusic.id);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onMomentumEnd: (event) => {
      const newIndex = Math.round(event.contentOffset.x / SCREEN_WIDTH);
      if (newIndex !== currentIndex) {
        runOnJS(navigateTrack)(newIndex > currentIndex ? "next" : "prev");
        runOnJS(setCurrentIndex)(newIndex);
      }
    },
  });

  useEffect(() => {
    if (activeIndex >= 0) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex,
        animated: false,
      });
      setCurrentIndex(activeIndex);
    }
  }, [activeIndex]);

  const renderItem = useCallback(
    ({ item, index }: { item: Music; index: number }) => (
      <MusicComponent
        // imageWidthDepTabHeight={imageWidthDepTabHeight}
        index={index}
        tabsHeight={tabsHeight}
        safeAreaHeight={safeAreaheight}
        scrollX={scrollX}
        imageWidth={imageWidth}
        music={item}
        sharedHeight={sharedHeight}
        translatedX={translatedX}
      />
    ),
    []
  );

  const animatedFlatlistStyle = useAnimatedStyle(() => {
    if (sharedHeight.value < SCREEN_HEIGHT) {
      const height = interpolate(
        sharedHeight.value,
        [80, SCREEN_HEIGHT],
        [80, 510]
      );
      const width = interpolate(
        sharedHeight.value,
        [80, SCREEN_HEIGHT],
        [SCREEN_WIDTH * 0.75, SCREEN_WIDTH]
      );
      return { height, width };
    }
    const height = interpolate(
      tabsHeight.value,
      [64, safeAreaheight.value - 80],
      [510, 80]
    );
    const width = interpolate(
      tabsHeight.value,
      [64, safeAreaheight.value - 80],
      [SCREEN_WIDTH, SCREEN_WIDTH * 0.75]
    );
    return { height, width };
  });

  return (
    <Animated.View
      className="flex-row items-center"
      style={[animatedFlatlistStyle]}
    >
      <Animated.FlatList
        ref={flatListRef}
        data={queueList}
        horizontal
        pagingEnabled
        snapToAlignment="start"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => item?.id?.toString() ?? index.toString()}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        renderItem={renderItem}
        className="w-full z-20 flex-1 "
      />
    </Animated.View>
  );
};

// const GestureList=({
//   sharedHeight,
//   activeMusic,
//   translatedX,
//   imageWidth,
//   horizontalPanGesture,
// }:{
//   activeMusic:Music
//   sharedHeight: SharedValue<number>;
// translatedX: SharedValue<number>;
// imageWidth:DerivedValue<number>
//   horizontalPanGesture: PanGesture;

// })=>{

//   return(
//     <GestureDetector gesture={horizontalPanGesture}>
//      <MusicComponent
//       imageWidth={imageWidth}
//       music={activeMusic}
//       sharedHeight={sharedHeight}
//       translatedX={translatedX}
//      />
//   </GestureDetector>
//   )
// }

// original music comp

export default AnimatedTrackSetter;
