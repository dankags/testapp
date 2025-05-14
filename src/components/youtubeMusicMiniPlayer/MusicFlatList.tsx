import MusicComponent from "@/src/components/youtubeMusicMiniPlayer/MusicComp";
import { dummyMusicData } from "@/src/constants/data";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
} from "react-native";
import {
    PanGesture,
    Pressable,
} from "react-native-gesture-handler";
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

type MusicFlatListProps= {
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
}

type MusicListProps= {
  navigateTrack: (trackDirection: "prev" | "next") => void;
  queueList: Music[];
  activeMusic: Music;
  sharedHeight: SharedValue<number>;
  translatedX: SharedValue<number>;
  imageWidth: DerivedValue<number>;
  tabsHeight: SharedValue<number>;
  safeAreaheight: SharedValue<number>;
}


const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("screen");

const MusicFlatList = ({
  sharedHeight,
  activeMusic,
  translatedX,
  tabsHeight,
  safeAreaHeight,
  navigateTrack,
  handleSheetExpansion,
}:MusicFlatListProps) => {

  // Dynamically calculates the image width based on UI expansion state.
// - It uses `useDerivedValue` to automatically re-compute `imageWidth`
//   whenever `sharedHeight`, `tabsHeight`, or `safeAreaHeight` change.
  const imageWidth = useDerivedValue(() => {
    const isMiniPlayerExpanding = sharedHeight.value < SCREEN_HEIGHT;
    const source = isMiniPlayerExpanding  ? sharedHeight.value : tabsHeight.value;

    return interpolate(
      source,
      isMiniPlayerExpanding ? [80, SCREEN_HEIGHT] : [64, safeAreaHeight.value - 80],
      isMiniPlayerExpanding  ? [60, SCREEN_WIDTH] : [SCREEN_WIDTH, 60],
      Extrapolation.CLAMP
    );
  });

  // Computes the animated style for the active music container based on the UI's expansion state.
// It returns dynamic `translateY` and `height` values using Reanimated's interpolation logic,
// adjusting layout based on whether the container is expanded or collapsed.
  const animatedActiveMusicContainer = useAnimatedStyle(() => {
    if (sharedHeight.value < SCREEN_HEIGHT) {
      const translateY = interpolate(
        sharedHeight.value,
        [80, SCREEN_HEIGHT],
        [-5, 0],
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
      [0, -64],
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

      <Pressable onPress={handleSheetExpansion} className="flex-1">
        <Musiclist
          tabsHeight={tabsHeight}
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

const Musiclist = ({
  activeMusic,
  queueList,
  imageWidth,
  sharedHeight,
  translatedX,
  tabsHeight,
  navigateTrack,
  safeAreaheight,
}:MusicListProps) => {
   
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeIndex = queueList.findIndex((item) => item.id === activeMusic.id);

  // Handles horizontal scroll logic for the music player track list.
// - `onScroll`: updates `scrollX` with current horizontal offset.
// - `onMomentumEnd`: detects swipe direction, navigates to next/prev track, and updates current index.
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

  //  auto-scrolls to `activeIndex` when it changes (e.g., on initial load or external trigger).
  useEffect(() => {
    if (activeIndex >= 0) {
    flatListRef.current?.scrollToIndex({
      index: activeIndex,
      animated: false,
    });
    setCurrentIndex(activeIndex);
    scrollX.value = activeIndex * SCREEN_WIDTH; 
  }
  }, [activeIndex]);

  // Renders each music item using a memoized callback for performance optimization.
// Passes animated and layout-related props to the MusicComponent.
  const renderItem = useCallback(
    ({ item, index }: { item: Music; index: number }) => (
      <MusicComponent
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

  // Dynamically animates the FlatList container’s height and width
// based on whether the view is expanded or collapsed.
// - In expanded mode: height grows from 80 to 510, width from 75% to 100%.
// - In collapsed mode: height shrinks from 510 to 80, width from 100% to 75%.
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
        removeClippedSubviews={true}
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


export default MusicFlatList;
