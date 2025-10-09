# 📧 Resend API Key Setup & Verification Guide

## **How to Get the Correct Resend API Key**

### **Step 1: Access Resend Dashboard**
1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Sign in to your account
3. Navigate to **API Keys** section

### **Step 2: Create a New API Key**
1. Click **"Create API Key"**
2. Give it a descriptive name (e.g., "Infra24 Production", "Infra24 Development")
3. Select the appropriate permissions:
   - **Full Access**: For production use
   - **Sending Only**: For basic email sending
   - **Read Only**: For testing/verification
4. Click **"Create"**
5. **Copy the key immediately** (you won't be able to see it again)

### **Step 3: Verify the Key Format**
A valid Resend API key should:
- Start with `re_`
- Be approximately 40-50 characters long
- Contain letters, numbers, and underscores
- Example: `re_1234567890abcdef_1234567890abcdef`

## **How to Verify Your API Key is Working**

### **Method 1: Use the Verification Script**
```bash
# Set your API key
export RESEND_API_KEY=your_key_here

# Run the verification script
node scripts/verify-resend-key.js
```

### **Method 2: Manual Verification**
```bash
# Test with curl
curl -X GET "https://api.resend.com/domains" \
  -H "Authorization: Bearer your_key_here" \
  -H "Content-Type: application/json"
```

### **Method 3: Test in Your Application**
```javascript
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Test the connection
resend.domains.list()
  .then(response => {
    if (response.error) {
      console.log('❌ API key error:', response.error.message);
    } else {
      console.log('✅ API key working:', response.data);
    }
  })
  .catch(error => {
    console.log('❌ Connection error:', error.message);
  });
```

## **Environment Setup**

### **Local Development**
```bash
# Create .env.local file
echo "RESEND_API_KEY=your_key_here" >> .env.local

# Add to .gitignore
echo ".env.local" >> .gitignore
```

### **Production (Vercel)**
```bash
# Add to Vercel environment variables
vercel env add RESEND_API_KEY production --sensitive

# When prompted, enter your API key
```

### **Other Platforms**
- **Netlify**: Site settings > Environment variables
- **Railway**: Project variables
- **Docker**: Update docker-compose.yml

## **Common Issues & Solutions**

### **Issue 1: "Invalid API Key"**
**Solution:**
- Check if the key is copied correctly
- Verify the key is active in Resend dashboard
- Ensure no extra spaces or characters

### **Issue 2: "Insufficient Permissions"**
**Solution:**
- Check the key permissions in Resend dashboard
- Create a new key with full access if needed

### **Issue 3: "Rate Limit Exceeded"**
**Solution:**
- Check your Resend plan limits
- Upgrade your plan if needed
- Implement rate limiting in your code

### **Issue 4: "Domain Not Verified"**
**Solution:**
- Verify your sending domain in Resend dashboard
- Add DNS records as required
- Use a verified domain for sending

## **Security Best Practices**

### **1. Never Commit API Keys**
```gitignore
# Add to .gitignore
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.key
secrets/
```

### **2. Use Environment Variables**
```javascript
// ✅ Good
const resend = new Resend(process.env.RESEND_API_KEY);

// ❌ Bad
const resend = new Resend('re_1234567890abcdef_1234567890abcdef');
```

### **3. Different Keys for Different Environments**
- **Development**: Use a test key with limited permissions
- **Staging**: Use a staging key
- **Production**: Use a production key with full permissions

### **4. Rotate Keys Regularly**
- Generate new keys every 90 days
- Revoke old keys immediately
- Update all environments with new keys

## **Testing Your Setup**

### **1. Run the Verification Script**
```bash
node scripts/verify-resend-key.js
```

### **2. Test Email Sending**
```javascript
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    const response = await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: ['test@example.com'],
      subject: 'Test Email',
      html: '<p>This is a test email from Infra24!</p>',
    });
    
    console.log('✅ Email sent successfully:', response.data);
  } catch (error) {
    console.log('❌ Email failed:', error.message);
  }
}

testEmail();
```

### **3. Check Resend Dashboard**
- Monitor email delivery
- Check bounce rates
- Review API usage

## **Troubleshooting Checklist**

- [ ] API key is set in environment variables
- [ ] Key format is correct (starts with `re_`)
- [ ] Key has appropriate permissions
- [ ] Domain is verified in Resend dashboard
- [ ] No rate limits exceeded
- [ ] Environment variables are loaded correctly
- [ ] API key is not expired or revoked

## **Support Resources**

- **Resend Documentation**: https://resend.com/docs
- **Resend Support**: https://resend.com/contact
- **API Reference**: https://resend.com/docs/api-reference

---

**Remember**: Always keep your API keys secure and never commit them to version control!
