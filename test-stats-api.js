const axios = require('axios');

async function testStatsAPI() {
    try {
        // Get token from a test login first
        console.log('🔐 Logging in as SuperAdmin...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/verify-otp', {
            phoneNumber: '085719195627',
            otp: '123456' // Default OTP for testing
        });

        if (!loginResponse.data.success) {
            console.log('❌ Login failed, trying with password...');
            // If OTP login fails, the seed created users with password
            // We'll just use a direct token fetch
            const token = loginResponse.data.token || 'test';
            console.log('Token:', token);
        }

        const token = loginResponse.data.token;
        console.log('✅ Logged in successfully\n');

        // Test stats endpoint
        console.log('📊 Fetching stats from API...');
        const statsResponse = await axios.get('http://localhost:5000/api/questionnaires-ks/stats', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('\n📈 API Response:');
        console.log('==================');
        console.log(JSON.stringify(statsResponse.data, null, 2));
        console.log('==================\n');

    } catch (error) {
        if (error.response) {
            console.error('❌ API Error:', error.response.status);
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('❌ Error:', error.message);
        }
    }
}

testStatsAPI();
