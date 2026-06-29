import { PrismaClient, ProductType, RedirectStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://skenis.lt").replace(
  /\/+$/,
  ""
);

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@skenis.lt").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "SkenisDemo2026!";
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: "Skenis Admin",
      passwordHash,
      role: "ADMIN"
    },
    create: {
      email,
      name: "Skenis Admin",
      passwordHash,
      role: "ADMIN"
    }
  });

  const existingDemoBatch = await prisma.qrBatch.findFirst({
    where: { name: "Demo gamybos partija" }
  });

  if (!existingDemoBatch) {
    await prisma.qrBatch.create({
      data: {
        name: "Demo gamybos partija",
        productType: ProductType.CARD,
        quantity: 3,
        tokenPrefix: "DEMO_",
        manufacturerNote:
          "Demo duomenys vietiniam testavimui. Realioje gamyboje naudokite naujai sugeneruotą partiją.",
        links: {
          create: [
            {
              token: "DEMO_A7K92LQD",
              shortUrl: `${baseUrl}/r/DEMO_A7K92LQD`,
              productType: ProductType.CARD,
              status: RedirectStatus.ACTIVE,
              companyName: "Demo klinika",
              contactName: "Demo kontaktas",
              contactEmail: "demo@skenis.lt",
              destinationUrl: "https://g.page/r/example/review",
              notes: "Aktyvi demonstracinė QR nuoroda."
            },
            {
              token: "DEMO_8fK29xQp",
              shortUrl: `${baseUrl}/r/DEMO_8fK29xQp`,
              productType: ProductType.CARD,
              status: RedirectStatus.UNASSIGNED,
              notes: "Nepriskirta demonstracinė QR nuoroda."
            },
            {
              token: "DEMO_X4P91LmN",
              shortUrl: `${baseUrl}/r/DEMO_X4P91LmN`,
              productType: ProductType.CARD,
              status: RedirectStatus.DISABLED,
              destinationUrl: "https://g.page/r/example/review",
              notes: "Išjungta demonstracinė QR nuoroda."
            }
          ]
        }
      }
    });
  }

  const existingLead = await prisma.lead.findFirst({
    where: { email: "uzklausa@skenis.lt" }
  });

  if (!existingLead) {
    await prisma.lead.create({
      data: {
        name: "Aistė",
        companyName: "Demo restoranas",
        email: "uzklausa@skenis.lt",
        phone: "+37060000000",
        quantity: 25,
        productType: ProductType.STAND,
        googleReviewUrl: "https://g.page/r/example/review",
        message: "Norime stalinių stendų trims filialams."
      }
    });
  }

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      entityType: "Seed",
      entityId: "demo",
      action: "SEED_DEMO_DATA",
      newValue: { email }
    }
  });

  console.log(`Seed complete. Admin: ${email} / ${password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
