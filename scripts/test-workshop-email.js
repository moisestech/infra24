const { sendWorkshopRegistrationEmail } = require('../lib/email/workshop-emails')

async function testWorkshopEmail() {
  try {
    console.log('📧 Testing workshop registration email...')

    const emailData = {
      to: 'test@example.com', // Replace with your email for testing
      workshopTitle: 'AI Art Creation Workshop',
      organizationName: 'Oolite Arts',
      participantName: 'Test User',
      workshopDate: 'March 15, 2024',
      workshopTime: '2:00 PM - 5:00 PM',
      workshopLocation: 'Digital Lab - AI Art Fundamentals',
      instructorName: 'AI Art Specialist',
      workshopDescription: 'Learn to create stunning digital art using AI tools and techniques. Perfect for beginners and experienced artists alike.',
      maxParticipants: 12,
      currentParticipants: 8,
      language: 'en',
      registrationId: 'REG-12345-ABC',
      workshopId: 'workshop-123',
      organizationSlug: 'oolite'
    }

    const result = await sendWorkshopRegistrationEmail(emailData)

    if (result.success) {
      console.log('✅ Workshop registration email sent successfully!')
      console.log('📧 Message ID:', result.messageId)
      console.log('📬 Check your email inbox for the confirmation')
    } else {
      console.error('❌ Failed to send email:', result.error)
    }

  } catch (error) {
    console.error('❌ Error testing workshop email:', error)
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testWorkshopEmail()
}

module.exports = { testWorkshopEmail }
