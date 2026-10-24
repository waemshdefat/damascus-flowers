import type {
  DeliveryZoneConfig,
  PaymentMethodConfig,
  ProductImage,
} from "./schema";

export interface SeedCategory {
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  heroImage: string;
  sortOrder: number;
}

export interface SeedProduct {
  slug: string;
  legacySlugs: string[];
  nameAr: string;
  subtitleAr: string;
  descriptionAr: string;
  careTipsAr: string;
  priceJod: string;
  compareAtPriceJod?: string | null;
  badgeTextAr?: string;
  isAddon?: boolean;
  priceOnRequest: boolean;
  categorySlug: string;
  secondaryCategories: string[];
  images: ProductImage[];
  stockQuantity: number | null;
  inStock: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

export const INITIAL_CATEGORIES: SeedCategory[] = [
  {
    slug: "flower-bouquets",
    nameAr: "باقات الورد",
    nameEn: "Flower Bouquets",
    descriptionAr:
      "باقات ورد طبيعي منسّقة يدويًا بتوقيع أزهار دمشق، تجمع بين الجوري الفاخر والبيبي روز والتغليف الورقي الأنيق.",
    heroImage: "/images/products/baqat-lamsat-dimashq-1.jpg",
    sortOrder: 1,
  },
  {
    slug: "flower-boxes",
    nameAr: "بوكسات الورد والهدايا",
    nameEn: "Flower & Gift Boxes",
    descriptionAr:
      "صناديق وبوكسات زهور فاخرة بتفاصيل متقنة وشريط Damascus Flowers المطبوع، مصمّمة لتكون هدية تبقى في الذاكرة.",
    heroImage: "/images/products/box-lamsat-alhayat-1.jpg",
    sortOrder: 2,
  },
  {
    slug: "occasion-gifts",
    nameAr: "هدايا المناسبات",
    nameEn: "Occasion Gifts",
    descriptionAr:
      "تنسيقات مخصّصة لأجمل اللحظات والمناسبات السعيدة، من التهنئة بالسلامة والمواليد إلى الذكرى السنوية والمفاجآت الراقية.",
    heroImage: "/images/products/box-alhamdulillah-ala-alsalama-1.jpg",
    sortOrder: 3,
  },
  {
    slug: "teddy-bears-gifts",
    nameAr: "الدببة والهدايا الإضافية",
    nameEn: "Teddy Bears & Add-on Gifts",
    descriptionAr:
      "دببة مخملية ناعمة وإضافات رقيقة تُرفق مع باقات وبوكسات الورد لإضفاء لمسة دافئة ومميزة على هديتك.",
    heroImage: "/images/products/teddy-bears-gifts-1.jpg",
    sortOrder: 4,
  },
];

const DEFAULT_CARE_TIPS =
  "يُفضّل وضع الزهور في مكان معتدل البرودة بعيدًا عن أشعة الشمس المباشرة وتيارات الهواء، مع تجديد الماء وقص أطراف السيقان بزاوية مائلة كل يومين للحفاظ على نضارتها أطول فترة ممكنة.";

// Exact 10 products & JOD prices requested for the store + authentic Damascus Flowers Teddy Bears
export const INITIAL_PRODUCTS: SeedProduct[] = [
  {
    slug: "box-lamsat-alhayat",
    legacySlugs: ["بوكس-لمسة-الحياة"],
    nameAr: "بوكس لمسة الحياة",
    subtitleAr: "تنسيق فاخر من الجوري الأبيض والبيبي روز الوردي والعنابي في بوكس أزهار دمشق",
    descriptionAr:
      "بوكس فاخر بتوقيع أزهار دمشق يجمع تناغمًا راقيًا بين الجوري الأبيض النقي والبيبي روز بدرجات الوردي الهادئ والعنابي الدافئ مع لمسات الخضرة الطبيعية وشريط Damascus Flowers الأنيق.",
    careTipsAr:
      "يحتوي البوكس على إسفنج زهري مبلّل بالماء المغذي؛ يُنصح بإضافة القليل من الماء البارد برفق بين السيقان يوميًا وإبعاده عن مصادر الحرارة.",
    priceJod: "48.00",
    priceOnRequest: false,
    categorySlug: "flower-boxes",
    secondaryCategories: ["occasion-gifts"],
    images: [
      {
        url: "/images/products/box-lamsat-alhayat-1.jpg",
        alt: "بوكس لمسة الحياة من أزهار دمشق — تنسيق ورد طبيعي فاخر في الأردن",
      },
    ],
    stockQuantity: 15,
    inStock: true,
    isFeatured: true,
    sortOrder: 1,
  },
  {
    slug: "baqat-baby-rose-wardi",
    legacySlugs: ["باقة-البيبي-روز-الوردي-1", "باقة-البيبي-روز-الوردي"],
    nameAr: "باقة البيبي روز الوردي",
    subtitleAr: "باقة ناعمة من زهور البيبي روز الوردي الطبيعي بتغليف راقٍ",
    descriptionAr:
      "باقة أنثوية رقيقة من أغصان البيبي روز الوردي المنتقاة بعناية، مغلّفة بورق فاخر يحمل شعار Damascus Flowers لتقديم هدية تعبّر عن الرقة والامتنان.",
    careTipsAr: DEFAULT_CARE_TIPS,
    priceJod: "35.00",
    priceOnRequest: false,
    categorySlug: "flower-bouquets",
    secondaryCategories: [],
    images: [
      {
        url: "/images/products/baqat-baby-rose-wardi-1.jpg",
        alt: "باقة البيبي روز الوردي من متجر أزهار دمشق",
      },
      {
        url: "/images/products/baqat-baby-rose-wardi-2.jpg",
        alt: "تفاصيل تغليف باقة البيبي روز الوردي — أزهار دمشق",
      },
    ],
    stockQuantity: 20,
    inStock: true,
    isFeatured: true,
    sortOrder: 2,
  },
  {
    slug: "baqat-jouri-ahmar-100-warda",
    legacySlugs: ["باقة-الجوري-الأحمر-العملاقة-100-وردة"],
    nameAr: "باقة الجوري الأحمر العملاقة، 100 وردة",
    subtitleAr: "مائة وردة جوري أحمر مخملي في تنسيق ملكي استثنائي للمناسبات الكبرى",
    descriptionAr:
      "باقة مهيبة مؤلفة من 100 وردة جوري أحمر طبيعي متفتّح بعناية، ملفوفة بطبقات فاخرة من الورق الكريمي المطبوع بهوية Damascus Flowers لإبهار من تحب في أهم المناسبات.",
    careTipsAr: DEFAULT_CARE_TIPS,
    priceJod: "110.00",
    priceOnRequest: false,
    categorySlug: "flower-bouquets",
    secondaryCategories: ["occasion-gifts"],
    images: [
      {
        url: "/images/products/baqat-jouri-ahmar-100-1.jpg",
        alt: "باقة الجوري الأحمر العملاقة 100 وردة من أزهار دمشق",
      },
      {
        url: "/images/products/baqat-jouri-ahmar-100-2.jpg",
        alt: "صورة جانبية لباقة الجوري الأحمر العملاقة 100 وردة — Damascus Flowers",
      },
    ],
    stockQuantity: 8,
    inStock: true,
    isFeatured: true,
    sortOrder: 3,
  },
  {
    slug: "baqat-aniqa-2",
    legacySlugs: ["باقة-أنيقة-2"],
    nameAr: "باقة أنيقة 2",
    subtitleAr: "تنسيق متوازن يجمع البساطة الراقية وتناغم الألوان الهادئة",
    descriptionAr:
      "باقة ورد طبيعي منسّقة بذوق كلاسيكي هادئ وتغليف أنيق يتناسب مع مختلف الزيارات والتهاني اليومية الراقية.",
    careTipsAr: DEFAULT_CARE_TIPS,
    priceJod: "28.00",
    priceOnRequest: false,
    categorySlug: "flower-bouquets",
    secondaryCategories: [],
    images: [
      {
        url: "/images/products/baqat-aniqa-2-1.jpg",
        alt: "باقة أنيقة 2 من متجر أزهار دمشق للزهور والهدايا",
      },
      {
        url: "/images/products/baqat-aniqa-2-2.jpg",
        alt: "تفاصيل تنسيق باقة أنيقة 2 — أزهار دمشق",
      },
    ],
    stockQuantity: 18,
    inStock: true,
    isFeatured: false,
    sortOrder: 4,
  },
  {
    slug: "box-mushakkal-aniq",
    legacySlugs: ["بوكس-مشكل-أنيق"],
    nameAr: "بوكس مشكل أنيق",
    subtitleAr: "تشكيلة غنية من أجود الزهور الموسمية والجوري في صندوق هدايا فاخر",
    descriptionAr:
      "بوكس زهور فاخر بتشكيلة متكاملة من الورود الطبيعية المتناسقة بعناية فائقة داخل صندوق أنيق يمنح حضورًا لافتًا في المناسبات والتهاني الرسمية والعائلية.",
    careTipsAr:
      "يُنصح بإبقاء الصندوق في غرفة معتدلة الحرارة وإضافة القليل من الماء البارد إلى الإسفنج الزهري كل يومين.",
    priceJod: "75.00",
    priceOnRequest: false,
    categorySlug: "flower-boxes",
    secondaryCategories: ["occasion-gifts"],
    images: [
      {
        url: "/images/products/box-mushakkal-aniq-1.jpg",
        alt: "بوكس مشكل أنيق من أزهار دمشق — بوكسات ورد وهدايا فاخرة",
      },
      {
        url: "/images/products/box-mushakkal-aniq-2.jpg",
        alt: "تفاصيل الزهور في بوكس مشكل أنيق — Damascus Flowers",
      },
    ],
    stockQuantity: 10,
    inStock: true,
    isFeatured: true,
    sortOrder: 5,
  },
  {
    slug: "baqat-alanaqa-albanafsajiya",
    legacySlugs: ["باقة-الأناقة-البنفسجية"],
    nameAr: "باقة الأناقة البنفسجية",
    subtitleAr: "تناغم ساحر بدرجات البنفسجي واللافندر مع تغليف عصري راقٍ",
    descriptionAr:
      "باقة مميزة لمحبي الدرجات البنفسجية الهادئة، منسّقة بعناية من زهور طبيعية منتقاة تمنح إحساسًا بالفخامة والتميّز.",
    careTipsAr: DEFAULT_CARE_TIPS,
    priceJod: "45.00",
    priceOnRequest: false,
    categorySlug: "flower-bouquets",
    secondaryCategories: ["occasion-gifts"],
    images: [
      {
        url: "/images/products/baqat-alanaqa-albanafsajiya-1.jpg",
        alt: "باقة الأناقة البنفسجية من أزهار دمشق",
      },
      {
        url: "/images/products/baqat-alanaqa-albanafsajiya-2.jpg",
        alt: "زاوية إضافية لباقة الأناقة البنفسجية — Damascus Flowers",
      },
    ],
    stockQuantity: 14,
    inStock: true,
    isFeatured: true,
    sortOrder: 6,
  },
  {
    slug: "baqat-alhub-alwardiya",
    legacySlugs: ["باقة-الحب-الوردية"],
    nameAr: "باقة الحب الوردية",
    subtitleAr: "لمسة وردية ناعمة تعبّر عن المحبة والتقدير بأسلوب أنيق",
    descriptionAr:
      "باقة لطيفة بدرجات الوردي الدافئ وتغليف متقن، مثالية للمفاجآت الرقيقة وإهداء من تحب في كل وقت.",
    careTipsAr: DEFAULT_CARE_TIPS,
    priceJod: "20.00",
    priceOnRequest: false,
    categorySlug: "flower-bouquets",
    secondaryCategories: ["occasion-gifts"],
    images: [
      {
        url: "/images/products/baqat-alhub-alwardiya-1.jpg",
        alt: "باقة الحب الوردية من أزهار دمشق",
      },
      {
        url: "/images/products/baqat-alhub-alwardiya-2.jpg",
        alt: "تفاصيل باقة الحب الوردية — Damascus Flowers",
      },
    ],
    stockQuantity: 25,
    inStock: true,
    isFeatured: false,
    sortOrder: 7,
  },
  {
    slug: "baqat-baby-rose-mushakkala",
    legacySlugs: ["باقة-بيبي-روز-مشكلة"],
    nameAr: "باقة بيبي روز مشكلة",
    subtitleAr: "مزيج مبهج من زهور البيبي روز متعددة الألوان بتغليف فاخر",
    descriptionAr:
      "تجمع هذه الباقة أجمل ألوان البيبي روز الطبيعي في تنسيق متناغم يفيض بهجة وحيوية مع لمسة أزهار دمشق الخاصة.",
    careTipsAr: DEFAULT_CARE_TIPS,
    priceJod: "28.00",
    priceOnRequest: false,
    categorySlug: "flower-bouquets",
    secondaryCategories: [],
    images: [
      {
        url: "/images/products/baqat-baby-rose-mushakkala-1.jpg",
        alt: "باقة بيبي روز مشكلة من أزهار دمشق",
      },
      {
        url: "/images/products/baqat-baby-rose-mushakkala-2.jpg",
        alt: "تفاصيل ألوان باقة بيبي روز مشكلة — Damascus Flowers",
      },
    ],
    stockQuantity: 20,
    inStock: true,
    isFeatured: false,
    sortOrder: 8,
  },
  {
    slug: "baqat-lamsat-dimashq",
    legacySlugs: ["باقة-لمسة-دمشق"],
    nameAr: "باقة لمسة دمشق",
    subtitleAr: "التنسيق المميز المستوحى من عراقة الذوق الدمشقي ورهافة الورد الطبيعي",
    descriptionAr:
      "باقة تحمل اسم الدار وهويتها، منسّقة بعناية من زهور طبيعية مختارة بتدرجات متناغمة وتغليف راقٍ يحمل ختم Damascus Flowers.",
    careTipsAr: DEFAULT_CARE_TIPS,
    priceJod: "35.00",
    priceOnRequest: false,
    categorySlug: "flower-bouquets",
    secondaryCategories: ["occasion-gifts"],
    images: [
      {
        url: "/images/products/baqat-lamsat-dimashq-1.jpg",
        alt: "باقة لمسة دمشق من متجر أزهار دمشق",
      },
      {
        url: "/images/products/baqat-lamsat-dimashq-2.jpg",
        alt: "تفاصيل باقة لمسة دمشق — Damascus Flowers",
      },
    ],
    stockQuantity: 18,
    inStock: true,
    isFeatured: true,
    sortOrder: 9,
  },
  {
    slug: "box-alhamdulillah-ala-alsalama",
    legacySlugs: ["بوكس-الحمدلله-على-السلامة"],
    nameAr: "بوكس الحمدلله على السلامة",
    subtitleAr: "صندوق أكريليك أنيق بعبارة الحمد لله على السلامة وتنسيق بيبي روز أبيض ووردي",
    descriptionAr:
      "بوكس إهداء راقٍ بواجهة شفافة مزدانة بخط عربي ذهبي أنيق «الحمد لله على السلامة» مع تنسيق ناعم من البيبي روز الأبيض والوردي؛ الخيار الأمثل لعيادة المرضى والتهنئة بالسلامة.",
    careTipsAr:
      "يُحفظ البوكس في مكان بارد نسبيًا بعيدًا عن الشمس المباشرة للحفاظ على نضارة الزهور داخل الحقيبة الشفافة.",
    priceJod: "55.00",
    priceOnRequest: false,
    categorySlug: "occasion-gifts",
    secondaryCategories: ["flower-boxes"],
    images: [
      {
        url: "/images/products/box-alhamdulillah-ala-alsalama-1.jpg",
        alt: "بوكس الحمدلله على السلامة من أزهار دمشق",
      },
      {
        url: "/images/products/box-alhamdulillah-ala-alsalama-2.jpg",
        alt: "بوكس ورد الحمدلله على السلامة — Damascus Flowers",
      },
    ],
    stockQuantity: 12,
    inStock: true,
    isFeatured: true,
    sortOrder: 10,
  },
  // Authentic Damascus Flowers Teddy Bears & Add-on Gifts category item (from current damascusflowers.com product ID 2099 where price=0; no unapproved price invented!)
  {
    slug: "hadaya-wa-dubab-damascus-flowers",
    legacySlugs: ["هدايا-ودبب"],
    isAddon: true,
    nameAr: "دببة وهدايا إضافية فاخرة",
    subtitleAr: "دببة مخملية ناعمة بألوان اللافندر والأحمر والكريمي لإرفاقها مع باقتك",
    descriptionAr:
      "مجموعة دببة مخملية فاخرة من أزهار دمشق (متوفرة باللون البنفسجي اللافندر، الأحمر الكلاسيكي، والأبيض الكريمي) يمكن إضافتها مع أي باقة أو بوكس هدايا. اذكر اللون المفضل في ملاحظات الطلب وسيتم تأكيد السعر حسب الحجم واللون المختار (أو يمكن للإدارة تحديد السعر مباشرة من لوحة التحكم).",
    careTipsAr: "قطعة قطيفة ناعمة عالية الجودة مناسبة للإهداء والاحتفاظ التذكاري.",
    priceJod: "0.00",
    priceOnRequest: true,
    categorySlug: "teddy-bears-gifts",
    secondaryCategories: ["occasion-gifts"],
    images: [
      {
        url: "/images/products/teddy-bears-gifts-1.jpg",
        alt: "دبدوب لافندر مخملي من أزهار دمشق — الدببة والهدايا الإضافية",
      },
      {
        url: "/images/products/teddy-bears-gifts-2.jpg",
        alt: "دبدوب أحمر مخملي من أزهار دمشق — الدببة والهدايا الإضافية",
      },
      {
        url: "/images/products/teddy-bears-gifts-3.jpg",
        alt: "دبدوب كريمي ناعم من أزهار دمشق — الدببة والهدايا الإضافية",
      },
    ],
    stockQuantity: 15,
    inStock: true,
    isFeatured: false,
    sortOrder: 11,
  },
  {
    slug: "baqat-ishraqat-alshams",
    legacySlugs: ["باقة-اشراقة-الشمس"],
    nameAr: "باقة اشراقة الشمس",
    subtitleAr: "باقة عبّاد الشمس المشرقة مع أغصان الأوكالبتوس بتغليف أبيض أنيق وشريط أسود",
    descriptionAr:
      "باقة مفعمة بالطاقة والبهجة من زهور عبّاد الشمس الطبيعية الكبيرة، منسّقة مع أوراق الأوكالبتوس الفضية داخل تغليف أبيض ناصع بتوقيع Damascus Flowers وشريط ساتان أسود راقٍ — هدية مثالية للتهنئة ونشر السعادة.",
    careTipsAr: DEFAULT_CARE_TIPS,
    priceJod: "40.00",
    priceOnRequest: false,
    categorySlug: "flower-bouquets",
    secondaryCategories: ["occasion-gifts"],
    images: [
      { url: "/images/products/baqat-ishraqat-alshams-1.jpg", alt: "باقة إشراقة الشمس — عبّاد الشمس من أزهار دمشق" },
      { url: "/images/products/baqat-ishraqat-alshams-2.jpg", alt: "باقة إشراقة الشمس بتغليف أبيض — Damascus Flowers" },
    ],
    stockQuantity: 14,
    inStock: true,
    isFeatured: true,
    sortOrder: 12,
  },
  {
    slug: "baqat-baby-rose-abyad",
    legacySlugs: ["باقة-البيبي-روز-الابيض"],
    nameAr: "باقة البيبي روز الابيض",
    subtitleAr: "بياض ناصع ورقة استثنائية من أغصان البيبي روز الطبيعي بتغليف أبيض حريري",
    descriptionAr:
      "باقة أنيقة وغنية من البيبي روز الأبيض النقي بتفتّحه الناعم، ملفوفة بورق أبيض فاخر وشريط ساتان أبيض مع ختم Damascus Flowers — خيار راقٍ للمناسبات الرسمية والتهاني والأفراح.",
    careTipsAr: DEFAULT_CARE_TIPS,
    priceJod: "38.00",
    priceOnRequest: false,
    categorySlug: "flower-bouquets",
    secondaryCategories: ["occasion-gifts"],
    images: [
      { url: "/images/products/baqat-baby-rose-abyad-1.jpg", alt: "باقة البيبي روز الأبيض من أزهار دمشق" },
      { url: "/images/products/baqat-baby-rose-abyad-2.jpg", alt: "تفاصيل باقة البيبي روز الأبيض — Damascus Flowers" },
    ],
    stockQuantity: 15,
    inStock: true,
    isFeatured: false,
    sortOrder: 13,
  },
  {
    slug: "box-mushakkal-lamsat-dimashq",
    legacySlugs: ["بوكس-مشكل-من-لمسات-دِمشق"],
    nameAr: "بوكس مشكل من لمسات دِمشق",
    subtitleAr: "بوكس مخملي وردي كبير بتشكيلة غنية من الجوري الفوشي والخوخي والبيبي روز والكريزانثيم",
    descriptionAr:
      "بوكس فاخر بحجم كبير بتوقيع لمسات دمشق، يجمع تشكيلة متكاملة من الجوري الفوشي والخوخي والكريمي مع البيبي روز والكريزانثيم البنفسجي والجبسوفيلا وأوراق الأوكالبتوس، داخل صندوق مخملي وردي يحمل شعار Damascus Flowers — الخيار الأمثل للمناسبات الكبرى والتهاني الرسمية.",
    careTipsAr:
      "يحتوي البوكس على إسفنج زهري مبلّل؛ يُنصح بإضافة القليل من الماء البارد بين السيقان يوميًا وإبقائه بعيدًا عن الشمس المباشرة.",
    priceJod: "85.00",
    priceOnRequest: false,
    categorySlug: "flower-boxes",
    secondaryCategories: ["occasion-gifts"],
    images: [
      { url: "/images/products/box-mushakkal-lamsat-dimashq-1.jpg", alt: "بوكس مشكل من لمسات دمشق — أزهار دمشق" },
      { url: "/images/products/box-mushakkal-lamsat-dimashq-2.jpg", alt: "بوكس ورد مخملي وردي فاخر — Damascus Flowers" },
    ],
    stockQuantity: 8,
    inStock: true,
    isFeatured: true,
    sortOrder: 14,
  },
  {
    slug: "baqat-kharifiya-dimashqiya",
    legacySlugs: ["باقة-خريفية-دِمشقية"],
    nameAr: "باقة خريفية دِمشقية",
    subtitleAr: "تناغم دافئ من الجوري الأصفر والوردي والخوخي مع البامباس والجبسوفيلا بتغليف ذهبي شفاف",
    descriptionAr:
      "باقة بألوان الخريف الدافئة تجمع الجوري الأصفر المشرق والوردي الناعم والخوخي مع زهور الجبسوفيلا البيضاء وأعشاب البامباس وأوراق الأوكالبتوس، ملفوفة بتغليف شفاف بحواف ذهبية وشرائط مطبوعة بشعار Damascus Flowers.",
    careTipsAr: DEFAULT_CARE_TIPS,
    priceJod: "20.00",
    priceOnRequest: false,
    categorySlug: "flower-bouquets",
    secondaryCategories: [],
    images: [
      { url: "/images/products/baqat-kharifiya-dimashqiya-1.jpg", alt: "باقة خريفية دمشقية من أزهار دمشق" },
      { url: "/images/products/baqat-kharifiya-dimashqiya-2.jpg", alt: "تفاصيل باقة خريفية دمشقية — Damascus Flowers" },
    ],
    stockQuantity: 16,
    inStock: true,
    isFeatured: false,
    sortOrder: 15,
  },
  {
    slug: "baqat-aniqa-2-red-roses",
    legacySlugs: ["باقة-انيقة-2"],
    nameAr: "باقة انيقة 2",
    subtitleAr: "جوري أحمر مخملي مع الأوكالبتوس بتغليف أسود فاخر بحواف ذهبية وشريط عنابي",
    descriptionAr:
      "باقة كلاسيكية راقية من الجوري الأحمر المخملي المتفتّح بعناية مع أغصان الأوكالبتوس، داخل تغليف أسود فاخر بحواف ذهبية وشريط ساتان عنابي بتوقيع Damascus Flowers — تعبير أنيق عن الحب والتقدير.",
    careTipsAr: DEFAULT_CARE_TIPS,
    priceJod: "22.00",
    priceOnRequest: false,
    categorySlug: "flower-bouquets",
    secondaryCategories: ["occasion-gifts"],
    images: [
      { url: "/images/products/baqat-aniqa-2-red-1.jpg", alt: "باقة انيقة 2 — جوري أحمر بتغليف أسود من أزهار دمشق" },
      { url: "/images/products/baqat-aniqa-2-red-2.jpg", alt: "تفاصيل باقة انيقة 2 جوري أحمر — Damascus Flowers" },
    ],
    stockQuantity: 18,
    inStock: true,
    isFeatured: true,
    sortOrder: 16,
  },
  {
    slug: "box-alwan-altabia",
    legacySlugs: ["بوكس-الوان-الطبيعه-من-ازهار-دمشق"],
    nameAr: "بوكس الوان الطبيعه من ازهار دمشق",
    subtitleAr: "بوكس أسود فاخر «La Vie en Fleurs» بالجوري الخوخي والليليوم الوردي مع درج شوكولاتة",
    descriptionAr:
      "بوكس أنيق باللون الأسود بتوقيع أزهار دمشق يجمع الجوري الخوخي الناعم مع زهور الليليوم الوردي والأبيض والخضرة الطبيعية، ويتميّز بدرج سفلي يحتوي على قطع شوكولاتة فاخرة — هدية متكاملة تجمع الزهور والحلوى في تقديم راقٍ.",
    careTipsAr:
      "يحتوي البوكس على إسفنج زهري مبلّل؛ يُنصح بإضافة القليل من الماء البارد بين السيقان يوميًا وإبقائه بعيدًا عن الشمس المباشرة.",
    priceJod: "38.00",
    priceOnRequest: false,
    categorySlug: "flower-boxes",
    secondaryCategories: ["occasion-gifts"],
    images: [
      { url: "/images/products/box-alwan-altabia-1.jpg", alt: "بوكس ألوان الطبيعة الأسود مع الشوكولاتة من أزهار دمشق" },
      { url: "/images/products/box-alwan-altabia-2.jpg", alt: "تفاصيل بوكس ألوان الطبيعة — جوري خوخي وليليوم — Damascus Flowers" },
    ],
    stockQuantity: 12,
    inStock: true,
    isFeatured: false,
    sortOrder: 17,
  },
  {
    slug: "baqat-aniqa-3",
    legacySlugs: ["باقة-انيقة-3"],
    nameAr: "باقة انيقة 3",
    subtitleAr: "جوري خوخي ووردي وأبيض مع براعم الليليوم بتغليف ورق الصحف الأنيق وشريط وردي",
    descriptionAr:
      "باقة عصرية بتغليف ورق الصحف الكلاسيكي الأنيق، تجمع الجوري الخوخي والوردي والأبيض مع براعم الليليوم الخضراء وزهور الكريزانثيم البيضاء، مربوطة بشريط ساتان وردي ناعم — خيار مثالي للفتات اللطيفة والمفاجآت اليومية بسعر مميز.",
    careTipsAr: DEFAULT_CARE_TIPS,
    priceJod: "18.00",
    priceOnRequest: false,
    categorySlug: "flower-bouquets",
    secondaryCategories: [],
    images: [
      { url: "/images/products/baqat-aniqa-3-1.jpg", alt: "باقة انيقة 3 بتغليف ورق الصحف من أزهار دمشق" },
      { url: "/images/products/baqat-aniqa-3-2.jpg", alt: "تفاصيل باقة انيقة 3 — Damascus Flowers" },
    ],
    stockQuantity: 20,
    inStock: true,
    isFeatured: false,
    sortOrder: 18,
  },
  {
    slug: "baqat-dimashq-alwardiya",
    legacySlugs: ["باقة-دِمشق-الوردية"],
    nameAr: "باقة دِمشق الوردية",
    subtitleAr: "باقة غنية من الجوري الفوشي والوردي والكريمي بتغليف شفاف أبيض وشريط وردي",
    descriptionAr:
      "باقة فاخرة وكثيفة من الجوري الطبيعي بتدرجات الفوشي والوردي الفاتح والكريمي المتناغمة، ملفوفة بتغليف شفاف أبيض بحواف بيضاء وشريط ساتان وردي مع ختم Damascus Flowers — تنسيق ملكي للمناسبات الكبيرة والتعبير عن أعمق المشاعر.",
    careTipsAr: DEFAULT_CARE_TIPS,
    priceJod: "55.00",
    priceOnRequest: false,
    categorySlug: "flower-bouquets",
    secondaryCategories: ["occasion-gifts"],
    images: [
      { url: "/images/products/baqat-dimashq-alwardiya-1.jpg", alt: "باقة دمشق الوردية — جوري فوشي ووردي وكريمي من أزهار دمشق" },
      { url: "/images/products/baqat-dimashq-alwardiya-2.jpg", alt: "تفاصيل باقة دمشق الوردية — Damascus Flowers" },
    ],
    stockQuantity: 12,
    inStock: true,
    isFeatured: true,
    sortOrder: 19,
  },
  {
    slug: "baqat-alanaqa-almushriqa",
    legacySlugs: ["باقة-الاناقة-المشرقة"],
    nameAr: "باقة الاناقة المشرقة",
    subtitleAr: "تشكيلة مبهجة من الجوري الوردي والخوخي مع عبّاد الشمس والليليوم بتغليف شبكي أبيض",
    descriptionAr:
      "باقة مشرقة تجمع الجوري الوردي والفوشي والخوخي والأبيض مع زهور عبّاد الشمس وبراعم الليليوم والليمونيوم البنفسجي والجبسوفيلا، ملفوفة بتغليف شبكي أبيض أنيق وشريط ساتان وردي — تنسيق يفيض حيوية وبهجة بتوقيع أزهار دمشق.",
    careTipsAr: DEFAULT_CARE_TIPS,
    priceJod: "39.00",
    priceOnRequest: false,
    categorySlug: "flower-bouquets",
    secondaryCategories: ["occasion-gifts"],
    images: [
      { url: "/images/products/baqat-alanaqa-almushriqa-1.jpg", alt: "باقة الأناقة المشرقة من أزهار دمشق" },
      { url: "/images/products/baqat-alanaqa-almushriqa-2.jpg", alt: "تفاصيل باقة الأناقة المشرقة — Damascus Flowers" },
    ],
    stockQuantity: 14,
    inStock: true,
    isFeatured: false,
    sortOrder: 20,
  },
  {
    slug: "baqat-almawlood-boy",
    legacySlugs: ["باقة-المولود-boy-من-ازهار-دمشق-🩵", "باقة-المولود-boy-من-ازهار-دمشق"],
    nameAr: "باقة المولود boy من ازهار دمشق 🩵",
    subtitleAr: "ليليوم أبيض وكريزانثيم أزرق وأبيض مع الجبسوفيلا بتغليف سماوي للتهنئة بالمولود",
    descriptionAr:
      "باقة مخصّصة للتهنئة بقدوم المولود الجديد، تجمع زهور الليليوم الأبيض الكبيرة مع الكريزانثيم الأزرق السماوي والأبيض والجبسوفيلا الناعمة، بتغليف سماوي أنيق وشريط ساتان أبيض مع بطاقة Damascus Flowers — أجمل طريقة لمشاركة فرحة العائلة.",
    careTipsAr: DEFAULT_CARE_TIPS,
    priceJod: "25.00",
    priceOnRequest: false,
    categorySlug: "occasion-gifts",
    secondaryCategories: ["flower-bouquets"],
    images: [
      { url: "/images/products/baqat-almawlood-boy-1.jpg", alt: "باقة المولود boy السماوية من أزهار دمشق" },
      { url: "/images/products/baqat-almawlood-boy-2.jpg", alt: "تفاصيل باقة المولود boy — ليليوم وكريزانثيم أزرق — Damascus Flowers" },
    ],
    stockQuantity: 12,
    inStock: true,
    isFeatured: false,
    sortOrder: 21,
  },
  {
    slug: "baqat-wardiya-hadia",
    legacySlugs: ["باقة-وردية-هادئة-🩷", "باقة-وردية-هادئة"],
    nameAr: "باقة وردية هادئة 🩷",
    subtitleAr: "جوري وردي ناعم مع الكريزانثيم الأبيض وبراعم الليليوم بتغليف وردي داكن أنيق",
    descriptionAr:
      "باقة هادئة ورقيقة تجمع الجوري الوردي الناعم مع زهور الكريزانثيم البيضاء الكبيرة وبراعم الليليوم الخضراء والأوراق الطبيعية، ملفوفة بتغليف وردي داكن أنيق وشريط ساتان أبيض مع ختم Damascus Flowers — تعبير لطيف عن المودة في كل مناسبة.",
    careTipsAr: DEFAULT_CARE_TIPS,
    priceJod: "25.00",
    priceOnRequest: false,
    categorySlug: "flower-bouquets",
    secondaryCategories: [],
    images: [
      { url: "/images/products/baqat-wardiya-hadia-1.jpg", alt: "باقة وردية هادئة — جوري وردي وكريزانثيم أبيض من أزهار دمشق" },
      { url: "/images/products/baqat-wardiya-hadia-2.jpg", alt: "تفاصيل باقة وردية هادئة — Damascus Flowers" },
    ],
    stockQuantity: 15,
    inStock: true,
    isFeatured: false,
    sortOrder: 22,
  },
  {
    slug: "lamsat-dimashq-alraqiya",
    legacySlugs: ["لمسة-دمشق-الراقية-💜", "لمسة-دمشق-الراقية"],
    nameAr: "لمسة دمشق الراقية 💜",
    subtitleAr: "عبّاد الشمس مع الليليوم الأبيض والوردي والقرنفل بتغليف بنفسجي فاخر",
    descriptionAr:
      "تنسيق راقٍ بتوقيع أزهار دمشق يجمع زهور عبّاد الشمس المشرقة مع الليليوم الأبيض والوردي والقرنفل الأبيض والكريزانثيم البنفسجي الصغير والليمونيوم، ملفوف بتغليف بنفسجي لافندر فاخر مع تول أبيض وشريط ساتان — باقة مميزة بحضور لافت للمناسبات الخاصة.",
    careTipsAr: DEFAULT_CARE_TIPS,
    priceJod: "36.00",
    priceOnRequest: false,
    categorySlug: "flower-bouquets",
    secondaryCategories: ["occasion-gifts"],
    images: [
      { url: "/images/products/lamsat-dimashq-alraqiya-1.jpg", alt: "لمسة دمشق الراقية — عبّاد الشمس والليليوم بتغليف بنفسجي من أزهار دمشق" },
      { url: "/images/products/lamsat-dimashq-alraqiya-2.jpg", alt: "تفاصيل لمسة دمشق الراقية — Damascus Flowers" },
    ],
    stockQuantity: 15,
    inStock: true,
    isFeatured: false,
    sortOrder: 23,
  },
  {
    slug: "baqat-mix-alrabie-alaniqa",
    legacySlugs: [],
    nameAr: "باقة مكس الربيع الانيقة",
    subtitleAr: "عبّاد الشمس مع البيبي روز الكريمي بتغليف كريمي أنيق وشريط أسود",
    descriptionAr:
      "باقة ربيعية مبهجة تجمع زهور عبّاد الشمس الكبيرة مع عناقيد البيبي روز الكريمي الناعم والخضرة الطبيعية، ملفوفة بتغليف كريمي أنيق وشريط ساتان أسود بتوقيع Damascus Flowers — تنسيق مشرق يناسب التهاني والمفاجآت السعيدة.",
    careTipsAr: DEFAULT_CARE_TIPS,
    priceJod: "28.00",
    priceOnRequest: false,
    categorySlug: "flower-bouquets",
    secondaryCategories: ["occasion-gifts"],
    images: [
      { url: "/images/products/baqat-mix-alrabie-aniqa-1.jpg", alt: "باقة مكس الربيع الأنيقة — عبّاد الشمس والبيبي روز الكريمي من أزهار دمشق" },
    ],
    stockQuantity: 15,
    inStock: true,
    isFeatured: false,
    sortOrder: 24,
  },
  {
    slug: "baqat-aljouri-alclassicia",
    legacySlugs: [],
    nameAr: "باقة الجوري الكلاسيكيه",
    subtitleAr: "باقة كلاسيكية فاخرة من الجوري الأحمر المخملي مع أوراق الراسكس وشريط أسود مطبوع",
    descriptionAr:
      "باقة كلاسيكية مستديرة من الجوري الأحمر المخملي الفاخر محاطة بأوراق الراسكس الخضراء اللامعة، بسيقان طويلة مكشوفة وشريط ساتان أسود يحمل شعار Damascus Flowers — الخيار الأرقى للتعبير عن الحب في المناسبات الكبيرة والذكرى السنوية.",
    careTipsAr: DEFAULT_CARE_TIPS,
    priceJod: "55.00",
    priceOnRequest: false,
    categorySlug: "flower-bouquets",
    secondaryCategories: ["occasion-gifts"],
    images: [
      { url: "/images/products/baqat-aljouri-alclassic-1.jpg", alt: "باقة الجوري الكلاسيكية — جوري أحمر مخملي مع شريط أسود من أزهار دمشق" },
      { url: "/images/products/baqat-aljouri-alclassic-2.jpg", alt: "تفاصيل باقة الجوري الكلاسيكية — Damascus Flowers" },
    ],
    stockQuantity: 10,
    inStock: true,
    isFeatured: true,
    sortOrder: 25,
  },
  {
    slug: "baqat-jouri-abyad-wa-ahmar",
    legacySlugs: [],
    nameAr: "باقة جوري ابيض واحمر",
    subtitleAr: "جوري أبيض كريمي وأحمر مع السوليداغو والأوكالبتوس بتغليف أخضر نعناعي",
    descriptionAr:
      "باقة أنيقة تجمع الجوري الأبيض الكريمي الكبير مع الجوري الأحمر الصغير وزهور السوليداغو الصفراء وأوراق الأوكالبتوس، ملفوفة بتغليف أخضر نعناعي هادئ وشريط ساتان أبيض مع ختم Damascus Flowers — تناغم كلاسيكي بسعر مميز.",
    careTipsAr: DEFAULT_CARE_TIPS,
    priceJod: "20.00",
    priceOnRequest: false,
    categorySlug: "flower-bouquets",
    secondaryCategories: [],
    images: [
      { url: "/images/products/baqat-jouri-abyad-ahmar-1.jpg", alt: "باقة جوري أبيض وأحمر بتغليف نعناعي من أزهار دمشق" },
      { url: "/images/products/baqat-jouri-abyad-ahmar-2.jpg", alt: "تفاصيل باقة جوري أبيض وأحمر — Damascus Flowers" },
    ],
    stockQuantity: 20,
    inStock: true,
    isFeatured: false,
    sortOrder: 26,
  },
  {
    slug: "box-altakharruj",
    legacySlugs: [],
    nameAr: "بوكس التخرج 🎓",
    subtitleAr: "بوكس أبيض فاخر بالجوري الأحمر مع لفافات نقدية وبالونات التخرج وبطاقة إهداء",
    descriptionAr:
      "بوكس تهنئة بالتخرج بتوقيع أزهار دمشق: صندوق أبيض أنيق مليء بالجوري الأحمر المخملي مع لفافات نقدية مرتبة بين الورود (تُجهَّز بقيمة يحدّدها العميل)، وزهور الجبسوفيلا والخضرة الطبيعية، وبالونات شفافة بطبعة التخرج، وبطاقة إهداء مع شريط ساتان أسود — هدية تخرج لا تُنسى.",
    careTipsAr:
      "يحتوي البوكس على إسفنج زهري مبلّل؛ يُنصح بإضافة القليل من الماء البارد بين السيقان يوميًا وإبقائه بعيدًا عن الشمس المباشرة.",
    priceJod: "37.00",
    priceOnRequest: false,
    categorySlug: "occasion-gifts",
    secondaryCategories: ["flower-boxes"],
    images: [
      { url: "/images/products/box-altakharruj-1.jpg", alt: "بوكس التخرج — جوري أحمر مع بالونات التخرج من أزهار دمشق" },
      { url: "/images/products/box-altakharruj-2.jpg", alt: "تفاصيل بوكس التخرج — Damascus Flowers" },
    ],
    stockQuantity: 10,
    inStock: true,
    isFeatured: true,
    sortOrder: 27,
  },
  {
    slug: "baqat-lilies-wa-almanthour-alclassicia",
    legacySlugs: [],
    nameAr: "باقة الليليز والمنثور الكلاسيكية",
    subtitleAr: "براعم الليليوم مع المنثور الوردي والجبسوفيلا والأوكالبتوس بتغليف وردي ترابي",
    descriptionAr:
      "باقة كلاسيكية عطرة تجمع براعم الليليوم الخضراء التي تتفتّح تدريجيًا مع زهور المنثور الوردي الناعم والجبسوفيلا البيضاء وأوراق الأوكالبتوس الفضية، ملفوفة بتغليف وردي ترابي أنيق وشرائط كريمية مطبوعة بتوقيع Damascus Flowers.",
    careTipsAr:
      "براعم الليليوم تتفتّح خلال أيام قليلة في الماء النظيف؛ يُنصح بإزالة حبوب اللقاح عند التفتح للحفاظ على نقاء البتلات، وتجديد الماء كل يومين.",
    priceJod: "38.00",
    priceOnRequest: false,
    categorySlug: "flower-bouquets",
    secondaryCategories: ["occasion-gifts"],
    images: [
      { url: "/images/products/baqat-lilies-manthour-1.jpg", alt: "باقة الليليز والمنثور الكلاسيكية من أزهار دمشق" },
      { url: "/images/products/baqat-lilies-manthour-2.jpg", alt: "تفاصيل باقة الليليز والمنثور — Damascus Flowers" },
    ],
    stockQuantity: 12,
    inStock: true,
    isFeatured: false,
    sortOrder: 28,
  },
  {
    slug: "baqat-scarf-mikasa",
    legacySlugs: [],
    nameAr: "باقة سكارف ميكاسا",
    subtitleAr: "جوري أحمر بتغليف قماش ميكاسا العنابي الناعم وشريط ساتان أبيض",
    descriptionAr:
      "باقة مميزة من الجوري الأحمر الطبيعي مع الأوراق الخضراء، ملفوفة بأسلوب السكارف من قماش ميكاسا العنابي الناعم بحوافه الطبيعية وشريط ساتان أبيض مع ختم Damascus Flowers — تنسيق دافئ وفخم يناسب المناسبات الرومانسية.",
    careTipsAr: DEFAULT_CARE_TIPS,
    priceJod: "35.00",
    priceOnRequest: false,
    categorySlug: "flower-bouquets",
    secondaryCategories: ["occasion-gifts"],
    images: [
      { url: "/images/products/baqat-scarf-mikasa-1.jpg", alt: "باقة سكارف ميكاسا — جوري أحمر بتغليف قماشي عنابي من أزهار دمشق" },
      { url: "/images/products/baqat-scarf-mikasa-2.jpg", alt: "تفاصيل باقة سكارف ميكاسا — Damascus Flowers" },
    ],
    stockQuantity: 12,
    inStock: true,
    isFeatured: false,
    sortOrder: 29,
  },
  // Checkout add-on suggestions (isAddon) — set their final prices from /admin
  {
    slug: "ulbat-chocolate-fakhira",
    legacySlugs: [],
    nameAr: "علبة شوكولاتة فاخرة",
    subtitleAr: "إضافة راقية تُرفق مع الباقة أو البوكس — شوكولاتة فاخرة مغلّفة بعناية",
    descriptionAr:
      "علبة شوكولاتة فاخرة مختارة بعناية لتُرفق مع باقتك أو بوكس الهدايا من أزهار دمشق، تضيف لمسة حلوة وأنيقة إلى هديتك. يتم تأكيد الحجم والسعر عند تأكيد الطلب (ويمكن للإدارة تحديد السعر مباشرة من لوحة التحكم).",
    careTipsAr: "تُحفظ في مكان بارد وجاف بعيدًا عن أشعة الشمس.",
    priceJod: "0.00",
    priceOnRequest: true,
    isAddon: true,
    categorySlug: "teddy-bears-gifts",
    secondaryCategories: ["occasion-gifts"],
    images: [
      { url: "/images/products/addon-chocolate-box.jpg", alt: "علبة شوكولاتة فاخرة — إضافة للهدايا من أزهار دمشق" },
    ],
    stockQuantity: null,
    inStock: true,
    isFeatured: false,
    sortOrder: 90,
  },
];

// Additional authentic products discovered on live damascusflowers.com — ready for 1-click import from Admin Dashboard!
export const LEGACY_WOOCOMMERCE_CATALOG: SeedProduct[] = [
];

// Delivery zones — note feeJod is null by default so ZERO unapproved delivery prices are invented;
// store owner can set exact JOD fee per zone anytime inside /admin!
export const DEFAULT_DELIVERY_ZONES: DeliveryZoneConfig[] = [
  // All 12 governorates of Jordan. feeJod = null → no price is shown; the customer sees
  // "تُحدَّد تكلفة التوصيل حسب الحي والمنطقة". The owner can set a fee per governorate anytime from /admin.
  { id: "amman", nameAr: "محافظة العاصمة عمّان", feeJod: null, noteAr: "تُحدَّد تكلفة التوصيل حسب الحي والمنطقة", enabled: true },
  { id: "zarqa", nameAr: "محافظة الزرقاء", feeJod: null, noteAr: "تُحدَّد تكلفة التوصيل حسب الحي والمنطقة", enabled: true },
  { id: "balqa", nameAr: "محافظة البلقاء", feeJod: null, noteAr: "تُحدَّد تكلفة التوصيل حسب الحي والمنطقة", enabled: true },
  { id: "madaba", nameAr: "محافظة مادبا", feeJod: null, noteAr: "تُحدَّد تكلفة التوصيل حسب الحي والمنطقة", enabled: true },
  { id: "irbid", nameAr: "محافظة إربد", feeJod: null, noteAr: "تُحدَّد تكلفة التوصيل حسب الحي والمنطقة", enabled: true },
  { id: "jerash", nameAr: "محافظة جرش", feeJod: null, noteAr: "تُحدَّد تكلفة التوصيل حسب الحي والمنطقة", enabled: true },
  { id: "ajloun", nameAr: "محافظة عجلون", feeJod: null, noteAr: "تُحدَّد تكلفة التوصيل حسب الحي والمنطقة", enabled: true },
  { id: "mafraq", nameAr: "محافظة المفرق", feeJod: null, noteAr: "تُحدَّد تكلفة التوصيل حسب الحي والمنطقة", enabled: true },
  { id: "karak", nameAr: "محافظة الكرك", feeJod: null, noteAr: "تُحدَّد تكلفة التوصيل حسب الحي والمنطقة", enabled: true },
  { id: "tafilah", nameAr: "محافظة الطفيلة", feeJod: null, noteAr: "تُحدَّد تكلفة التوصيل حسب الحي والمنطقة", enabled: true },
  { id: "maan", nameAr: "محافظة معان", feeJod: null, noteAr: "تُحدَّد تكلفة التوصيل حسب الحي والمنطقة", enabled: true },
  { id: "aqaba", nameAr: "محافظة العقبة", feeJod: null, noteAr: "تُحدَّد تكلفة التوصيل حسب الحي والمنطقة", enabled: true },
];

export const DEFAULT_PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: "cod",
    nameAr: "الدفع عند الاستلام",
    descriptionAr: "الدفع نقدًا بالدينار الأردني عند استلام الطلب.",
    enabled: true,
  },
  {
    id: "cliq",
    nameAr: "تحويل فوري (CliQ / تحويل بنكي)",
    descriptionAr: "متاح للتفعيل عند الرغبة — يتم تزويد العميل ببيانات التحويل عند تأكيد الطلب (مفيد جدًا للطلبات السرية وإرسال الهدايا).",
    enabled: true,
  },
  {
    id: "card_online",
    nameAr: "البطاقات البنكية الإلكترونية (قريبًا)",
    descriptionAr: "بوابة دفع إلكتروني قابلة للربط مستقبلاً.",
    enabled: false,
  },
];
