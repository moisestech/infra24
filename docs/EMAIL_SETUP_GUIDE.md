# Email Service Setup Guide

## 📧 Resend API Configuration

### 1. Get Resend API Key
1. Sign up at [resend.com](https://resend.com)
2. Create a new API key in your dashboard
3. Copy the API key

### 2. Environment Variables
Add the following to your `.env.local` file:

```bash
# Resend Email Service
RESEND_API_KEY=re_your_api_key_here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Domain Configuration (Production)
For production, you'll need to:
1. Add your domain to Resend
2. Configure DNS records for email authentication
3. Update the `from` address in email templates

## 🎨 Email Templates

### Available Templates
- **Booking Confirmation**: Sent to artist when booking is created
- **Host Notification**: Sent to host when new booking is created
- **Booking Reminder**: 24-hour and 1-hour reminders
- **Booking Rescheduled**: When booking time is changed
- **Booking Cancelled**: When booking is cancelled

### Template Customization
Templates are located in `lib/email/templates/`:
- `booking-confirmation.ts` - Main confirmation template
- Additional templates can be added as needed

## 🧪 Testing Email Service

### Development Testing
1. Set `RESEND_API_KEY` in `.env.local`
2. Create a test booking
3. Check server logs for email sending results
4. Verify emails are received

### Email Validation
The service includes:
- Email format validation
- Organization domain checking
- Error handling and logging

## 📊 Email Analytics

### Tracking
- Email delivery status
- Open rates (if enabled)
- Click tracking (if enabled)
- Error logging

### Monitoring
Check server logs for:
- Email sending success/failure
- API errors
- Delivery issues

## 🔧 Troubleshooting

### Common Issues
1. **API Key Not Set**: Check `RESEND_API_KEY` in environment
2. **Domain Not Verified**: Verify domain in Resend dashboard
3. **Rate Limits**: Check Resend usage limits
4. **Email Format**: Ensure valid email addresses

### Debug Mode
Enable debug logging by checking server console for:
- Email sending attempts
- API responses
- Error messages

## 🚀 Production Deployment

### Requirements
1. Verified domain in Resend
2. Proper DNS configuration
3. SSL certificate
4. Environment variables set

### Best Practices
- Use dedicated email domain
- Monitor delivery rates
- Set up email monitoring
- Implement retry logic for failed sends















