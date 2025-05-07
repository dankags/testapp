// import { useEffect, useState } from "react";
// // import { SetupService } from "../services";
// // import TrackPlayer from "react-native-track-player";

// export default function useSetupPlayer() {
//     const [playerReady, setPlayerReady] = useState<boolean>(false);
  
//     useEffect(() => {
//       let unmounted = false;
//       (async () => {
//         await SetupService();
//         if (unmounted) return;
//         setPlayerReady(true);
//         const queue = await TrackPlayer.getQueue();
//         if (unmounted) return;
//         if (queue.length <= 0) {
//          return
//         }
//       })();
//       return () => {
//         unmounted = true;
//       };
//     }, []);
//     return playerReady;
//   }