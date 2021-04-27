import styles from './styles.module.scss';
import { useEffect, useRef, useState } from 'react';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { usePlayer } from '../../contexts/PlayerContext';
import Image from 'next/image';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import Head from 'next/head';

export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [progress, setProgress] = useState(0)
    const { 
            episodeList,
            currentEpisodeIndex,
            isPlaying,
            isLooping,
            isShuffling,
            hasPrevious,
            hasNext,
            togglePlay,
            toggleLoop,
            toggleisShuffle,
            setPlayingState,
            playPrevious,
            playNext,
            clearPlayerState
        } = usePlayer();
    const episode = episodeList[currentEpisodeIndex]

    useEffect(()=>{
        if(!audioRef.current){
            return;
        }
        isPlaying? audioRef.current.play() : audioRef.current.pause();
 
    }, [isPlaying])

    function setupProgressListener(){
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', ()=>{
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    function handleSeek(amount: number){
        audioRef.current.currentTime = amount;
        setProgress(amount);

    }

    function handleEpisodeEnded(){
        if(hasNext) playNext();
        else clearPlayerState();
    }

    return (
        <div className={styles.playerContainer}>
            <Head>
                <title>Home | Podecastr</title>
            </Head>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora</strong>
            </header>

            {
                episode ?
                    (
                        <div className={styles.currentPlayer}>
                            <Image
                                width={592}
                                height={592}
                                src={episode.thumbnail}
                                objectFit='cover'
                            />
                            <strong>{episode.title}</strong>
                            <span>{episode.members}</span>
                        </div>
                    ) : (
                        <div className={styles.emptyPlayer}>
                            <strong>Selecione um podcast para ouvir</strong>
                        </div>
                    )
            }
            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration || 0)}</span>
                </div>

                {episode && (
                    <audio 
                        src={episode.url}
                        ref={audioRef}
                        loop = {isLooping}
                        autoPlay
                        onEnded={() => handleEpisodeEnded()}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={setupProgressListener}
                    />
                )}

                <div className={styles.buttons}>
                    <button 
                        type="button" 
                        className={isShuffling && styles.actived}
                        disabled={!episode || episodeList.length == 1}
                        onClick={toggleisShuffle}
                    >
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>

                    <button type="button" disabled={!episode || !hasPrevious}
                        onClick={playPrevious}
                    >
                        <img src="/play-previous.svg" alt="Anterior" />
                    </button>

                    <button 
                        type="button" 
                        disabled={!episode} 
                        className={styles.playButton}
                        onClick={togglePlay}   
                    >
                        {isPlaying ?
                            <img src="/pause.svg" alt="Play" />
                            : <img src="/play.svg" alt="Play" />}

                    </button>

                    <button type="button" disabled={!episode || !hasNext}
                        onClick={playNext}
                    >
                        <img src="/play-next.svg" alt="Proximo" />

                    </button>

                    <button 
                        type="button" 
                        disabled={!episode} 
                        onClick={toggleLoop}
                        className={isLooping && styles.actived}
                    >
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div >
    );
}