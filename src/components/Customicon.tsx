// components/CustomIcon.tsx
import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, Foundation, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons, SimpleLineIcons } from "@expo/vector-icons";
import React from "react";

const CustomIcon = ({ iconLibraryType, color = "#6b7280", size = 20, style,iconName }: IconProps) => {
  switch (iconLibraryType) {
    case "MaterialCommunityIcons":
      return <MaterialCommunityIcons name={iconName as keyof typeof MaterialCommunityIcons["glyphMap"]} size={size} color={color??"black"} style={style} />;
    case "Ionicons":
      return <Ionicons name={iconName as keyof typeof Ionicons["glyphMap"]} size={size} color={color??"black"} style={style} />;
    case "FontAwesome":
      return <FontAwesome name={iconName as keyof typeof FontAwesome["glyphMap"]} size={size} color={color??"black"} style={style} />;
    case "Entypo":
      return <Entypo name={iconName as keyof typeof Entypo["glyphMap"]} size={size} color={color??"black"} style={style} />;
    case "MaterialIcons":
      return <MaterialIcons name={iconName as keyof typeof MaterialIcons["glyphMap"]} size={size} color={color??"black"} style={style} />;  
    case "SimpleLineIcons":
      return <SimpleLineIcons name={iconName as keyof typeof SimpleLineIcons["glyphMap"]} size={size} color={color??"black"} style={style} />;  
    case "FontAwesome5":
      return <FontAwesome5 name={iconName as keyof typeof FontAwesome["glyphMap"]} size={size} color={color??"black"} style={style} />;  
    case "Feather":
      return <Feather name={iconName as keyof typeof Feather["glyphMap"]} size={size} color={color??"black"} style={style} />;  
    case "AntDesign":
      return <AntDesign name={iconName as keyof typeof AntDesign["glyphMap"]} size={size} color={color??"black"} style={style} />;  
    case "Octicons":
        return <Octicons name={iconName as keyof typeof Octicons["glyphMap"]} size={size} color={color??"black"}/>  
    case "Foundation":
        return <Foundation name={iconName as keyof typeof Foundation["glyphMap"]} size={size} color={color??"black"}/>    
    default:
      return null;
  }
};

export default CustomIcon;
