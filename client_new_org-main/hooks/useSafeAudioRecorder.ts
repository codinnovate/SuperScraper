import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";

interface AudioRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  uri?: string;
}

export const useSafeAudioRecorder = () => {
  const [recorderState, setRecorderState] = useState<AudioRecorderState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
  });
  const [audioError, setAudioError] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use refs to store the audio objects
  const recordingRef = useRef<Audio.Recording | null>(null);
  const recordingStartTimeRef = useRef<number>(0);

  useEffect(() => {
    const initializeAudio = async () => {
      try {
        // Request recording permissions
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          console.warn("Recording permission not granted");
          setAudioError(true);
          return;
        }

        setIsInitialized(true);
        console.log("✅ Audio recorder initialized successfully");
      } catch (error) {
        console.warn("Failed to initialize audio recorder:", error);
        setAudioError(true);
      }
    };

    initializeAudio();

    // Cleanup function
    return () => {
      if (recordingRef.current && recorderState.isRecording) {
        try {
          recordingRef.current.stopAndUnloadAsync();
        } catch (error) {
          console.warn("Error cleaning up audio recorder:", error);
        }
      }
    };
  }, []);

  const startRecording = async () => {
    if (!isInitialized || audioError) {
      console.warn("Audio recorder not available");
      return false;
    }

    try {
      console.log("🔄 Starting audio recording...");
      
      // Set audio mode before each recording session (fixes iOS issue)
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      
      // Create a new recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      recordingRef.current = recording;
      recordingStartTimeRef.current = Date.now();
      
      setRecorderState(prev => ({
        ...prev,
        isRecording: true,
        duration: 0
      }));
      
      console.log("✅ Audio recording started");
      return true;
    } catch (error) {
      console.error("Error starting recording:", error);
      setAudioError(true);
      return false;
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current || !isInitialized) {
      console.warn("Audio recorder not available");
      return null;
    }

    try {
      console.log("🔄 Stopping audio recording...");
      
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      const duration = Date.now() - recordingStartTimeRef.current;
      
      setRecorderState(prev => ({
        ...prev,
        isRecording: false,
        duration: duration,
        uri: uri || undefined
      }));
      
      console.log("✅ Audio recording stopped, file generated:", uri);
      
      // Clean up the recording reference
      recordingRef.current = null;
      
      return {
        uri: uri,
        durationMillis: duration
      };
    } catch (error) {
      console.error("Error stopping recording:", error);
      recordingRef.current = null;
      return null;
    }
  };

  const pauseRecording = async () => {
    if (!recordingRef.current || !isInitialized) return;
    try {
      await recordingRef.current.pauseAsync();
      setRecorderState(prev => ({
        ...prev,
        isPaused: true
      }));
    } catch (error) {
      console.error("Error pausing recording:", error);
    }
  };

  const resumeRecording = async () => {
    if (!recordingRef.current || !isInitialized) return;
    try {
      await recordingRef.current.resumeAsync();
      setRecorderState(prev => ({
        ...prev,
        isPaused: false
      }));
    } catch (error) {
      console.error("Error resuming recording:", error);
    }
  };

  const getRecordingStatus = () => {
    return {
      isRecording: recorderState.isRecording,
      isPaused: recorderState.isPaused,
      duration: recorderState.duration,
      uri: recorderState.uri,
    };
  };

  return {
    audioRecorder: recordingRef.current,
    recorderState,
    audioError,
    isInitialized,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    getRecordingStatus,
  };
};
