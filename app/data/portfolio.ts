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
    heroImage: "/assets/projects/intelligentcoffeeshop/frontend.jpeg",
    gallery: [
      "/assets/projects/intelligentcoffeeshop/frontend.jpeg",
      "/assets/projects/intelligentcoffeeshop/backend.png",
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
