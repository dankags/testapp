import { Link } from "expo-router";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import Animated, { interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";
import CustomIcon from "../Customicon";
import { cn, formatDuration, formatNumber } from "@/src/lib/utils";
import { memo, useMemo } from "react";
import Slider from '@react-native-community/slider';

type AnimatedControlsMusicInfoProps = {
  sharedHeight: SharedValue<number>;
  activeMusic: Music;
  isPlaying: boolean;
  safeAreaHeight: SharedValue<number>;
  tabsHeight: SharedValue<number>;
  handlePlayToggle: () => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleResetHeight: () => void;
};

type ActionButtonProps= {
    iconName: string;
    label?: string;
    iconLibraryType: keyof typeof IconType;
  }

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');

const MusicPlayerControls = ({
  sharedHeight,
  activeMusic,
  isPlaying,
  tabsHeight,
  safeAreaHeight,
  handleNext,
  handlePrevious,
  handleResetHeight,
  handlePlayToggle,
}: AnimatedControlsMusicInfoProps) => {
  
  // Animate opacity,display and translation in Y-axis of the controls When the Mini-Player or SafeArea height's changes
  const animatedStyle = useAnimatedStyle(() => {
    if (sharedHeight.value < SCREEN_HEIGHT) {
      return {
        transform: [
          {
            translateY: interpolate(
              sharedHeight.value,
              [100, SCREEN_HEIGHT],
              [SCREEN_WIDTH, 0]
            ),
          },
        ],
        opacity: interpolate(
          sharedHeight.value,
          [SCREEN_WIDTH, SCREEN_HEIGHT],
          [0, 1]
        ),
        display: sharedHeight.value > SCREEN_HEIGHT / 2 ? "flex" : "none",
      };
    }

    return {
      transform: [
        {
          translateY: interpolate(
            tabsHeight.value,
            [64, safeAreaHeight.value - 80],
            [0, safeAreaHeight.value / 2]
          ),
        },
      ],
      opacity: interpolate(
        tabsHeight.value,
        [64, safeAreaHeight.value * 0.4, safeAreaHeight.value - 80],
        [1, 0.2, 0]
      ),
      display: tabsHeight.value < safeAreaHeight.value * 0.75 ? "flex" : "none",
    };
  });

  // reusable action button
  const ActionButton = ({iconName, label, iconLibraryType,}:ActionButtonProps) => (
    <Pressable className="px-3 py-2 flex-row items-center justify-center gap-2 mr-3 rounded-full bg-white/15">
      <CustomIcon
        iconLibraryType={iconLibraryType}
        iconName={iconName}
        size={18}
        color="white"
      />
      {label && (
        <Text className="text-white text-sm font-semibold">{label}</Text>
      )}
    </Pressable>
  );

  // memorizing the music name and artists across re-renders
  const musicMeta = useMemo(
    () => (
      <>
        <Text className="text-white text-2xl font-bold">
          <Link href="/" onPress={handleResetHeight}>
            {activeMusic.name}
          </Link>
        </Text>
        <View className="flex-row items-center">
          {activeMusic.artists.map((artist, index) => (
            <Text key={artist.id} className="text-neutral-400 text-lg">
              <Link href="/" onPress={handleResetHeight}>
                {artist.name}
              </Link>
              {index < activeMusic.artists.length - 1 && " • "}
            </Text>
          ))}
        </View>
      </>
    ),
    [activeMusic]
  );

  return (
    <Animated.View className="w-full flex-1 mt-9 px-6  " style={animatedStyle}>
      <View className="pb-6 pt-3">{musicMeta}</View>

      {/* Controls */}
      <View className="w-full py-3">
        <View className="w-full flex-row justify-between items-center mb-5">
          <Pressable>
            <CustomIcon
              iconLibraryType="Ionicons"
              iconName="shuffle"
              size={24}
              color="white"
            />
          </Pressable>
          <Pressable onPress={handlePrevious} className="p-3 rounded-full">
            <CustomIcon
              iconLibraryType="FontAwesome5"
              iconName="step-backward"
              size={24}
              color="white"
            />
          </Pressable>
          <Pressable
            onPress={handlePlayToggle}
            className="size-20 bg-white rounded-full items-center justify-center"
          >
            <CustomIcon
              iconLibraryType={isPlaying ? "Ionicons" : "Foundation"}
              iconName={isPlaying ? "pause" : "play"}
              size={32}
              color="black"
            />
          </Pressable>
          <Pressable onPress={handleNext} className="p-3 rounded-full">
            <CustomIcon
              iconLibraryType="FontAwesome5"
              iconName="step-forward"
              size={24}
              color="white"
            />
          </Pressable>
          <Pressable>
            <CustomIcon
              iconLibraryType="Ionicons"
              iconName="repeat-sharp"
              size={24}
              color="white"
            />
          </Pressable>
        </View>

        <View className="w-full flex-row items-center justify-center pt-4 ">
          <Slider
            style={{ width: SCREEN_WIDTH - 24 }}
            value={0.5}
            minimumValue={0}
            maximumValue={1}
            thumbTintColor="transparent"
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#ffffff80"
          />
        </View>

        <View className="w-full flex-row items-center justify-between py-3">
          <Text className="text-neutral-300 text-sm">{formatDuration(40)}</Text>
          <Text className="text-neutral-300 text-sm">
            {formatDuration(activeMusic.duration)}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View className="w-full mt-12">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View
            className="flex-row rounded-full items-center mr-3 bg-white/15"
            style={{ borderRadius: 9999 }}
          >
            {/* Like and Unlike button */}
            <Pressable className="px-3 py-2 flex-row items-center gap-2">
              <CustomIcon
                iconLibraryType="AntDesign"
                iconName="like2"
                size={18}
                color="white"
              />
              <Text className="text-white text-sm font-semibold">
                {formatNumber(activeMusic.likes)}
              </Text>
            </Pressable>
            <View className="h-5 w-[1px] bg-white/30 mx-1" />
            <Pressable className="px-3 py-2">
              <CustomIcon
                iconLibraryType="AntDesign"
                iconName="dislike2"
                size={18}
                color="white"
              />
            </Pressable>
          </View>

          {/* Reusable Action Buttons */}
          <ActionButton
            iconLibraryType="MaterialCommunityIcons"
            iconName="comment-text-outline"
          />
          <ActionButton
            iconLibraryType="Entypo"
            iconName="add-to-list"
            label="Save"
          />
          <ActionButton
            iconLibraryType="MaterialIcons"
            iconName="music-video"
            label="Video"
          />
          <ActionButton
            iconLibraryType="MaterialCommunityIcons"
            iconName="share-outline"
            label="Share"
          />
          <ActionButton
            iconLibraryType="Octicons"
            iconName="download"
            label="Download"
          />
          <ActionButton
            iconLibraryType="Ionicons"
            iconName="radio"
            label="Radio"
          />
        </ScrollView>
      </View>
    </Animated.View>
  );
};

export default memo(MusicPlayerControls);
