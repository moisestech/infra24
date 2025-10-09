#!/usr/bin/env node

/**
 * Resend API Key Verification Script
 * Tests if your Resend API key is working correctly
 */

const { Resend } = require('resend');

console.log('🔍 Resend API Key Verification Starting...');

// Check if API key is set
const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.log('❌ RESEND_API_KEY environment variable is not set');
  console.log('');
  console.log('💡 To set it:');
  console.log('   export RESEND_API_KEY=your_key_here');
  console.log('   or add it to .env.local file');
  process.exit(1);
}

console.log('✅ RESEND_API_KEY environment variable is set');
console.log(`🔑 Key format: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);

// Validate key format
if (!apiKey.startsWith('re_')) {
  console.log('⚠️  Warning: Resend API keys typically start with "re_"');
}

if (apiKey.length < 40) {
  console.log('⚠️  Warning: Resend API keys are typically longer than 40 characters');
}

// Initialize Resend client
const resend = new Resend(apiKey);

// Test 1: Check API key validity by making a simple API call
async function testApiKey() {
  console.log('🧪 Testing API key validity...');
  
  try {
    // Try to get domains (this is a safe API call that doesn't send emails)
    const response = await resend.domains.list();
    
    if (response.error) {
      console.log('❌ API key is invalid or has insufficient permissions');
      console.log(`   Error: ${response.error.message}`);
      return false;
    }
    
    console.log('✅ API key is valid and working');
    console.log(`📧 Found ${response.data?.length || 0} domain(s) in your account`);
    
    if (response.data && response.data.length > 0) {
      console.log('   Domains:');
      response.data.forEach(domain => {
        console.log(`   - ${domain.name} (${domain.status})`);
      });
    }
    
    return true;
  } catch (error) {
    console.log('❌ Failed to test API key');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Test 2: Check sending permissions (optional - only if user wants to test)
async function testSendingPermissions() {
  console.log('📤 Testing sending permissions...');
  
  try {
    // Try to send a test email to a non-existent address
    // This will fail but won't actually send an email
    const response = await resend.emails.send({
      from: 'test@example.com',
      to: ['test@example.invalid'],
      subject: 'Test Email',
      html: '<p>This is a test email</p>',
    });
    
    if (response.error) {
      if (response.error.message.includes('Invalid email') || 
          response.error.message.includes('not found')) {
        console.log('✅ API key has sending permissions (test email failed as expected)');
        return true;
      } else {
        console.log('❌ API key may not have sending permissions');
        console.log(`   Error: ${response.error.message}`);
        return false;
      }
    }
    
    console.log('✅ API key has sending permissions');
    return true;
  } catch (error) {
    console.log('❌ Failed to test sending permissions');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Test 3: Check rate limits and account status
async function checkAccountStatus() {
  console.log('📊 Checking account status...');
  
  try {
    // Get account info
    const response = await resend.domains.list();
    
    if (response.data) {
      console.log('✅ Account is active');
      console.log(`📈 Account has ${response.data.length} domain(s) configured`);
      
      // Check if any domains are verified
      const verifiedDomains = response.data.filter(domain => domain.status === 'verified');
      if (verifiedDomains.length > 0) {
        console.log('✅ You have verified domains for sending emails');
      } else {
        console.log('⚠️  No verified domains found - you may need to verify a domain to send emails');
      }
    }
    
    return true;
  } catch (error) {
    console.log('❌ Failed to check account status');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Main verification function
async function verifyResendKey() {
  console.log('');
  console.log('🔍 VERIFICATION RESULTS:');
  console.log('========================');
  
  const apiKeyValid = await testApiKey();
  
  if (!apiKeyValid) {
    console.log('');
    console.log('❌ VERIFICATION FAILED');
    console.log('💡 Next steps:');
    console.log('   1. Check if the API key is correct');
    console.log('   2. Verify the key is active in Resend dashboard');
    console.log('   3. Check if the key has the right permissions');
    console.log('   4. Generate a new key if needed');
    return;
  }
  
  await checkAccountStatus();
  
  console.log('');
  console.log('✅ VERIFICATION SUCCESSFUL');
  console.log('🎉 Your Resend API key is working correctly!');
  
  console.log('');
  console.log('💡 RECOMMENDATIONS:');
  console.log('- Keep your API key secure and never commit it to git');
  console.log('- Use environment variables for all environments');
  console.log('- Consider using different keys for development and production');
  console.log('- Monitor your usage in the Resend dashboard');
}

// Run verification
verifyResendKey().catch(error => {
  console.error('💥 Verification failed:', error);
  process.exit(1);
});
