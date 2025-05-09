import { Link } from "expo-router";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import Animated, { interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";
import CustomIcon from "../Customicon";
// import Slider from '@react-native-community/slider';
import { cn, formatDuration, formatNumber } from "@/src/lib/utils";
import { useEffect, useState } from "react";

type AnimatedControlsMusicInfoProps={
  sharedHeight: SharedValue<number>;
  activeMusic: Music;
  isPlaying: boolean;
  safeAreaHeight:number,
   tabsHeight:SharedValue<number>
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
  tabsHeight,
  safeAreaHeight,
  handleNext,
  handlePrevious,
  handleResetHeight,
  handlePlayToggle,
}:AnimatedControlsMusicInfoProps ) => {
  const [displayCompomnent,setDisplayComp]=useState(false)
   const animatedFromSharedHeight = useAnimatedStyle(() => {
   if(sharedHeight.value<SCREEN_HEIGHT){
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
    const display=sharedHeight.value>(SCREEN_HEIGHT/2)?"flex":"none"
    return {
      transform: [{ translateY }],
      opacity,
      display,
    };
  }

  const translateY = interpolate(
      tabsHeight.value,
      [64, safeAreaHeight - 80],
      [0, safeAreaHeight / 2]
    );

    const opacity = interpolate(
      tabsHeight.value,
      [64, safeAreaHeight * 0.4, safeAreaHeight - 80],
      [1, 0.2, 0]
    );
    const display=tabsHeight.value<safeAreaHeight*0.75?"flex":"none"
    return {
      transform: [{ translateY }],
      opacity,
      display,
    };

  });





  return (
    <Animated.View
      className={"w-full flex-1 px-6  relative"}
      style={[animatedFromSharedHeight]}
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
          <Pressable className="p-3 rounded-full" onPress={handlePrevious}>
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
              size={32}
              color="black"
            />
          </Pressable>
          <Pressable className="p-3 rounded-full" onPress={handleNext}>
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
          {/* <Slider
            style={{width:"100%",height:8}}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#Fafafa"
            maximumTrackTintColor="#ffffff99"
            thumbTintColor="transparent"
          /> */}
        </View>
        <View className="w-full flex-row items-center justify-between">
        <Text className="text-neutral-300 bg-white/60xt-sm">
            {formatDuration(40)}
          </Text>
          <Text className="text-neutral-300 bg-white/60xt-sm">
            {formatDuration(activeMusic.duration)}
          </Text>
        </View>
      </View>
      <View className="w-full mt-12">
        <ScrollView
          className=""
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
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
    
    </Animated.View>
  );
};

export default AnimatedControlsMusicInfo