import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedCategories() {
  console.log("Seeding categories...");

  // Create categories with their subcategories
  const categories = [
    {
      name: "سيارات",
      slug: "cars",
      description: "جميع أنواع السيارات والمركبات",
      subcategories: [
        { name: "سيدان", slug: "sedan" },
        { name: "دفع رباعي", slug: "suv" },
        { name: "هاتشباك", slug: "hatchback" },
        { name: "بك أب", slug: "pickup" },
        { name: "سيارات فاخرة", slug: "luxury" },
        { name: "دراجات نارية", slug: "motorcycles" },
      ],
    },
    {
      name: "إلكترونيات",
      slug: "electronics",
      description: "الأجهزة الإلكترونية والتقنية",
      subcategories: [
        { name: "هواتف ذكية", slug: "phones" },
        { name: "لابتوب", slug: "laptops" },
        { name: "تابلت", slug: "tablets" },
        { name: "كاميرات", slug: "cameras" },
        { name: "ألعاب إلكترونية", slug: "gaming" },
        { name: "اكسسوارات", slug: "accessories" },
      ],
    },
    {
      name: "عقارات",
      slug: "real-estate",
      description: "شقق وفلل وعقارات للإيجار والبيع",
      subcategories: [
        { name: "شقق للإيجار", slug: "apartments-rent" },
        { name: "فلل للإيجار", slug: "houses-rent" },
        { name: "شقق للبيع", slug: "apartments-sale" },
        { name: "فلل للبيع", slug: "houses-sale" },
        { name: "عقارات تجارية", slug: "commercial" },
        { name: "أراضي", slug: "land" },
      ],
    },
    {
      name: "أثاث",
      slug: "furniture",
      description: "أثاث منزلي ومكتبي",
      subcategories: [
        { name: "غرف نوم", slug: "bedroom" },
        { name: "صالات", slug: "living-room" },
        { name: "غرف طعام", slug: "dining" },
        { name: "مكاتب", slug: "office" },
        { name: "مطابخ", slug: "kitchen" },
        { name: "أثاث خارجي", slug: "outdoor" },
      ],
    },
    {
      name: "رياضة",
      slug: "sports",
      description: "معدات وأدوات رياضية",
      subcategories: [
        { name: "لياقة بدنية", slug: "fitness" },
        { name: "دراجات هوائية", slug: "bikes" },
        { name: "كرة قدم", slug: "football" },
        { name: "سباحة", slug: "swimming" },
        { name: "معدات جيم", slug: "gym" },
        { name: "رياضات خارجية", slug: "outdoor-sports" },
      ],
    },
    {
      name: "أزياء",
      slug: "fashion",
      description: "ملابس وأحذية واكسسوارات",
      subcategories: [
        { name: "ملابس رجالية", slug: "men-clothing" },
        { name: "ملابس نسائية", slug: "women-clothing" },
        { name: "أحذية", slug: "shoes" },
        { name: "حقائب", slug: "bags" },
        { name: "اكسسوارات", slug: "accessories" },
        { name: "ساعات", slug: "watches" },
      ],
    },
  ];

  for (const categoryData of categories) {
    const { subcategories, ...categoryInfo } = categoryData;

    try {
      const category = await prisma.category.create({
        data: {
          ...categoryInfo,
          subcategories: {
            create: subcategories,
          },
        },
        include: {
          subcategories: true,
        },
      });

      console.log(
        `Created category: ${category.name} with ${category.subcategories.length} subcategories`
      );
    } catch (error) {
      console.log(
        `Category ${categoryInfo.name} already exists or error occurred:`,
        error
      );
    }
  }

  console.log("Categories seeding completed!");
}

async function main() {
  try {
    await seedCategories();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
