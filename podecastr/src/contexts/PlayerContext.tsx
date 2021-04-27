import { createContext, ReactNode, useContext, useState } from 'react'

type Episode = {
    title: string,
    members: string,
    thumbnail: string,
    duration: number,
    url: string,
};

type PlayerContextData = {
    episodeList: Episode[],
    currentEpisodeIndex: number,
    isPlaying: boolean,
    isLooping: boolean,
    isShuffling: boolean,
    hasNext: boolean,
    hasPrevious: boolean,
    togglePlay: () => void,
    toggleLoop: () => void,
    toggleisShuffle: () => void,
    play: (episode: Episode) => void,
    playNext: () => void,
    playPrevious: () => void,
    playList: (list: Episode[], index: number) => void,
    setPlayingState: (state: boolean) => void,
    clearPlayerState: () => void,
}

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([])
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setisShuffling] = useState(false);



    function play(episode: Episode) {
        setEpisodeList([episode])
        setCurrentEpisodeIndex(0)
        setIsPlaying(true)
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

    
    function playNext(){
        
        if (isShuffling){
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        }else hasNext &&
        setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }

    function playPrevious(){
        hasPrevious && setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }

    function togglePlay() {
        setIsPlaying(!isPlaying)
    }

    function toggleLoop() {
        setIsLooping(!isLooping)
    }

    function toggleisShuffle() {
        setisShuffling(!isShuffling)
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state)
    }

    function clearPlayerState(){
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }

    return (
        <PlayerContext.Provider value={{
            episodeList,
            currentEpisodeIndex,
            isPlaying,
            isLooping,
            isShuffling,
            hasNext,
            hasPrevious,
            togglePlay,
            toggleLoop,
            toggleisShuffle,
            play,
            playList,
            playNext,
            playPrevious,
            setPlayingState,
            clearPlayerState,
        }}>

            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () =>{
    return useContext(PlayerContext);
}