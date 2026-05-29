import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import LockScreen from './components/LockScreen';
import Scrapbook from './components/Scrapbook';

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [giftData, setGiftData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  
  const audioRef = useRef(null);

  // Initialize the audio instance with loop enabled
  useEffect(() => {
    audioRef.current = new Audio('/assets/Soch Na Sake [SlowedReverb] Song Lyrics  Arijit Singh, Tulsi Kumar.mp3');
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Unlock callback invoked when 4 digits are typed
  const handleUnlock = async (passcode) => {
    try {
      setErrorMsg(''); // Clear previous errors
      const response = await axios.post('http://localhost:5000/api/gift/unlock', { passcode });
      
      if (response.status === 200) {
        setGiftData(response.data);
        setIsUnlocked(true);

        // Play the background song automatically upon successful unlock
        if (audioRef.current) {
          audioRef.current.play()
            .then(() => {
              setIsAudioPlaying(true);
            })
            .catch((err) => {
              console.warn('Audio autoplay prevented by browser permissions. Direct click on music controls will resolve this.', err);
            });
        }
      }
    } catch (error) {
      console.error('Passcode verification error:', error);
      if (error.response && error.response.status === 401) {
        setErrorMsg('Incorrect passcode');
      } else {
        setErrorMsg('Server connection failed');
      }
      
      // Auto-clear the error message after a short period to allow re-shaking on next attempt
      setTimeout(() => {
        setErrorMsg('');
      }, 3000);
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setGiftData(null);
    setErrorMsg('');

    // Stop and reset the background song when closing the scrapbook
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsAudioPlaying(false);
    }
  };

  // Toggle background song playback
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => {
            setIsAudioPlaying(true);
          })
          .catch((err) => {
            console.error('Audio play failed:', err);
          });
      }
    }
  };

  return (
    <div>
      {isUnlocked && giftData ? (
        <Scrapbook 
          giftData={giftData} 
          onLock={handleLock} 
          isAudioPlaying={isAudioPlaying}
          toggleAudio={toggleAudio}
        />
      ) : (
        <LockScreen onUnlock={handleUnlock} errorMsg={errorMsg} />
      )}
    </div>
  );
}

export default App;
