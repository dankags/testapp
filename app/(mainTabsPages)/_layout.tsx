import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import React, { memo, useMemo } from "react";
import { router, Tabs, usePathname } from "expo-router";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { cn } from "@/src/lib/utils";
import CustomIcon from "@/src/components/Customicon";
import BottomPlayerComp from "@/src/components/youtubeMusicPlayer/BottomPlayerComp";
import { StatusBar } from "expo-status-bar";


type TabProps = {
  name: string;
  iconLibraryType: keyof typeof IconType;
  iconName: string;
  size: number;
  color: string;
  focused: boolean;
  onPress: () => void;
  playerHeight: SharedValue<number>;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("screen");

const tabItems = [
  {
    route: "/" as const,
    label: "Home",
    iconLib: ["Foundation", "Octicons"] as const,
    icon: "home",
  },
  {
    route: "/samples" as const,
    label: "Samples",
    iconLib: ["Entypo", "Feather"] as const,
    icon: ["controller-fast-forward", "fast-forward"],
  },
  {
    route: "/explore" as const,
    label: "Explore",
    iconLib: ["Ionicons", "FontAwesome5"] as const,
    icon: "compass",
  },
  {
    route: "/library" as const,
    label: "Library",
    iconLib: ["MaterialIcons", "MaterialCommunityIcons"] as const,
    icon: ["library-music", "music-box-multiple-outline"],
  },
  {
    route: "/upgrade" as const,
    label: "Upgrade",
    iconLib: ["AntDesign", "AntDesign"] as const,
    icon: "playcircleo",
    activeColor: "#0a0a0a",
  },
];

const TabBarButtonItem = memo(
  ({
    playerHeight,
    name,
    iconLibraryType,
    iconName,
    size = 20,
    color,
    focused,
    onPress,
  }: TabProps) => {
    const pathname = usePathname();

    const animatedTabStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        playerHeight.value,
        [80, SCREEN_HEIGHT * 0.7, SCREEN_HEIGHT],
        [1, 0.2, 0],
        Extrapolation.CLAMP
      );
      return {
        opacity,
      };
    });

    return (
      <TouchableOpacity
        onPress={onPress}
        className="flex-1 bg-transparent justify-center items-center"
      >
        <Animated.View
          className="size-fit items-center justify-center gap-1"
          style={[animatedTabStyle]}
        >
          <View
            className={cn(
              "p-1 justify-center items-center bg-transparent",
              pathname === "/upgrade" && focused && "rounded-full bg-white"
            )}
          >
            <CustomIcon
              iconLibraryType={iconLibraryType}
              iconName={iconName}
              size={size}
              color={color}
            />
          </View>
          <Text className={cn("text-white text-xs font-normal")}>{name}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  }
);

TabBarButtonItem.displayName = "TabBarButtonItem";

export default function MainTabsScreensLayout() {
  const pathname = usePathname();
  const playerHeight = useSharedValue(80);

  const activeRoute = useMemo(() => {
    return tabItems.find((item) =>
      item.route === "/" ? pathname === "/" : pathname.startsWith(item.route)
    )?.route;
  }, [pathname]);

  const animatedTabsStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      playerHeight.value,
      [80, SCREEN_HEIGHT],
      [0, 60],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }],
    };
  });

  return (
    <>
    <StatusBar
  translucent
  backgroundColor="transparent"
 style="light" // or "dark-content"
/>
      <BottomPlayerComp sharedHeight={playerHeight} />
      <Tabs
        tabBar={() => (
          <Animated.View
            className="w-full h-fit flex-row py-2 bg-neutral-900 absolute bottom-0"
            style={[animatedTabsStyle]}
          >
            {tabItems.map((item, idx) => {
              const isActive = item.route === activeRoute;
              return (
                <TabBarButtonItem
                  key={idx}
                  playerHeight={playerHeight}
                  onPress={() => router.push(item.route)}
                  iconLibraryType={
                    isActive ? item.iconLib[0] : item.iconLib[1]
                  }
                  iconName={
                    Array.isArray(item.icon)
                      ? isActive
                        ? item.icon[0]
                        : item.icon[1]
                      : item.icon
                  }
                  size={20}
                  name={item.label}
                  focused={isActive}
                  color={
                    isActive && item.activeColor
                      ? item.activeColor
                      : "#fafafa"
                  }
                />
              );
            })}
          </Animated.View>
        )}
        screenOptions={{ headerShown: false }}
      />
    </>
  );
}
