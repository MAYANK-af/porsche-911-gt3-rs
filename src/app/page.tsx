"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, motion, useTransform, AnimatePresence, useMotionValueEvent } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Gauge, ArrowUpRight, Power, Compass, X, Search, Check, CircleAlert, ChevronUp, Download, Volume2, VolumeX } from "lucide-react";

// Technical specifications dataset
const specsData = {
  engine: [
    { label: "Engine layout", value: "4.0-litre naturally aspirated flat-six" },
    { label: "Horsepower", value: "518 hp (386 kW) at 8,500 rpm" },
    { label: "Max torque", value: "465 Nm at 6,300 rpm" },
    { label: "Max engine speed", value: "9,000 rpm" },
  ],
  performance: [
    { label: "0–100 km/h", value: "3.2 seconds" },
    { label: "0–160 km/h", value: "6.9 seconds" },
    { label: "0–200 km/h", value: "10.6 seconds" },
    { label: "Top speed", value: "296 km/h" },
  ],
  chassis: [
    { label: "Transmission", value: "7-speed Porsche Doppelkupplung (PDK)" },
    { label: "Drive layout", value: "Rear-wheel drive" },
    { label: "Front axle", value: "Double wishbone front axle with PASM active damping" },
    { label: "Rear axle", value: "Multi-link rear axle with active dampers and rear axle steering" },
  ],
  body: [
    { label: "Kerb weight (DIN)", value: "1,450 kg" },
    { label: "Downforce (standard)", value: "409 kg at 285 km/h" },
    { label: "Downforce (Weissach Package)", value: "1,000 kg at 285 km/h" },
    { label: "Drag Coefficient (Cd)", value: "0.39" },
  ]
};

const configPaints = [
  { name: "Guards Red", hex: "#D32F2F", price: 0 },
  { name: "Python Green", hex: "#00FF41", price: 3270 },
  { name: "Shark Blue", hex: "#0088CC", price: 3270 },
  { name: "GT Silver Metallic", hex: "#B3B9BE", price: 1250 }
];

const configWheels = [
  { name: "Forged Aluminum Rims", price: 0 },
  { name: "Forged Magnesium Wheels (Weissach Spec)", price: 9250 }
];

const configPackages = [
  { name: "Standard Aerodynamics Setup", price: 0 },
  { name: "Clubsport Package (Steel Roll Cage)", price: 4500 },
  { name: "Weissach Lightweight Package (Carbon CFRP Elements)", price: 31250 }
];

// High-Performance viewport-virtualized Blob video player
interface LazyBlobVideoProps {
  src: string;
  poster: string;
  className?: string;
  style?: React.CSSProperties;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  autoPlay?: boolean;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  viewportId: string;
  visibleViewportIds: string[];
  isTouchDevice: boolean;
  alwaysAutoplay?: boolean;
}

function LazyBlobVideo({
  src,
  poster,
  className = "",
  style,
  muted = true,
  loop = true,
  playsInline = true,
  autoPlay = false,
  videoRef,
  viewportId,
  visibleViewportIds,
  isTouchDevice,
  alwaysAutoplay = false
}: LazyBlobVideoProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const isInViewport = visibleViewportIds.includes(viewportId);

  useEffect(() => {
    if (!isInViewport) return;
    if (blobUrl) return;

    let active = true;
    const timer = setTimeout(() => {
      fetch(src, { priority: "low" } as any)
        .then((res) => {
          if (!res.ok) throw new Error("Fetch failed");
          return res.blob();
        })
        .then((blob) => {
          if (active) {
            const url = URL.createObjectURL(blob);
            setBlobUrl(url);
          }
        })
        .catch((err) => console.error("Lazy video loading failed:", err));
    }, 450); // 450ms debounce to filter out fast scrolls

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [src, isInViewport, blobUrl]);

  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  const forceAutoplay = alwaysAutoplay || isTouchDevice;

  // Clean the caller's className of layout flow overrides and force absolute layering
  const cleanClassName = className.replace(/\b(block|relative)\b/g, "").trim();
  const mediaClass = `absolute inset-0 ${cleanClassName}`;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden" style={style}>
      <img
        src={poster}
        alt="Porsche preview frame"
        className={`${mediaClass} transition-opacity duration-500 z-0 ${
          forceAutoplay
            ? (isLoaded && blobUrl ? "opacity-0" : "opacity-100")
            : "group-hover:opacity-0 opacity-100"
        }`}
      />
      {isInViewport && blobUrl && (
        <video
          ref={videoRef}
          src={blobUrl}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          autoPlay={autoPlay || forceAutoplay}
          onCanPlayThrough={() => setIsLoaded(true)}
          className={`${mediaClass} transition-opacity duration-500 z-10 ${
            forceAutoplay
              ? (isLoaded ? "opacity-100" : "opacity-0")
              : "opacity-0 group-hover:opacity-100"
          }`}
        />
      )}
    </div>
  );
}

export default function Page() {
  // Video element refs for hovers
  const heroPaintVideoRef = useRef<HTMLVideoElement>(null);
  const hero360VideoRef = useRef<HTMLVideoElement>(null);
  const heroRacingVideoRef = useRef<HTMLVideoElement>(null);

  const gridExplodedVideoRef = useRef<HTMLVideoElement>(null);
  const gridTrackVideoRef = useRef<HTMLVideoElement>(null);
  const gridCockpitVideoRef = useRef<HTMLVideoElement>(null);
  const gridCabinVideoRef = useRef<HTMLVideoElement>(null);
  const crankshaftVideoRef = useRef<HTMLVideoElement>(null);

  // Parallax section refs
  const containerAero = useRef<HTMLDivElement>(null);
  const containerPerformance = useRef<HTMLDivElement>(null);
  const containerConfigure = useRef<HTMLDivElement>(null);

  // Interaction states
  const [aeroSpeed, setAeroSpeed] = useState<number>(180);
  const [aeroGear, setAeroGear] = useState<number>(5);
  const [aeroDrs, setAeroDrs] = useState<boolean>(true);
  const [telemetryMode, setTelemetryMode] = useState<"manual" | "nurburgring">("manual");
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  
  // Engine Soundboard states
  const [rpm, setRpm] = useState(1000);
  const [isRevving, setIsRevving] = useState(false);

  const [headlightMode, setHeadlightMode] = useState<string>("daytime");
  const [activeSpecTab, setActiveSpecTab] = useState<string>("engine");

  // Overlay states
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isDealersOpen, setIsDealersOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Account user simulation
  const [userAccount, setUserAccount] = useState<string | null>(null);
  const [loginInput, setLoginInput] = useState("");

  // Dealer search simulation
  const [dealerSearchQuery, setDealerSearchQuery] = useState("");
  const [dealerResults, setDealerResults] = useState<any[] | null>(null);
  const [dealerNotice, setDealerNotice] = useState<string | null>(null);

  // Configurator choice states
  const [selectedPaint, setSelectedPaint] = useState(configPaints[0]);
  const [selectedWheels, setSelectedWheels] = useState(configWheels[0]);
  const [selectedPackage, setSelectedPackage] = useState(configPackages[0]);
  const [isConfigOrdered, setIsConfigOrdered] = useState(false);

  // Calculate pricing
  const basePrice = 223800;
  const totalPrice = basePrice + selectedPaint.price + selectedWheels.price + selectedPackage.price;

  // Hydration guard state
  const [isMounted, setIsMounted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [visibleViewportIds, setVisibleViewportIds] = useState<string[]>([]);
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    }
  }, []);

  // === PREMIUM UX: Audio Controller ===
  const [isMuted, setIsMuted] = useState(true);
  const [activeAudioVideo, setActiveAudioVideo] = useState<string | null>(null);

  const toggleVideoAudio = (videoId: string) => {
    if (activeAudioVideo === videoId) {
      setActiveAudioVideo(null);
      setIsMuted(true);
    } else {
      setActiveAudioVideo(videoId);
      setIsMuted(false);
    }
  };

  const renderAudioToggle = (videoId: string) => {
    const isUnmuted = activeAudioVideo === videoId;
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleVideoAudio(videoId);
        }}
        className={`absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-black/60 border border-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 cursor-pointer shadow-md ${
          isUnmuted 
            ? "opacity-100" 
            : "opacity-90 md:opacity-0 md:group-hover:opacity-100"
        }`}
        title={isUnmuted ? "Mute sound" : "Unmute sound"}
      >
        {isUnmuted ? <Volume2 size={14} className="animate-pulse" /> : <VolumeX size={14} />}
      </button>
    );
  };

  // === PREMIUM UX: Preloader ===
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  // === PREMIUM UX: Back to Top Button ===
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Nürburgring Nordschleife coordinates list
  const trackPoints = [
    { x: 50, y: 15 },
    { x: 35, y: 15 },
    { x: 20, y: 25 },
    { x: 20, y: 40 },
    { x: 25, y: 48 },
    { x: 30, y: 55 },
    { x: 30, y: 65 },
    { x: 20, y: 73 },
    { x: 15, y: 80 },
    { x: 25, y: 90 },
    { x: 38, y: 95 },
    { x: 50, y: 85 },
    { x: 60, y: 85 },
    { x: 70, y: 85 },
    { x: 80, y: 90 },
    { x: 85, y: 85 },
    { x: 88, y: 75 },
    { x: 80, y: 60 },
    { x: 80, y: 45 },
    { x: 80, y: 30 },
    { x: 65, y: 15 },
    { x: 50, y: 15 }
  ];

  const getTrackCoordinate = (progress: number) => {
    const p = Math.max(0, Math.min(1, progress));
    const numSegments = trackPoints.length - 1;
    const rawIdx = p * numSegments;
    const idx = Math.floor(rawIdx);
    const frac = rawIdx - idx;
    
    if (idx >= numSegments) return trackPoints[trackPoints.length - 1];
    
    const p1 = trackPoints[idx];
    const p2 = trackPoints[idx + 1];
    
    return {
      x: p1.x + (p2.x - p1.x) * frac,
      y: p1.y + (p2.y - p1.y) * frac
    };
  };

  const getTelemetryForProgress = (progress: number) => {
    if (progress < 0.1) {
      const p = progress / 0.1;
      return { speed: Math.round(120 + p * 120), gear: 5, drs: true };
    } else if (progress < 0.3) {
      const p = (progress - 0.1) / 0.2;
      return { speed: Math.round(240 - p * 130), gear: 3, drs: false };
    } else if (progress < 0.45) {
      const p = (progress - 0.3) / 0.15;
      return { speed: Math.round(110 + p * 150), gear: 6, drs: true };
    } else if (progress < 0.6) {
      const p = (progress - 0.45) / 0.15;
      const speed = p < 0.4 
        ? 260 - (p / 0.4) * 160
        : 100 + ((p - 0.4) / 0.6) * 170;
      return { speed: Math.round(speed), gear: p < 0.4 ? 3 : 6, drs: p > 0.4 };
    } else if (progress < 0.75) {
      const p = (progress - 0.6) / 0.15;
      const speed = p < 0.5
        ? 270 - (p / 0.5) * 190
        : 80 + ((p - 0.5) / 0.5) * 5;
      return { speed: Math.round(speed), gear: 2, drs: false };
    } else if (progress < 0.9) {
      const p = (progress - 0.75) / 0.15;
      return { speed: Math.round(85 + p * 115), gear: 4, drs: false };
    } else {
      const p = (progress - 0.9) / 0.1;
      return { speed: Math.round(200 + p * 96), gear: 7, drs: true };
    }
  };

  const [scrollProgressForDot, setScrollProgressForDot] = useState(0);
  const [dotPos, setDotPos] = useState({ x: 50, y: 15 });

  // Handle PDK gear mapping in manual mode
  useEffect(() => {
    if (telemetryMode === "manual") {
      if (aeroSpeed > 260) {
        setAeroGear(7);
        setAeroDrs(true);
      } else if (aeroSpeed > 200) {
        setAeroGear(6);
        setAeroDrs(true);
      } else if (aeroSpeed > 150) {
        setAeroGear(5);
        setAeroDrs(false);
      } else if (aeroSpeed > 110) {
        setAeroGear(4);
        setAeroDrs(false);
      } else if (aeroSpeed > 90) {
        setAeroGear(3);
        setAeroDrs(false);
      } else {
        setAeroGear(2);
        setAeroDrs(false);
      }
    }
  }, [aeroSpeed, telemetryMode]);

  // Engine Soundboard tachometer revving loop
  useEffect(() => {
    let interval: any;
    if (isRevving) {
      interval = setInterval(() => {
        setRpm((prev) => {
          if (prev >= 8900) {
            return 8800 + Math.floor(Math.random() * 200); // Limiter bounce
          }
          return Math.min(9000, prev + 350 + Math.floor(Math.random() * 150));
        });
      }, 30);
    } else {
      interval = setInterval(() => {
        setRpm((prev) => {
          if (prev <= 1000) return 1000;
          return Math.max(1000, prev - 300 - Math.floor(Math.random() * 100));
        });
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isRevving]);

  // Sync crankshaft video playback speed and sound to engine RPM
  useEffect(() => {
    if (crankshaftVideoRef.current) {
      const rate = 0.8 + ((rpm - 1000) / 8000) * 1.2;
      crankshaftVideoRef.current.playbackRate = rate;
      if (isRevving) {
        crankshaftVideoRef.current.muted = false;
      } else {
        crankshaftVideoRef.current.muted = (activeAudioVideo !== "crankshaft");
      }
    }
  }, [rpm, isRevving, activeAudioVideo]);

  // Keyboard rev controls: Spacebar or Up Arrow
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === "Space" || e.code === "ArrowUp") && !isConfigOpen && !isDealersOpen && !isLoginOpen) {
        e.preventDefault();
        setIsRevving(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        setIsRevving(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isConfigOpen, isDealersOpen, isLoginOpen]);

  // === PREMIUM UX: Scroll Progress ===
  const { scrollYProgress: globalScrollProgress } = useScroll();
  const [scrollPercent, setScrollPercent] = useState(0);
  useMotionValueEvent(globalScrollProgress, "change", (latest) => {
    setScrollPercent(Math.round(latest * 100));
  });

  // === PREMIUM UX: Brochure Toast ===
  const [showBrochureToast, setShowBrochureToast] = useState(false);
  const handleBrochureDownload = () => {
    setShowBrochureToast(true);
    setTimeout(() => setShowBrochureToast(false), 3500);
  };

  // Performance Section launch control states & timer
  const [performanceInView, setPerformanceInView] = useState(false);
  const [launchSpeed, setLaunchSpeed] = useState(0);

  useEffect(() => {
    if (!performanceInView) {
      setLaunchSpeed(0);
      return;
    }
    let start = 0;
    const duration = 3200; // 3.2 seconds
    const interval = 30; // 30ms ticking rate
    const step = 100 / (duration / interval);
    
    const timer = setInterval(() => {
      start += step;
      if (start >= 100) {
        setLaunchSpeed(100);
        clearInterval(timer);
      } else {
        setLaunchSpeed(Math.round(start));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [performanceInView]);

  // Parallax scroll hooks
  const { scrollYProgress: scrollAero } = useScroll({
    target: containerAero,
    offset: ["start end", "end start"],
  });
  const aeroBgY = useTransform(scrollAero, [0, 1], ["-10%", "10%"]);
  const aeroDimOpacity = useTransform(scrollAero, [0.75, 1], [0, 1]);
  const aeroTextY = useTransform(scrollAero, [0, 1], [60, -60]);

  // Listen to scroll inside aerodynamics section for Nürburgring telemetry
  useMotionValueEvent(scrollAero, "change", (latest) => {
    const normalized = Math.max(0, Math.min(1, (latest - 0.25) / 0.5));
    setScrollProgressForDot(normalized);
    setDotPos(getTrackCoordinate(normalized));
    
    if (telemetryMode === "nurburgring") {
      const stats = getTelemetryForProgress(normalized);
      setAeroSpeed(stats.speed);
      setAeroGear(stats.gear);
      setAeroDrs(stats.drs);
    }
  });

  const { scrollYProgress: scrollPerformance } = useScroll({
    target: containerPerformance,
    offset: ["start end", "end start"],
  });
  const performanceBgY = useTransform(scrollPerformance, [0, 1], ["-10%", "10%"]);
  const performanceDimOpacity = useTransform(scrollPerformance, [0.75, 1], [0, 1]);
  const performanceTextY = useTransform(scrollPerformance, [0, 1], [60, -60]);

  const { scrollYProgress: scrollConfigure } = useScroll({
    target: containerConfigure,
    offset: ["start end", "end start"],
  });
  const configureBgY = useTransform(scrollConfigure, [0, 1], ["-10%", "10%"]);

  // Global IntersectionObserver scroll-triggered autoplay for loop videos
  useEffect(() => {
    if (!isMounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            if (video.hasAttribute("data-reset-on-enter")) {
              video.currentTime = 0;
            }
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll("video[data-autoplay-on-scroll]").forEach((v) => {
      observer.observe(v);
    });

    return () => {
      observer.disconnect();
    };
  }, [isMounted]);

  // Unified Viewport Intersection Observer for lazy-mounting video decoders
  useEffect(() => {
    if (!isMounted || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-viewport-id");
          if (!id) return;
          if (entry.isIntersecting) {
            setVisibleViewportIds((prev) => [...new Set([...prev, id])]);
          } else {
            setVisibleViewportIds((prev) => prev.filter((item) => item !== id));
          }
        });
      },
      { 
        threshold: 0.02,
        rootMargin: "150px 0px"
      }
    );

    document.querySelectorAll("[data-viewport-id]").forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [isMounted, isLoading]);

  // Hover-to-play utility
  const handleVideoHover = (ref: React.RefObject<HTMLVideoElement | null>, isHovered: boolean, videoId?: string) => {
    if (!ref.current) return;
    if (isHovered) {
      ref.current.play().catch(() => {});
      if (videoId) {
        setActiveAudioVideo(videoId);
      }
    } else {
      ref.current.pause();
      if (videoId) {
        setActiveAudioVideo((prev) => prev === videoId ? null : prev);
      }
    }
  };

  // Simulate dealer search
  const handleDealerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealerSearchQuery.trim()) {
      setDealerResults([]);
      return;
    }
    const mockDealers = [
      { name: "Porsche Centre Downtown", address: "788 Motor Avenue, Financial District", phone: "+1 (555) 911-3000", distance: "2.4 miles" },
      { name: "Porsche Experience Center West", address: "100 Speed Loop Way, Airport Logistics", phone: "+1 (555) 911-5000", distance: "6.8 miles" },
      { name: "Porsche Center Valley Hills", address: "400 Skyline Highway, Alpine Heights", phone: "+1 (555) 911-7000", distance: "11.1 miles" }
    ];
    setDealerResults(mockDealers);
  };

  return (
    <>
    {/* === PRELOADER SPLASH SCREEN === */}
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Opaque Background Image */}
          <div 
            className="absolute inset-0 bg-[url('/images/bg-moon.jpg')] bg-cover bg-center opacity-[0.35] pointer-events-none z-0" 
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center gap-6 z-10"
          >
            <span className="porsche-wordmark tracking-[0.5em] text-white">
              PORSCHE
            </span>
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 120 }}
                transition={{ duration: 1.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="h-[2px] bg-white/40 rounded-full"
              />
            </div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-semibold"
            >
              911 GT3 RS Experience
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    <div className="relative w-full bg-[#0a0a0a] text-white selection:bg-white selection:text-black antialiased">

      {/* === SCROLL PROGRESS INDICATOR === */}
      <motion.div
        className="fixed top-0 left-0 h-[2px] bg-white/60 z-[60] origin-left"
        style={{ scaleX: globalScrollProgress, width: "100%" }}
      />
      <Navbar 
        onMenuToggle={() => setIsMenuOpen(true)}
        onConfigureToggle={() => setIsConfigOpen(true)}
        onDealersToggle={() => setIsDealersOpen(true)}
        onLoginToggle={() => setIsLoginOpen(true)}
      />

      {/* SHOWROOM EXPERIENCE (DARK THEME) */}
      <div className="bg-[#0a0a0a] text-white w-full relative">
        
        {/* SECTION 1: HERO CAROUSEL */}
        <section className="relative pt-24 md:pt-32 pb-12 px-6 md:px-16 w-full flex flex-col justify-between">
          <div className="max-w-[1700px] mx-auto w-full mb-8 flex justify-between items-end">
            <div>
              <span className="porsche-label text-white/40">Showroom</span>
              {/* Official Porsche styling: Massive, Bold, Uppercase, Tracking-Tighter, leading-none */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[88px] font-black uppercase tracking-tighter mt-1 text-white leading-none">
                911 GT3 RS Lineup
              </h1>
            </div>
            <span className="text-xs uppercase font-bold tracking-widest text-white/40 hidden sm:inline">
              Hover to preview model
            </span>
          </div>

          {/* 3-Column Card Carousel Band (Enlarged Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1700px] mx-auto w-full">
            
            {/* Hero Card 1: 911 GT3 RS Paint Design */}
            <div
              className="group relative showcase-card h-[480px] sm:h-[600px] cursor-pointer rounded-[24px] overflow-hidden"
              onMouseEnter={() => handleVideoHover(heroPaintVideoRef, true, "hero-paint")}
              onMouseLeave={() => handleVideoHover(heroPaintVideoRef, false, "hero-paint")}
              onClick={() => setIsConfigOpen(true)}
              data-viewport-id="hero-paint"
            >
              <div className="absolute inset-0 w-full h-full">
                {isMounted && (
                  <LazyBlobVideo
                    src="/videos/body-paint.mp4"
                    poster="/images/paint/ezgif-frame-001.jpg"
                    className="absolute inset-0 w-full h-full object-cover scale-[1.07]"
                    videoRef={heroPaintVideoRef}
                    muted={activeAudioVideo !== "hero-paint"}
                    loop={true}
                    playsInline={true}
                    viewportId="hero-paint"
                    visibleViewportIds={visibleViewportIds}
                    isTouchDevice={isTouchDevice}
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none z-10" />
              <div className="absolute bottom-8 left-8 right-8 text-white z-20 flex justify-between items-end transition-transform duration-300 group-hover:-translate-y-1">
                <div>
                  <span className="text-[10px] text-white/50 uppercase tracking-widest font-semibold block mb-1">Exterior Finish</span>
                  <h3 className="text-xl font-bold uppercase tracking-wider">911 GT3 RS - Paint Design</h3>
                </div>
                <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
                  <ArrowUpRight size={16} />
                </div>
              </div>
              {isMounted && renderAudioToggle("hero-paint")}
            </div>

            {/* Hero Card 2: 911 GT3 RS 360° Studio View */}
            <div
              className="group relative showcase-card h-[480px] sm:h-[600px] cursor-pointer rounded-[24px] overflow-hidden"
              onMouseEnter={() => handleVideoHover(hero360VideoRef, true, "hero-360")}
              onMouseLeave={() => handleVideoHover(hero360VideoRef, false, "hero-360")}
              onClick={() => {
                const el = document.getElementById("telemetry-start");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              data-viewport-id="hero-360"
            >
              <div className="absolute inset-0 w-full h-full">
                {isMounted && (
                  <LazyBlobVideo
                    src="/videos/360-view.mp4"
                    poster="/images/turntable/ezgif-frame-260.jpg"
                    className="absolute inset-0 w-full h-full object-cover scale-[1.07]"
                    videoRef={hero360VideoRef}
                    muted={activeAudioVideo !== "hero-360"}
                    loop={true}
                    playsInline={true}
                    viewportId="hero-360"
                    visibleViewportIds={visibleViewportIds}
                    isTouchDevice={isTouchDevice}
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none z-10" />
              <div className="absolute bottom-8 left-8 right-8 text-white z-20 flex justify-between items-end transition-transform duration-300 group-hover:-translate-y-1">
                <div>
                  <span className="text-[10px] text-white/50 uppercase tracking-widest font-semibold block mb-1">360° Turntable</span>
                  <h3 className="text-xl font-bold uppercase tracking-wider">911 GT3 RS - Studio View</h3>
                </div>
                <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
                  <ArrowUpRight size={16} />
                </div>
              </div>
              {isMounted && renderAudioToggle("hero-360")}
            </div>

            {/* Hero Card 3: 911 GT3 RS Track Intro */}
            <div
              className="group relative showcase-card h-[480px] sm:h-[600px] cursor-pointer rounded-[24px] overflow-hidden"
              onMouseEnter={() => handleVideoHover(heroRacingVideoRef, true, "hero-racing")}
              onMouseLeave={() => handleVideoHover(heroRacingVideoRef, false, "hero-racing")}
              onClick={() => {
                const el = document.getElementById("performance");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              data-viewport-id="hero-racing"
            >
              <div className="absolute inset-0 w-full h-full">
                {isMounted && (
                  <LazyBlobVideo
                    src="/videos/intro-racing.mp4"
                    poster="/images/racing/ezgif-frame-001.jpg"
                    className="absolute inset-0 w-full h-full object-cover scale-[1.07]"
                    videoRef={heroRacingVideoRef}
                    muted={activeAudioVideo !== "hero-racing"}
                    loop={true}
                    playsInline={true}
                    viewportId="hero-racing"
                    visibleViewportIds={visibleViewportIds}
                    isTouchDevice={isTouchDevice}
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none z-10" />
              <div className="absolute bottom-8 left-8 right-8 text-white z-20 flex justify-between items-end transition-transform duration-300 group-hover:-translate-y-1">
                <div>
                  <span className="text-[10px] text-white/50 uppercase tracking-widest font-semibold block mb-1">Motorsport Entry</span>
                  <h3 className="text-xl font-bold uppercase tracking-wider">911 GT3 RS - Track Intro</h3>
                </div>
                <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
                  <ArrowUpRight size={16} />
                </div>
              </div>
              {isMounted && renderAudioToggle("hero-racing")}
            </div>

          </div>

          {/* Specs legal disclaimers */}
          <div className="max-w-[1700px] mx-auto w-full mt-10">
            <p className="text-[11px] sm:text-xs text-white/40 leading-relaxed font-sans border-t border-white/10 pt-4 text-justify">
              Porsche 911 GT3 RS: Fuel consumption combined [model range]: 13.4 / 100 km, CO₂ emissions combined [model range]: 305 g/km. Real-world consumption values may vary based on driving style, environmental conditions, and vehicle configuration.
            </p>
          </div>
        </section>

        {/* SECTION 2: MAIN HEADLINE */}
        <section className="py-24 md:py-36 px-6 text-center max-w-[1700px] mx-auto bg-[#0a0a0a]">
          {/* Official layout styling: Massive typography scaling */}
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[100px] font-black uppercase tracking-tighter text-white leading-[0.9]">
            Your Porsche journey starts now.
          </h2>
        </section>

        {/* SECTION 3: MAIN MODEL GRID (2x2) */}
        <section className="max-w-[1700px] mx-auto px-6 md:px-16 pb-28 bg-[#0a0a0a]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Grid Card A: 911 GT3 RS Exploded View */}
            <div
              className="group relative rounded-[24px] overflow-hidden h-[450px] sm:h-[550px] bg-black cursor-pointer shadow-lg card-glow-hover"
              onMouseEnter={() => handleVideoHover(gridExplodedVideoRef, true, "exploded-view")}
              onMouseLeave={() => handleVideoHover(gridExplodedVideoRef, false, "exploded-view")}
              onClick={() => {
                const el = document.getElementById("powertrain-splits");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              data-viewport-id="grid-exploded"
            >
              <div className="absolute inset-0 w-full h-full">
                {isMounted && (
                  <LazyBlobVideo
                    src="/videos/exploded-view.mp4"
                    poster="/images/explosion/ezgif-frame-200.jpg"
                    className="absolute inset-0 w-full h-full object-cover scale-[1.07]"
                    videoRef={gridExplodedVideoRef}
                    muted={activeAudioVideo !== "exploded-view"}
                    loop={true}
                    playsInline={true}
                    viewportId="grid-exploded"
                    visibleViewportIds={visibleViewportIds}
                    isTouchDevice={isTouchDevice}
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none z-10" />
              
              {/* Badges */}
              <div className="absolute top-6 left-6 z-20">
                <span className="bg-white/10 backdrop-blur-md text-white text-[9px] uppercase font-bold tracking-widest px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
                  Chassis Engineering
                </span>
              </div>

              {/* Text overlays */}
              <div className="absolute bottom-8 left-8 right-8 text-white z-20 flex justify-between items-end transition-transform duration-300 group-hover:-translate-y-1">
                <div className="max-w-xs sm:max-w-md">
                  <h3 className="text-2xl md:text-3xl font-extrabold italic tracking-wide">911 GT3 RS - Exploded View</h3>
                  <p className="text-white/60 text-xs sm:text-sm font-light mt-2 leading-relaxed">
                    Iconic sports car with rear engine: 2 doors, 2+2 seats.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-white/80 group-hover:text-white transition-colors duration-200 whitespace-nowrap">
                  <span>Explore</span>
                  <div className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
              {isMounted && renderAudioToggle("exploded-view")}
            </div>

            {/* Grid Card B: 911 GT3 RS Track Setup */}
            <div
              className="group relative rounded-[24px] overflow-hidden h-[450px] sm:h-[550px] bg-black cursor-pointer shadow-lg card-glow-hover"
              onMouseEnter={() => handleVideoHover(gridTrackVideoRef, true, "emotional-2")}
              onMouseLeave={() => handleVideoHover(gridTrackVideoRef, false, "emotional-2")}
              onClick={() => {
                const el = document.getElementById("aerodynamics");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              data-viewport-id="grid-track"
            >
              <div className="absolute inset-0 w-full h-full">
                {isMounted && (
                  <LazyBlobVideo
                    src="/videos/emotional-2.mp4"
                    poster="/images/nature/ezgif-frame-150.jpg"
                    className="absolute inset-0 w-full h-full object-cover scale-[1.07]"
                    videoRef={gridTrackVideoRef}
                    muted={activeAudioVideo !== "emotional-2"}
                    loop={true}
                    playsInline={true}
                    viewportId="grid-track"
                    visibleViewportIds={visibleViewportIds}
                    isTouchDevice={isTouchDevice}
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none z-10" />
              
              {/* Badges */}
              <div className="absolute top-6 left-6 z-20">
                <span className="bg-red-500/20 backdrop-blur-md text-red-300 text-[9px] uppercase font-bold tracking-widest px-3.5 py-1.5 rounded-full border border-red-500/20 shadow-sm">
                  Track Configuration
                </span>
              </div>

              {/* Text overlays */}
              <div className="absolute bottom-8 left-8 right-8 text-white z-20 flex justify-between items-end transition-transform duration-300 group-hover:-translate-y-1">
                <div className="max-w-xs sm:max-w-md">
                  <h3 className="text-2xl md:text-3xl font-extrabold italic tracking-wide">911 GT3 RS - Track Setup</h3>
                  <p className="text-white/60 text-xs sm:text-sm font-light mt-2 leading-relaxed">
                    Precise mid-engine layout feeling with track alignment limits.
                  </p>
                </div>
                <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
                  <ArrowUpRight size={16} />
                </div>
              </div>
              {isMounted && renderAudioToggle("emotional-2")}
            </div>

            {/* Grid Card C: 911 GT3 RS Steering Controls */}
            <div
              className="group relative rounded-[24px] overflow-hidden h-[450px] sm:h-[550px] bg-black cursor-pointer shadow-lg card-glow-hover"
              onMouseEnter={() => handleVideoHover(gridCockpitVideoRef, true, "cockpit-1")}
              onMouseLeave={() => handleVideoHover(gridCockpitVideoRef, false, "cockpit-1")}
              onClick={() => {
                const el = document.getElementById("telemetry-start");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              data-viewport-id="grid-cockpit"
            >
              <div className="absolute inset-0 w-full h-full">
                {isMounted && (
                  <LazyBlobVideo
                    src="/videos/cockpit-1.mp4"
                    poster="/images/cockpit/ezgif-frame-150.jpg"
                    className="absolute inset-0 w-full h-full object-cover scale-[1.07]"
                    videoRef={gridCockpitVideoRef}
                    muted={activeAudioVideo !== "cockpit-1"}
                    loop={true}
                    playsInline={true}
                    viewportId="grid-cockpit"
                    visibleViewportIds={visibleViewportIds}
                    isTouchDevice={isTouchDevice}
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none z-10" />
              
              {/* Badges */}
              <div className="absolute top-6 left-6 z-20">
                <span className="bg-blue-500/20 backdrop-blur-md text-blue-300 text-[9px] uppercase font-bold tracking-widest px-3.5 py-1.5 rounded-full border border-blue-500/25 shadow-sm">
                  Active Cockpit
                </span>
              </div>

              {/* Text overlays */}
              <div className="absolute bottom-8 left-8 right-8 text-white z-20 flex justify-between items-end transition-transform duration-300 group-hover:-translate-y-1">
                <div className="max-w-xs sm:max-w-md">
                  <h3 className="text-2xl md:text-3xl font-extrabold italic tracking-wide">911 GT3 RS - Active Controls</h3>
                  <p className="text-white/60 text-xs sm:text-sm font-light mt-2 leading-relaxed">
                    Adjust compression, damping, differential, and ESC live from the wheel.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-white/80 group-hover:text-white transition-colors duration-200 whitespace-nowrap">
                  <span>Explore</span>
                  <div className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
              {isMounted && renderAudioToggle("cockpit-1")}
            </div>

            {/* Grid Card D: 911 GT3 RS Interior Design */}
            <div
              className="group relative rounded-[24px] overflow-hidden h-[450px] sm:h-[550px] bg-black cursor-pointer shadow-lg card-glow-hover"
              onMouseEnter={() => handleVideoHover(gridCabinVideoRef, true, "cockpit-2")}
              onMouseLeave={() => handleVideoHover(gridCabinVideoRef, false, "cockpit-2")}
              onClick={() => {
                const el = document.getElementById("configure-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              data-viewport-id="grid-cabin"
            >
              <div className="absolute inset-0 w-full h-full">
                {isMounted && (
                  <LazyBlobVideo
                    src="/videos/cockpit-2.mp4"
                    poster="/images/cockpit-alt/ezgif-frame-150.jpg"
                    className="absolute inset-0 w-full h-full object-cover scale-[1.07]"
                    videoRef={gridCabinVideoRef}
                    muted={activeAudioVideo !== "cockpit-2"}
                    loop={true}
                    playsInline={true}
                    viewportId="grid-cabin"
                    visibleViewportIds={visibleViewportIds}
                    isTouchDevice={isTouchDevice}
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none z-10" />
              
              {/* Badges */}
              <div className="absolute top-6 left-6 z-20">
                <span className="bg-green-500/20 backdrop-blur-md text-green-300 text-[9px] uppercase font-bold tracking-widest px-3.5 py-1.5 rounded-full border border-green-500/25 shadow-sm">
                  Cabin Layout
                </span>
              </div>

              {/* Text overlays */}
              <div className="absolute bottom-8 left-8 right-8 text-white z-20 flex justify-between items-end transition-transform duration-300 group-hover:-translate-y-1">
                <div className="max-w-xs sm:max-w-md">
                  <h3 className="text-2xl md:text-3xl font-extrabold italic tracking-wide">911 GT3 RS - Racing Cabin</h3>
                  <p className="text-white/60 text-xs sm:text-sm font-light mt-2 leading-relaxed">
                    Lightweight Alcantara bucket seats and structural steel roll cage.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-white/80 group-hover:text-white transition-colors duration-200 whitespace-nowrap">
                  <span>Explore</span>
                  <div className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
              {isMounted && renderAudioToggle("cockpit-2")}
            </div>

          </div>
        </section>

      </div>

      {/* MOTORSPORT TELEMETRY EXPERIENCE (DARK THEME) */}
      <div id="telemetry-start" className="bg-[#0a0a0a] text-white w-full relative">
        
        {/* SECTION 5: PERFORMANCE LAUNCH */}
        <section
          ref={containerPerformance}
          id="performance"
          className="relative min-h-screen w-full flex items-center overflow-hidden py-24 group"
          onMouseEnter={() => setActiveAudioVideo("launch-0-100")}
          onMouseLeave={() => setActiveAudioVideo((prev) => prev === "launch-0-100" ? null : prev)}
          data-viewport-id="section-performance"
        >
          <div className="absolute inset-0 w-full h-full z-0">
            {isMounted && (
              <LazyBlobVideo
                src="/videos/launch-0-100.mp4"
                poster="/images/launch/ezgif-frame-001.jpg"
                className="absolute inset-0 w-full h-full object-cover scale-[1.07]"
                muted={activeAudioVideo !== "launch-0-100"}
                loop={true}
                playsInline={true}
                viewportId="section-performance"
                visibleViewportIds={visibleViewportIds}
                isTouchDevice={isTouchDevice}
                alwaysAutoplay={true}
              />
            )}

            {/* Edge gradients */}
            <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none z-10" />

            <motion.div 
              className="absolute inset-0 bg-[#0a0a0a] pointer-events-none z-10"
              style={{ opacity: performanceDimOpacity }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.2) 100%)",
              zIndex: 1,
            }}
          />

          <div className="relative z-10 max-w-[1700px] mx-auto px-6 md:px-16 w-full text-white">
            <motion.div 
              style={{ y: performanceTextY }}
              onViewportEnter={() => setPerformanceInView(true)}
              onViewportLeave={() => setPerformanceInView(false)}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-start justify-center"
              >
                <span className="porsche-label text-white/55">Launch Control</span>
                <h2 className="porsche-section-title mt-2 text-3xl md:text-5xl font-extrabold leading-tight text-white">
                  0–100 km/h in 3.2 seconds.
                </h2>
                <p className="porsche-body mt-4 text-sm leading-relaxed">
                  Brutal speed control. Double-clutch PDK shifts gears instantly with race-spec traction. Direct feedback curves transfer all 518 horsepower into rapid forward motion.
                </p>
              </motion.div>

              <div className="flex justify-center lg:justify-end">
                <div className="bg-black/35 border border-white/[0.08] backdrop-blur-md p-6 sm:p-8 w-full max-w-sm rounded-2xl font-sans flex flex-col items-center shadow-2xl">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold flex items-center gap-1.5">
                    <Gauge size={12} className="text-white/80 animate-pulse" /> Launch Telemetry
                  </span>
                  
                  {/* Dial HUD */}
                  <div className="relative w-44 h-44 mt-6 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="88"
                        cy="88"
                        r="72"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="4"
                        fill="transparent"
                      />
                      <circle
                        cx="88"
                        cy="88"
                        r="72"
                        stroke="#ffffff"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 72}
                        strokeDashoffset={2 * Math.PI * 72 * (1 - launchSpeed / 100)}
                        style={{ transition: "stroke-dashoffset 0.1s linear" }}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-4xl font-extrabold tracking-tight font-mono">{launchSpeed}</span>
                      <span className="text-[9px] text-white/40 uppercase tracking-wider font-semibold mt-1">KM/H</span>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6 text-center w-full justify-around border-t border-white/[0.08] pt-6 font-mono">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-white/30 uppercase tracking-wider font-sans font-semibold">Gear</span>
                      <span className="text-lg font-bold mt-1 text-white">{launchSpeed > 85 ? "3rd" : launchSpeed > 45 ? "2nd" : launchSpeed > 0 ? "1st" : "N"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-white/30 uppercase tracking-wider font-sans font-semibold">RPM</span>
                      <span className="text-lg font-bold mt-1 text-white">{launchSpeed > 0 ? Math.round(4000 + launchSpeed * 45) : 0}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-white/30 uppercase tracking-wider font-sans font-semibold">G-Force</span>
                      <span className="text-lg font-bold mt-1 text-white">{launchSpeed > 0 ? (1.2 + (launchSpeed/200)).toFixed(1) + " G" : "0.0"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          {isMounted && renderAudioToggle("launch-0-100")}
        </section>

        {/* SECTION 4: ACTIVE AERODYNAMICS HUD */}
        <section
          ref={containerAero}
          id="aerodynamics"
          className="relative flex flex-col md:flex-row items-stretch min-h-[600px] w-full border-t border-white/[0.06] bg-[#0a0a0a]"
        >
          {/* Left Column: Video Tile with interactive hotspots */}
          <div 
            className="w-full md:w-1/2 h-[350px] md:h-auto relative overflow-hidden bg-black group"
            onMouseEnter={() => setActiveAudioVideo("aero-rim")}
            onMouseLeave={() => setActiveAudioVideo((prev) => prev === "aero-rim" ? null : prev)}
            data-viewport-id="section-aero"
          >
            {isMounted && (
              <LazyBlobVideo
                src="/videos/aero-rim.mp4"
                poster="/images/aerodynamics/ezgif-frame-048.jpg"
                className="absolute inset-0 w-full h-full object-cover scale-[1.07]"
                muted={activeAudioVideo !== "aero-rim"}
                loop={true}
                playsInline={true}
                viewportId="section-aero"
                visibleViewportIds={visibleViewportIds}
                isTouchDevice={isTouchDevice}
                alwaysAutoplay={true}
              />
            )}

            {/* Glowing Hotspot Beacons */}
            {isMounted && (
              <>
                {/* Hotspot 1: Rear Wing DRS */}
                <div className="absolute z-20" style={{ top: "30%", left: "78%" }}>
                  <button 
                    onClick={() => setActiveHotspot(activeHotspot === "wing" ? null : "wing")}
                    className="w-6 h-6 rounded-full bg-white/25 border border-white/50 flex items-center justify-center text-white cursor-pointer active:scale-95 transition-all hover:bg-white/40 shadow-lg relative"
                    title="Swan-Neck Wing DRS"
                  >
                    <span className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white block" />
                  </button>
                </div>

                {/* Hotspot 2: Fender gills */}
                <div className="absolute z-20" style={{ top: "55%", left: "33%" }}>
                  <button 
                    onClick={() => setActiveHotspot(activeHotspot === "gills" ? null : "gills")}
                    className="w-6 h-6 rounded-full bg-white/25 border border-white/50 flex items-center justify-center text-white cursor-pointer active:scale-95 transition-all hover:bg-white/40 shadow-lg relative"
                    title="Fender Ventilation"
                  >
                    <span className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white block" />
                  </button>
                </div>

                {/* Hotspot 3: Roof fins */}
                <div className="absolute z-20" style={{ top: "34%", left: "55%" }}>
                  <button 
                    onClick={() => setActiveHotspot(activeHotspot === "roof" ? null : "roof")}
                    className="w-6 h-6 rounded-full bg-white/25 border border-white/50 flex items-center justify-center text-white cursor-pointer active:scale-95 transition-all hover:bg-white/40 shadow-lg relative"
                    title="Roof Aero Fins"
                  >
                    <span className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white block" />
                  </button>
                </div>

                {/* Hotspot 4: Underbody diffuser */}
                <div className="absolute z-20" style={{ top: "75%", left: "12%" }}>
                  <button 
                    onClick={() => setActiveHotspot(activeHotspot === "diffuser" ? null : "diffuser")}
                    className="w-6 h-6 rounded-full bg-white/25 border border-white/50 flex items-center justify-center text-white cursor-pointer active:scale-95 transition-all hover:bg-white/40 shadow-lg relative"
                    title="Active Underbody Diffuser"
                  >
                    <span className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white block" />
                  </button>
                </div>
              </>
            )}

            {/* Hotspot Info Popup */}
            <AnimatePresence>
              {activeHotspot && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute bottom-6 left-6 right-6 z-30 bg-black/90 backdrop-blur-md border border-white/10 p-5 rounded-xl text-white font-sans flex flex-col shadow-2xl"
                >
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Aero Component Detail</span>
                    <button onClick={() => setActiveHotspot(null)} className="text-white/60 hover:text-white cursor-pointer p-0.5">
                      <X size={12} />
                    </button>
                  </div>
                  <h4 className="text-sm font-black uppercase mt-2 text-white">
                    {activeHotspot === "wing" && "Swan-Neck DRS Rear Wing"}
                    {activeHotspot === "gills" && "Front Fender Gill Ventilation"}
                    {activeHotspot === "roof" && "Radiator Guidance Roof Fins"}
                    {activeHotspot === "diffuser" && "Active Underbody Diffuser Flaps"}
                  </h4>
                  <p className="text-[11px] text-white/70 mt-1.5 leading-relaxed font-light">
                    {activeHotspot === "wing" && "The massive swan-neck rear wing stands taller than the roofline. Hydraulic actuators dynamically adapt the blade pitch to act as a Drag Reduction System (DRS) on straights, or an airbrake during high-speed deceleration."}
                    {activeHotspot === "gills" && "Structural pressure building up inside the front wheel wells is directed outwards through integrated carbon-fiber gill ventilation vents. This reduces lift on the front axle and aids brake cooling."}
                    {activeHotspot === "roof" && "Radiator air is directed up through the front lid and guided outwards by carbon roof fins, ensuring the engine intakes on the rear deck lid only feed cool ambient combustion air to the flat-six."}
                    {activeHotspot === "diffuser" && "Active aerodynamic panels in the underbody regulate airflow under the nose in real-time, working in sync with the rear wing to maintain perfect 30:70 aerodynamic balance across corners."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Edge gradients */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none z-10" />
            {isMounted && renderAudioToggle("aero-rim")}
          </div>

          {/* Right Column: Telemetry Controls & Details */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20 py-16"
          >
            <span className="porsche-label text-white/40">Motorsport Telemetry</span>
            <h3 className="porsche-section-title text-2xl md:text-3xl leading-tight text-white mt-1">
              860 kg of downforce.
            </h3>
            <p className="porsche-body mt-4 text-sm leading-relaxed">
              Swan-neck rear wing controls negative lifts dynamically. Wheel arches route drag out of structural pressure hubs to create absolute grip, producing a massive 860 kg of downforce at track speeds.
            </p>
          </motion.div>
        </section>

        {/* SECTION 6: POWERTRAIN SPLITS */}
        <section id="powertrain-splits" className="w-full bg-[#0a0a0a]">
          
          {/* Crankshaft split (text left, video right) */}
          <div className="relative flex flex-col md:flex-row items-stretch min-h-[500px] w-full border-t border-white/[0.06] bg-[#0a0a0a]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20 py-16"
            >
              <div className="flex items-center gap-2 mb-2">
                <Power size={14} className="text-white/40" />
                <span className="porsche-label text-white/40">Engine Design</span>
              </div>
              <h3 className="porsche-section-title text-2xl md:text-3xl leading-tight text-white">
                High-rev crankshaft.
              </h3>
              <p className="porsche-body mt-4 text-sm leading-relaxed">
                Engineered straight from motorsport. Rigid valvetrains and customized lightweight crankshaft geometries sing smoothly all the way up to 9,000 RPM.
              </p>

              {/* Tachometer Soundboard Widget */}
              {isMounted && (
                <div className="flex flex-col items-center mt-6 p-5 bg-white/[0.02] border border-white/[0.08] rounded-2xl w-full">
                  <span className="text-[9px] text-white/40 uppercase tracking-widest font-extrabold block mb-4">
                    Crankshaft RPM Tachometer
                  </span>
                  <div className="relative w-44 h-24 flex items-center justify-center overflow-hidden">
                    <svg className="w-40 h-40 -rotate-90 absolute" viewBox="0 0 100 100">
                      {/* Grey background arc */}
                      <path
                        d="M 50 12 A 38 38 0 0 1 88 50 A 38 38 0 0 1 50 88"
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      {/* Redline sector (9k - 10k RPM) */}
                      <path
                        d="M 50 88 A 38 38 0 0 1 23.1 76.8"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="5.5"
                        strokeLinecap="round"
                        opacity="0.8"
                      />
                      {/* Glow outline behind active path */}
                      <path
                        d="M 50 12 A 38 38 0 0 1 88 50 A 38 38 0 0 1 50 88"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray="119.3"
                        strokeDashoffset={119.3 - (119.3 * ((rpm - 1000) / 9000))}
                        className="transition-all duration-75 opacity-20"
                      />
                    </svg>
                    {/* Spinning needle */}
                    <div
                      className="absolute bottom-0 w-0.5 h-16 bg-red-500 origin-bottom rounded-full transition-transform duration-75"
                      style={{ transform: `rotate(${-90 + ((rpm - 1000) / 9000) * 180}deg)` }}
                    />
                    <div className="absolute bottom-0 w-5 h-5 rounded-full bg-white border-2 border-red-500" />
                    
                    {/* RPM HUD */}
                    <div className="absolute bottom-2 text-center">
                      <span className="text-lg font-mono font-black block text-white tracking-wider">
                        {Math.round(rpm)}
                      </span>
                      <span className="text-[7px] text-white/40 uppercase tracking-widest font-extrabold font-sans">
                        RPM
                      </span>
                    </div>
                  </div>
                  
                  {/* rev trigger button */}
                  <button
                    onMouseDown={() => setIsRevving(true)}
                    onMouseUp={() => setIsRevving(false)}
                    onMouseLeave={() => setIsRevving(false)}
                    onTouchStart={(e) => { e.preventDefault(); setIsRevving(true); }}
                    onTouchEnd={(e) => { e.preventDefault(); setIsRevving(false); }}
                    className="mt-5 px-5 py-2 rounded-xl border border-white/10 hover:border-white/40 text-[9px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black active:scale-95 transition-all duration-300 cursor-pointer w-full select-none"
                  >
                    Hold to Rev Engine (Spacebar / Up Key)
                  </button>
                </div>
              )}
            </motion.div>

            <div 
              className="w-full md:w-1/2 h-[350px] md:h-auto relative overflow-hidden bg-black group"
              onMouseEnter={() => setActiveAudioVideo("crankshaft")}
              onMouseLeave={() => setActiveAudioVideo((prev) => prev === "crankshaft" ? null : prev)}
              data-viewport-id="section-crankshaft"
            >
              {isMounted && (
                <LazyBlobVideo
                  src="/videos/crankshaft.mp4"
                  poster="/images/crankshaft/ezgif-frame-001.jpg"
                  className="absolute inset-0 w-full h-full object-cover scale-[1.07]"
                  videoRef={crankshaftVideoRef}
                  muted={activeAudioVideo !== "crankshaft" && !isRevving}
                  loop={true}
                  playsInline={true}
                  viewportId="section-crankshaft"
                  visibleViewportIds={visibleViewportIds}
                  isTouchDevice={isTouchDevice}
                  alwaysAutoplay={true}
                />
              )}
              {isMounted && renderAudioToggle("crankshaft")}
            </div>
          </div>

          {/* Piston HUD split (video left, text right) */}
          <div className="relative flex flex-col md:flex-row items-stretch min-h-[500px] w-full border-t border-white/[0.06] bg-[#0a0a0a]">
            <div 
              className="w-full md:w-1/2 h-[350px] md:h-auto relative overflow-hidden bg-black order-2 md:order-1 group"
              onMouseEnter={() => setActiveAudioVideo("piston-hud")}
              onMouseLeave={() => setActiveAudioVideo((prev) => prev === "piston-hud" ? null : prev)}
              data-viewport-id="section-piston"
            >
              {isMounted && (
                <LazyBlobVideo
                  src="/videos/piston-hud.mp4"
                  poster="/images/piston/ezgif-frame-120.jpg"
                  className="absolute inset-0 w-full h-full object-cover scale-[1.07]"
                  muted={activeAudioVideo !== "piston-hud"}
                  loop={true}
                  playsInline={true}
                  viewportId="section-piston"
                  visibleViewportIds={visibleViewportIds}
                  isTouchDevice={isTouchDevice}
                  alwaysAutoplay={true}
                />
              )}
              {isMounted && renderAudioToggle("piston-hud")}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20 py-16 order-1 md:order-2"
            >
              <div className="flex items-center gap-2 mb-2">
                <Compass size={14} className="text-white/40" />
                <span className="porsche-label text-white/40">Combustion Telemetry</span>
              </div>
              <h3 className="porsche-section-title text-2xl md:text-3xl leading-tight text-white">
                Piston overlay & direct feed.
              </h3>
              <p className="porsche-body mt-4 text-sm leading-relaxed">
                Forged pistons travel in carbon-coated cylinders. Telemetry lines reveal optimized combustion dynamics, delivering instantaneous throttle response.
              </p>
            </motion.div>
          </div>

          {/* PDLS Headlight matrix (Text left, video rightmost - Swapped Adaptive LED to go Rightmost) */}
          <div id="design" className="relative flex flex-col md:flex-row items-stretch min-h-[500px] w-full border-t border-white/[0.06] bg-[#0a0a0a]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20 py-16"
            >
              <span className="porsche-label text-white/40">Light System</span>
              <h3 className="porsche-section-title text-2xl md:text-3xl leading-tight text-white mt-1">
                Adaptive Matrix LEDs.
              </h3>
              <p className="porsche-body mt-4 text-sm leading-relaxed">
                Porsche Dynamic Light System (PDLS) matrix technology adjusts highbeams dynamically to path structures, weather, and steering inputs instantly.
              </p>

              {/* Interactive settings selector */}
              <div className="mt-8 pt-6 border-t border-white/[0.08] font-sans">
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold block mb-3">
                  PDLS Plus Settings
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "daytime", label: "Daytime Signature" },
                    { id: "highbeam", label: "Matrix Highbeam" },
                    { id: "cornering", label: "Adaptive Cornering" }
                  ].map((beam) => {
                    const isSelected = headlightMode === beam.id;
                    return (
                      <button
                        key={beam.id}
                        onClick={() => setHeadlightMode(beam.id)}
                        className={`py-2 px-4 text-[10px] tracking-wider uppercase font-bold border transition-all duration-200 cursor-pointer rounded-sm ${
                          isSelected
                            ? "bg-white text-black border-white"
                            : "bg-transparent text-white/70 border-white/20 hover:border-white/50 hover:text-white"
                        }`}
                      >
                        {beam.label}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 min-h-[60px]">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={headlightMode}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="text-white/60 text-xs leading-relaxed font-light"
                    >
                      {headlightMode === "daytime" && "Four-point signature LED lighting makes the 911 GT3 RS instantly recognizable as a Porsche model from a distance."}
                      {headlightMode === "highbeam" && "PDLS Plus utilizes 84 individually controlled LEDs to segment and dim highbeam zones to avoid blinding other vehicles while keeping maximum pathway illumination."}
                      {headlightMode === "cornering" && "Matrix elements swivel up to 15 degrees in reaction to dynamic steering lock angles and vehicle velocity, illuminating curves before turn-in."}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            <div 
              className="w-full md:w-1/2 h-[350px] md:h-auto relative overflow-hidden bg-black group"
              onMouseEnter={() => setActiveAudioVideo("headlights")}
              onMouseLeave={() => setActiveAudioVideo((prev) => prev === "headlights" ? null : prev)}
              data-viewport-id="section-headlights"
            >
              {isMounted && (
                <LazyBlobVideo
                  src="/videos/headlights.mp4"
                  poster="/images/headlight/ezgif-frame-263.jpg"
                  className="absolute inset-0 w-full h-full object-cover scale-[1.07]"
                  muted={activeAudioVideo !== "headlights"}
                  loop={false}
                  playsInline={true}
                  viewportId="section-headlights"
                  visibleViewportIds={visibleViewportIds}
                  isTouchDevice={isTouchDevice}
                  alwaysAutoplay={true}
                />
              )}
              {isMounted && renderAudioToggle("headlights")}
            </div>
          </div>
        </section>

        {/* ORDER ENTRY / CONFIGURATOR FULL-SCREEN HERO (Unique emotional-cta-1.mp4 usage) */}
        <section
          ref={containerConfigure}
          id="configure-section"
          className="relative h-screen w-full overflow-hidden border-t border-white/[0.06] group"
          onMouseEnter={() => setActiveAudioVideo("emotional-cta-1")}
          onMouseLeave={() => setActiveAudioVideo((prev) => prev === "emotional-cta-1" ? null : prev)}
          data-viewport-id="section-configure"
        >
          <div className="absolute inset-0 w-full h-full z-0">
            {isMounted && (
              <LazyBlobVideo
                src="/videos/emotional-cta-1.mp4"
                poster="/images/lifestyle/ezgif-frame-001.jpg"
                className="absolute inset-0 w-full h-full object-cover scale-[1.07]"
                muted={activeAudioVideo !== "emotional-cta-1"}
                loop={true}
                playsInline={true}
                viewportId="section-configure"
                visibleViewportIds={visibleViewportIds}
                isTouchDevice={isTouchDevice}
                alwaysAutoplay={true}
              />
            )}
            
            <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none z-10" />
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%)",
              zIndex: 1,
            }}
          />

          <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-6">
            <span className="porsche-label text-white/50">Order Entry</span>
            <h2 className="porsche-section-title mt-2 text-white text-3xl sm:text-5xl font-extrabold uppercase">
              The legend starts here.
            </h2>
            <p className="text-white/70 text-sm mt-3 font-light max-w-sm">
              911 GT3 RS. Order yours today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setIsConfigOpen(true)}
                className="porsche-btn-solid cursor-pointer"
              >
                Configure Your GT3 RS
              </button>
              <button 
                onClick={() => setIsDealersOpen(true)}
                className="porsche-btn-outline cursor-pointer"
              >
                Find Dealers
              </button>
            </div>
          </div>
          {isMounted && renderAudioToggle("emotional-cta-1")}
        </section>

        {/* DESIGN & AESTHETIC HIGHLIGHTS GALLERY */}
        <section id="design-gallery" className="bg-[#0a0a0a] py-24 px-6 md:px-16 border-t border-white/[0.08] relative overflow-hidden">
          <div className="max-w-[1700px] mx-auto">
            <span className="porsche-label text-white/40">Visual Engineering</span>
            <h2 className="porsche-section-title text-white mt-1 mb-12">Design & Aerodynamic Details.</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  img: "/images/user_img_1.jpg",
                  title: "Weissach Aero Carbon",
                  desc: "Carbon-fiber reinforced plastic (CFRP) roof, front lid, and upper shell elements optimize structural weight distribution."
                },
                {
                  img: "/images/user_img_2.jpg",
                  title: "Magnesium Monoblocs",
                  desc: "Forged magnesium center-lock wheels save 8.0 kg in unsprung mass, refining vertical dampers response."
                },
                {
                  img: "/images/user_img_3.jpg",
                  title: "Swan-Neck DRS Profile",
                  desc: "The active rear wing incorporates hydraulic drag reduction actuators, adapting pitch angles live on track."
                },
                {
                  img: "/images/user_img_4.jpg",
                  title: "Signature Matrix PDLS",
                  desc: "Adaptive four-point LED running lights frame the low, wide track nose designed to maximize central air routing."
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="group relative rounded-[20px] overflow-hidden h-[400px] bg-black/40 border border-white/[0.06] hover:border-white/20 transition-colors duration-300"
                >
                  <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none z-10" />
                  
                  <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col justify-end h-full">
                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono font-bold block mb-1">
                      Detail {idx + 1}
                    </span>
                    <h3 className="text-lg font-bold uppercase tracking-wider text-white group-hover:text-white transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/60 font-light mt-2 leading-relaxed opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-[100px] transition-all duration-500 ease-in-out overflow-hidden">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TECHNICAL SPECIFICATIONS TABLES */}
        <section className="bg-[#0a0a0a] py-28 px-6 md:px-16 border-t border-white/[0.08] relative overflow-hidden">
          {/* Opaque Background Image */}
          <div 
            className="absolute inset-0 bg-[url('/images/bg-specs.jpg')] bg-cover bg-center opacity-[0.25] pointer-events-none z-0" 
          />
          <div className="max-w-[900px] mx-auto relative z-10 bg-[#0a0a0a]/75 backdrop-blur-md border border-white/[0.08] p-8 sm:p-12 rounded-3xl shadow-2xl">
            <span className="porsche-label text-white/40">Specifications Data</span>
            <h2 className="porsche-section-title text-white mt-1">Technical specifications.</h2>

            {/* Category Tabs */}
            <div className="flex border-b border-white/10 mt-8 gap-6 overflow-x-auto whitespace-nowrap scrollbar-none font-sans">
              {[
                { id: "engine", label: "Engine" },
                { id: "performance", label: "Performance" },
                { id: "chassis", label: "Chassis & Transmission" },
                { id: "body", label: "Body & Dimensions" }
              ].map((tab) => {
                const isSelected = activeSpecTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSpecTab(tab.id)}
                    className={`pb-3 text-xs sm:text-sm tracking-wider uppercase font-bold border-b-2 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-white text-white"
                        : "border-transparent text-white/40 hover:text-white/80"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col font-sans min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSpecTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {specsData[activeSpecTab as keyof typeof specsData].map((spec) => (
                    <div
                      key={spec.label}
                      className="flex flex-col sm:flex-row justify-between py-4 border-b border-white/[0.08] gap-1 sm:gap-4"
                    >
                      <span className="text-white/50 text-xs sm:text-sm tracking-wide font-normal">
                        {spec.label}
                      </span>
                      <span className="text-white/90 text-xs sm:text-sm font-bold tracking-wide text-left sm:text-right">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setIsConfigOpen(true)}
                className="porsche-btn-solid cursor-pointer"
              >
                Configure Your GT3 RS
              </button>
              <button onClick={handleBrochureDownload} className="porsche-btn-outline cursor-pointer">
                Download Brochure
              </button>
            </div>
          </div>
        </section>

        {/* MINIMAL BRAND FOOTER */}
        <footer className="bg-[#0a0a0a] text-white/50 py-16 px-6 md:px-16 border-t border-white/[0.08] font-mono text-[13px]">
          <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            
            <div className="flex flex-col gap-2">
              <span className="porsche-wordmark tracking-[0.45em] text-white">
                PORSCHE
              </span>
              <span className="text-[11px] text-white/30 block mt-1">
                &copy; 2026 Porsche Experience. Designed &amp; Developed by itachii9090.
              </span>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 uppercase text-[11px] tracking-wider text-white/40 font-sans font-semibold">
              <span 
                onClick={() => {
                  const el = document.getElementById("telemetry-start");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="hover:text-white cursor-pointer transition-colors duration-200"
              >
                Models
              </span>
              <span>&middot;</span>
              <span 
                onClick={() => {
                  const el = document.getElementById("aerodynamics");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="hover:text-white cursor-pointer transition-colors duration-200"
              >
                Motorsport
              </span>
              <span>&middot;</span>
              <span 
                onClick={() => setIsConfigOpen(true)}
                className="hover:text-white cursor-pointer transition-colors duration-200"
              >
                Configurator
              </span>
              <span>&middot;</span>
              <span 
                onClick={() => setIsDealersOpen(true)}
                className="hover:text-white cursor-pointer transition-colors duration-200"
              >
                Dealers
              </span>
            </div>

            <div className="flex gap-4 text-white/40 uppercase tracking-widest text-[10px] font-sans font-bold">
              <span className="hover:text-white cursor-pointer transition-colors duration-200">Instagram</span>
              <span className="hover:text-white cursor-pointer transition-colors duration-200">YouTube</span>
              <span className="hover:text-white cursor-pointer transition-colors duration-200">Twitter</span>
            </div>

          </div>
        </footer>

      </div>

      {/* ========================================================================= */}
      {/* MOCK APPLICATION INTERACTIVE MODALS & OVERLAYS */}
      {/* ========================================================================= */}

      {/* 1. FULL-SCREEN NAV MENU OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center font-sans overflow-hidden"
          >
            {/* Opaque Background Image */}
            <div 
              className="absolute inset-0 bg-[url('/images/bg-moon.jpg')] bg-cover bg-center opacity-[0.30] pointer-events-none z-0" 
            />
            <button 
              onClick={() => setIsMenuOpen(false)} 
              className="absolute top-6 left-6 text-white/50 hover:text-white uppercase tracking-widest text-xs flex items-center gap-1.5 cursor-pointer font-bold z-10"
            >
              <X size={16} /> Close Menu
            </button>
            <div className="flex flex-col gap-6 text-center max-w-lg px-6 z-10">
              {[
                { label: "Showroom Grid", id: "telemetry-start" },
                { label: "Active Aerodynamics", id: "aerodynamics" },
                { label: "Performance telemetry", id: "performance" },
                { label: "Engine Crankshaft", id: "powertrain-splits" },
                { label: "PDLS Lights System", id: "design" },
                { label: "Design Details", id: "design-gallery" },
                { label: "Specifications", id: "configure-section" }
              ].map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsMenuOpen(false);
                    const el = document.getElementById(link.id);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-2xl sm:text-4xl font-extrabold uppercase tracking-widest text-white/60 hover:text-white hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
              
              <div className="h-[1px] w-24 bg-white/20 mx-auto my-4" />
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { setIsMenuOpen(false); setIsConfigOpen(true); }}
                  className="text-xs uppercase tracking-widest text-white/50 hover:text-white font-bold cursor-pointer"
                >
                  GT3 RS Configurator &rarr;
                </button>
                <button 
                  onClick={() => { setIsMenuOpen(false); setIsDealersOpen(true); }}
                  className="text-xs uppercase tracking-widest text-white/50 hover:text-white font-bold cursor-pointer"
                >
                  Find a Porsche Centre &rarr;
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. INTERACTIVE CONFIGURATOR BUILDER MODAL */}
      <AnimatePresence>
        {isConfigOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 font-sans text-white"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0c0c0c] border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-black/40">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/50">Interactive Builder</h3>
                  <h2 className="text-xl font-extrabold tracking-tight text-white uppercase mt-0.5">Configure 911 GT3 RS</h2>
                </div>
                <button onClick={() => { setIsConfigOpen(false); setIsConfigOrdered(false); }} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer">
                  <X size={14} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 scrollbar-none">
                {isConfigOrdered ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-10 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center text-green-400 mb-6">
                      <Check size={32} />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-wider text-white">Booking Confirmed</h3>
                    <p className="text-white/60 text-sm mt-3 leading-relaxed max-w-md font-light">
                      Your Porsche 911 GT3 RS configuration build code has been generated. A Porsche Personal consultant from your nearest dealer will call you to finalize allocation.
                    </p>
                    
                    {/* Summary Card */}
                    <div className="mt-8 bg-white/5 border border-white/10 p-5 rounded-xl w-full text-left font-mono text-xs flex flex-col gap-3">
                      <div className="flex justify-between border-b border-white/15 pb-2 text-[10px] text-white/50 uppercase tracking-widest">
                        <span>Option Details</span>
                        <span>MSRP</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Porsche 911 GT3 RS (Base)</span>
                        <span className="font-bold">${basePrice.toLocaleString()}</span>
                      </div>
                      {/* Paint spec removed */}
                      <div className="flex justify-between">
                        <span className="text-white/70">Wheels: {selectedWheels.name}</span>
                        <span className="font-bold">${selectedWheels.price === 0 ? "No Charge" : selectedWheels.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Setup: {selectedPackage.name}</span>
                        <span className="font-bold">${selectedPackage.price === 0 ? "No Charge" : selectedPackage.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-white/15 pt-3 text-sm text-white font-sans font-extrabold uppercase">
                        <span>Total Build MSRP</span>
                        <span>${totalPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => { setIsConfigOpen(false); setIsConfigOrdered(false); }}
                      className="porsche-btn-solid mt-8 w-full cursor-pointer"
                    >
                      Back to Showroom
                    </button>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Left Column: Visual Preview with Dynamic Paint Overlay */}
                    <div className="flex flex-col gap-5 w-full">
                      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/50 aspect-[16/10] w-full flex items-center justify-center shadow-xl group">
                        <img
                          src="/images/wallpapers/wallpaper-studio.jpg"
                          alt="Porsche 911 GT3 RS live configurator profile"
                          className="w-full h-full object-cover block"
                        />

                        
                        {/* Paint spec badge removed */}

                        {/* Bottom Badge Overlay */}
                        <div className="absolute bottom-4 right-4 bg-black/60 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl text-[8px] uppercase tracking-widest font-black flex flex-col gap-0.5 text-right select-none">
                          <span className="text-white/40">Wheels Spec</span>
                          <span className="text-white font-sans">{selectedWheels.name.split(" (")[0]}</span>
                        </div>
                      </div>

                      {/* Config summary details */}
                      <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex flex-col gap-3 font-mono text-[10px] text-white/50 w-full shadow-inner">
                        <div className="flex justify-between items-center">
                          <span>BASE MODEL MSRP</span>
                          <span className="text-white font-bold">${basePrice.toLocaleString()}</span>
                        </div>
                        {/* Paint finish summary removed */}
                        <div className="flex justify-between items-center border-t border-white/5 pt-2.5">
                          <span>WHEELS PACKAGE</span>
                          <span className="text-white font-bold">{selectedWheels.name.split(" (")[0]}</span>
                          <span className="text-white font-bold">{selectedWheels.price === 0 ? "NO CHARGE" : `+$${selectedWheels.price.toLocaleString()}`}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-white/5 pt-2.5">
                          <span>TRACK PERFORMANCE PACKAGE</span>
                          <span className="text-white font-bold">{selectedPackage.name.split(" (")[0]}</span>
                          <span className="text-white font-bold">{selectedPackage.price === 0 ? "NO CHARGE" : `+$${selectedPackage.price.toLocaleString()}`}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Controls Options */}
                    <div className="flex flex-col gap-6 w-full">
                      {/* Wheels Selection */}
                      <div className="flex flex-col gap-3">
                        <span className="text-[10px] text-white/40 uppercase tracking-widest font-extrabold block">1. Select Wheels Package</span>
                        <div className="flex flex-col gap-2.5">
                          {configWheels.map((wheel) => {
                            const isSelected = selectedWheels.name === wheel.name;
                            return (
                              <button
                                key={wheel.name}
                                onClick={() => setSelectedWheels(wheel)}
                                className={`flex justify-between items-center p-3.5 border rounded-xl text-left transition-all cursor-pointer ${
                                  isSelected ? "bg-white/10 border-white text-white" : "bg-white/[0.02] border-white/10 text-white/70 hover:border-white/30"
                                }`}
                              >
                                <span className="text-xs font-bold uppercase tracking-wider">{wheel.name}</span>
                                <span className="text-xs font-semibold text-white/50 font-mono">
                                  {wheel.price === 0 ? "Standard Option" : `+ $${wheel.price.toLocaleString()}`}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Package Selection */}
                      <div className="flex flex-col gap-3 border-t border-white/10 pt-5">
                        <span className="text-[10px] text-white/40 uppercase tracking-widest font-extrabold block">2. Select Track Performance Package</span>
                        <div className="flex flex-col gap-2.5">
                          {configPackages.map((pkg) => {
                            const isSelected = selectedPackage.name === pkg.name;
                            return (
                              <button
                                key={pkg.name}
                                onClick={() => setSelectedPackage(pkg)}
                                className={`flex justify-between items-center p-3.5 border rounded-xl text-left transition-all cursor-pointer ${
                                  isSelected ? "bg-white/10 border-white text-white" : "bg-white/[0.02] border-white/10 text-white/70 hover:border-white/30"
                                }`}
                              >
                                <span className="text-xs font-bold uppercase tracking-wider">{pkg.name}</span>
                                <span className="text-xs font-semibold text-white/50 font-mono">
                                  {pkg.price === 0 ? "Standard Option" : `+ $${pkg.price.toLocaleString()}`}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Price summary block */}
                      <div className="border-t border-white/10 pt-6 mt-2 flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Estimated MSRP</span>
                          <span className="text-3xl font-black font-mono block mt-1">${totalPrice.toLocaleString()}</span>
                        </div>
                        <button 
                          onClick={() => setIsConfigOrdered(true)}
                          className="porsche-btn-solid cursor-pointer"
                        >
                          Submit Configuration
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. SIMULATED DEALERS LOCATOR MODAL */}
      <AnimatePresence>
        {isDealersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 font-sans text-white"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0c0c0c] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 relative flex flex-col"
            >
              <button onClick={() => { setIsDealersOpen(false); setDealerResults(null); setDealerNotice(null); setDealerSearchQuery(""); }} className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer">
                <X size={14} />
              </button>

              <span className="text-[10px] text-white/40 uppercase tracking-widest font-extrabold block">Dealers network</span>
              <h2 className="text-xl font-extrabold uppercase mt-1 text-white tracking-wider">Find a Porsche Centre</h2>

              <form onSubmit={handleDealerSearch} className="relative mt-5 flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Enter city or ZIP code..."
                    value={dealerSearchQuery}
                    onChange={(e) => setDealerSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 px-4 py-2.5 pl-10 text-xs rounded-xl focus:border-white focus:outline-none transition-all font-sans"
                  />
                  <Search size={14} className="absolute left-3.5 top-3.5 text-white/40" />
                </div>
                <button type="submit" className="bg-white text-black px-4 text-xs font-bold uppercase rounded-xl hover:bg-white/80 transition-all cursor-pointer">
                  Search
                </button>
              </form>

              {/* Dynamic Search Results */}
              <div className="mt-6 flex flex-col gap-3.5 min-h-[150px]">
                {dealerNotice && (
                  <div className="bg-green-500/10 border border-green-500/25 p-3 rounded-lg text-green-400 text-xs font-medium flex items-center gap-2">
                    <Check size={14} /> {dealerNotice}
                  </div>
                )}
                
                {dealerResults === null ? (
                  <div className="text-white/30 text-xs italic font-light text-center py-10">
                    Submit a search query to locate licensed Porsche dealerships.
                  </div>
                ) : dealerResults.length === 0 ? (
                  <div className="text-white/30 text-xs font-light text-center py-10 flex flex-col items-center gap-2">
                    <CircleAlert size={18} className="text-white/50" />
                    <span>No Porsche Centres found matching &ldquo;{dealerSearchQuery}&rdquo;</span>
                  </div>
                ) : (
                  dealerResults.map((dealer, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/[0.03] border border-white/5 p-4 rounded-xl flex flex-col gap-1.5"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-extrabold uppercase tracking-wide text-white">{dealer.name}</span>
                        <span className="text-[10px] text-white/50 font-mono">{dealer.distance}</span>
                      </div>
                      <span className="text-[11px] text-white/60 font-light">{dealer.address}</span>
                      <div className="flex justify-between items-center mt-3 border-t border-white/5 pt-2">
                        <span className="text-[10px] text-white/50 font-mono">{dealer.phone}</span>
                        <button 
                          onClick={() => setDealerNotice(`Requested callback with ${dealer.name}`)}
                          className="text-[9px] uppercase tracking-widest text-white/80 hover:text-white font-bold cursor-pointer"
                        >
                          Request Callback
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. SIMULATED USER LOGIN MODAL */}
      <AnimatePresence>
        {isLoginOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 font-sans text-white"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0c0c0c] border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 relative flex flex-col"
            >
              <button onClick={() => { setIsLoginOpen(false); setLoginInput(""); }} className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer">
                <X size={14} />
              </button>

              <span className="text-[10px] text-white/40 uppercase tracking-widest font-extrabold block">My Porsche Gateway</span>
              
              {userAccount ? (
                <div className="py-8 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white/80 mb-4 font-extrabold">
                    {userAccount.slice(0,2).toUpperCase()}
                  </div>
                  <h2 className="text-xl font-extrabold text-white uppercase tracking-wider">Welcome Back</h2>
                  <span className="text-xs text-white/60 font-mono mt-1">{userAccount}</span>
                  <button 
                    onClick={() => setUserAccount(null)}
                    className="porsche-btn-outline mt-8 w-full cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-extrabold uppercase mt-1 text-white tracking-wider">Account Portal</h2>
                  
                  <div className="flex flex-col gap-4 mt-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Porsche Driver ID</label>
                      <input
                        type="email"
                        placeholder="driver@porsche-id.com"
                        value={loginInput}
                        onChange={(e) => setLoginInput(e.target.value)}
                        className="bg-white/5 border border-white/15 px-4 py-2.5 text-xs rounded-xl focus:border-white focus:outline-none transition-all font-sans"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Password</label>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        className="bg-white/5 border border-white/15 px-4 py-2.5 text-xs rounded-xl focus:border-white focus:outline-none transition-all font-sans"
                      />
                    </div>
                    <button 
                      onClick={() => {
                        if (loginInput.trim()) {
                          setUserAccount(loginInput);
                          setIsLoginOpen(false);
                          setLoginInput("");
                        } else {
                          setUserAccount("driver@porsche-id.com");
                          setIsLoginOpen(false);
                        }
                      }}
                      className="porsche-btn-solid mt-4 cursor-pointer text-center w-full"
                    >
                      Log In
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === GLOBAL FLOATING AUDIO CONTROLLER === */}
      {isMounted && (
        <button
          onClick={() => {
            if (activeAudioVideo) {
              setActiveAudioVideo(null);
            } else {
              setActiveAudioVideo("hero-racing"); // Default to hero racing when unmuting globally
            }
          }}
          className="fixed bottom-8 left-8 z-[90] w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-lg group"
          aria-label={activeAudioVideo ? "Mute all sound" : "Unmute primary sound"}
          title={activeAudioVideo ? "Mute all sound" : "Unmute primary sound"}
        >
          {!activeAudioVideo ? (
            <VolumeX size={18} className="group-hover:scale-110 transition-transform" />
          ) : (
            <Volume2 size={18} className="group-hover:scale-110 transition-transform animate-pulse" />
          )}
        </button>
      )}

      {/* === BACK TO TOP FLOATING BUTTON === */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-[90] w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 cursor-pointer shadow-lg group"
            aria-label="Back to top"
          >
            <ChevronUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* === BROCHURE DOWNLOAD TOAST === */}
      <AnimatePresence>
        {showBrochureToast && (
          <motion.div
            initial={{ opacity: 0, y: 40, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 40, x: "-50%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-8 left-1/2 z-[90] bg-white text-black px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 font-sans"
          >
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <Download size={14} className="text-green-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider">Brochure Ready</span>
              <span className="text-[10px] text-black/60 font-light">911_GT3_RS_Brochure_2026.pdf — 24.8 MB</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
    </>
  );
}
