const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

(async () => {
    try {
        // Check if phone exists
        const existing = await prisma.user.findUnique({
            where: { phone: "081222475475" },
            include: { profile: true },
        });

        if (existing) {
            console.log(
                "✅ User sudah ada:",
                existing.username,
                "-",
                existing.profile?.fullName
            );
            console.log("🔄 Update ke role ADMIN...");
            await prisma.user.update({
                where: { id: existing.id },
                data: { role: "ADMIN" },
            });
            console.log("✅ Berhasil update ke ADMIN!");
            await prisma.$disconnect();
            process.exit(0);
        }

        // Create new admin
        console.log("📝 Membuat user baru...");
        const hashedPassword = await bcrypt.hash("Admin@2025", 12);
        const user = await prisma.user.create({
            data: {
                phone: "081222475475",
                email: "suaibhalim@gmail.com",
                username: "suaibhalim",
                password: hashedPassword,
                role: "ADMIN",
                profile: {
                    create: {
                        fullName: "Suaib Halim",
                    },
                },
            },
            include: { profile: true },
        });
        console.log(
            "✅ Admin berhasil ditambahkan:",
            user.username,
            "-",
            user.profile.fullName
        );
        await prisma.$disconnect();
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        await prisma.$disconnect();
        process.exit(1);
    }
})();
