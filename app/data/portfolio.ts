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
  image?: string;
  href?: string;
};

export const experiencesData: Project[] = [
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
        label: "Description",
        value: "A statistical model for predicting FIFA World Cup 2026 match outcomes, group standings, and tournament winner probabilities. The project utilizes an ensemble of Dixon-Coles Maximum Likelihood Estimation, Poisson Generalized Linear Models, and an Elo rating system. It features a Node.js production pipeline for mathematical modeling, Python Jupyter Notebooks for methodology documentation, and a Next.js frontend for data visualization."
      },
      {
        label: "Task",
        value: [
          "Engineered a statistical ensemble model using Dixon-Coles Maximum Likelihood Estimation and Poisson GLMs to predict international football match outcomes.",
          "Designed an Elo rating system and executed a Monte Carlo simulation (50,000 iterations) to accurately forecast tournament winner probabilities and group standings.",
          "Built a production pipeline to fit mathematical models and process historical data across 900+ matches",
        ],
        list: true
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
    // link: "https://foodsecurityforecasting.streamlit.app/"
  },
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
    heroImage: "/assets/projects/intelligentcoffeeshop/login page.png",
    gallery: [
      ["/assets/projects/intelligentcoffeeshop/login page.png", "Login Page"],
      ["/assets/projects/intelligentcoffeeshop/dashboard page.png", "Dashboard Page"],
      ["/assets/projects/intelligentcoffeeshop/inventory page.png", "Inventory Page"],
      ["/assets/projects/intelligentcoffeeshop/reports page.png", "Reports Page"],
      ["/assets/projects/intelligentcoffeeshop/backend.png", "Backend"],
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
        label: "Problem",
        value: "Local governments in the Sulampua region needed a reliable method to predict food security statuses to formulate effective agricultural and economic policies."
      },
      {
        label: "My Role",
        value: "Machine Learning Modeler & Data Analyst"
      },
      {
        label: "Method",
        value: "Developed predictive models using Python, utilizing variables from the National Food Agency's Atlas across 127 data points. Deployed the interactive dashboard via Streamlit."
      },
      {
        label: "Result",
        value: "Achieved an R² score of 0.801 and RMSE of 0.887, enabling policymakers to simulate and visualize food security risks dynamically."
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
        value: "Calculating pension fund premium costs is mathematically complex and often opaque for participants. There was a need for an accessible tool to simulate different scenarios."
      },
      {
        label: "My Role",
        value: "Actuarial Developer"
      },
      {
        label: "Method",
        value: "Translated complex actuarial formulas (Entry Age Normal, Attained Age Normal, Projected Unit Credit) into Python algorithms and built a user-friendly interface with Streamlit."
      },
      {
        label: "Result",
        value: "Delivered a transparent and interactive simulator that allows users to instantly calculate and visualize their required premiums based on adjustable life parameters."
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
    title: "Cultivated Highland Agriculture",
    shortDesc: "Best time for plant and crop forecaster.",
    period: "Jan 2024 - Apr 2024",
    roleLabel: "Tools",
    role: "Google Colab, Looker Studio",
    details: [
      {
        label: "Problem",
        value: "Highland farmers struggle with unpredictable environmental changes, making it difficult to determine the optimal planting periods for various crops."
      },
      {
        label: "My Role",
        value: "Data Engineer & Modeler"
      },
      {
        label: "Method",
        value: "Managed data pipelines and performed hyperparameter tuning in Google Colab to optimize forecasting models. Visualized the predictions using Looker Studio."
      },
      {
        label: "Result",
        value: "Created an AI-based agriculture dashboard that provides actionable planting recommendations, identifying new business opportunities for highland agriculture."
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
    period: "Oct 2024",
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

