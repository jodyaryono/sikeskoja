const axios = require('axios');

async function fullTest() {
    try {
        console.log('🔐 Step 1: Request OTP...');
        const otpRequest = await axios.post('http://localhost:5000/api/auth/otp/request', {
            phone: '085719195627'
        });
        console.log('✅ OTP sent');

        console.log('\n🔐 Step 2: Verify OTP with 123456...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/otp/verify', {
            phone: '085719195627',
            otpCode: '123456'
        });

        if (!loginResponse.data.success) {
            console.error('❌ Login failed:', loginResponse.data);
            return;
        }

        const token = loginResponse.data.data.token;
        const user = loginResponse.data.data.user;

        console.log('✅ Login successful');
        console.log('User:', user.username, '-', user.profile?.fullName);
        console.log('Token:', token.substring(0, 50) + '...');

        console.log('\n📊 Step 3: Test Stats API...');
        const statsResponse = await axios.get('http://localhost:5000/api/questionnaires-ks/stats', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('✅ Stats Response:');
        console.log(JSON.stringify(statsResponse.data, null, 2));

        console.log('\n📋 Step 4: Test Questionnaires List API...');
        const listResponse = await axios.get('http://localhost:5000/api/questionnaires-ks', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('✅ Questionnaires List:');
        console.log('Total:', listResponse.data.data?.length || 0);
        if (listResponse.data.data && listResponse.data.data.length > 0) {
            listResponse.data.data.forEach((q, i) => {
                console.log(`${i + 1}. ${q.namaKepalaKeluarga} - ${q.kecamatan}, ${q.kelurahan} (${q.status})`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
            console.error('Status:', error.response.status);
        }
    }
}

fullTest();
