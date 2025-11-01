const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkOTP() {
    try {
        // Get latest OTP session
        const otpSession = await prisma.oTPSession.findFirst({
            where: {
                phone: '085719195627',
                isVerified: false
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (otpSession) {
            console.log('\n📱 Latest OTP Session:');
            console.log('Phone:', otpSession.phone);
            console.log('OTP Code:', otpSession.otpCode);
            console.log('Expires At:', otpSession.expiresAt);
            console.log('Created At:', otpSession.createdAt);
            console.log('Is Expired:', new Date() > otpSession.expiresAt);
        } else {
            console.log('❌ No OTP session found');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkOTP();
