"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Lanyard from "./components/Lanyard/Lanyard";
import RotatingText from "./components/RotatingText/RotatingText";
import SplitText from "./components/SplitText/SplitText";
import BlurText from "./components/BlurText/BlurText";
import AnimatedContent from "./components/AnimatedContent/AnimatedContent";
import DotGrid from "./components/DotGrid/DotGrid";
import ColorBends from "./components/ColorBends/ColorBends";
import PillNav from "./components/PillNav/PillNav";
import LogoLoop from "./components/LogoLoop/LogoLoop";


// --- PISAHAN DATA ---

type DetailItem = {
  label: string;
  value?: string | string[];
  list?: boolean;
};

type ProjectLink = {
  label: string;
  href: string;
};

type GalleryItem = string | [string, string];

type Project = {
  id: string;
  cardTag: string;
  year: string;
  title: string;
  shortDesc: string;
  period?: string;
  roleLabel?: string;
  role?: string;
  details?: DetailItem[];
  heroImage?: string;
  logo?: string;
  gallery?: GalleryItem[];
  link?: string | null;
  links?: ProjectLink[];
  ctaLabel?: string;
};

type AchievementItem = {
  title: string;
  competitionType: string;
  organizer: string;
  date: string;
  image?: string;
  href?: string;
};

const galleryItems = (gallery: GalleryItem[] = []) =>
  gallery
    .map((item) => {
      if (typeof item === "string") {
        return { src: item, caption: "" };
      }
      const [src, caption] = item;
      return { src, caption: caption ?? "" };
    })
    .filter((item) => item.src && item.src.trim().length > 0);

const renderMultilineText = (text: string | string[]) =>
  Array.isArray(text)
    ? text.map((line: string, index: number) => (
      <span key={index}>
        {line}
        {index < text.length - 1 && <br />}
      </span>
    ))
    : text;

const renderDetails = (details: DetailItem[] = []) =>
  details
    .filter((item) => {
      if (item.list && Array.isArray(item.value)) {
        return item.value.some((entry) => entry.trim().length > 0);
      }
      if (Array.isArray(item.value)) {
        return item.value.some((entry) => entry.trim().length > 0);
      }
      return typeof item.value === "string" && item.value.trim().length > 0;
    })
    .map((item, index) => (
      <div key={`${item.label}-${index}`}>
        <p className="text-sm text-white/60">{item.label}</p>
        {item.list && Array.isArray(item.value) ? (
          <ul className="mt-2 space-y-1 text-base text-white/80 list-disc list-outside ml-5">
            {item.value
              .filter((entry) => entry.trim().length > 0)
              .map((entry, entryIndex) => (
                <li key={entryIndex}>{entry}</li>
              ))}
          </ul>
        ) : (
          <p className="text-base text-white/80">{renderMultilineText(item.value ?? "")}</p>
        )}
      </div>
    ));

const experiencesData = [
  {
    id: "internbi",
    cardTag: "Internship",
    year: "2025",
    title: "Bank Indonesia South Sulawesi",
    shortDesc: "Data Entry Automation and Forecasting support",
    period: "22 Apr 2025 - 1 Aug 2025",
    roleLabel: "Job Type",
    role: "Internship",
    details: [
      {
        label: "Position",
        value: "Data and Statistics Function of Economic and Finance"
      },
      {
        label: "Task",
        value: [
          "Developed a streamlining tool using Fuzzy Matching with Levenshtein Distance algorithm to accelerate monthly Data Entry of 5,000+ entries from 52 different spreadsheets with time efficiency up to 75% (from 2 hours to 30 minutes).",
          "Participated in an internal project to develop a Farmer Planting Calendar dashboard. Performed Data Analysis, Forecasting, and Data Visualization in Power BI to provide optimal planting period recommendations for farmers.",
          "Managed monthly food price and balance sheet updates across multiple web portals."
        ],
        list: true
      }
    ],
    heroImage: "/assets/experience/internbi/Capstone Presentation.jpg",
    gallery: [
      ["/assets/experience/internbi/Capstone Presentation.jpg", "Capstone Presentation"],
      ["/assets/experience/internbi/Onboarding.jpg", "Onboarding"],
      ["/assets/experience/internbi/Mentors and Partner.jpg", "Mentors and Partner"],
      ["/assets/experience/internbi/3rd Floor Fellows.jpg", "3rd Floor Fellows"],
      ["/assets/experience/internbi/Internal Project Fellows.jpg", "Internal Project Fellows"]
    ],
    logo: "/assets/experience/internbi/Logo BI.png",
    link: null
  }
];

const projectsData = [
  {
    id: "intelligentcoffeeshop",
    cardTag: "NextJS, n8n",
    year: "2025",
    title: "Intelligent Coffee Shop Automation",
    shortDesc: "AI Generated Insights for Coffee Shop Businesses",
    period: "May 2026",
    roleLabel: "Tools",
    role: "NextJS, n8n",
    details: [
      {
        label: "Description",
        value: "Intelligent Coffee Shop Automation merupakan project full-stack yang saya kerjakan bersama teman. Berawal dari keresahan terhadap naiknya harga menu dari coffee shop favorit saya, memunculkan ide untuk membuat aplikasi ini. Juga mengingat banyaknya Coffee Shop di kota saya, Makassar dan menempati peringkat 1 Coffee Shop terbanyak di Indonesia. Kami membuat sistem cerdas untuk memaksimalkan kinerja operasional melalui AI Agent. Dasbor bisa menghasilkan laporan layaknya data analyst dan business intelligence kepada owner, sehingga memudahkan decision making. Sistem dibekali dengan intelligence stock untuk mencatat segala bahan keluar secara otomatis, menampilkan sisa menu available, dan early warning. Selain itu, sistem bisa memberikan rekomendasi upselling yang langsung muncul di layar kasir menggunakan algoritma taste-profile seperti Netflix."
      },
      {
        label: "Task",
        value: [
          "-",
          "-"
        ],
        list: true
      }
    ],
    heroImage: "./assets/projects/intelligentcoffeeshop/frontend.jpeg",
    gallery: [
      "./assets/projects/intelligentcoffeeshop/frontend.jpeg",
      "./assets/projects/intelligentcoffeeshop/backend.png",
    ],
    // link: "https://foodsecurityforecasting.streamlit.app/"
  },
  {
    id: "foodsecurity",
    cardTag: "Streamlit",
    year: "2025",
    title: "Food Security Forecasting System",
    shortDesc: "Food Security System for Sulampua's Region.",
    period: "Jul 2025 - Sep 2025",
    roleLabel: "Tools",
    role: "Streamlit",
    details: [
      {
        label: "Description",
        value: "Built a time-series forecasting model to support pension fund planning decisions."
      },
      {
        label: "Task",
        value: [
          "Collaborated on building a Machine Learning based Food Security Prediction System using the Streamlit framework.",
          "Performed Predictive Modeling on 5 variables from the National Food Agency’s Food Security Atlas, covering 127 points in the Sulampua region. Model achieved an R2 score of 0.801 and RMSE of 0.887."
        ],
        list: true
      }
    ],
    heroImage: "./assets/projects/foodsecurity/foodsecurity1.png",
    gallery: [
      "./assets/projects/foodsecurity/foodsecurity1.png",
      "./assets/projects/foodsecurity/foodsecurity2.png",
      "./assets/projects/foodsecurity/foodsecurity3.png"
    ],
    link: "https://foodsecurityforecasting.streamlit.app/"
  },
  {
    id: "pensionfund",
    cardTag: "Streamlit",
    year: "2025",
    title: "Pension Fund Actuarial Simulator",
    shortDesc: "Count pension fund premium costs.",
    period: "Oct 2025 - Jan 2026",
    roleLabel: "Tools",
    role: "Streamlit",
    details: [
      {
        label: "Description",
        value: "Built a time-series forecasting model to support pension fund planning decisions."
      },
      {
        label: "Task",
        value: [
          "Built a Pension Fund Calculator using the Streamlit framework. Useful for calculating participant premiums, featuring simulation parameters adjustable to user conditions.",
          "Implemented Entry Age Normal, Attained Age Normal, and Projected Unit Credit formulas into a digital platform for transparent and accessible calculations."
        ],
        list: true
      }
    ],
    heroImage: "./assets/projects/pensionfund/pensionfund1.png",
    gallery: [
      "./assets/projects/pensionfund/pensionfund1.png",
      "./assets/projects/pensionfund/pensionfund2.png",
      "./assets/projects/pensionfund/pensionfund3.png"
    ],
    link: "https://danapensiun.streamlit.app/"
  },
  {
    id: "cultivatedhighland",
    cardTag: "Colab, Looker",
    year: "2024",
    title: "Cultivated Highland Agriculture",
    shortDesc: "Best time for plant and crop forecaster.",
    period: "Jan 2024 - Apr 2024",
    roleLabel: "Tools",
    role: "Google Colab, Looker Studio",
    details: [
      {
        label: "Description",
        value: "Built a time-series forecasting model to support pension fund planning decisions."
      },
      {
        label: "Task",
        value: [
          "Collaborated on an Artificial Intelligence based Highland Agriculture Parameter dashboard and identified business opportunities through predictive analysis.",
          "Managed Data Pipelines and performed Hyperparameter Tuning to optimize model performance across various environmental parameters."
        ],
        list: true
      }
    ],
    heroImage: "./assets/projects/cultivatedhighland/cultivatedhighland1.png",
    gallery: [
      "./assets/projects/cultivatedhighland/cultivatedhighland1.png"
    ],
    links: [
      {
        label: "Open Notebook",
        href: "https://bit.ly/NotebookDigdaya"
      },
      {
        label: "Open Dashboard",
        href: "https://bit.ly/DashboardDigdaya"
      }
    ]
  }
];

const researchData = [
  {
    id: "smartcelldrybox",
    cardTag: "Scientific Paper Competition",
    year: "2022",
    title: "Smart Cell Dry Box: Practical Seaweed Processing",
    shortDesc: "Winning Paper at Milky Way Scientific Paper Competition",
    period: "Aug 2024 - Oct 2024",
    roleLabel: "Category",
    role: "Scientific Paper Competition",
    details: [
      {
        label: "Full Title",
        value: "Smart Cell Dry Box: Pengolahan Praktis Rumput Laut di Desa Laikang, Kabupaten Takalar, Sulawesi Selatan"
      },
      {
        label: "Recognition",
        value: "Winner of Milky Way Scientific Paper Competition by Universitas Jember."
      },
      {
        label: "Description",
        value: "An innovation"
      },
      {
        label: "Task",
        value: "Doing research"
      }
    ],
    heroImage: "",
    gallery: [],
    link: ""
  },
  {
    id: "sipekan",
    cardTag: "Scientific Paper Competition",
    year: "2025",
    title: "SIPEKAN: Food Security Prediction System",
    shortDesc: "Top 10 Paper at Aksinomi Sulampua",
    period: "October 2025",
    roleLabel: "Category",
    role: "Scientific Paper Competition",
    details: [
      {
        label: "Full Title",
        value: "SIPEKAN: Sistem Prediksi Ketahanan Pangan berbasis Machine Learning sebagai Supporting Model Perumusan Kebijakan"
      },
      {
        label: "Recognition",
        value: "Top 10 Paper at Aksinomi Sulampua 2025, Professional Category"
      },
      {
        label: "Description",
        value: "An innovation."
      },
      {
        label: "Task",
        value: "Doing research"
      }
    ],
    heroImage: "",
    gallery: [],
    links: [
      {
        label: "Open Notebook",
        href: "#foodsecurity"
      },
    ]
  },
  {
    id: "ecobluevillage",
    cardTag: "Scientific Paper Competition",
    year: "2024",
    title: "Eco Blue Village: Seaweed Biofuel Innovation",
    shortDesc: "Submission for Aksinomi Sulampua",
    period: "September 2025",
    roleLabel: "Category",
    role: "Scientific Paper Competition",
    details: [
      {
        label: "Full Title",
        value: "Eco Blue Village: Modifikasi Olahan Rumput Laut Menjadi Biofuel sebagai Katalisator Perekonomian Takalar melalui Penguatan BumDes Sokong Indonesia Emas 2045"
      },
      {
        label: "Recognition",
        value: "Submission for Aksinomi Sulampua 2024, Undergraduate Category"
      },
      {
        label: "Description",
        value: "An innovation."
      },
      {
        label: "Task",
        value: "Doing research"
      }
    ],
    heroImage: "",
    gallery: [],
    link: ""
  },
];

const organizationsData: Project[] = [
  {
    id: "org-softball",
    cardTag: "President",
    year: "2024",
    title: "Softball Student Activity Unit",
    shortDesc: "UKM Softball-Baseball Unhas",
    period: "Jan 2024 - Dec 2024",
    roleLabel: "Role",
    role: "President",
    details: [
      {
        label: "Native Name",
        value: "Unit Kegiatan Mahasiswa Softball-Baseball Universitas Hasanuddin"
      },
      {
        label: "Task",
        value: [
          "Coordinated 24 daily board members and 52 junior members in executing organizational activities.",
          "Built bonding and instilled a competitive spirit in members, leading to 1st Place achievements for both Men’s and Women’s teams at the 2024 Airlangga National Championship."
        ],
        list: true
      }
    ],
    heroImage: "",
    logo: "/assets/organizations/softball/Logo UKM Softball Unhas.png",
    gallery: [
      ["/assets/organizations/softball/Certificate of Appreciation.jpg", "Certificate of Appreciation"],
      ["/assets/organizations/softball/Champion Team.jpg", "Champion Team"],
      ["/assets/organizations/softball/Unhas Day 2024.jpg", "Unhas Day 2024"],
      ["/assets/organizations/softball/Softball Club Fellows.jpg", "Softball Club Fellows"],
    ],
    link: null
  },
  {
    id: "org-himatika",
    cardTag: "Academic Coordinator",
    year: "2023",
    title: "Mathematics Student Club",
    shortDesc: "Himatika FMIPA Unhas",
    period: "Nov 2023 - Jun 2024",
    roleLabel: "Role",
    role: "Coordinator of Academic & Student Affairs",
    details: [
      {
        label: "Native Name",
        value: "Himpunan Mahasiswa Matematika FMIPA Universitas Hasanuddin"
      },
      {
        label: "Task",
        value: [
          "Coordinated 15 daily board members to provide academic assistance for 120 junior members.",
          "Maintained student integrity within the association to ensure members complete their studies on time."
        ],
        list: true
      }
    ],
    heroImage: "",
    logo: "/assets/organizations/himatika/Logo Himatika FMIPA Unhas.png",
    gallery: [
      ["/assets/organizations/himatika/Executive Board.jpg", "Executive Board"],
    ],
    link: null
  }
];

const achievements: AchievementItem[] = [
  {
    title: "Top 10 Paper",
    competitionType: "Scientific Paper",
    organizer: "Aksinomi Sulampua, BI Sulsel",
    date: "Oct 2025",
  },
  {
    title: "Top 10 Ambassador",
    competitionType: "Ambassador",
    organizer: "CBP Rupiah, BI Sulsel",
    date: "Jun 2025",
  },
  {
    title: "Outstanding Student",
    competitionType: "Recognition",
    organizer: "Math Dept. Hasanuddin University",
    date: "Aug 2024",
  },
  {
    title: "1st Place Softball Men's",
    competitionType: "Sports",
    organizer: "Airlangga National Championship",
    date: "Jul 2024",
  },
  {
    title: "Outstanding Student",
    competitionType: "Recognition",
    organizer: "Math Dept. Hasanuddin University",
    date: "Aug 2023",
  },
  {
    title: "2nd Place Softball Men's",
    competitionType: "Sports",
    organizer: "UGM Cup",
    date: "Jun 2023",
  },
  {
    title: "2nd Place Videography",
    competitionType: "Creative",
    organizer: "National Environmental Expo",
    date: "Jun 2023",
  },
  {
    title: "4th Runner-Up Infographic",
    competitionType: "Creative",
    organizer: "Celebes Plano Fest",
    date: "Nov 2023",
  },
  {
    title: "1st Place Paper",
    competitionType: "Scientific Paper",
    organizer: "Milky Way Scientific Paper Competition",
    date: "Dec 2022",
  }
];

export default function Home() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    images: [] as string[],
    captions: [] as string[],
    index: 0
  });
  const [lanyardOffsetY, setLanyardOffsetY] = useState(0);

  // --- STATE UNTUK GYROSCOPE LANYARD ---
  const [gyroGravity, setGyroGravity] = useState<[number, number, number]>([0, -40, 0]);
  const [showGyroPermission, setShowGyroPermission] = useState(false);

  const [pageReady, setPageReady] = useState(false);
  const [isLowPerformanceMode, setIsLowPerformanceMode] = useState(false);

  useEffect(() => {
    setPageReady(true);

    // Performance Check for heavy animations
    const checkPerformance = () => {
      const storedPref = localStorage.getItem("performanceMode");
      if (storedPref) {
        setIsLowPerformanceMode(storedPref === "low");
        return;
      }

      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const isLowEndHardware = hardwareConcurrency < 4;
      const isMobile = window.innerWidth < 768;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Enable low performance mode if reduced motion is preferred OR it's a low-end mobile device
      setIsLowPerformanceMode(prefersReducedMotion || (isLowEndHardware && isMobile));
    };

    checkPerformance();

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e: MediaQueryListEvent) => {
      const storedPref = localStorage.getItem("performanceMode");
      if (storedPref) return; // Don't override manual preference
      if (e.matches) setIsLowPerformanceMode(true);
      else checkPerformance();
    };

    mediaQuery.addEventListener("change", handleMotionChange);
    return () => mediaQuery.removeEventListener("change", handleMotionChange);
  }, []);

  const togglePerformanceMode = () => {
    setIsLowPerformanceMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("performanceMode", newMode ? "low" : "high");
      return newMode;
    });
  };

  // --- REFERENSI & LOGIKA SCROLL DOCUMENTATION ---
  const docsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateLanyardOffset = () => {
      const width = window.innerWidth;
      if (width >= 1366) {
        setLanyardOffsetY(0.4);
      } else if (width >= 1024) {
        setLanyardOffsetY(0.6);
      } else if (width >= 768) {
        setLanyardOffsetY(-0.8);
      } else {
        setLanyardOffsetY(0);
      }
    };

    updateLanyardOffset();
    window.addEventListener("resize", updateLanyardOffset);
    return () => window.removeEventListener("resize", updateLanyardOffset);
  }, []);

  useEffect(() => {
    const el = docsScrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, [activeProject]);

  const navItems = [
    { id: "profile", label: "Profile", href: "#profile" },
    { id: "experiences", label: "Experiences", href: "#experiences" },
    { id: "projects", label: "Projects", href: "#projects" },
    { id: "research", label: "Research", href: "#research" },
    { id: "organizations", label: "Organizations", href: "#organizations" },
    { id: "achievements", label: "Achievements", href: "#achievements" },
    { id: "contacts", label: "Contacts", href: "#contacts" },
  ];

  // 1. LOGIKA HISTORY BROWSER
  useEffect(() => {
    const handlePopState = () => {
      if (lightbox.isOpen) {
        setLightbox((prev) => ({ ...prev, isOpen: false }));
      } else if (activeProject) {
        setActiveProject(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightbox.isOpen) window.history.back();
        else if (activeProject) window.history.back();
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightbox.isOpen, activeProject]);

  // 2. LOGIKA GYROSCOPE (DEVICE ORIENTATION)
  const handleOrientation = (event: DeviceOrientationEvent) => {
    let { beta, gamma } = event;
    if (beta === null || gamma === null) return;

    // Batasi nilai kemiringan ekstrem
    beta = Math.max(-90, Math.min(90, Math.floor(beta)));
    gamma = Math.max(-90, Math.min(90, Math.floor(gamma)));

    // Konversi kemiringan X dan Y menjadi sumbu gravitasi X dan Z (Rapier physics)
    const gx = gamma * 0.6;
    const gz = (beta - 45) * 0.6; // Anggap posisi rileks HP adalah miring 45 derajat

    setGyroGravity([gx, -40, gz]);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        // Jika iOS 13+, butuh permission (tampilkan tombol)
        setShowGyroPermission(true);
      } else {
        // Jika Android atau browser lain, langsung jalankan
        window.addEventListener('deviceorientation', handleOrientation);
      }
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  const requestGyro = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
          setShowGyroPermission(false);
        } else {
          setShowGyroPermission(false); // Sembunyikan tombol jika ditolak
        }
      } catch (e) {
        console.error("Gyro error:", e);
      }
    }
  };

  // 3. LOGIKA KUNCI SCROLL SAAT MODAL TERBUKA
  const isOverlayOpen = activeProject !== null || lightbox.isOpen;

  useEffect(() => {
    if (isOverlayOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOverlayOpen]);

  // Keyboard navigation for lightbox (prevent arrow key scrolling)
  useEffect(() => {
    if (!lightbox.isOpen) return;

    const handleLightboxKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setLightbox((prev) => ({ ...prev, index: (prev.index + 1) % prev.images.length }));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setLightbox((prev) => ({ ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length }));
      }
    };

    window.addEventListener("keydown", handleLightboxKey);
    return () => window.removeEventListener("keydown", handleLightboxKey);
  }, [lightbox.isOpen]);

  // CONTROLLERS MODAL & LIGHTBOX
  const openProjectModal = (project: any) => {
    window.history.pushState({ modalOpen: true }, "");
    setActiveProject(project);
  };
  const closeProjectModal = () => window.history.back();

  const openLightbox = (images: string[], captions: string[], index: number) => {
    window.history.pushState({ lightboxOpen: true }, "");
    setLightbox({ isOpen: true, images, captions, index });
  };
  const closeLightbox = () => window.history.back();

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightbox((prev) => ({ ...prev, index: (prev.index + 1) % prev.images.length }));
  };
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightbox((prev) => ({ ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length }));
  };

  const achievementTargetById = (id: string) =>
    researchData.find((project) => project.id === id) ||
    projectsData.find((project) => project.id === id) ||
    experiencesData.find((project) => project.id === id) ||
    organizationsData.find((project) => project.id === id);

  const techLogos = achievements.map((item, index) => {
    const combinedTitle = item.title.trim();
    const isExternal = item.href?.startsWith("http");
    const targetId = item.href?.startsWith("#") ? item.href.slice(1) : undefined;
    const modalTarget = targetId ? achievementTargetById(targetId) : undefined;

    const card = (
      <div className="w-[260px] sm:w-[300px] rounded-3xl border border-white/15 bg-[#111111] p-4 text-left transition-all duration-300 hover:scale-[1.02] hover:border-white my-2">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-white/60 truncate">{item.competitionType}</p>
          <p className="text-xs uppercase tracking-wide text-white/60 truncate">{item.date}</p>
        </div>
        <h3 className="mt-1 text-base font-semibold text-white truncate">{combinedTitle}</h3>
        <p className="mt-1 text-xs text-white/60 truncate">{item.organizer}</p>
      </div>
    );

    if (modalTarget) {
      return {
        node: (
          <button
            type="button"
            onClick={() => openProjectModal(modalTarget)}
            className="block"
            aria-label={`Open ${combinedTitle}`}
          >
            {card}
          </button>
        ),
        title: combinedTitle
      };
    }

    if (item.href && isExternal) {
      return {
        node: (
          <a
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="block"
            aria-label={`Open ${combinedTitle}`}
          >
            {card}
          </a>
        ),
        title: combinedTitle
      };
    }

    if (item.href) {
      return {
        node: (
          <Link href={item.href} className="block" aria-label={`Open ${combinedTitle}`}>
            {card}
          </Link>
        ),
        title: combinedTitle
      };
    }

    return {
      node: <div className="block">{card}</div>,
      title: combinedTitle,
      ariaLabel: `Achievement ${index + 1}`
    };
  });


  return (
    <div id="profile" className="min-h-screen overflow-x-hidden bg-[#101010] relative pt-0 pb-10">

      {/* PERFORMANCE TOGGLE */}
      <button
        onClick={togglePerformanceMode}
        className="fixed z-50 bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center justify-center w-12 h-12 sm:w-auto sm:h-auto sm:px-3 sm:py-2 gap-2 bg-[#111111]/60 hover:bg-[#111111]/80 backdrop-blur-md border border-white/20 text-white/80 rounded-full sm:rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
        aria-label="Toggle Performance Mode"
        title={isLowPerformanceMode ? "Enable High Performance Mode" : "Enable Low Performance Mode"}
      >
        {isLowPerformanceMode ? (
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-currentColor stroke-[1.5] stroke-linecap-round stroke-linejoin-round">
            <rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect>
            <line x1="22" y1="11" x2="22" y2="13"></line>
            <line x1="6" y1="11" x2="6" y2="13"></line>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-[#C6F10E] stroke-[1.5] stroke-linecap-round stroke-linejoin-round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        )}
        <span className="text-xs font-medium hidden sm:inline">{isLowPerformanceMode ? "Low Performance" : "High Performance"}</span>
      </button>

      {/* PILL NAV */}
      <PillNav items={navItems} forceClose={isOverlayOpen} />

      {/* HEADER SECTION */}
      <div className="w-full relative overflow-visible">
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div style={{ width: '100%', height: '100%', position: 'relative', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)' }}>
            {!isLowPerformanceMode ? (
              <>
                <ColorBends colors={["#19382e"]} rotation={90} speed={0.2} scale={1} frequency={1} warpStrength={1} mouseInfluence={1} noise={0.15} parallax={0.5} iterations={1} intensity={1.5} bandWidth={6} transparent autoRotate={0} />
                <DotGrid dotSize={5} gap={15} baseColor="#2F293A" activeColor="#5227FF" proximity={120} shockRadius={250} shockStrength={5} resistance={750} returnDuration={1.5} />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#101010] via-[#15241e] to-[#101010] opacity-80" />
            )}
          </div>
        </div>
        <div className={`mx-auto max-w-[1366px] min-h-screen px-4 sm:px-6 ${isLowPerformanceMode ? 'flex items-center' : ''}`}>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-0 w-full">
            <div className={`col-span-1 h-full relative z-10 order-2 xl:order-1 ${!isLowPerformanceMode ? 'xl:col-span-6' : 'xl:col-span-12'}`}>
              <div className={`flex ${!isLowPerformanceMode ? 'items-start xl:items-center' : 'items-center'} h-full w-full`}>
                <div className={`flex flex-col gap-6 ${!isLowPerformanceMode ? '-mt-28 sm:-mt-20 md:-mt-10 lg:-mt-64 xl:mt-0' : 'w-full max-w-5xl mx-auto'} transition-opacity duration-300 ${!pageReady ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
                  <AnimatedContent distance={100} direction="vertical" reverse={false} duration={0.8} ease="power3.out" initialOpacity={0} animateOpacity scale={1} threshold={0.1} delay={0}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-0 sm:mt-0 md:mt-14">
                      <h1 className="text-lg sm:text-2xl text-white font-bold">Open to Position as a</h1>
                      <RotatingText texts={['Data Analyst', 'Data Scientist', 'Risk Analyst', 'Management Trainee']} mainClassName="px-2 sm:px-2 md:px-3 bg-[#C6F10E] text-black overflow-hidden py-0.5 sm:py-1 justify-center rounded-lg text-lg sm:text-2xl font-bold inline-flex transition-all" staggerFrom="last" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-120%" }} staggerDuration={0.025} splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1" transition={{ type: "spring", damping: 30, stiffness: 400 }} rotationInterval={2000} animatePresenceMode="wait" animatePresenceInitial={false} splitBy="characters" auto loop />
                    </div>
                  </AnimatedContent>
                  <div className="flex flex-col items-start gap-4">
                    <SplitText text="I'm Maulana Raji Shofil Fuadi" className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-semibold text-start whitespace-normal lg:whitespace-nowrap" textAlign="left" delay={50} from={{ opacity: 0, transform: 'translate3d(0,50px,0)' }} to={{ opacity: 1, transform: 'translate3d(0,0,0)' }} threshold={0.1} rootMargin="-0px" />
                    <SplitText text="Actuarial Science Graduate" className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold text-start text-[#C6F10E]" textAlign="left" delay={75} from={{ opacity: 0, transform: 'translate3d(0,50px,0)' }} to={{ opacity: 1, transform: 'translate3d(0,0,0)' }} threshold={0.1} rootMargin="-0px" />
                  </div>
                  <div className="flex flex-col items-start">
                    <BlurText text="Actuarial Science graduate with a concentration in data analytics, currently focusing on AI Automation. Demonstrated leader with strong leadership skills and a history of accomplishments. Effective communicator in both Indonesian and English, equipped with a solid skillset in management and creative sectors." delay={20} animateBy="words" direction="top" className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 max-w-xl sm:max-w-2xl md:max-w-7xl" />
                  </div>
                </div>
              </div>
            </div>
            <div className={`col-span-1 xl:col-span-6 relative z-0 overflow-visible order-1 xl:order-2 ${!isLowPerformanceMode ? '-mt-56 sm:-mt-64 md:-mt-80 lg:-mt-10 xl:-mt-0' : 'hidden'}`}>
              {/* TOMBOL REQUEST GYRO (HANYA MUNCUL DI iOS 13+) */}
              {showGyroPermission && !isLowPerformanceMode && (
                <button
                  onClick={requestGyro}
                  className="absolute z-30 bottom-10 right-4 sm:right-10 flex items-center gap-2 bg-[#111111]/60 hover:bg-[#111111]/80 backdrop-blur-md border border-white/20 text-white/80 px-3 py-2 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                  aria-label="Enable 3D Interaction"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-currentColor stroke-[1.5] stroke-linecap-round stroke-linejoin-round" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                  <span className="text-xs font-medium">Enable 3D</span>
                </button>
              )}

              {/* Setting untuk Ukuran Lanyard */}
              <div className="relative w-[280%] -ml-[90%] sm:w-[300%] sm:-ml-[100%] md:w-[350%] md:-ml-[125%] lg:w-[350%] lg:-ml-[125%] xl:w-[400%] xl:-ml-[130%] 2xl:w-[450%] 2xl:-ml-[150%] flex items-center justify-center">

                {/* GRAVITASI LANYARD SUDAH DINAMIS */}
                {!isLowPerformanceMode && (
                  <Lanyard position={[0, 0, 15]} gravity={gyroGravity} lanyardOffsetY={lanyardOffsetY} />
                )}

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. SECTION EXPERIENCES */}
      <section id="experiences" className="w-full mt-10 scroll-mt-28">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">Experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiencesData.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => openProjectModal(project)}
                className="group relative text-left rounded-3xl border border-white/15 bg-[#111111] p-3 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/70 hover:shadow-[0_20px_60px_rgba(255,255,255,0.15)]"
              >
                <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ boxShadow: '0 0 80px rgba(255,255,255,0.18)' }} />
                <div className="relative overflow-hidden rounded-2xl">
                  <img src={project.heroImage} alt={project.title} className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="px-2 pt-4 pb-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-xs uppercase tracking-widest text-white/60">{project.cardTag}</p>
                    <p className="text-xs sm:text-xs uppercase tracking-wide text-white/60">{project.year}</p>
                  </div>
                  <h3 className="mt-1 text-lg sm:text-xl md:text-xl lg:text-xl font-semibold text-white truncate">{project.title}</h3>
                  <p className="mt-2 text-xs text-white/60 truncate">{project.shortDesc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. SECTION PROJECTS */}
      <section id="projects" className="w-full mt-20 scroll-mt-28">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => openProjectModal(project)}
                className="group relative text-left rounded-3xl border border-white/15 bg-[#111111] p-3 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/70 hover:shadow-[0_20px_60px_rgba(255,255,255,0.15)]"
              >
                <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ boxShadow: '0 0 80px rgba(255,255,255,0.18)' }} />
                <div className="relative overflow-hidden rounded-2xl">
                  <img src={project.heroImage} alt={project.title} className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="px-2 pt-4 pb-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-xs uppercase tracking-wide text-white/60">{project.cardTag}</p>
                    <p className="text-xs sm:text-xs uppercase tracking-wide text-white/60">{project.year}</p>
                  </div>
                  <h3 className="mt-1 text-lg sm:text-xl md:text-xl lg:text-xl font-semibold text-white truncate">{project.title}</h3>
                  <p className="mt-2 text-xs text-white/60 truncate">{project.shortDesc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SECTION RESEARCH */}
      <section id="research" className="w-full mt-20 scroll-mt-28">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">Research</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {researchData.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => openProjectModal(project)}
                className="group relative text-left rounded-3xl border border-white/15 bg-[#111111] p-3 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/70 hover:shadow-[0_20px_60px_rgba(255,255,255,0.15)]"
              >
                <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ boxShadow: '0 0 80px rgba(255,255,255,0.18)' }} />
                <div className="relative overflow-hidden rounded-2xl">
                  <img src={project.heroImage} alt={project.title} className="h-0 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="px-2 pt-1 pb-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-xs uppercase tracking-wide text-white/60">{project.cardTag}</p>
                    <p className="text-xs sm:text-xs uppercase tracking-wide text-white/60">{project.year}</p>
                  </div>
                  <h3 className="mt-1 text-m sm:text-l font-semibold text-white truncate">{project.title}</h3>
                  <p className="mt-1 text-xs sm:text-xs text-white/60 truncate">{project.shortDesc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECTION ORGANIZATIONS */}
      <section id="organizations" className="w-full mt-20 scroll-mt-28">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">Organizations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizationsData.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => openProjectModal(project)}
                className="group relative text-left rounded-3xl border border-white/15 bg-[#111111] p-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/70 hover:shadow-[0_20px_60px_rgba(255,255,255,0.15)] flex items-center gap-4"
              >
                <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ boxShadow: '0 0 80px rgba(255,255,255,0.18)' }} />

                {/* SMALL LOGO */}
                {project.logo && (
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12">
                    <img src={project.logo} alt={project.title} className="max-w-full max-h-full object-contain" />
                  </div>
                )}

                {/* TEXT CONTENT */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-xs uppercase tracking-wide text-white/60 truncate mr-2">{project.cardTag}</p>
                    <p className="text-xs sm:text-xs uppercase tracking-wide text-white/60 flex-shrink-0">{project.year}</p>
                  </div>
                  <h3 className="mt-1 text-base sm:text-lg font-semibold text-white truncate">{project.title}</h3>
                  <p className="mt-1 text-xs text-white/60 truncate">{project.shortDesc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SECTION ACHIEVEMENTS */}
      <section id="achievements" className="w-full mt-20 scroll-mt-28">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">Achievements</h2>
          <div className="py-2 overflow-visible">
            <LogoLoop
              logos={techLogos}
              speed={60}
              direction="left"
              gap={12}
              pauseOnHover
              enableDrag
              fadeOut
              fadeOutColor="#101010"
              ariaLabel="Achievements"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contacts" className="w-full mt-28 mb-20 border-t border-white/10 pt-10 flex flex-col items-center justify-center gap-6 scroll-mt-28">
        <div className="flex items-center justify-center gap-6">
          <a
            href="mailto:maulanarajisf@gmail.com"
            target="_blank"
            rel="noreferrer"
            className="transition-opacity hover:opacity-80"
            aria-label="Email"
          >
            <img
              src="https://img.icons8.com/?size=100&id=12623&format=png&color=888888"
              alt="Email Logo"
              className="h-7 w-7"
            />
          </a>
          <a
            href="https://github.com/ajimolana"
            target="_blank"
            rel="noreferrer"
            className="transition-opacity hover:opacity-80"
            aria-label="GitHub"
          >
            <img
              src="https://img.icons8.com/?size=100&id=12599&format=png&color=888888"
              alt="GitHub Logo"
              className="h-7 w-7"
            />
          </a>
          <a
            href="https://linkedin.com/in/maulanaraji/"
            target="_blank"
            rel="noreferrer"
            className="transition-opacity hover:opacity-80"
            aria-label="LinkedIn"
          >
            <img
              src="https://img.icons8.com/?size=100&id=8808&format=png&color=888888"
              alt="LinkedIn Logo"
              className="h-7 w-7"
            />
          </a>
          <a
            href="https://instagram.com/ajimolana/"
            target="_blank"
            rel="noreferrer"
            className="transition-opacity hover:opacity-80"
            aria-label="Instagram"
          >
            <img
              src="https://img.icons8.com/?size=100&id=32309&format=png&color=888888"
              alt="Instagram Logo"
              className="h-7 w-7"
            />
          </a>
        </div>
        <p className="text-sm text-[#dfdfdf] text-center px-4">
          Copyright &copy; 2026 Maulana Raji Shofil Fuadi. All rights reserved.
        </p>
      </footer>

      {/* GLOBAL PROJECT MODAL (Fixed Header + Scrollable Content) */}
      {activeProject && (
        <div
          className="fixed inset-0 z-40 bg-black/70 px-4 py-6 flex items-center justify-center backdrop-blur-sm"
          onClick={closeProjectModal}
        >
          <div
            className="relative w-full max-w-3xl rounded-3xl border border-white/20 bg-[#111111] text-white shadow-2xl flex flex-col max-h-[75vh] sm:max-h-[85vh] overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex-none flex items-center justify-between bg-[#111111] px-5 py-4 sm:px-6 sm:py-5 border-b border-white/10 z-10">
              <div className="flex items-center gap-3">
                {activeProject.logo && (
                  <img src={activeProject.logo} alt={activeProject.title} className="w-8 h-8 object-contain flex-shrink-0" />
                )}
                <h3 className="text-sm md:text-base font-semibold pr-4">{activeProject.title}</h3>
              </div>
              <button
                type="button"
                className="flex-shrink-0 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/80 transition hover:border-white/60 hover:text-white"
                onClick={closeProjectModal}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12" /><path d="M18 6l-12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6 sm:py-6 space-y-6">
              {(activeProject.period || (activeProject.roleLabel && activeProject.role)) && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {activeProject.period && (
                    <div>
                      <p className="text-sm text-white/60">Period</p>
                      <p className="text-base text-white">{activeProject.period}</p>
                    </div>
                  )}
                  {activeProject.roleLabel && activeProject.role && (
                    <div>
                      <p className="text-sm text-white/60">{activeProject.roleLabel}</p>
                      <p className="text-base text-white">{activeProject.role}</p>
                    </div>
                  )}
                </div>
              )}

              {renderDetails(activeProject.details)}

              {galleryItems(activeProject.gallery).length > 0 && (
                <div>
                  <p className="text-sm text-white/60">Documentation</p>
                  <div
                    ref={docsScrollRef}
                    className="mt-3 flex overflow-x-auto gap-3 pb-4 no-scrollbar"
                  >
                    {galleryItems(activeProject.gallery).map((item, idx: number) => (
                      <div key={item.src + idx} className="flex-none">
                        <img
                          src={item.src}
                          alt={`Documentation ${idx + 1}`}
                          className="h-40 w-64 rounded-2xl object-cover cursor-pointer hover:opacity-70 transition-opacity"
                          onClick={() =>
                            openLightbox(
                              galleryItems(activeProject.gallery).map((img) => img.src),
                              galleryItems(activeProject.gallery).map((img) => img.caption ?? ""),
                              idx
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray(activeProject.links) && activeProject.links.length > 0 && (
                <div>
                  <p className="mb-2 text-sm text-white/60">Link</p>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.links.map((item: { label: string; href: string }, index: number) => (
                      <Link
                        key={`${item.href}-${index}`}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm text-white transition hover:border-white hover:bg-white hover:text-black"
                      >
                        {item.label}
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {!activeProject.links && activeProject.link && (
                <div>
                  <p className="mb-2 text-sm text-white/60">Link</p>
                  <Link
                    href={activeProject.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm text-white transition hover:border-white hover:bg-white hover:text-black"
                  >
                    {activeProject.ctaLabel ?? "Open Project"}
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX UNTUK PREVIEW GAMBAR */}
      {lightbox.isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white p-2"
            onClick={closeLightbox}
          >
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12" /><path d="M18 6l-12 12" /></svg>
          </button>

          <div className="relative w-full max-w-5xl max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <div className="flex w-full flex-col items-center">
              <img
                src={lightbox.images[lightbox.index]}
                alt="Preview"
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              {lightbox.captions[lightbox.index] && (
                <p className="mt-4 text-sm text-white/70">
                  {lightbox.captions[lightbox.index]}
                </p>
              )}
            </div>
            {lightbox.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-0 sm:-left-12 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white bg-black/40 hover:bg-black/80 rounded-r-lg sm:rounded-full transition"
                >
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-0 sm:-right-12 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white bg-black/40 hover:bg-black/80 rounded-l-lg sm:rounded-full transition"
                >
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}


    </div>
  );
}