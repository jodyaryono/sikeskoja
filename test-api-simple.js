const axios = require('axios');

async function testAPI() {
    try {
        console.log('🔐 Testing OTP Request...');

        // Request OTP
        const otpRequest = await axios.post('http://localhost:5000/api/auth/otp/request', {
            phone: '085719195627'
        });

        console.log('✅ OTP Request Response:', otpRequest.data);

        if (!otpRequest.data.success) {
            console.error('❌ OTP request failed');
            return;
        }

        console.log('\n🔐 Testing OTP Verify with default OTP 123456...');

        // Verify OTP dengan default testing OTP
        const loginResponse = await axios.post('http://localhost:5000/api/auth/otp/verify', {
            phone: '085719195627',
            otp: '123456'
        });

        console.log('✅ Login Response:', loginResponse.data);

        if (loginResponse.data.success && loginResponse.data.token) {
            const token = loginResponse.data.token;
            console.log('\n🔑 Token:', token.substring(0, 50) + '...');

            // Test stats API
            console.log('\n📊 Testing Stats API...');
            const statsResponse = await axios.get('http://localhost:5000/api/questionnaires-ks/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('✅ Stats Response:', JSON.stringify(statsResponse.data, null, 2));

            // Test questionnaires list API
            console.log('\n📋 Testing Questionnaires List API...');
            const listResponse = await axios.get('http://localhost:5000/api/questionnaires-ks', {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('✅ List Response:');
            console.log('Total:', listResponse.data.data?.length || 0);
            if (listResponse.data.data && listResponse.data.data.length > 0) {
                console.log('First item:', JSON.stringify(listResponse.data.data[0], null, 2));
            }
        } else {
            console.log('❌ Login failed');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
            console.error('Status:', error.response.status);
        }
    }
}

testAPI();
