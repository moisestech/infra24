# 🚨 Security Incident Response: Exposed Resend API Key

## **CRITICAL: Immediate Actions Required**

GitGuardian has detected a Resend API key exposed in your GitHub repository. This is a **HIGH SEVERITY** security incident that requires immediate action.

### **Step 1: Revoke the Exposed Key (IMMEDIATE - DO THIS NOW)**

1. **Go to Resend Dashboard**: https://resend.com/api-keys
2. **Find the exposed key** (GitGuardian detected it on October 8th, 2025)
3. **DELETE/REVOKE the key immediately**
4. **This prevents unauthorized access to your email service**

### **Step 2: Identify the Source of the Leak**

Run the security audit script:
```bash
node scripts/security-audit.js
```

This will scan your codebase for any exposed secrets.

### **Step 3: Check Git History**

Since GitGuardian detected this on October 8th, 2025, check your recent commits:

```bash
# Check recent commits
git log --oneline -10

# Look for environment files in recent commits
git log --name-only --since="2024-10-01" | grep -E "\.(env|config)"

# Search for the specific key pattern in git history
git log -p --all | grep -E "re_[a-zA-Z0-9_-]{40,}"
```

### **Step 4: Remove the Key from Git History**

If the key was committed to git history, you need to remove it:

#### **Option A: If it's in a recent commit (recommended)**
```bash
# Remove the file containing the key
git rm .env
git commit -m "Remove .env file containing exposed API key"
git push origin main
```

#### **Option B: If it's in git history (advanced)**
```bash
# Use git filter-branch to remove from history
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env' \
  --prune-empty --tag-name-filter cat -- --all

# Force push to update remote
git push origin --force --all
```

### **Step 5: Generate New API Key**

1. **Go to Resend Dashboard**: https://resend.com/api-keys
2. **Create a new API key**
3. **Copy the new key securely**
4. **Give it a descriptive name** (e.g., "Infra24 Production - Generated after security incident")

### **Step 6: Update Environment Variables**

#### **Local Development**
```bash
# Create .env.local file
echo "RESEND_API_KEY=your_new_key_here" >> .env.local

# Add to .gitignore if not already there
echo ".env.local" >> .gitignore
echo ".env" >> .gitignore
```

#### **Production (Vercel)**
```bash
# Add new key to Vercel
vercel env add RESEND_API_KEY production --sensitive

# When prompted, enter your new API key
```

#### **Other Deployment Platforms**
- **Netlify**: Add to site settings > environment variables
- **Railway**: Add to project variables
- **Docker**: Update docker-compose.yml or Dockerfile

### **Step 7: Verify the Fix**

1. **Test email functionality** with the new key
2. **Run the security audit again**: `node scripts/security-audit.js`
3. **Check that no secrets are exposed**

### **Step 8: Prevent Future Incidents**

#### **Add to .gitignore**
```gitignore
# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# API keys and secrets
*.key
*.pem
secrets/
```

#### **Use Environment Variables**
- Never commit API keys to git
- Use environment variables for all secrets
- Use a secrets management service for production

#### **Regular Security Audits**
```bash
# Run security audit regularly
node scripts/security-audit.js

# Use tools like GitGuardian or GitHub's secret scanning
```

## **Post-Incident Actions**

### **1. Monitor for Unauthorized Usage**
- Check Resend dashboard for unusual activity
- Monitor email sending patterns
- Set up alerts for unusual API usage

### **2. Update Team**
- Inform team members about the incident
- Review security practices
- Update documentation

### **3. Document the Incident**
- Record what happened
- Document the response steps taken
- Update security procedures

## **Prevention Checklist**

- [ ] All API keys are in environment variables
- [ ] .env files are in .gitignore
- [ ] No secrets in code comments
- [ ] Regular security audits scheduled
- [ ] Team trained on secret management
- [ ] Secrets management service in use (optional)

## **Emergency Contacts**

- **Resend Support**: https://resend.com/contact
- **GitHub Support**: https://support.github.com
- **Vercel Support**: https://vercel.com/help

---

**Remember**: This is a critical security incident. Act quickly to revoke the exposed key and prevent unauthorized access to your email service.
