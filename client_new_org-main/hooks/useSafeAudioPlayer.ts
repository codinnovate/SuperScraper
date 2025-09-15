import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";

interface AudioPlayerState {
  isPlaying: boolean;
  duration: number;
  position: number;
  isLoaded: boolean;
}

export const useSafeAudioPlayer = (uri?: string) => {
  const [audioError, setAudioError] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [audioState, setAudioState] = useState<AudioPlayerState>({
    isPlaying: false,
    duration: 0,
    position: 0,
    isLoaded: false,
  });

  // Use refs to store the audio objects
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    if (!uri || audioError) return;

    const initializeAudio = async () => {
      try {
        // Set audio mode for playback
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        // Load the audio file
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: false },
          onPlaybackStatusUpdate
        );

        soundRef.current = sound;
        setIsInitialized(true);
        console.log("✅ Audio player initialized successfully");
      } catch (error) {
        console.warn("Failed to initialize audio player:", error);
        setAudioError(true);
      }
    };

    const onPlaybackStatusUpdate = (status: any) => {
      if (status.isLoaded) {
        setAudioState({
          isPlaying: status.isPlaying,
          duration: status.durationMillis || 0,
          position: status.positionMillis || 0,
          isLoaded: status.isLoaded,
        });

        // Handle audio completion
        if (status.didJustFinish) {
          console.log("✅ Audio playback completed");
          setAudioState(prev => ({
            ...prev,
            isPlaying: false,
            position: 0, // Reset position to beginning
          }));
        }
      }
    };

    initializeAudio();

    // Cleanup function
    return () => {
      if (soundRef.current) {
        try {
          soundRef.current.unloadAsync();
        } catch (error) {
          console.warn("Error unloading audio player:", error);
        }
      }
    };
  }, [uri, audioError]);

  const play = async () => {
    if (!soundRef.current || !isInitialized) return;
    try {
      // If audio finished, reset to beginning before playing
      if (audioState.position >= audioState.duration && audioState.duration > 0) {
        await soundRef.current.setPositionAsync(0);
        setAudioState(prev => ({
          ...prev,
          position: 0,
        }));
      }
      
      await soundRef.current.playAsync();
    } catch (error) {
      console.error("Error playing audio:", error);
      setAudioError(true);
    }
  };

  const pause = async () => {
    if (!soundRef.current || !isInitialized) return;
    try {
      await soundRef.current.pauseAsync();
    } catch (error) {
      console.error("Error pausing audio:", error);
    }
  };

  const stop = async () => {
    if (!soundRef.current || !isInitialized) return;
    try {
      await soundRef.current.stopAsync();
      await soundRef.current.setPositionAsync(0);
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        position: 0,
      }));
    } catch (error) {
      console.error("Error stopping audio:", error);
    }
  };

  const seekTo = async (position: number) => {
    if (!soundRef.current || !isInitialized) return;
    try {
      await soundRef.current.setPositionAsync(position);
    } catch (error) {
      console.error("Error seeking audio:", error);
    }
  };

  return {
    audioPlayer: soundRef.current,
    audioError,
    isInitialized,
    audioState,
    play,
    pause,
    stop,
    seekTo,
  };
};
