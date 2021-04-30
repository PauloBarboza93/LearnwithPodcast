import { createContext, useState, ReactNode, useContext } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    playList: (List: Episode[], index: number) => void;
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    playNext: () => void;
    playPrevious: () => void;
    clearPlayerState: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps ={
    children: ReactNode;
}

export function PlayerContextProvider ({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play (episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList (List: Episode[], index: number) {
      setEpisodeList(List);
      setCurrentEpisodeIndex(index);
      setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function toggleLoop() {
      setIsLooping(!isLooping);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function clearPlayerState() {
      setEpisodeList([]);
      setCurrentEpisodeIndex(0);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) <episodeList.length

  function playNext() {
      if (isShuffling) {
          const nexRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)

          setCurrentEpisodeIndex(nexRandomEpisodeIndex);
      } else if (hasNext) {
        setCurrentEpisodeIndex(currentEpisodeIndex + 1);
      }
  }

  function playPrevious() {
      if (hasPrevious) {
        setCurrentEpisodeIndex(currentEpisodeIndex - 1);
      }
  }

  return (
    <PlayerContext.Provider 
        value={{
            episodeList, 
            currentEpisodeIndex, 
            play,
            playList, 
            isPlaying,
            isLooping,
            isShuffling, 
            playNext,
            playPrevious,
            togglePlay,
            toggleLoop,
            toggleShuffle, 
            setPlayingState,
            hasNext,
            hasPrevious, 
            clearPlayerState,
        }}
    >
        {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}