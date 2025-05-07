import { Link } from "expo-router";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import Animated, { interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";
import CustomIcon from "./Customicon";
import * as Progress from 'react-native-progress';
import { cn, formatDuration, formatNumber } from "../lib/utils";

type AnimatedControlsMusicInfoProps={
  sharedHeight: SharedValue<number>;
  activeMusic: Music;
  isPlaying: boolean;
  handlePlayToggle: () => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleResetHeight: () => void;
}

const SNAP_BOTTOM = 80;

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');


const AnimatedControlsMusicInfo = ({
  sharedHeight,
  activeMusic,
  isPlaying,
  handleNext,
  handlePrevious,
  handleResetHeight,
  handlePlayToggle,
}:AnimatedControlsMusicInfoProps ) => {
  const animatedMusicPlayerWrapperStyles = useAnimatedStyle(() => {
    const display = sharedHeight.value < 120 ? "none" : "flex";
    const translateY = interpolate(
      sharedHeight.value,
      [100, SCREEN_HEIGHT],
      [SCREEN_WIDTH, 0]
    );
    const opacity = interpolate(
      sharedHeight.value,
      [SCREEN_WIDTH, SCREEN_HEIGHT],
      [0, 1]
    );
    return {
      display,
      transform: [{ translateY }],
      opacity,
    };
  });
  return (
    <Animated.View
      className={"w-full flex-1 px-6"}
      style={[animatedMusicPlayerWrapperStyles]}
    >
      <View className="  mb-6 mt-11">
        <Text className="text-white text-2xl font-bold">
          <Link href={`/`} onPress={handleResetHeight}>
            {activeMusic.name}
          </Link>
        </Text>
        <View className="flex-row items-center">
          {activeMusic.artists.map((artist, index) => (
            <Text key={artist.id} className="text-neutral-400 text-lg">
              <Link href={`/`} onPress={handleResetHeight}>
                {artist.name}
              </Link>
              {index < activeMusic.artists.length - 1 && " • "}
            </Text>
          ))}
        </View>
      </View>
      <View className="w-full py-3">
        <View className="w-full flex-row justify-between items-center mb-5">
          <Pressable className="">
            <CustomIcon
              iconLibraryType={"Ionicons"}
              iconName={"shuffle"}
              size={24}
              color="white"
            />
          </Pressable>
          <Pressable className="" onPress={handlePrevious}>
            <CustomIcon
              iconLibraryType={"FontAwesome5"}
              iconName={"step-backward"}
              size={24}
              color="white"
            />
          </Pressable>
          <Pressable
            className="size-20 bg-white rounded-full items-center justify-center"
            onPress={handlePlayToggle}
          >
            <CustomIcon
              iconLibraryType={isPlaying ? "Ionicons" : "Foundation"}
              iconName={isPlaying ? "pause" : "play"}
              size={28}
              color="black"
            />
          </Pressable>
          <Pressable className="" onPress={handleNext}>
            <CustomIcon
              iconLibraryType={"FontAwesome5"}
              iconName={"step-forward"}
              size={24}
              color="white"
            />
          </Pressable>
          <Pressable className="">
            <CustomIcon
              iconLibraryType={"Ionicons"}
              iconName={"repeat-sharp"}
              size={24}
              color="white"
            />
          </Pressable>
        </View>
        <View className="w-full flex-row items-center py-3">
          <Progress.Bar
            progress={0.4}
            height={4}
            width={SCREEN_WIDTH - 48}
            color="white"
            borderRadius={20}
            borderColor="#ffffff1a"
            unfilledColor="#ffffff33"
            className="bg-white/10"
          />
        </View>
        <View className="w-full flex-row items-center justify-between">
          <Text className="text-neutral-300 text-sm">00:00</Text>
          <Text className="text-neutral-300 text-sm">
            {formatDuration(activeMusic.duration)}
          </Text>
        </View>
      </View>
      <View className="w-full mt-12">
        <ScrollView className="" horizontal={true} showsHorizontalScrollIndicator={false}>
          <View
            className="flex-row rounded-full items-center mr-3  bg-white/15"
            style={{ borderRadius: 9999 }}
          >
            <Pressable className="px-3 py-2  flex-row items-center justify-center gap-2 rounded-full">
              <CustomIcon
                iconLibraryType="AntDesign"
                iconName={"like2"}
                size={18}
                color="white"
              />
              <Text className="text-white text-sm font-semibold ">
                {formatNumber(activeMusic.likes)}
              </Text>
            </Pressable>

            <View className="h-5 w-[1px] bg-white/30 mx-1" />

            <Pressable className="px-3 py-2  flex-row items-center justify-center gap-2  rounded-full">
              <CustomIcon
                iconLibraryType="AntDesign"
                iconName={"dislike2"}
                size={18}
                color="white"
              />
            </Pressable>
          </View>
          <Pressable className="px-3 py-2  flex-row items-center justify-center gap-2 mr-3 rounded-full  bg-white/15">
            <CustomIcon
              iconLibraryType="MaterialCommunityIcons"
              iconName={"comment-text-outline"}
              size={18}
              color="white"
            />
          </Pressable>
          <Pressable className="px-3 py-2  flex-row items-center justify-center gap-2 mr-3 rounded-full  bg-white/15">
            <CustomIcon
              iconLibraryType="Entypo"
              iconName={"add-to-list"}
              size={18}
              color="white"
            />
            <Text className="text-white text-sm font-semibold ">Save</Text>
          </Pressable>
          <Pressable className="px-3 py-2  flex-row items-center justify-center gap-2 mr-3 rounded-full  bg-white/15">
            <CustomIcon
              iconLibraryType="MaterialIcons"
              iconName={"music-video"}
              size={18}
              color="white"
            />
            <Text className="text-white text-sm font-semibold ">Video</Text>
          </Pressable>
          <Pressable className="px-3 py-2  flex-row items-center justify-center gap-2 mr-3 rounded-full  bg-white/15">
            <CustomIcon
              iconLibraryType="MaterialCommunityIcons"
              iconName={"share-outline"}
              size={18}
              color="white"
            />
            <Text className="text-white text-sm font-semibold ">Share</Text>
          </Pressable>
          <Pressable className="px-3 py-2  flex-row items-center justify-center gap-2 mr-3 rounded-full  bg-white/15">
            <CustomIcon
              iconLibraryType="Octicons"
              iconName={"download"}
              size={18}
              color="white"
            />
            <Text className="text-white text-sm font-semibold ">Download</Text>
          </Pressable>
          <Pressable className="px-3 py-2  flex-row items-center justify-center gap-2 mr-3 rounded-full  bg-white/15">
            <CustomIcon
              iconLibraryType="Ionicons"
              iconName={"radio"}
              size={18}
              color="white"
            />
            <Text className="text-white text-sm font-semibold ">Radio</Text>
          </Pressable>
        </ScrollView>
      </View>
      <View className="flex-1 w-full flex-row justify-center items-end">
        <Pressable className="w-4/12 px-3 py-4 flex-row justify-center items-center">
          <Text className="text-lg font-semibold text-neutral-400">
            UP NEXT
          </Text>
        </Pressable>
        <Pressable className="w-4/12  px-3 py-4 flex-row justify-center items-center">
          <Text
            className={cn(
              "text-lg font-semibold text-neutral-600",
              activeMusic.lyrics && "text-neutral-400"
            )}
          >
            LYRICS
          </Text>
        </Pressable>
        <Pressable className="w-4/12 px-3 py-4 flex-row justify-center items-center">
          <Text className="text-lg font-semibold text-neutral-400">
            RELATED
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

export default AnimatedControlsMusicInfo