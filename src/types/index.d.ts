declare interface Artist{
    id:string
    name:string
}

declare interface Music {
    id:string
    artists:Artist[]
    name:string
    coverImage:string
    duration:number
    musicVibrantColor?:string
    lyrics?:string
    audio:string
    likes:number
    video?:string
}

declare enum IconType{
    MaterialCommunityIcons = "MaterialCommunityIcons",
    Ionicons = "Ionicons",
    FontAwesome = "FontAwesome",
    Entypo = "Entypo",
    MaterialIcons = "MaterialIcons",
    SimpleLineIcons = "SimpleLineIcons",
    FontAwesome5 = "FontAwesome5",
    Feather = "Feather",
    AntDesign = "AntDesign",
    Octicons="Octicons",
    Foundation="Foundation",

}

declare interface IconProps{
    iconLibraryType: keyof typeof IconType;
    color?: string;
    size?: number;
    style?: TextStyle | ViewStyle | ImageStyle;
    iconName: keyof typeof IconType["glyphMap"];
  };