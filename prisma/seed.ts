import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  papuaFamilies,
  generateMorePapuaFamilies,
} from "./papua-families-data";

const prisma = new PrismaClient();

// Helper untuk calculate umur
function calculateAge(tanggalLahir: Date): number {
  const today = new Date();
  let age = today.getFullYear() - tanggalLahir.getFullYear();
  const monthDiff = today.getMonth() - tanggalLahir.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < tanggalLahir.getDate())
  ) {
    age--;
  }

  return age;
}

// Helper untuk generate koordinat GPS random di area Kota Jayapura (DARATAN KOTA ONLY!)
// FOKUS: Pusat kota Jayapura, Entrop, Abepura bagian barat (JAUH dari teluk/pantai)
// Range ULTRA KETAT untuk memastikan 100% DARATAN!
function generateJayapuraCoordinates(): {
  latitude: number;
  longitude: number;
} {
  const latMin = -2.585; // Selatan (Abepura barat)
  const latMax = -2.545; // Utara (Jayapura pusat kota)
  const lngMin = 140.698; // Barat (daratan safe)
  const lngMax = 140.708; // Timur (SEBELUM teluk - max 140.708!)

  const latitude = Math.random() * (latMax - latMin) + latMin;
  const longitude = Math.random() * (lngMax - lngMin) + lngMin;

  return {
    latitude: parseFloat(latitude.toFixed(6)),
    longitude: parseFloat(longitude.toFixed(6)),
  };
}

async function main() {
  console.log("🌱 Seeding database...");

  // Hash password for demo users
  const hashedPassword = await bcrypt.hash("password123", 12);

  // Create SUPERADMIN user - Jodyaryono
  const superadmin = await prisma.user.upsert({
    where: { email: "jodyaryono@sikeskoja.com" },
    update: {},
    create: {
      email: "jodyaryono@sikeskoja.com",
      username: "jodyaryono",
      password: hashedPassword,
      phone: "085719195627", // Jodyaryono's phone
      role: "SUPERADMIN",
      profile: {
        create: {
          fullName: "Jody Aryono (SuperAdmin)",
          phone: "085719195627",
        },
      },
    },
  });

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@sikeskoja.com" },
    update: {},
    create: {
      email: "admin@sikeskoja.com",
      username: "admin",
      password: hashedPassword,
      phone: "081234567890", // For OTP login
      role: "ADMIN",
      profile: {
        create: {
          fullName: "Administrator SiKesKoja",
          phone: "081234567890",
        },
      },
    },
  });

  // Create 20 petugas users dengan nama Papua
  const petugasNames = [
    "Yanto Kogoya",
    "Maria Wenda",
    "John Wanggai",
    "Elisabeth Yikwa",
    "David Enumbi",
    "Sarah Tekege",
    "Paul Nawipa",
    "Anna Ayomi",
    "Simon Karunggu",
    "Ruth Padang",
    "Michael Wally",
    "Dorkas Rumere",
    "Daniel Yoku",
    "Agnes Asso",
    "Peter Modouw",
    "Grace Sani",
    "Thomas Wambrauw",
    "Esther Imbiri",
    "Isaac Krey",
    "Margareth Bonay",
  ];

  const petugasList = [];
  for (let i = 0; i < petugasNames.length; i++) {
    const phone = `08123456${(7891 + i).toString()}`;
    const email = `petugas${i + 1}@sikeskoja.com`;
    const username = `petugas${i + 1}`;

    const petugas = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        username,
        password: hashedPassword,
        phone,
        role: "PETUGAS",
        profile: {
          create: {
            fullName: petugasNames[i],
            phone,
          },
        },
      },
      include: {
        profile: true,
      },
    });
    petugasList.push(petugas);
  }

  console.log("👥 Created users:", {
    superadmin: superadmin.id,
    admin: admin.id,
    totalPetugas: petugasList.length,
  });

  // Create Questionnaires KS dengan data Papua (25+ keluarga)
  console.log("📋 Creating Papua family questionnaires...");

  // Gabungkan data manual (5) + generated (20)
  const allFamilies = [...papuaFamilies, ...generateMorePapuaFamilies(20)];

  console.log(`Total keluarga akan dibuat: ${allFamilies.length}`);

  for (let i = 0; i < allFamilies.length; i++) {
    const keluarga = allFamilies[i];
    const creator = petugasList[i % petugasList.length]; // Rotate between 20 petugas

    // Update nama pengumpul data dengan nama petugas sebenarnya
    keluarga.questionnaire.namaPengumpulData =
      creator.profile?.fullName || creator.username;

    // Calculate jumlah anggota berdasarkan umur
    const anggotaData = keluarga.anggotaKeluarga.map((a: any) => {
      const umur = calculateAge(a.tanggalLahir);
      return { ...a, umur };
    });

    const jumlahAnggotaKeluarga = anggotaData.length;
    const jumlahAnggotaDewasa = anggotaData.filter(
      (a: any) => a.umur >= 16
    ).length;
    const jumlahAnggotaUsia0_15 = anggotaData.filter(
      (a: any) => a.umur >= 0 && a.umur <= 15
    ).length;
    const jumlahAnggotaUsia12_59 = anggotaData.filter(
      (a: any) => a.umur >= 12 && a.umur <= 59
    ).length;
    const jumlahAnggotaUsia10_54 = anggotaData.filter(
      (a: any) => a.umur >= 10 && a.umur <= 54
    ).length;
    const jumlahAnggotaUsia0_11 = anggotaData.filter(
      (a: any) => a.umur >= 0 && a.umur <= 11
    ).length;

    // Generate koordinat GPS untuk area Jayapura
    const coordinates = generateJayapuraCoordinates();

    const questionnaire = await prisma.questionnaire.create({
      data: {
        ...keluarga.questionnaire,
        jumlahAnggotaKeluarga,
        jumlahAnggotaDewasa,
        jumlahAnggotaUsia0_15,
        jumlahAnggotaUsia12_59,
        jumlahAnggotaUsia10_54,
        jumlahAnggotaUsia0_11,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        status: i === 0 ? "DRAFT" : i === 1 ? "IN_PROGRESS" : "COMPLETED",
        createdBy: creator.id,
        submittedAt: i >= 2 ? new Date() : null,
        anggotaKeluarga: {
          create: anggotaData.map((anggota: any, index: number) => {
            const data: any = {
              noUrut: index + 1,
              nama: anggota.nama,
              hubunganKeluarga: anggota.hubunganKeluarga,
              tanggalLahir: anggota.tanggalLahir,
              umur: anggota.umur,
              jenisKelamin: anggota.jenisKelamin,
              statusPerkawinan: anggota.statusPerkawinan,
              agama: anggota.agama,
              nik:
                anggota.nik ||
                `917101${String(Math.floor(Math.random() * 1000000)).padStart(
                  10,
                  "0"
                )}`,
            };

            // Optional fields - only add if they exist
            if (anggota.pendidikan) data.pendidikan = anggota.pendidikan;
            if (anggota.pekerjaan) data.pekerjaan = anggota.pekerjaan;
            if ("sedangHamil" in anggota)
              data.sedangHamil = anggota.sedangHamil;

            return data;
          }),
        },
      },
      include: {
        anggotaKeluarga: true,
      },
    });

    console.log(
      `✅ Questionnaire ${i + 1}/${allFamilies.length}: ${
        keluarga.questionnaire.namaKepalaKeluarga
      } (${questionnaire.anggotaKeluarga.length} anggota) - Pengisi: ${
        creator.profile?.fullName
      }`
    );
  }

  console.log("✅ Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  const totalUsers = await prisma.user.count();
  const totalQuestionnaires = await prisma.questionnaire.count();
  const totalAnggota = await prisma.anggotaKeluarga.count();
  console.log(`  👥 Total Users: ${totalUsers}`);
  console.log(`  📋 Total Questionnaires: ${totalQuestionnaires}`);
  console.log(`  👨‍👩‍👧‍👦 Total Anggota Keluarga: ${totalAnggota}`);

  console.log("\n🔐 Demo credentials:");
  console.log(
    "SuperAdmin: jodyaryono@sikeskoja.com / 085719195627 / password123"
  );
  console.log("Admin: admin@sikeskoja.com / 081234567890 / password123");
  console.log("Petugas1: petugas1@sikeskoja.com / 081234567891 / password123");
  console.log("Petugas2: petugas2@sikeskoja.com / 081234567892 / password123");
}

main()
  .catch((e) => {
    console.error(" Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
