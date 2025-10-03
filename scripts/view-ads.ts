import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function viewAds() {
  console.log("📋 Current Ads in Database:\n");

  // Get cars category ads
  const carsAds = await prisma.ad.findMany({
    where: {
      category: {
        slug: "cars",
      },
    },
    include: {
      category: true,
      subcategory: true,
      seller: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get real estate category ads
  const realEstateAds = await prisma.ad.findMany({
    where: {
      category: {
        slug: "real-estate",
      },
    },
    include: {
      category: true,
      subcategory: true,
      seller: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log("🚗 CAR ADS:");
  console.log("=".repeat(50));
  carsAds.forEach((ad, index) => {
    console.log(`${index + 1}. ${ad.title}`);
    console.log(`   💰 Price: ${ad.price.toLocaleString()} ${ad.currency}`);
    console.log(`   📍 Location: ${ad.location}`);
    console.log(`   📂 Category: ${ad.subcategory?.name || "No subcategory"}`);
    console.log(`   📞 Phone: ${ad.phone}`);
    console.log(`   ⭐ Featured: ${ad.featured ? "Yes" : "No"}`);
    console.log(`   👀 Views: ${ad.views}`);
    console.log(`   📅 Posted: ${ad.postedDate.toLocaleDateString()}`);
    console.log("");
  });

  console.log("\n🏠 REAL ESTATE ADS:");
  console.log("=".repeat(50));
  realEstateAds.forEach((ad, index) => {
    console.log(`${index + 1}. ${ad.title}`);
    console.log(`   💰 Price: ${ad.price.toLocaleString()} ${ad.currency}`);
    console.log(`   📍 Location: ${ad.location}`);
    console.log(`   📂 Category: ${ad.subcategory?.name || "No subcategory"}`);
    console.log(`   📞 Phone: ${ad.phone}`);
    console.log(`   ⭐ Featured: ${ad.featured ? "Yes" : "No"}`);
    console.log(`   👀 Views: ${ad.views}`);
    console.log(`   📅 Posted: ${ad.postedDate.toLocaleDateString()}`);
    console.log("");
  });

  // Summary
  console.log("📊 SUMMARY:");
  console.log("=".repeat(30));
  console.log(`Total Car Ads: ${carsAds.length}`);
  console.log(`Total Real Estate Ads: ${realEstateAds.length}`);
  console.log(`Total Ads: ${carsAds.length + realEstateAds.length}`);

  const featuredCount = [...carsAds, ...realEstateAds].filter(
    (ad) => ad.featured
  ).length;
  console.log(`Featured Ads: ${featuredCount}`);
}

async function main() {
  try {
    await viewAds();
  } catch (error) {
    console.error("Error viewing ads:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
