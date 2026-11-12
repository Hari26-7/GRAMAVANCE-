import { useState, useEffect, useRef, useCallback } from 'react';

export type SpeechLanguage = 'en-IN' | 'ta-IN' | 'hi-IN';

export interface UseSpeechRecognitionOptions {
  onTranscript?: (newFinalText: string) => void;
}

export interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  startListening: (lang?: SpeechLanguage) => void;
  stopListening: () => void;
  resetTranscript: () => void;
  clearError: () => void;
}

interface IWindowWithSpeech extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export function useSpeechRecognition(options?: UseSpeechRecognitionOptions): UseSpeechRecognitionReturn {
  // Check browser support synchronously on initial render
  const [isSupported, setIsSupported] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const win = window as unknown as IWindowWithSpeech;
    return Boolean(win && (win.SpeechRecognition || win.webkitSpeechRecognition));
  });

  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isManuallyStoppedRef = useRef<boolean>(false);
  const onTranscriptRef = useRef(options?.onTranscript);

  useEffect(() => {
    onTranscriptRef.current = options?.onTranscript;
  }, [options?.onTranscript]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore error on unmount
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  const stopListening = useCallback(() => {
    isManuallyStoppedRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Already stopped or not started
      }
    }
    setIsListening(false);
    setIsProcessing(false);
  }, []);

  const startListening = useCallback(
    (lang: SpeechLanguage = 'en-IN') => {
      setError(null);
      isManuallyStoppedRef.current = false;

      const win = typeof window !== 'undefined' ? (window as unknown as IWindowWithSpeech) : null;
      const SpeechRecognitionClass = win?.SpeechRecognition || win?.webkitSpeechRecognition;

      if (!SpeechRecognitionClass) {
        setError(
          'Voice recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.'
        );
        setIsSupported(false);
        return;
      }

      // Stop existing instance if any
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      try {
        const recognition = new SpeechRecognitionClass();
        recognitionRef.current = recognition;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = lang;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          setIsProcessing(false);
          setError(null);
        };

        recognition.onaudiostart = () => {
          setIsListening(true);
        };

        recognition.onspeechstart = () => {
          setIsProcessing(true);
        };

        recognition.onresult = (event: any) => {
          let currentFinal = '';
          let currentInterim = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const piece = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              currentFinal += piece;
            } else {
              currentInterim += piece;
            }
          }

          if (currentFinal) {
            const trimmed = currentFinal.trim();
            setTranscript((prev) => {
              const separator = prev && !prev.endsWith(' ') ? ' ' : '';
              return prev + separator + trimmed;
            });
            setInterimTranscript('');

            // Fire callback directly from the event handler
            if (onTranscriptRef.current) {
              onTranscriptRef.current(trimmed);
            }
          } else {
            setInterimTranscript(currentInterim);
          }
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          setIsProcessing(false);

          const errCode = event.error;
          if (errCode === 'not-allowed') {
            setError(
              'Microphone access was denied. Please allow microphone permissions in your browser URL bar.'
            );
          } else if (errCode === 'no-speech') {
            setError('No speech was detected. Please try speaking into your microphone again.');
          } else if (errCode === 'audio-capture') {
            setError(
              'No microphone found. Please ensure a working microphone is connected to your computer.'
            );
          } else if (errCode === 'network') {
            setError('Speech service network error. Please check your internet connection.');
          } else if (errCode === 'aborted') {
            if (!isManuallyStoppedRef.current) {
              setError('Speech recording was interrupted.');
            }
          } else {
            setError(`Speech recognition notice: ${errCode || 'Unknown issue'}`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          setIsProcessing(false);
          setInterimTranscript('');
        };

        recognition.start();
      } catch (err: any) {
        console.error('[Gramavance Voice] Failed to start recognition:', err);
        setIsListening(false);
        setIsProcessing(false);
        setError(err?.message || 'Failed to initialize microphone speech recognition.');
      }
    },
    []
  );

  return {
    isSupported,
    isListening,
    isProcessing,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    clearError,
  };
}

export default useSpeechRecognition;
