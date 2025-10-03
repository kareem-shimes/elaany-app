import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedAds() {
  console.log("Seeding sample ads...");

  // First, let's get the categories and subcategories we need
  const carsCategory = await prisma.category.findUnique({
    where: { slug: "cars" },
    include: { subcategories: true },
  });

  const realEstateCategory = await prisma.category.findUnique({
    where: { slug: "real-estate" },
    include: { subcategories: true },
  });

  if (!carsCategory || !realEstateCategory) {
    console.error(
      "Required categories not found. Please run seed-categories first."
    );
    return;
  }

  // Get or create a sample user for the ads
  let sampleUser = await prisma.user.findFirst({
    where: { email: "seller@example.com" },
  });

  if (!sampleUser) {
    sampleUser = await prisma.user.create({
      data: {
        email: "seller@example.com",
        name: "Sample Seller",
        role: "USER",
      },
    });
  }

  // Car ads data
  const carAds = [
    {
      title: "تويوتا كامري 2020 - حالة ممتازة",
      description:
        "سيارة تويوتا كامري موديل 2020، ماشية 45,000 كيلو، حالة ممتازة، صيانة دورية منتظمة. السيارة نظيفة جداً وجاهزة للاستخدام. فحص كامل متاح.",
      price: 85000,
      currency: "SAR",
      location: "الرياض، السعودية",
      condition: "USED" as const,
      isNegotiable: true,
      phone: "+966501234567",
      subcategorySlug: "sedan",
      images: ["/uploads/cars/camry-1.jpg", "/uploads/cars/camry-2.jpg"],
    },
    {
      title: "لكزس LX 570 - 2019",
      description:
        "لكزس LX 570 موديل 2019، لون أبيض، داخلية جلد بيج، ماشية 38,000 كم. السيارة في حالة الوكالة، تحت الضمان، جميع الخدمات في الوكالة.",
      price: 285000,
      currency: "SAR",
      location: "جدة، السعودية",
      condition: "USED" as const,
      isNegotiable: true,
      phone: "+966502345678",
      subcategorySlug: "luxury",
      featured: true,
      images: ["/uploads/cars/lexus-1.jpg", "/uploads/cars/lexus-2.jpg"],
    },
    {
      title: "هوندا سيفيك 2021 - وكالة",
      description:
        "هوندا سيفيك 2021، لون رمادي، ماشية 25,000 كم فقط. السيارة تحت الضمان، جميع الخدمات في الوكالة. حالة ممتازة جداً.",
      price: 72000,
      currency: "SAR",
      location: "الدمام، السعودية",
      condition: "USED" as const,
      isNegotiable: false,
      phone: "+966503456789",
      subcategorySlug: "sedan",
      images: ["/uploads/cars/civic-1.jpg"],
    },
    {
      title: "فورد رابتور 2022 - جديد",
      description:
        "فورد رابتور 2022، لون أسود، جديد لم يستخدم. السيارة من الوكالة مباشرة، ضمان شامل لمدة 3 سنوات.",
      price: 185000,
      currency: "SAR",
      location: "الرياض، السعودية",
      condition: "NEW" as const,
      isNegotiable: false,
      phone: "+966504567890",
      subcategorySlug: "pickup",
      featured: true,
      images: ["/uploads/cars/raptor-1.jpg", "/uploads/cars/raptor-2.jpg"],
    },
    {
      title: "BMW X5 2018 - فحص كامل",
      description:
        "BMW X5 موديل 2018، لون أزرق، ماشية 65,000 كم. فحص كامل متاح، تم تغيير جميع القطع الاستهلاكية. حالة جيدة جداً.",
      price: 145000,
      currency: "SAR",
      location: "مكة، السعودية",
      condition: "USED" as const,
      isNegotiable: true,
      phone: "+966505678901",
      subcategorySlug: "suv",
      images: ["/uploads/cars/bmw-1.jpg"],
    },
  ];

  // Real estate ads data
  const realEstateAds = [
    {
      title: "شقة 3 غرف للإيجار - حي الملقا",
      description:
        "شقة واسعة 3 غرف نوم، 2 حمام، صالة كبيرة، مطبخ مجهز. الشقة في الدور الثاني، مصعد، موقف سيارة. قريبة من الخدمات والمدارس.",
      price: 32000,
      currency: "SAR",
      location: "حي الملقا، الرياض",
      condition: "USED" as const,
      isNegotiable: true,
      phone: "+966506789012",
      subcategorySlug: "apartments-rent",
      images: [
        "/uploads/real-estate/apartment-1.jpg",
        "/uploads/real-estate/apartment-2.jpg",
      ],
    },
    {
      title: "فيلا للبيع - المروج",
      description:
        "فيلا دورين، 5 غرف نوم، 4 حمامات، صالة كبيرة، غرفة طعام، مطبخ واسع، حديقة خلفية. المساحة 400 متر مربع.",
      price: 1250000,
      currency: "SAR",
      location: "حي المروج، الرياض",
      condition: "USED" as const,
      isNegotiable: true,
      phone: "+966507890123",
      subcategorySlug: "houses-sale",
      featured: true,
      images: [
        "/uploads/real-estate/villa-1.jpg",
        "/uploads/real-estate/villa-2.jpg",
      ],
    },
    {
      title: "شقة للبيع - برج سكني راقي",
      description:
        "شقة 4 غرف في برج سكني راقي، الدور 15، إطلالة رائعة على المدينة. جميع الخدمات متوفرة: مسبح، جيم، أمن 24 ساعة.",
      price: 850000,
      currency: "SAR",
      location: "وسط المدينة، الرياض",
      condition: "NEW" as const,
      isNegotiable: false,
      phone: "+966508901234",
      subcategorySlug: "apartments-sale",
      featured: true,
      images: ["/uploads/real-estate/tower-apartment-1.jpg"],
    },
    {
      title: "فيلا للإيجار - مفروشة بالكامل",
      description:
        "فيلا مفروشة بالكامل، 4 غرف نوم، 3 حمامات، مطبخ مجهز، حديقة، مسبح خاص. مثالية للعائلات.",
      price: 65000,
      currency: "SAR",
      location: "حي النرجس، الرياض",
      condition: "USED" as const,
      isNegotiable: true,
      phone: "+966509012345",
      subcategorySlug: "houses-rent",
      images: [
        "/uploads/real-estate/furnished-villa-1.jpg",
        "/uploads/real-estate/furnished-villa-2.jpg",
      ],
    },
    {
      title: "محل تجاري للإيجار - شارع رئيسي",
      description:
        "محل تجاري في موقع ممتاز على شارع رئيسي، مساحة 120 متر مربع، واجهة زجاجية، موقف سيارات أمام المحل.",
      price: 45000,
      currency: "SAR",
      location: "شارع الملك فهد، الدمام",
      condition: "USED" as const,
      isNegotiable: true,
      phone: "+966500123456",
      subcategorySlug: "commercial",
      images: ["/uploads/real-estate/shop-1.jpg"],
    },
  ];

  // Insert car ads
  console.log("Adding car ads...");
  for (const adData of carAds) {
    const { subcategorySlug, ...adInfo } = adData;
    const subcategory = carsCategory.subcategories.find(
      (sub) => sub.slug === subcategorySlug
    );

    if (subcategory) {
      try {
        const ad = await prisma.ad.create({
          data: {
            ...adInfo,
            sellerId: sampleUser.id,
            categoryId: carsCategory.id,
            subcategoryId: subcategory.id,
          },
        });
        console.log(`Created car ad: ${ad.title}`);
      } catch (error) {
        console.error(`Error creating car ad "${adInfo.title}":`, error);
      }
    }
  }

  // Insert real estate ads
  console.log("Adding real estate ads...");
  for (const adData of realEstateAds) {
    const { subcategorySlug, ...adInfo } = adData;
    const subcategory = realEstateCategory.subcategories.find(
      (sub) => sub.slug === subcategorySlug
    );

    if (subcategory) {
      try {
        const ad = await prisma.ad.create({
          data: {
            ...adInfo,
            sellerId: sampleUser.id,
            categoryId: realEstateCategory.id,
            subcategoryId: subcategory.id,
          },
        });
        console.log(`Created real estate ad: ${ad.title}`);
      } catch (error) {
        console.error(
          `Error creating real estate ad "${adInfo.title}":`,
          error
        );
      }
    }
  }

  console.log("Ads seeding completed!");
}

async function main() {
  try {
    await seedAds();
  } catch (error) {
    console.error("Error seeding ads:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
