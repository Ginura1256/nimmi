import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Scrapbook({ giftData, onLock, isAudioPlaying, toggleAudio, onAddMemory, onAddWishlistItem, onToggleWishlistItem, onDeleteWishlistItem }) {
  const { recipientName, letterText, mediaUrls, wishlist = [] } = giftData;
  const [isOpen, setIsOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Active Tab state
  const [activeTab, setActiveTab] = useState('memories'); // 'memories' or 'wishlist'

  // State for Add Memory modal/form
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [inputMethod, setInputMethod] = useState('file'); // 'file' or 'url'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for Add Wishlist modal/form
  const [isAddWishlistOpen, setIsAddWishlistOpen] = useState(false);
  const [newWishlistTitle, setNewWishlistTitle] = useState('');
  const [newWishlistUrl, setNewWishlistUrl] = useState('');
  const [wishlistInputMethod, setWishlistInputMethod] = useState('file'); // 'file' or 'url'
  const [isWishlistSubmitting, setIsWishlistSubmitting] = useState(false);

  // Converts selected image file to base64 string
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert("Please upload an image file (PNG, JPG, JPEG, etc.)");
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        alert("Image is too large! Please select an image under 4MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit handler for adding a new memory
  const handleSubmitMemory = async (e) => {
    e.preventDefault();
    if (!newUrl) {
      alert("Please upload a photo or enter a photo URL!");
      return;
    }
    if (!newCaption.trim()) {
      alert("Please enter a caption!");
      return;
    }

    setIsSubmitting(true);
    const success = await onAddMemory(newUrl, newCaption);
    setIsSubmitting(false);

    if (success) {
      setIsAddModalOpen(false);
      setNewCaption('');
      setNewUrl('');
    }
  };

  // Converts selected wishlist image file to base64 string
  const handleWishlistFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert("Please upload an image file (PNG, JPG, JPEG, etc.)");
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        alert("Image is too large! Please select an image under 4MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewWishlistUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit handler for adding a new wishlist item
  const handleSubmitWishlist = async (e) => {
    e.preventDefault();
    if (!newWishlistTitle.trim()) {
      alert("Please enter a title/name for the item!");
      return;
    }

    setIsWishlistSubmitting(true);
    const success = await onAddWishlistItem(newWishlistTitle, newWishlistUrl || '');
    setIsWishlistSubmitting(false);

    if (success) {
      setIsAddWishlistOpen(false);
      setNewWishlistTitle('');
      setNewWishlistUrl('');
    }
  };

  // Handle open envelope with a custom flower bloom transition effect
  const handleOpenEnvelope = () => {
    setIsTransitioning(true);
    // Switch envelope screen to scrapbook screen when viewport is covered in petals (at 1.5s)
    setTimeout(() => {
      setIsOpen(true);
    }, 1500);
    // Clear transition overlay once animation completes (at 3.0s)
    setTimeout(() => {
      setIsTransitioning(false);
    }, 3000);
  };

  // Close zoomed modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setZoomedImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fallback captions for the polaroids matching the themed memory lane
  const captions = [
    "Elevator mirror selfies with you 🛗❤️",
    "That beautiful smile of yours close up ✨",
    "Sunny days outdoors together ☀️🌿",
    "Forever walking by your side 🌸",
    "Beautiful sunsets by the beach 🌊🌅",
    "Looking up at the trees, hand-in-hand 🌳✌️",
    "Close enough to hear your heart beat. ✨",
    "Lean on me, I got you forever 🧡",
    "Enjoying the fresh breeze outside 🌬️🌷"
  ];

  // Specific configuration tokens to match the organic, overlapping real scrapbook aesthetic
  const cardConfigs = [
    { rotation: "rotate-[3deg]", size: "w-64 sm:w-72", tapeRotation: "-rotate-[6deg]", tagColor: "bg-amber-50 text-stone-850 border-amber-200/80", tagPos: "-bottom-2 -right-3 rotate-[-2deg]", margin: "mt-6 md:mt-12 mb-20 md:mb-32" },
    { rotation: "-rotate-[4deg]", size: "w-64 sm:w-72", tapeRotation: "rotate-[4deg]", tagColor: "bg-rose-50 text-stone-850 border-rose-200/80", tagPos: "top-4 -left-4 rotate-[3deg]", margin: "mt-16 md:mt-28 mb-24 md:mb-40" },
    { rotation: "rotate-[2deg]", size: "w-64 sm:w-72", tapeRotation: "-rotate-[3deg]", tagColor: "bg-emerald-50 text-stone-850 border-emerald-200/80", tagPos: "-bottom-3 -left-3 rotate-[-3deg]", margin: "mt-8 md:mt-14 mb-20 md:mb-32" },
    { rotation: "-rotate-[3deg]", size: "w-64 sm:w-72", tapeRotation: "rotate-[5deg]", tagColor: "bg-sky-50 text-stone-850 border-sky-200/80", tagPos: "-bottom-2 -right-4 rotate-[4deg]", margin: "mt-20 md:mt-32 mb-28 md:mb-44" },
    { rotation: "rotate-[4deg]", size: "w-64 sm:w-72", tapeRotation: "-rotate-[4deg]", tagColor: "bg-purple-50 text-stone-850 border-purple-200/80", tagPos: "top-4 -right-3 rotate-[-2deg]", margin: "mt-10 md:mt-18 mb-20 md:mb-36" },
    { rotation: "-rotate-[2deg]", size: "w-64 sm:w-72", tapeRotation: "rotate-[3deg]", tagColor: "bg-yellow-50 text-stone-850 border-yellow-200/80", tagPos: "-bottom-3 -left-4 rotate-[4deg]", margin: "mt-24 md:mt-40 mb-32 md:mb-48" },
    { rotation: "rotate-[3deg]", size: "w-64 sm:w-72", tapeRotation: "-rotate-[5deg]", tagColor: "bg-teal-50 text-stone-850 border-teal-200/80", tagPos: "-bottom-2 -right-3 rotate-[-3deg]", margin: "mt-8 md:mt-12 mb-20 md:mb-32" },
    { rotation: "-rotate-[4deg]", size: "w-64 sm:w-72", tapeRotation: "rotate-[4deg]", tagColor: "bg-orange-50 text-stone-850 border-orange-200/80", tagPos: "top-4 -left-3 rotate-[2deg]", margin: "mt-18 md:mt-30 mb-24 md:mb-40" },
    { rotation: "rotate-[2deg]", size: "w-64 sm:w-72", tapeRotation: "-rotate-[3deg]", tagColor: "bg-pink-50 text-stone-850 border-pink-200/80", tagPos: "-bottom-3 -right-4 rotate-[-4deg]", margin: "mt-12 md:mt-20 mb-24 md:mb-36" }
  ];

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] text-stone-800 p-4 md:p-8 flex flex-col items-center relative overflow-x-hidden select-none font-serif-elegant">

      {/* 1. Full-Bleed Themed Floral Background Vector Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        {/* Top-left floral vector */}
        <svg className="absolute top-10 left-10 text-pink-300 w-32 h-32 md:w-48 md:h-48" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 100 100">
          <path d="M10,50 Q30,30 50,50 T90,50 M50,10 Q50,35 50,50 T50,90" />
          <circle cx="50" cy="50" r="8" fill="currentColor" className="text-pink-200" />
        </svg>
        {/* Bottom-right floral vector */}
        <svg className="absolute bottom-10 right-10 text-pink-300 w-40 h-40 md:w-56 md:h-56" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="12" />
          <path d="M50,10 L50,90 M10,50 L90,50" />
        </svg>
      </div>

      {/* Floating flower shapes that gently drift vertically */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-1/4 right-10 text-pink-400/30 text-xl pointer-events-none hidden md:block"
      >
        ✿
      </motion.div>
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 left-10 text-pink-400/30 text-xl pointer-events-none hidden md:block"
      >
        ❀
      </motion.div>

      {/* 2. Header Navigation Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl flex justify-between items-center mb-8 border-b border-stone-200/80 pb-4 z-10"
      >
        <span className="font-cursive text-3xl text-pink-700 font-bold tracking-wide">A Bouquet for You</span>
        <div className="flex items-center gap-3">
          {/* Music Controller Button */}
          <button
            onClick={toggleAudio}
            className={`text-[11px] font-sans font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 border px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm ${isAudioPlaying
              ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100/80'
              : 'bg-white/70 border-stone-200 text-stone-400 hover:text-stone-750'
              }`}
            title={isAudioPlaying ? "Mute Background Song" : "Play Background Song"}
          >
            {isAudioPlaying ? (
              <>
                <span className="flex items-center gap-[2px] h-3">
                  <span className="w-[2px] h-2.5 bg-rose-600 rounded-full animate-bounce [animation-duration:0.6s]"></span>
                  <span className="w-[2px] h-3.5 bg-rose-600 rounded-full animate-bounce [animation-duration:0.8s] delay-75"></span>
                  <span className="w-[2px] h-2 bg-rose-600 rounded-full animate-bounce [animation-duration:0.5s] delay-150"></span>
                </span>
                Playing
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-3.5 h-3.5 text-stone-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6L4.5 9H1.5v6h3l4.5 3.75V5.25z" />
                </svg>
                Muted
              </>
            )}
          </button>

          {/* Lock Screen Button */}
          <button
            onClick={onLock}
            className="text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-400 hover:text-stone-770 transition-colors flex items-center gap-1.5 border border-stone-200 bg-white/70 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25z" />
            </svg>
            Lock Screen
          </button>
        </div>
      </motion.div>

      {/* AnimatePresence for transitions between envelope closed and open scrapbook view */}
      <div className="w-full max-w-4xl flex flex-col items-center z-10">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* ENVELOPE CLOSED VIEW */
            <motion.div
              key="envelope"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              onClick={handleOpenEnvelope}
              className="w-full max-w-md bg-[#FAF0E6] rounded-2xl shadow-2xl p-6 md:p-8 cursor-pointer relative border border-stone-200/60 overflow-hidden transform hover:-translate-y-1 hover:shadow-3xl transition-all duration-300"
            >
              {/* Background texture overlay */}
              <div className="absolute inset-0 bg-[#fdfaf7] opacity-60" />

              <div className="relative flex flex-col items-center py-10 md:py-16">
                {/* Wax Seal Graphic */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-16 h-16 rounded-full bg-rose-700 shadow-lg shadow-rose-900/40 flex items-center justify-center text-white border-2 border-rose-600/60 mb-6"
                >
                  <span className="font-serif-elegant font-bold text-xl select-none">L</span>
                </motion.div>

                <h3 className="font-cursive text-3xl text-stone-700 mb-2">You have a secret letter</h3>
                <p className="text-stone-400 font-sans text-xs uppercase tracking-widest mb-6">From your future husband</p>

                <span className="text-xs text-rose-600/70 font-sans tracking-wide uppercase px-4 py-2 border border-rose-200/50 rounded-full bg-rose-50/50 animate-pulse">
                  Click to open envelope
                </span>
              </div>
            </motion.div>
          ) : (
            /* SCRAPBOOK CONTENT DISPLAY */
            <motion.div
              key="scrapbook-opened"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col items-center"
            >
              {/* 3. Stylized Parchment Text Container */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="w-full max-w-xl bg-white border border-stone-200/80 rounded-2xl shadow-xl p-6 md:p-8 relative overflow-hidden mb-12"
              >
                <div className="absolute inset-0 bg-[#fffdfc] opacity-60 pointer-events-none" />

                {/* Header detail */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashed border-stone-200 relative">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-sans font-bold">From:</span>
                    <h2 className="font-cursive text-2xl text-stone-700 font-semibold">ginura</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-sans font-bold">For:</span>
                    <h2 className="font-cursive text-2xl text-stone-700 font-semibold">Nimnadi</h2>
                  </div>
                </div>

                {/* Wax Seal overlay on document */}
                <div className="flex justify-center mb-6 relative">
                  <div className="w-12 h-12 rounded-full bg-rose-700 shadow-md shadow-rose-900/30 flex items-center justify-center text-white border border-rose-600/50">
                    <span className="font-serif-elegant font-bold text-lg select-none">L</span>
                  </div>
                </div>

                {/* Main letter body with premium dark card layout */}
                <div className="bg-[#2c2927] text-[#eae5db] p-6 rounded-xl shadow-inner relative leading-relaxed tracking-wide text-center">
                  <div className="absolute top-2 left-4 text-rose-500/20 font-serif-elegant text-5xl">“</div>
                  <p className="font-serif-elegant text-[14px] md:text-[15px] italic relative z-10 px-2 py-2 leading-7 whitespace-pre-line">
                    {letterText}
                  </p>
                  <div className="absolute bottom-0 right-4 text-rose-500/20 font-serif-elegant text-5xl">”</div>
                </div>

                {/* Signature details */}
                <div className="mt-8 text-center relative">
                  <p className="font-cursive text-3xl text-pink-700">always yours,</p>
                  <p className="font-cursive text-xl text-stone-500 mt-1">ginura ❤️</p>
                </div>
              </motion.div>

              {/* Tabs for Memories and Wishlist */}
              <div className="flex gap-4 justify-center mb-8 mt-6 relative z-10">
                <button
                  onClick={() => setActiveTab('memories')}
                  className={`px-6 py-2.5 rounded-full font-semibold font-sans tracking-wide uppercase transition-all duration-300 text-xs md:text-sm border shadow-sm ${activeTab === 'memories'
                    ? 'bg-pink-600 border-pink-650 text-white shadow-md shadow-pink-900/20 scale-[1.03]'
                    : 'bg-white/80 border-stone-200 text-stone-400 hover:text-stone-700 hover:bg-white'
                    }`}
                >
                  🌸 Our Memories
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`px-6 py-2.5 rounded-full font-semibold font-sans tracking-wide uppercase transition-all duration-300 text-xs md:text-sm border shadow-sm ${activeTab === 'wishlist'
                    ? 'bg-pink-600 border-pink-650 text-white shadow-md shadow-pink-900/20 scale-[1.03]'
                    : 'bg-white/80 border-stone-200 text-stone-400 hover:text-stone-700 hover:bg-white'
                    }`}
                >
                  ✨ Future Wishlist
                </button>
              </div>

              {/* 4. Asymmetrical Organic Scrapbook Collage with Washi Tape and Overlapping Sticky Notes */}
              {activeTab === 'memories' && ((mediaUrls && mediaUrls.length > 0) || (giftData.memories && giftData.memories.length > 0)) && (
                <div className="w-full max-w-5xl mt-4 relative flex flex-col items-center">
                  <h3 className="font-cursive text-center text-4xl text-stone-700 mb-10 tracking-wide">
                    Our Memories
                  </h3>

                  {/* Scrapbook Doodle Sketches scattered behind photos */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-[0.45] z-0">
                    {/* Top Section */}
                    <span className="absolute top-[3%] left-[4%] text-6xl text-pink-300 rotate-[-12deg] filter drop-shadow-sm font-cursive">🌸</span>
                    <span className="absolute top-[8%] right-[6%] text-7xl text-sky-300 rotate-[15deg] filter drop-shadow-sm font-cursive">✨</span>
                    <span className="absolute top-[15%] left-[8%] text-5xl text-rose-350 rotate-[20deg] filter drop-shadow-sm font-cursive">🧸</span>
                    <span className="absolute top-[22%] right-[8%] text-6xl text-pink-450 rotate-[-15deg] filter drop-shadow-sm font-cursive animate-pulse">❤️</span>

                    {/* Upper Mid Section */}
                    <span className="absolute top-[32%] left-[3%] text-6xl text-rose-350/90 rotate-[-8deg] filter drop-shadow-sm font-cursive">🎀</span>
                    <span className="absolute top-[38%] right-[5%] text-7xl text-amber-300 rotate-[18deg] filter drop-shadow-sm font-cursive">💖</span>
                    <span className="absolute top-[44%] left-[6%] text-5xl text-emerald-300 rotate-[10deg] filter drop-shadow-sm font-cursive">🍀</span>

                    {/* Center Section */}
                    <span className="absolute top-[52%] right-[7%] text-6xl text-amber-400 rotate-[-12deg] filter drop-shadow-sm font-cursive">🌻</span>
                    <span className="absolute top-[58%] left-[4%] text-7xl text-pink-400 rotate-[25deg] filter drop-shadow-sm font-cursive">💌</span>
                    <span className="absolute top-[64%] right-[4%] text-5xl text-purple-300 rotate-[-10deg] filter drop-shadow-sm font-cursive">☁️</span>

                    {/* Lower Mid Section */}
                    <span className="absolute top-[72%] left-[7%] text-6xl text-red-400 rotate-[15deg] filter drop-shadow-sm font-cursive">🍓</span>
                    <span className="absolute top-[78%] right-[8%] text-6xl text-rose-450/90 rotate-[-20deg] filter drop-shadow-sm font-cursive animate-pulse">❤️</span>
                    <span className="absolute top-[84%] left-[5%] text-5xl text-sky-400 rotate-[12deg] filter drop-shadow-sm font-cursive">🎈</span>

                    {/* Bottom Section */}
                    <span className="absolute top-[90%] right-[6%] text-7xl text-amber-350 rotate-[-5deg] filter drop-shadow-sm font-cursive">⭐</span>
                    <span className="absolute top-[94%] left-[6%] text-6xl text-pink-300 rotate-[18deg] filter drop-shadow-sm font-cursive">🧁</span>
                  </div>

                  {/* Columns masonry layout matching the kid's adventures reference */}
                  <div className="columns-1 sm:columns-2 md:columns-3 gap-16 md:gap-24 [column-fill:_balance] w-full px-4 md:px-8 mt-8 relative z-10">

                    {/* Add Memory Polaroid Card */}
                    <motion.div
                      whileHover={{ scale: 1.04, rotate: 0, y: -4 }}
                      onClick={() => setIsAddModalOpen(true)}
                      className="break-inside-avoid bg-white p-3 pb-8 shadow-lg border border-dashed border-pink-300/60 hover:border-pink-400 hover:bg-pink-50/10 transform rotate-[-2deg] mt-6 md:mt-12 mb-20 md:mb-32 w-64 sm:w-72 mx-auto flex flex-col cursor-pointer transition-all duration-300"
                    >
                      <div className="w-full aspect-[4/3] bg-stone-50 border border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 mb-2 rounded-sm relative">
                        <span className="text-4xl font-light text-pink-400/80 mb-1">+</span>
                        <span className="text-xs uppercase tracking-wider font-sans font-semibold text-stone-500">Add Memory</span>
                      </div>
                      <div className="bg-amber-50/70 text-stone-750 border border-amber-200/50 shadow-sm px-3 py-2 max-w-[170px] mx-auto rounded-sm rotate-[1deg] text-center mt-2">
                        <p className="font-cursive text-sm">Click here to add one of our moments ❤️</p>
                      </div>
                    </motion.div>

                    {(() => {
                      const seeded = mediaUrls ? mediaUrls.map((url, idx) => ({
                        url,
                        caption: captions[idx % captions.length]
                      })) : [];
                      const added = giftData.memories || [];
                      const combined = [...seeded, ...added];

                      return combined.map((memory, index) => {
                        const config = cardConfigs[index % cardConfigs.length];
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: "-40px" }}
                            whileHover={{ scale: 1.06, rotate: 0, y: -8, zIndex: 40, boxShadow: "0 25px 50px -12px rgba(87, 72, 64, 0.25)" }}
                            transition={{ type: "spring", stiffness: 120, damping: 14 }}
                            onClick={() => setZoomedImage({ url: memory.url, caption: memory.caption })}
                            className={`break-inside-avoid bg-white p-3 pb-8 shadow-xl border border-stone-200/50 hover:border-pink-300/40 transform ${config.rotation} ${config.margin} transition-all duration-300 ${config.size} mx-auto relative flex flex-col cursor-zoom-in`}
                          >
                            {/* Washi Tape Strip at the top of the photo */}
                            <div
                              className={`absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-yellow-100/70 border-l border-r border-dashed border-stone-400/20 shadow-sm pointer-events-none ${config.tapeRotation} z-10`}
                              style={{ mixBlendMode: "multiply" }}
                            />

                            {/* Photo Frame */}
                            <div className="w-full bg-stone-100 overflow-hidden relative border border-stone-100 mb-2">
                              <img
                                src={memory.url}
                                alt={`Memory ${index + 1}`}
                                className="w-full h-auto object-cover filter brightness-[0.98] sepia-[0.05]"
                                loading="lazy"
                              />
                              {/* Glossy overlay effect */}
                              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
                            </div>

                            {/* Overlapping Handwritten Caption sticky note */}
                            <div className={`absolute ${config.tagPos} ${config.tagColor} border shadow-md px-3 py-1.5 max-w-[170px] rounded-sm z-20 pointer-events-none`}>
                              <p className="font-cursive text-[14px] leading-snug text-left select-none">
                                {memory.caption}
                              </p>
                            </div>
                          </motion.div>
                        );
                      });
                    })()}
                  </div>

                  {/* Ending Romantic Letter Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.0, ease: "easeOut" }}
                    className="w-full max-w-lg bg-[#faf8f5] border border-stone-200/60 rounded-2xl shadow-xl p-8 relative overflow-hidden mt-20 mb-16 mx-auto text-center"
                  >
                    {/* Decorative subtle botanical line art bg */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
                      <svg className="w-full h-full text-pink-900" fill="currentColor" viewBox="0 0 100 100">
                        <path d="M50,10 C40,30 20,40 50,80 C80,40 60,30 50,10 Z" />
                      </svg>
                    </div>

                    {/* Washi Tape Strip at the top of the ending letter */}
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-pink-100/60 border-l border-r border-dashed border-pink-300/30 shadow-sm pointer-events-none rotate-[2deg] z-10"
                      style={{ mixBlendMode: "multiply" }}
                    />

                    {/* Floral decorative icon */}
                    <span className="text-4xl text-rose-500/80 block mb-4 select-none">🌹</span>

                    {/* Handwritten love message */}
                    <p className="font-cursive text-2xl text-stone-750 leading-relaxed px-2">
                      "Loving you is the best decision I've made in my life . thank you for being you and I will always choose for forever and ever"
                    </p>

                    {/* Subtle heart accent */}
                    <span className="text-xl text-rose-400 block mt-4 animate-pulse select-none">❤️</span>
                  </motion.div>
                </div>
              )}

              {/* 4.5 Wishlist Tab Content Display */}
              {activeTab === 'wishlist' && (
                <div className="w-full max-w-5xl mt-4 relative flex flex-col items-center">
                  <h3 className="font-cursive text-center text-4xl text-stone-700 mb-2 tracking-wide">
                    Our Wishlist
                  </h3>
                  <p className="font-serif-elegant italic text-stone-500 text-sm mb-10 text-center max-w-md">
                    "A beautiful collection of dreams and things we wish to buy and share in our future together..."
                  </p>

                  {/* Columns masonry or grid layout for wishlist items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 md:gap-16 w-full px-4 md:px-8 relative z-10">

                    {/* Add Item Card */}
                    <motion.div
                      whileHover={{ scale: 1.04, rotate: 0, y: -4 }}
                      onClick={() => setIsAddWishlistOpen(true)}
                      className="bg-white p-3 pb-8 shadow-lg border border-dashed border-pink-300/60 hover:border-pink-400 hover:bg-pink-50/10 transform rotate-[1.5deg] w-64 sm:w-72 mx-auto flex flex-col cursor-pointer transition-all duration-300 h-[380px]"
                    >
                      <div className="w-full h-[220px] bg-stone-50 border border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 mb-4 rounded-sm relative">
                        <span className="text-4xl font-light text-pink-400/80 mb-1">+</span>
                        <span className="text-xs uppercase tracking-wider font-sans font-semibold text-stone-500">Add Item</span>
                      </div>
                      <div className="bg-amber-50/70 text-stone-750 border border-amber-200/50 shadow-sm px-3 py-2 max-w-[200px] mx-auto rounded-sm rotate-[-1deg] text-center mt-auto">
                        <p className="font-cursive text-sm">Add something to our list ❤️</p>
                      </div>
                    </motion.div>

                    {/* Wishlist Items list */}
                    {wishlist.length === 0 ? (
                      <div className="col-span-full py-16 text-center">
                        <p className="font-serif-elegant italic text-stone-400 text-base">
                          Our wishlist is empty right now. Click on "Add Item" to add our first dream together!
                        </p>
                      </div>
                    ) : (
                      wishlist.map((item, index) => {
                        const rotDegrees = (index % 3 === 0) ? "-rotate-[3deg]" : (index % 3 === 1) ? "rotate-[2deg]" : "rotate-[-1.5deg]";
                        const tapeRot = (index % 2 === 0) ? "rotate-[4deg]" : "-rotate-[3deg]";
                        return (
                          <motion.div
                            key={item._id || index}
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            whileHover={{ scale: 1.04, rotate: 0, y: -6, zIndex: 30 }}
                            className={`bg-white p-3 pb-6 shadow-xl border border-stone-200/50 hover:border-pink-300/40 transform ${rotDegrees} w-64 sm:w-72 mx-auto relative flex flex-col h-[380px] transition-all duration-300`}
                          >
                            {/* Washi Tape Strip at the top */}
                            <div
                              className={`absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-yellow-100/70 border-l border-r border-dashed border-stone-400/20 shadow-sm pointer-events-none ${tapeRot} z-10`}
                              style={{ mixBlendMode: "multiply" }}
                            />

                            {/* Item Image */}
                            <div className={`w-full h-[220px] bg-stone-100 overflow-hidden relative border border-stone-100 mb-4 rounded-sm ${item.imageUrl ? 'cursor-zoom-in' : 'cursor-default'}`}
                              onClick={() => item.imageUrl && setZoomedImage({ url: item.imageUrl, caption: item.title })}>
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.title}
                                  className="w-full h-full object-cover filter brightness-[0.98] sepia-[0.02]"
                                  loading="lazy"
                                />
                              ) : (
                                (() => {
                                  const stickers = ["🎁", "💖", "🧸", "🏡", "✈️", "☕", "🍿", "💍", "🎨"];
                                  const stickerEmoji = stickers[index % stickers.length];
                                  const stickerLabels = [
                                    "For Us ❤️",
                                    "Our Dream ✨",
                                    "Future Plan 🌸",
                                    "Sweet Life 🍯",
                                    "Together 🥂"
                                  ];
                                  const stickerLabel = stickerLabels[index % stickerLabels.length];
                                  return (
                                    <div className="w-full h-full bg-gradient-to-tr from-pink-50 to-amber-50/60 flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
                                      {/* Sticker Badge design */}
                                      <div className="w-28 h-28 rounded-full bg-white border-4 border-dashed border-pink-300 shadow-md flex flex-col items-center justify-center rotate-[3deg] transition-transform duration-300 hover:rotate-[-3deg] relative z-10">
                                        <span className="text-4xl filter drop-shadow-sm mb-1">{stickerEmoji}</span>
                                        <span className="font-cursive text-xs text-pink-600 font-semibold tracking-wide">{stickerLabel}</span>
                                        {/* Inner shine */}
                                        <div className="absolute inset-0 rounded-full border border-pink-100/30 pointer-events-none" />
                                      </div>

                                      {/* Decorative sparkles / doodles behind the sticker */}
                                      <span className="absolute top-[10%] left-[15%] text-lg opacity-40 rotate-[10deg]">✨</span>
                                      <span className="absolute bottom-[15%] right-[15%] text-lg opacity-40 rotate-[-15deg]">✨</span>
                                      <span className="absolute top-[20%] right-[18%] text-base opacity-30">🌸</span>
                                      <span className="absolute bottom-[20%] left-[18%] text-base opacity-30">💖</span>
                                    </div>
                                  );
                                })()
                              )}
                              {/* Completed Stamp Overlay */}
                              {item.isCompleted && (
                                <div className="absolute inset-0 bg-stone-900/20 flex items-center justify-center z-20">
                                  <motion.div
                                    initial={{ scale: 0.5, rotate: -30, opacity: 0 }}
                                    animate={{ scale: 1, rotate: -15, opacity: 1 }}
                                    className="border-4 border-emerald-500 text-emerald-500 font-sans font-black uppercase text-xl px-4 py-1.5 rounded-lg tracking-widest bg-white/95 shadow-md flex items-center gap-1 select-none"
                                  >
                                    Bought! ❤️
                                  </motion.div>
                                </div>
                              )}
                            </div>

                            {/* Delete button sticker overlaying the top-right corner of image container */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                onDeleteWishlistItem(item._id);
                              }}
                              className="absolute top-5 right-5 z-30 bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-700 w-6 h-6 rounded-full flex items-center justify-center shadow-md border border-rose-200/50 transition-colors hover:scale-110 active:scale-95"
                              title="Delete Item"
                            >
                              <span className="text-xs font-bold font-sans">×</span>
                            </button>

                            {/* Title & Checkbox Area */}
                            <div className="flex flex-col flex-grow justify-between">
                              <h4 className={`font-cursive text-lg text-stone-750 px-1 leading-snug line-clamp-2 ${item.isCompleted ? 'line-through text-stone-400' : ''}`}>
                                {item.title}
                              </h4>

                              <label className="flex items-center gap-2 mt-2 cursor-pointer select-none border-t border-stone-100 pt-2.5">
                                <input
                                  type="checkbox"
                                  checked={item.isCompleted}
                                  onChange={(e) => onToggleWishlistItem(item._id, e.target.checked)}
                                  className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 border-stone-300 focus:ring-opacity-50 cursor-pointer"
                                />
                                <span className={`text-xs font-sans font-semibold tracking-wide uppercase ${item.isCompleted ? 'text-emerald-600' : 'text-stone-400'}`}>
                                  {item.isCompleted ? 'Completed! ✓' : 'Completed?'}
                                </span>
                              </label>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. Lightbox Zoom Modal overlay */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImage(null)}
            className="fixed inset-0 bg-stone-900/90 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out"
          >
            {/* Close Button */}
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 rounded-full bg-white/10 hover:bg-white/20"
              title="Close Zoom View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 150, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-4 pb-12 shadow-2xl border border-stone-200/50 max-w-lg md:max-w-xl w-full flex flex-col items-center relative rounded-md cursor-default"
            >
              {/* Washi Tape Strip at the top of the photo */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-yellow-100/80 border-l border-r border-dashed border-stone-400/20 shadow-sm pointer-events-none -rotate-[3deg] z-10"
                style={{ mixBlendMode: "multiply" }}
              />

              {/* Main Zoomed Photo */}
              <div className="w-full bg-stone-150 overflow-hidden relative border border-stone-100 mb-6 rounded-sm">
                <img
                  src={zoomedImage.url}
                  alt="Zoomed Memory"
                  className="w-full h-auto max-h-[60vh] object-contain mx-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
              </div>

              {/* Larger Handwritten Caption Note */}
              <div className="bg-amber-50/95 text-stone-850 border border-amber-200/80 shadow-md px-6 py-2.5 rotate-[-1deg] max-w-[90%] rounded-sm">
                <p className="font-cursive text-xl leading-snug text-center">
                  {zoomedImage.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Add Memory Modal Overlay */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 150, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FAF6F0] p-6 md:p-8 shadow-2xl border border-stone-200/80 max-w-md w-full relative rounded-2xl flex flex-col font-serif-elegant text-stone-850"
            >
              {/* Decorative tape at top */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-pink-100/60 border-l border-r border-dashed border-pink-300/30 shadow-sm pointer-events-none rotate-[-2deg] z-10"
                style={{ mixBlendMode: "multiply" }}
              />

              <h3 className="font-cursive text-3xl text-stone-755 text-center mb-6">
                Add a New Memory
              </h3>

              <form onSubmit={handleSubmitMemory} className="flex flex-col gap-4">
                {/* Input Method Toggle */}
                <div className="flex bg-stone-200/50 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => { setInputMethod('file'); setNewUrl(''); }}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${inputMethod === 'file' ? 'bg-white shadow-sm text-pink-700' : 'text-stone-500 hover:text-stone-750'}`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => { setInputMethod('url'); setNewUrl(''); }}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${inputMethod === 'url' ? 'bg-white shadow-sm text-pink-700' : 'text-stone-500 hover:text-stone-750'}`}
                  >
                    Image URL
                  </button>
                </div>

                {/* File Upload Selector */}
                {inputMethod === 'file' ? (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-stone-300 rounded-xl p-4 bg-white/40 hover:bg-white hover:border-pink-450 transition-colors relative cursor-pointer min-h-[140px]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />
                    {newUrl ? (
                      <div className="w-full flex flex-col items-center gap-2">
                        <img src={newUrl} alt="Preview" className="max-h-[100px] object-contain rounded-md shadow-sm border border-stone-200" />
                        <span className="text-[10px] text-pink-600 font-semibold tracking-wide uppercase bg-pink-50 px-2 py-0.5 rounded-full">Photo Selected</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-stone-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 mb-1 text-stone-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                        </svg>
                        <span className="text-xs font-semibold">Choose photo from library</span>
                        <span className="text-[10px] text-stone-450 mt-1">Supports PNG, JPG, JPEG (Max 4MB)</span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* URL Input */
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-400">Image URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      className="border border-stone-200/80 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-350 font-sans"
                    />
                    {newUrl && (
                      <div className="mt-2 text-center">
                        <img
                          src={newUrl}
                          alt="Preview"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                          onLoad={(e) => {
                            e.target.style.display = 'inline-block';
                          }}
                          className="max-h-[100px] object-contain rounded-md shadow-sm border border-stone-200"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Caption Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-400">Sweet Memory Caption</label>
                  <textarea
                    rows="2"
                    placeholder="Describe this moment... (e.g. Sunny days outdoors together ☀️🌿)"
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    className="border border-stone-200/80 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-300 font-sans resize-none"
                    maxLength="80"
                  />
                  <div className="text-right text-[10px] text-stone-400 font-sans">
                    {newCaption.length}/80 chars
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setNewCaption('');
                      setNewUrl('');
                    }}
                    className="flex-1 py-2 text-xs font-semibold font-sans tracking-wide uppercase border border-stone-200 text-stone-400 hover:text-stone-700 bg-white/40 hover:bg-white rounded-full transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2 text-xs font-semibold font-sans tracking-wide uppercase bg-pink-600 hover:bg-pink-700 text-white rounded-full transition-all shadow-md shadow-pink-900/10 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Memory'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. Add Wishlist Item Modal Overlay */}
      <AnimatePresence>
        {isAddWishlistOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 150, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FAF6F0] p-6 md:p-8 shadow-2xl border border-stone-200/80 max-w-md w-full relative rounded-2xl flex flex-col font-serif-elegant text-stone-850"
            >
              {/* Decorative tape at top */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-pink-100/60 border-l border-r border-dashed border-pink-300/30 shadow-sm pointer-events-none rotate-[2deg] z-10"
                style={{ mixBlendMode: "multiply" }}
              />

              <h3 className="font-cursive text-3xl text-stone-755 text-center mb-6">
                Add Wishlist Item
              </h3>

              <form onSubmit={handleSubmitWishlist} className="flex flex-col gap-4">
                {/* Input Method Toggle */}
                <div className="flex bg-stone-200/50 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => { setWishlistInputMethod('file'); setNewWishlistUrl(''); }}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${wishlistInputMethod === 'file' ? 'bg-white shadow-sm text-pink-700' : 'text-stone-500 hover:text-stone-750'}`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => { setWishlistInputMethod('url'); setNewWishlistUrl(''); }}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${wishlistInputMethod === 'url' ? 'bg-white shadow-sm text-pink-700' : 'text-stone-500 hover:text-stone-750'}`}
                  >
                    Image URL
                  </button>
                </div>

                {/* File Upload Selector */}
                {wishlistInputMethod === 'file' ? (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-stone-300 rounded-xl p-4 bg-white/40 hover:bg-white hover:border-pink-450 transition-colors relative cursor-pointer min-h-[140px]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleWishlistFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />
                    {newWishlistUrl ? (
                      <div className="w-full flex flex-col items-center gap-2">
                        <img src={newWishlistUrl} alt="Preview" className="max-h-[100px] object-contain rounded-md shadow-sm border border-stone-200" />
                        <span className="text-[10px] text-pink-600 font-semibold tracking-wide uppercase bg-pink-50 px-2 py-0.5 rounded-full">Photo Selected</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-stone-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 mb-1 text-stone-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                        </svg>
                        <span className="text-xs font-semibold">Choose photo from library</span>
                        <span className="text-[10px] text-stone-450 mt-1">Supports PNG, JPG, JPEG (Max 4MB)</span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* URL Input */
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-400">Image URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={newWishlistUrl}
                      onChange={(e) => setNewWishlistUrl(e.target.value)}
                      className="border border-stone-200/80 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-350 font-sans"
                    />
                    {newWishlistUrl && (
                      <div className="mt-2 text-center">
                        <img
                          src={newWishlistUrl}
                          alt="Preview"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                          onLoad={(e) => {
                            e.target.style.display = 'inline-block';
                          }}
                          className="max-h-[100px] object-contain rounded-md shadow-sm border border-stone-200"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Title Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-400">Wishlist Item Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Matching couple coffee mugs ☕✨"
                    value={newWishlistTitle}
                    onChange={(e) => setNewWishlistTitle(e.target.value)}
                    className="border border-stone-200/80 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-350 font-sans"
                    maxLength="80"
                  />
                  <div className="text-right text-[10px] text-stone-400 font-sans">
                    {newWishlistTitle.length}/80 chars
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddWishlistOpen(false);
                      setNewWishlistTitle('');
                      setNewWishlistUrl('');
                    }}
                    className="flex-1 py-2 text-xs font-semibold font-sans tracking-wide uppercase border border-stone-200 text-stone-400 hover:text-stone-700 bg-white/40 hover:bg-white rounded-full transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isWishlistSubmitting}
                    className="flex-1 py-2 text-xs font-semibold font-sans tracking-wide uppercase bg-pink-600 hover:bg-pink-700 text-white rounded-full transition-all shadow-md shadow-pink-900/10 disabled:opacity-50"
                  >
                    {isWishlistSubmitting ? 'Saving...' : 'Save Item'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flower Bloom Screen Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#FAF6F0] z-[60] flex items-center justify-center overflow-hidden pointer-events-none"
          >
            {/* Soft pink flash background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0.4, 0] }}
              transition={{ duration: 3.0 }}
              className="absolute inset-0 bg-pink-100"
            />

            {/* Bloom Petals / Flowers Grid */}
            {Array.from({ length: 40 }).map((_, i) => {
              const angle = (i * 360) / 40;
              const distance = i % 3 === 0 ? 250 : i % 2 === 0 ? 450 : 750;
              const startX = 0;
              const startY = 0;
              const endX = Math.cos((angle * Math.PI) / 180) * distance;
              const endY = Math.sin((angle * Math.PI) / 180) * distance;

              const flowerEmojis = ["🌸", "💮", "🌺", "🌼", "🏵️", "🌷", "🌸", "💮", "🌺"];
              const emoji = flowerEmojis[i % flowerEmojis.length];
              const sizeClass = i % 4 === 0 ? "text-6xl" : i % 2 === 0 ? "text-5xl" : "text-3xl";

              return (
                <motion.div
                  key={i}
                  initial={{
                    x: startX,
                    y: startY,
                    scale: 0,
                    rotate: 0,
                    opacity: 0
                  }}
                  animate={{
                    x: endX,
                    y: endY,
                    scale: [0, 2.2, 2.2, 0],
                    rotate: i % 2 === 0 ? 360 : -360,
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{
                    duration: 2.8,
                    ease: "easeInOut",
                    delay: (i % 10) * 0.04
                  }}
                  className={`absolute select-none pointer-events-none ${sizeClass} transform-gpu will-change-transform`}
                >
                  {emoji}
                </motion.div>
              );
            })}

            {/* Centered Cluster of Large Growing Flower Blossoms */}
            <div className="absolute flex items-center justify-center pointer-events-none">
              {/* Center */}
              <motion.div
                initial={{ scale: 0, rotate: 0, opacity: 0 }}
                animate={{
                  scale: [0, 6, 9, 0],
                  rotate: [0, 90, 180, 270],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{ duration: 3.0, ease: "easeInOut" }}
                className="text-9xl absolute select-none text-pink-400 transform-gpu will-change-transform z-10"
              >
                🌸
              </motion.div>

              {/* Top Left */}
              <motion.div
                initial={{ scale: 0, rotate: 0, opacity: 0, x: -100, y: -100 }}
                animate={{
                  scale: [0, 5, 8, 0],
                  rotate: [0, -90, -180, -270],
                  opacity: [0, 0.9, 0.9, 0]
                }}
                transition={{ duration: 3.0, ease: "easeInOut", delay: 0.05 }}
                className="text-8xl absolute select-none text-rose-300 transform-gpu will-change-transform"
              >
                🌺
              </motion.div>

              {/* Top Right */}
              <motion.div
                initial={{ scale: 0, rotate: 0, opacity: 0, x: 100, y: -100 }}
                animate={{
                  scale: [0, 5, 8, 0],
                  rotate: [0, 90, 180, 270],
                  opacity: [0, 0.9, 0.9, 0]
                }}
                transition={{ duration: 3.0, ease: "easeInOut", delay: 0.1 }}
                className="text-8xl absolute select-none text-amber-200 transform-gpu will-change-transform"
              >
                💮
              </motion.div>

              {/* Bottom Left */}
              <motion.div
                initial={{ scale: 0, rotate: 0, opacity: 0, x: -100, y: 100 }}
                animate={{
                  scale: [0, 5, 8, 0],
                  rotate: [0, 90, 180, 270],
                  opacity: [0, 0.9, 0.9, 0]
                }}
                transition={{ duration: 3.0, ease: "easeInOut", delay: 0.15 }}
                className="text-8xl absolute select-none text-pink-300 transform-gpu will-change-transform"
              >
                🌸
              </motion.div>

              {/* Bottom Right */}
              <motion.div
                initial={{ scale: 0, rotate: 0, opacity: 0, x: 100, y: 100 }}
                animate={{
                  scale: [0, 5, 8, 0],
                  rotate: [0, -90, -180, -270],
                  opacity: [0, 0.9, 0.9, 0]
                }}
                transition={{ duration: 3.0, ease: "easeInOut", delay: 0.08 }}
                className="text-8xl absolute select-none text-rose-400 transform-gpu will-change-transform"
              >
                🌺
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Scrapbook;
