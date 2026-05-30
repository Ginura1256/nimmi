import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import LockScreen from './components/LockScreen';
import Scrapbook from './components/Scrapbook';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nimmi.onrender.com';

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [giftData, setGiftData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.5); // Default to 50% volume

  const audioRef = useRef(null);

  // Initialize the audio instance with loop enabled
  useEffect(() => {
    audioRef.current = new Audio('/assets/bg_song.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = audioVolume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Sync volume changes dynamically
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioVolume;
    }
  }, [audioVolume]);

  // Unlock callback invoked when 4 digits are typed
  const handleUnlock = async (passcode) => {
    try {
      setErrorMsg(''); // Clear previous errors
      const response = await axios.post(`${API_BASE_URL}/api/gift/unlock`, { passcode });

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

  const handleAddMemory = async (url, caption) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/gift/${giftData._id}/memories`, { url, caption });
      if (response.status === 200) {
        setGiftData(response.data);
        return true;
      }
    } catch (err) {
      console.error("Error adding memory:", err);
      alert("Failed to add memory: " + (err.response?.data?.error || err.message));
      return false;
    }
  };

  const handleAddWishlistItem = async (title, imageUrl) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/gift/${giftData._id}/wishlist`, { title, imageUrl });
      if (response.status === 200) {
        setGiftData(response.data);
        return true;
      }
    } catch (err) {
      console.error("Error adding wishlist item:", err);
      alert("Failed to add item: " + (err.response?.data?.error || err.message));
      return false;
    }
  };

  const handleToggleWishlistItem = async (itemId, isCompleted) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/api/gift/${giftData._id}/wishlist/${itemId}`, { isCompleted });
      if (response.status === 200) {
        setGiftData(response.data);
        return true;
      }
    } catch (err) {
      console.error("Error toggling wishlist item:", err);
      alert("Failed to update status: " + (err.response?.data?.error || err.message));
      return false;
    }
  };

  const handleDeleteWishlistItem = async (itemId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/gift/${giftData._id}/wishlist/${itemId}`);
      if (response.status === 200) {
        setGiftData(response.data);
        return true;
      }
    } catch (err) {
      console.error("Error deleting wishlist item:", err);
      alert("Failed to delete item: " + (err.response?.data?.error || err.message));
      return false;
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
          audioVolume={audioVolume}
          setAudioVolume={setAudioVolume}
          onAddMemory={handleAddMemory}
          onAddWishlistItem={handleAddWishlistItem}
          onToggleWishlistItem={handleToggleWishlistItem}
          onDeleteWishlistItem={handleDeleteWishlistItem}
        />
      ) : (
        <LockScreen onUnlock={handleUnlock} errorMsg={errorMsg} />
      )}
    </div>
  );
}

export default App;
