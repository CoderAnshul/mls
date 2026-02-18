import { BsCheckCircleFill } from "react-icons/bs";
import { api } from '../../utils/api';
import { useCallback, useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoPauseSharp, IoPlaySharp } from "react-icons/io5";

const ReviewsSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [cardsToShow, setCardsToShow] = useState(1);
    const [containerWidth, setContainerWidth] = useState(0);
    const [selectedReview, setSelectedReview] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const carouselRef = useRef(null);
    const containerRef = useRef(null);
    const intervalRef = useRef(null);
    const transitionRef = useRef(true);

    // Responsive logic to determine cardsToShow
    useEffect(() => {
        const loadReviews = async () => {
             try {
                 const data = await api.reviews.getAll();
                 setReviews(data.filter(r => r.status === 'Approved'));
             } catch (err) {
                 console.error('Failed to load reviews', err);
             } finally {
                 setLoading(false);
             }
        };
        loadReviews();

        const handleResize = () => {
             if (carouselRef.current && containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
             }
            if (window.innerWidth >= 1024) { // Desktop
                setCardsToShow(3);
            } else { // Mobile & Tablet
                setCardsToShow(1);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Body scroll lock
    useEffect(() => {
        if (selectedReview) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
        return () => { 
            document.body.style.overflow = ''; 
            document.documentElement.style.overflow = '';
        };
    }, [selectedReview]);

    // Clone data for infinite loop
    // Structure: [Original-End (Clone), Original-Start...Original-End, Original-Start (Clone)]
    // Actually simpler: [End Clones, Original Data, Start Clones]
    // Start clones are visible when we slide past the end.
    // End clones are visible when we slide past the start (backwards).
    
    // We need enough clones to fill the screen width (cardsToShow)
    const clonesCount = cardsToShow; 
    const extendedReviews = reviews.length > 0 ? [
        ...reviews.slice(-clonesCount), 
        ...reviews,
        ...reviews.slice(0, clonesCount) 
    ] : [];

    // Initial index should be at the start of original data
    useEffect(() => {
        // Only set this once or when cardsToShow changes significantly logic-wise, 
        // but simple reset is safer to avoid glitches during resize.
        setCurrentIndex(clonesCount); 
    }, [clonesCount]);


    const gap = 24; // 1.5rem / 24px default gap
    // Width of one item = (Container Width - (Gap * (Visible Items - 1))) / Visible Items
    const cardWidth = containerWidth > 0 ? (containerWidth - (gap * (cardsToShow - 1))) / cardsToShow : 300;
    
    // Total shift = Index * (CardWidth + Gap)
    const getTranslateX = (index) => {
        return -(index * (cardWidth + gap));
    };

    const handleNext = useCallback(() => {
        if (currentIndex >= extendedReviews.length - clonesCount) return; // Prevent over-sliding before reset
        setCurrentIndex(prev => prev + 1);
        transitionRef.current = true;
    }, [currentIndex, extendedReviews.length, clonesCount]);

    const handlePrev = useCallback(() => {
        if (currentIndex <= 0) return;
        setCurrentIndex(prev => prev - 1);
        transitionRef.current = true;
    }, [currentIndex]);

    // Handle Transition End for Infinite Loop
    const handleTransitionEnd = () => {
        // If we are at the end clones, jump to the start of original data
        if (currentIndex >= reviewsData.length + clonesCount) {
             transitionRef.current = false;
             setCurrentIndex(clonesCount); 
             // We jumped from "End Clone 1" to "Original 1"
             // But wait, user slid to `reviewsData.length + clonesCount`. 
             // That index corresponds to `clonesCount` (start of real data).
        } 
        // If we are at the start clones, jump to the end of original data
        else if (currentIndex < clonesCount) {
             transitionRef.current = false;
             setCurrentIndex(reviewsData.length + currentIndex); // Correct mapping needed
             // Example: 
             // Data: [A, B, C], Clones=1. 
             // Extended: [C(0), A(1), B(2), C(3), A(4)]
             // Start Index = 1 (A).
             // Prev -> Index 0 (C). 
             // Jump -> Index 3 (C).
             // Math: 0 (index) -> length(3) + 0 = 3? Yes.
             
             // Wait, logic:
             // If currentIndex becomes clonesCount - 1 (index 0 in example).
             // We want it to become length + index ???
             // Max index is length + 2*clones - 1. 
             // Real data sits at [clonesCount ... length+clonesCount-1].
             // logic: newIndex = currentIndex + length
        }
    };
    
    // Refined Jump Logic for `handleTransitionEnd`
    useEffect(() => {
        if (currentIndex === extendedReviews.length - clonesCount) {
             // We just slid to the first clone at the end (mimicking start).
             // Wait for transition to finish, then snap.
             // Actually React state update is instant, we need to defer the snap?
             // No, trigger snap AFTER transition.
        }
    }, [currentIndex]);
    
    // Auto Play
    useEffect(() => {
        if (isPlaying && !selectedReview) {
            intervalRef.current = setInterval(() => {
                handleNext();
            }, 3000);
        }
        return () => clearInterval(intervalRef.current);
    }, [isPlaying, handleNext, selectedReview]);


    // Handling the "Infinite Jump" effectively 
    // We need to use `onTransitionEnd` on the container.
    // However, if we just updated `currentIndex`, the transition happens.
    // We need to detect if we landed on a clone.
    
    const onTransitionEnd = () => {
        // Check if we are in "Clone Zone"
        // End Clones Zone: indices [reviewsData.length + clonesCount, ...]
        // Actually, if we slide 1 by 1.
        // Last real item is at `clonesCount + reviewsData.length - 1`.
        // If we are at `clonesCount + reviewsData.length` (First end clone), we should snap to `clonesCount`.
        
        if (currentIndex >= clonesCount + reviews.length) {
            transitionRef.current = false;
            setCurrentIndex(clonesCount);
        } 
        else if (currentIndex < clonesCount) {
            transitionRef.current = false;
            setCurrentIndex(currentIndex + reviews.length);
        }
    };


    return (
    <section className="pb-16 border-t border-neutral-200 relative">
      <div className="w-full mx-auto px-4 md:px-0">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* Summary Card (Top on Mobile, Left on Desktop) */}
          <div className="w-full lg:w-1/4 bg-black text-white p-10 flex flex-col justify-center items-center text-center shrink-0 min-h-[260px] md:min-h-[300px]">
            <h3 className="text-xl md:text-2xl font-normal mb-4">Excellent</h3>
            <div className="flex gap-1.5 mb-2">
                 {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="bg-[#00b67a] p-1.5 md:p-1"><FaStar className="text-white text-lg md:text-xl block" /></div>
                 ))}
            </div>

            <p className="text-sm font-normal mb-1 mt-2">4.8 average</p>
            <p className="text-sm font-normal opacity-70">{reviews.length} reviews</p>
             <div className="mt-6 flex items-center justify-center gap-1.5 opacity-80">
                <FaStar className="text-white text-sm" />
                <span className="text-[10px] md:text-xs font-normal tracking-wider">Trustpilot</span>
            </div>
          </div>

          {/* Carousel Container (Below on Mobile, Right on Desktop) */}
          <div className="w-full lg:w-3/4 relative flex items-stretch group sm:px-10 md:px-12">
            
            {/* Left Arrow */}
            <button 
                onClick={handlePrev}
                className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 bg-transparent hover:bg-neutral-200/50 rounded-full transition-colors"
                aria-label="Previous review"
            >
                <IoIosArrowBack className="text-xl md:text-3xl text-neutral-800" />
            </button>

            {/* Inner Clipping Wrapper */}
            <div className="w-full overflow-hidden" ref={containerRef}>
                {/* Track */}
                <div 
                    className="flex h-full"
                    style={{
                        transform: `translateX(${getTranslateX(currentIndex)}px)`,
                        transition: transitionRef.current ? 'transform 0.5s ease-in-out' : 'none',
                        columnGap: `${gap}px`
                    }}
                    onTransitionEnd={onTransitionEnd}
                >
                    {loading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="bg-neutral-100 animate-pulse border border-neutral-100 shrink-0" style={{ width: `${cardWidth}px`, height: '240px' }} />
                        ))
                    ) : extendedReviews.map((review, index) => (
                        <div 
                            key={`${review._id}-${index}`} 
                            className="bg-white p-6 md:p-8 shadow-sm flex flex-col h-full relative shrink-0 text-left border border-neutral-100 cursor-pointer hover:border-neutral-300 transition-colors"
                            style={{ width: `${cardWidth}px` }}
                            onClick={() => setSelectedReview(review)}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-bold text-sm md:text-base">{review.name}</h4>
                                <div className="flex text-black text-[10px] md:text-xs gap-0.5 ml-2">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < (review.rating || 5) ? 'text-black' : 'text-neutral-200'} />
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center text-[10px] md:text-xs text-neutral-500 font-normal mb-4">
                                <BsCheckCircleFill className="mr-1.5 text-black" /> Verified Customer
                            </div>
                            
                            <p className="text-xs md:text-sm text-neutral-700 line-clamp-5 mb-12 leading-relaxed font-light">
                                {review.review}
                            </p>
                            
                            <div className="absolute bottom-6 right-6 text-[10px] md:text-xs text-neutral-400 font-normal text-right">
                                <span>{review.location}, </span>
                                <span>{review.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Arrow */}
            <button 
                onClick={handleNext}
                className="absolute right-0 md:right-2 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 bg-transparent hover:bg-neutral-200/50 rounded-full transition-colors"
                aria-label="Next review"
            >
                <IoIosArrowForward className="text-2xl md:text-3xl text-neutral-800" />
            </button>
            
            {/* Play/Pause Control */}
             <div className="absolute -bottom-8 right-0 md:right-12 flex items-center gap-1.5 text-[10px] md:text-xs text-neutral-400 cursor-pointer hover:text-black transition-colors" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <IoPauseSharp /> : <IoPlaySharp />}
                <span className="uppercase tracking-widest">{isPlaying ? 'Pause' : 'Play'}</span>
            </div>

          </div>
        </div>
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedReview(null)}
        >
            <div 
                className="bg-white w-full max-w-2xl relative p-8 md:p-12 animate-slide-up shadow-2xl overflow-y-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    className="absolute top-6 right-6 text-2xl text-neutral-400 hover:text-black transition-colors"
                    onClick={() => setSelectedReview(null)}
                >
                    <IoCloseOutline />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-bold text-lg md:text-xl text-neutral-900">{selectedReview.name}</h4>
                        <div className="flex text-black text-xs gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} />
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-center text-[10px] md:text-xs text-neutral-500 font-normal mb-8 uppercase tracking-widest">
                        <BsCheckCircleFill className="mr-1.5 text-black" /> Verified Customer
                    </div>

                    <p className="text-sm md:text-base text-neutral-700 leading-relaxed font-light mb-10 max-w-xl">
                        {selectedReview.review}
                    </p>

                    <div className="w-full flex flex-col items-center pt-8 border-t border-neutral-100">
                        <p className="text-[11px] text-neutral-400 mb-6 tracking-wide">
                            Was this review helpful? <button className="underline hover:text-black ml-1">Yes</button> <button className="underline hover:text-black ml-1">No</button>
                        </p>
                        
                        <div className="h-px w-24 bg-neutral-200 mb-6"></div>

                        <p className="text-[11px] md:text-xs text-neutral-400 font-normal mb-8">
                            {selectedReview.date}
                        </p>

                        <div className="flex items-center gap-8">
                            <a href={`https://twitter.com/intent/tweet?text=${selectedReview.review}`} target="_blank" rel="noopener noreferrer" className="text-neutral-900 hover:opacity-60 transition-opacity">
                                <FaTwitter className="text-lg" />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-neutral-900 hover:opacity-60 transition-opacity">
                                <FaFacebook className="text-lg" />
                            </a>
                            <a href="mailto:?subject=Check out this review&body=..." className="text-neutral-900 hover:opacity-60 transition-opacity">
                                <FaEnvelope className="text-lg" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
