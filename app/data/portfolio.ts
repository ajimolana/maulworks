export type DetailItem = {
  label: string;
  value?: string | string[];
  list?: boolean;
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type GalleryItem = string | [string, string];

export type Project = {
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

export type AchievementItem = {
  title: string;
  competitionType: string;
  organizer: string;
  date: string;
  /** ID matching a project in researchData, projectsData, experiencesData, or organizationsData */
  linkedProjectId?: string;
};

export const experiencesData: Project[] = [
  {
    id: "internask",
    cardTag: "Internship",
    year: "2026",
    title: "Asuransi Kredit Indonesia",
    shortDesc: "Reinsurance Data Analyst",
    period: "10 Aug 2026 - Ongoing",
    roleLabel: "Job Type",
    role: "Internship",
    details: [
      {
        label: "Position",
        value: "Reinsurance Data Analyst"
      },
      {
        label: "Task",
        value: [
          "Assigned to the Reinsurance Department within the Underwriting & Reinsurance Division."
        ],
        list: true
      }
    ],
    heroImage: "/assets/experience/internask/Profile.jpeg",
    gallery: [
      ["/assets/experience/internask/Profile.jpeg", "Profile"]
    ],
    logo: "/assets/experience/internask/Logo Askrindo.png",
    link: null
  },
  {
    id: "internbi",
    cardTag: "Internship",
    year: "2025",
    title: "Bank Indonesia South Sulawesi",
    shortDesc: "Economic & Finance Data Analyst",
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

export const projectsData: Project[] = [
  {
    id: "behindworldcup",
    cardTag: "Python, NextJS",
    year: "2026",
    title: "Data Science for World Cup 2026",
    shortDesc: "Look into World Cup through Data Science lens",
    period: "June 2026",
    roleLabel: "Tools",
    role: "Python, NextJS",
    details: [
      {
        label: "Problem",
        value: "Football predictions often rest on pundits' opinions rather than rigorous statistics. Coming from actuarial risk modelling, I built a platform that lets everyday fans explore World Cup 2026 projections through a data scientist's lens."
      },
      {
        label: "Role",
        value: "Data Scientist · Solo project"
      },
      {
        label: "Method",
        value: [
          "Built a statistical pipeline over 900+ historical international matches.",
          "Combined Dixon-Coles MLE, a Poisson GLM, and an EWMA form tracker into one ensemble. A Dixon-Coles dependence parameter, fitted with Newton-Raphson, fixes standard Poisson's blind spot for low-scoring draws.",
          "Simulated the whole tournament 50,000 times with Monte Carlo and dynamic Elo ratings.",
          "Built a Next.js web app to visualize probability matrices and the tournament bracket."
        ],
        list: true
      },
      {
        label: "Result",
        value: "Correctly predicted Spain as the 2026 champion (21.5% title odds) and Argentina as the other grand finalist."
      }
    ],
    heroImage: "/assets/projects/behindworldcup/Main Dashboard.png",
    gallery: [
      ["/assets/projects/behindworldcup/Main Dashboard.png", "Main Dashboard"],
      ["/assets/projects/behindworldcup/Landing Page.png", "Landing Page"],
      ["/assets/projects/behindworldcup/Methodology.png", "Methodology"],
      ["/assets/projects/behindworldcup/Insights Page.png", "Insights Page"],
      ["/assets/projects/behindworldcup/Detailed Team Breakdown.png", "Detailed Team Breakdown"],
    ],
  },
  {
    id: "intelligentcoffeeshop",
    cardTag: "NextJS, n8n",
    year: "2026",
    title: "Intelligent Coffee Shop Automation",
    shortDesc: "AI Generated Insights for Coffee Shop Businesses",
    period: "May 2026",
    roleLabel: "Tools",
    role: "NextJS, n8n",
    details: [
      {
        label: "Problem",
        value: "Prices kept rising at my favourite local coffee shops, and Makassar has more coffee shops than any other city in Indonesia. TettaPOS (‘Tetta’ means father in Makassarese) aims to be a trusted guide that helps owners watch operations and make smarter decisions."
      },
      {
        label: "Role",
        value: "AI Engineer · Duo project"
      },
      {
        label: "Method",
        value: [
          "Built an AI Agent that works like an automated data analyst, writing periodic reports for the owner.",
          "Tested a backend locally that sends scheduled daily analytics messages straight to the owner.",
          "Integrated smart stock: ingredients are deducted on every sale, remaining menu stock is shown, and low inventory triggers early warnings.",
          "Added cashier upselling from a taste-profile algorithm on sales history, plus auto-COGS from detailed recipes."
        ],
        list: true
      },
      {
        label: "Result",
        value: "Hosting the live backend was too costly, so we shipped a fully interactive front-end prototype that demonstrates the whole system, from the cashier screen to daily reports."
      }
    ],
    heroImage: "/assets/projects/intelligentcoffeeshop/login page.png",
    gallery: [
      ["/assets/projects/intelligentcoffeeshop/login page.png", "Login Page"],
      ["/assets/projects/intelligentcoffeeshop/dashboard page.png", "Dashboard Page"],
      ["/assets/projects/intelligentcoffeeshop/inventory page.png", "Inventory Page"],
      ["/assets/projects/intelligentcoffeeshop/reports page.png", "Reports Page"],
      ["/assets/projects/intelligentcoffeeshop/backend.png", "Backend"],
    ],
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
        label: "Problem",
        value: "Sulampua (Sulawesi, Maluku, and Papua) faces complex food security challenges: uneven logistics, high poverty, and severe stunting. Government responses are often reactive, so our team built an early warning system that maps regional risk before a crisis spreads."
      },
      {
        label: "Role",
        value: "Developer & Machine Learning Engineer · Team of three"
      },
      {
        label: "Method",
        value: [
          "Processed 2018–2024 data from the National Food Agency (Bapanas) for 127 regencies and cities across 9 provinces.",
          "Trained a Random Forest model with time series cross-validation, keeping predictions stable over time and avoiding overfitting on highly correlated socio-economic variables.",
          "Built simulations of four fiscal policy scenarios and 2025 vulnerability projections, with real-time risk tiering into 6 priority classes."
        ],
        list: true
      },
      {
        label: "Result",
        value: "R² of 0.801 and RMSE of 0.887. Feature importance showed poverty (35.4%) and clean water access (21.5%) as the main drivers of food vulnerability."
      }
    ],
    heroImage: "/assets/projects/foodsecurity/foodsecurity1.png",
    gallery: [
      "/assets/projects/foodsecurity/foodsecurity1.png",
      "/assets/projects/foodsecurity/foodsecurity2.png",
      "/assets/projects/foodsecurity/foodsecurity3.png"
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
        label: "Problem",
        value: "Indonesia's pension fund sector has very low literacy (27.79%) and inclusion (5.37%), according to SNLKI 2025. As my final year project, I turned complex actuarial calculations into a visual workflow so anyone can compare pension funding methods."
      },
      {
        label: "Role",
        value: "Data Scientist · Solo final year project"
      },
      {
        label: "Method",
        value: [
          "Translated advanced actuarial formulas into Python: Entry Age Normal, Attained Age Normal, and Projected Unit Credit.",
          "Built on the official Indonesian Mortality Table (TMI IV / TMI 2023).",
          "Used Python's decimal library to remove floating-point rounding errors, and caching to keep large commutation tables fast.",
          "Built a Streamlit interface where users enter participant parameters and see premiums and actuarial liabilities in real time."
        ],
        list: true
      },
      {
        label: "Result",
        value: "A live calculator that compares normal cost and actuarial liability across all three methods side by side, with the commutation formulas (Dx, Nx, Cx, Mx, Rx) laid out for learning."
      }
    ],
    heroImage: "/assets/projects/pensionfund/pensionfund1.png",
    gallery: [
      "/assets/projects/pensionfund/pensionfund1.png",
      "/assets/projects/pensionfund/pensionfund2.png",
      "/assets/projects/pensionfund/pensionfund3.png"
    ],
    link: "https://danapensiun.streamlit.app/"
  },
  {
    id: "cultivatedhighland",
    cardTag: "Colab, Looker",
    year: "2024",
    title: "Smart Highland Agriculture",
    shortDesc: "Forecasts the best planting times for crops.",
    period: "Apr 2024 - Jun 2024",
    roleLabel: "Tools",
    role: "Google Colab, Looker Studio",
    details: [
      {
        label: "Problem",
        value: "Climate change brings extreme weather that raises crop failure risk in highland farming. For our Startup Campus Data Science & AI Bootcamp capstone, we set out to give farmers predictive weather insights and concrete planting advice instead of raw weather data."
      },
      {
        label: "Role",
        value: "Data Scientist · Team of six"
      },
      {
        label: "Method",
        value: [
          "Cleaned raw climatology data into daily aggregates and handled outliers with the IQR method.",
          "Forecast weather with Facebook Prophet, compared against other regression models on MAE.",
          "Used correlations between climate parameters to build pest warning rules and crop recommendations.",
          "Kept the stable baseline configuration after over-tuning dropped validation accuracy from 99% to 98%."
        ],
        list: true
      },
      {
        label: "Result",
        value: "A Looker Studio dashboard with pesticide spraying schedules, planting and harvest season forecasts, and crop recommendations, plus a pitch deck turning the model into subscription and consulting plans."
      }
    ],
    heroImage: "/assets/projects/cultivatedhighland/cultivatedhighland1.png",
    gallery: [
      "/assets/projects/cultivatedhighland/cultivatedhighland1.png"
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

export const researchData: Project[] = [
  {
    id: "smartcelldrybox",
    cardTag: "Scientific Paper Competition",
    year: "2022",
    title: "Smart Cell Dry Box: Practical Seaweed Processing",
    shortDesc: "Winning Paper at Milky Way Scientific Paper Competition",
    period: "Aug 2022 - Oct 2022",
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
        value: "Seaweed farmers in Laikang Village faced significant challenges with post-harvest processing, often resulting in degraded quality due to unpredictable weather and inefficient drying methods."
      },
      {
        label: "Mechanism & Impact",
        value: "We designed the 'Smart Cell Dry Box'—an innovative, practical drying solution that accelerates the drying process while preserving the quality of the seaweed. This practical tool helps farmers stabilize their income by ensuring a consistent, high-quality yield regardless of weather conditions."
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
        value: "A policy formulation paper based on the SIPEKAN machine learning model, aiming to provide a data-driven approach to regional food security."
      },
      {
        label: "Abstract / Key Findings",
        value: "This research details the methodology behind the SIPEKAN dashboard (see Projects). By utilizing 5 key variables from the Food Security Atlas across 127 points, we proved that predictive modeling can significantly enhance the precision of government intervention policies in the Sulampua region."
      }
    ],
    heroImage: "",
    gallery: [],
    link: null
  },
  {
    id: "ecobluevillage",
    cardTag: "Scientific Paper Competition",
    year: "2024",
    title: "Eco Blue Village: Seaweed Biofuel Innovation",
    shortDesc: "Submission for Aksinomi Sulampua",
    period: "September 2024",
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
        value: "A proposal to empower the rural economy in Takalar through the innovative conversion of seaweed into biofuel, managed by local Village-Owned Enterprises (BUMDes)."
      },
      {
        label: "Concept & Impact",
        value: "The 'Eco Blue Village' concept outlines a scalable biofuel extraction process from abundant local seaweed. By integrating this innovation into the BUMDes framework, the project projects a circular economy model that provides a new renewable energy source while simultaneously boosting local income."
      }
    ],
    heroImage: "",
    gallery: [],
    link: ""
  },
];

export const organizationsData: Project[] = [
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
      },
      {
        label: "Reflection",
        value: "Leading this organization taught me that true leadership is about aligning individual motivations toward a collective goal. Winning the national championship wasn't just about athletic skill—it was the result of building a culture of trust, discipline, and shared vision over an entire year."
      }
    ],
    heroImage: "",
    logo: "/assets/organizations/softball/Logo UKM Softball Unhas.png",
    gallery: [
      ["/assets/organizations/softball/Certificate of Appreciation.jpg", "Certificate of Appreciation"],
      ["/assets/organizations/softball/Champion Team.JPG", "Champion Team"],
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
          "Initiated 'Bakat: Bantuan Akademik', a peer-tutoring program to help students maintain good academic standing and graduate on time.",
          "Organized the 'National Math Event', a large-scale academic competition.",
          "Created 'HimatikaTalks', a new seminar program inviting proven alumni to share real-world insights on scholarships and career realities."
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

export const achievements: AchievementItem[] = [
  {
    title: "Top 10 Paper",
    competitionType: "Paper",
    organizer: "Aksinomi Sulampua, BI Sulsel",
    date: "Oct 2025",
    linkedProjectId: "sipekan",
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
    organizer: "Faculty of Math & Science, Unhas",
    date: "Aug 2024",
  },
  {
    title: "Outstanding Student",
    competitionType: "Recognition",
    organizer: "Math Department, Unhas",
    date: "Aug 2024",
  },
  {
    title: "1st Place Softball Men's",
    competitionType: "Sports",
    organizer: "Airlangga National Championship, Unair",
    date: "Jul 2024",
    linkedProjectId: "org-softball",
  },
  {
    title: "4th Runner-Up Infographic",
    competitionType: "Creative",
    organizer: "Celebes Plano Fest, UINAM",
    date: "Nov 2023",
  },
  {
    title: "Outstanding Student",
    competitionType: "Recognition",
    organizer: "Math Department, Unhas",
    date: "Aug 2023",
  },
  {
    title: "2nd Place Softball Men's",
    competitionType: "Sports",
    organizer: "UGM Cup, UGM",
    date: "Jun 2023",
  },
  {
    title: "2nd Place Videography",
    competitionType: "Creative",
    organizer: "National Environmental Expo, Unhas",
    date: "Jun 2023",
  },
  {
    title: "1st Place Paper",
    competitionType: "Paper",
    organizer: "Milky Way Scientific Paper Competition, UNEJ",
    date: "Dec 2022",
    linkedProjectId: "smartcelldrybox",
  },
];

export const aboutModalData: Record<string, Project> = {
  education: {
    id: "about-education",
    cardTag: "Education",
    year: "2021-2026",
    title: "Hasanuddin University",
    shortDesc: "Bachelor of Actuarial Science",
    period: "Aug 2021 - Feb 2026",
    roleLabel: "GPA",
    role: "3.51/4.00",
    details: [
      { label: "Degree", value: "Bachelor of Actuarial Science" },
      { label: "Domain Knowledge", value: "Insurance, Investment, Supply Chain, Sharia Economic, Risk Management" }
    ],
    gallery: []
  },
  schol_prestasi: {
    id: "schol-prestasi",
    cardTag: "Scholarship",
    year: "2022",
    title: "BSI Scholarship Prestasi",
    shortDesc: "Bank Syariah Indonesia",
    period: "2022",
    roleLabel: "Issuer",
    role: "Bank Syariah Indonesia",
    details: [
      { label: "Awarded", value: "2022" },
      { label: "Description", value: "Awarded for outstanding academic achievements." }
    ],
    gallery: []
  },
  schol_talenta: {
    id: "schol-talenta",
    cardTag: "Scholarship",
    year: "2024",
    title: "BSI Scholarship Talenta",
    shortDesc: "Bank Syariah Indonesia",
    period: "2024",
    roleLabel: "Issuer",
    role: "Bank Syariah Indonesia",
    details: [
      { label: "Awarded", value: "2024" },
      { label: "Description", value: "Awarded for exceptional talent and leadership skills." }
    ],
    gallery: []
  },
  cert_data_analyst: {
    id: "cert-data-analyst",
    cardTag: "Certification",
    year: "2024",
    title: "Data Analyst",
    shortDesc: "National Professional Certification Agency",
    period: "Oct 2025",
    roleLabel: "Issuer",
    role: "BNSP",
    details: [
      { label: "Certification", value: "Data Analyst" },
      { label: "Issuer", value: "BNSP (National Professional Certification Agency)" },
      { label: "Date", value: "October 2024" }
    ],
    gallery: []
  },
  cert_data_science: {
    id: "cert-data-science",
    cardTag: "Certification",
    year: "2024",
    title: "Data Science & AI",
    shortDesc: "Startup Campus Bootcamp",
    period: "Feb 2024 - Jun 2024",
    roleLabel: "Issuer",
    role: "Startup Campus",
    details: [
      { label: "Program", value: "Data Science Bootcamp" },
      { label: "Skills Gained", value: "Python, Scikit-learn, Machine Learning, Looker Studio" },
      { label: "Duration", value: "Feb 2024 - Jun 2024" }
    ],
    gallery: []
  }
};

export const techStack: { group: string; items: string[] }[] = [
  { group: "Data & Analysis", items: ["Python", "SQL", "R", "Excel", "Google Sheets"] },
  { group: "BI & Dashboard", items: ["Power BI", "Tableau", "Looker Studio"] },
  { group: "Automation", items: ["n8n"] },
];

export const scholarships: { name: string; year: string; desc: string; modalKey: string }[] = [
  { name: "BSI Scholarship Prestasi", year: "2022", desc: "Bank Syariah Indonesia", modalKey: "schol_prestasi" },
  { name: "BSI Scholarship Talenta", year: "2024", desc: "Bank Syariah Indonesia", modalKey: "schol_talenta" },
];
