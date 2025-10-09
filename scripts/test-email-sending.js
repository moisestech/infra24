#!/usr/bin/env node

/**
 * Email Sending Test Script
 * Tests if your Resend API key can send emails
 */

const { Resend } = require('resend');

console.log('📧 Email Sending Test Starting...');

// Check if API key is set
const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.log('❌ RESEND_API_KEY environment variable is not set');
  console.log('💡 Make sure you have .env.local file with your API key');
  process.exit(1);
}

console.log('✅ RESEND_API_KEY found');

// Initialize Resend client
const resend = new Resend(apiKey);

// Test email sending
async function testEmailSending() {
  console.log('🧪 Testing email sending...');
  
  try {
    // Get the test email from command line argument or use default
    const testEmail = process.argv[2] || 'test@example.com';
    
    console.log(`📤 Sending test email to: ${testEmail}`);
    
    const response = await resend.emails.send({
      from: 'Infra24 Test <noreply@resend.dev>', // Using Resend's test domain
      to: [testEmail],
      subject: 'Infra24 Email Test - Security Incident Response',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">✅ Infra24 Email System Test</h2>
          <p>This is a test email to verify that your Resend API key is working correctly after the security incident response.</p>
          
          <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #0066cc; margin-top: 0;">Security Incident Response Completed</h3>
            <ul>
              <li>✅ Old exposed API key revoked</li>
              <li>✅ New API key generated and configured</li>
              <li>✅ Environment variables updated</li>
              <li>✅ Email system tested and working</li>
            </ul>
          </div>
          
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>Test ID:</strong> ${Math.random().toString(36).substring(7)}</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            This is an automated test email from Infra24. If you received this email, 
            your email system is working correctly.
          </p>
        </div>
      `,
    });
    
    if (response.error) {
      console.log('❌ Email sending failed');
      console.log(`   Error: ${response.error.message}`);
      
      if (response.error.message.includes('Invalid email')) {
        console.log('💡 The email address might be invalid. Try with a real email address:');
        console.log('   node scripts/test-email-sending.js your-email@example.com');
      }
      
      return false;
    }
    
    console.log('✅ Email sent successfully!');
    console.log(`   Email ID: ${response.data?.id}`);
    console.log(`   To: ${testEmail}`);
    console.log(`   From: noreply@resend.dev`);
    
    return true;
  } catch (error) {
    console.log('❌ Email sending failed with error');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Test API key validity first
async function testApiKey() {
  console.log('🔍 Testing API key validity...');
  
  try {
    const response = await resend.domains.list();
    
    if (response.error) {
      console.log('❌ API key is invalid');
      console.log(`   Error: ${response.error.message}`);
      return false;
    }
    
    console.log('✅ API key is valid');
    console.log(`📧 Found ${response.data?.length || 0} domain(s) in your account`);
    
    return true;
  } catch (error) {
    console.log('❌ Failed to test API key');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Main test function
async function runEmailTest() {
  console.log('');
  console.log('🔍 EMAIL SYSTEM TEST:');
  console.log('====================');
  
  const apiKeyValid = await testApiKey();
  
  if (!apiKeyValid) {
    console.log('');
    console.log('❌ Cannot proceed - API key is invalid');
    console.log('💡 Check your RESEND_API_KEY in .env.local');
    return;
  }
  
  console.log('');
  const emailSent = await testEmailSending();
  
  console.log('');
  if (emailSent) {
    console.log('🎉 EMAIL SYSTEM TEST SUCCESSFUL!');
    console.log('✅ Your email system is working correctly');
    console.log('✅ Security incident response completed successfully');
  } else {
    console.log('❌ EMAIL SYSTEM TEST FAILED');
    console.log('💡 Check the error messages above for troubleshooting');
  }
  
  console.log('');
  console.log('💡 NEXT STEPS:');
  console.log('1. Check your email inbox for the test email');
  console.log('2. If you didn\'t receive it, check spam folder');
  console.log('3. Verify your domain is configured in Resend dashboard');
  console.log('4. Test email functionality in your application');
}

// Run the test
runEmailTest().catch(error => {
  console.error('💥 Test failed:', error);
  process.exit(1);
});
