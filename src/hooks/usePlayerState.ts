import { useCallback, useEffect, useMemo, useState } from 'react';
import { dummyMusicData } from '../constants/data';

export function usePlayerState() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMusicIndex, setActiveMusicIndex] = useState(0);
  const [musicQueue] = useState(dummyMusicData);

  const activeMusic = useMemo(() => musicQueue[activeMusicIndex], [musicQueue, activeMusicIndex]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const navigateTrack = useCallback(
    (direction: 'prev' | 'next') => {
      const newIndex = direction === 'prev' ? activeMusicIndex - 1 : activeMusicIndex + 1;
      if (newIndex >= 0 && newIndex < musicQueue.length) {
        setActiveMusicIndex(newIndex);
      }
    },
    [activeMusicIndex, musicQueue]
  );
  

  useEffect(()=>{
    if(!activeMusic) return
    if(isPlaying){
      setIsPlaying(false)
      return
    }
  },[activeMusic])

  return {
    isPlaying,
    togglePlay,
    activeMusic,
    navigateTrack,
    setIsPlaying,
  };
}
