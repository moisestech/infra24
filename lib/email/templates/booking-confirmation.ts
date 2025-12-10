/**
 * Booking Confirmation Email Template
 */

export interface BookingConfirmationData {
  artistName: string
  artistEmail: string
  hostName: string
  hostEmail: string
  resourceTitle: string
  startTime: Date
  endTime: Date
  location: string
  meetingUrl?: string
  meetingCode?: string
  organizationName: string
  rescheduleUrl: string
  cancelUrl: string
  icsUrl: string
  calendarUrls: {
    google: string
    outlook: string
  }
}

export function generateBookingConfirmationHTML(data: BookingConfirmationData): string {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  const duration = Math.round((data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60))

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation - ${data.resourceTitle}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 10px;
        }
        .title {
            font-size: 28px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #6c757d;
            font-size: 16px;
        }
        .booking-details {
            background: #f8f9fa;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #495057;
        }
        .detail-value {
            color: #212529;
        }
        .meeting-link {
            background: #e3f2fd;
            border: 1px solid #2196f3;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
        }
        .meeting-link a {
            color: #1976d2;
            text-decoration: none;
            font-weight: 600;
            font-size: 18px;
        }
        .meeting-link a:hover {
            text-decoration: underline;
        }
        .calendar-section {
            margin: 30px 0;
        }
        .calendar-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 15px;
        }
        .calendar-btn {
            display: inline-block;
            padding: 12px 20px;
            background: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            transition: background-color 0.2s;
        }
        .calendar-btn:hover {
            background: #0056b3;
            color: white;
        }
        .calendar-btn.outlook {
            background: #0078d4;
        }
        .calendar-btn.outlook:hover {
            background: #106ebe;
        }
        .actions {
            margin: 30px 0;
            text-align: center;
        }
        .action-btn {
            display: inline-block;
            padding: 12px 24px;
            margin: 0 10px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.2s;
        }
        .reschedule-btn {
            background: #28a745;
            color: white;
        }
        .reschedule-btn:hover {
            background: #218838;
            color: white;
        }
        .cancel-btn {
            background: #dc3545;
            color: white;
        }
        .cancel-btn:hover {
            background: #c82333;
            color: white;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }
        .footer a {
            color: #007bff;
            text-decoration: none;
        }
        @media (max-width: 600px) {
            .calendar-buttons {
                flex-direction: column;
            }
            .calendar-btn {
                text-align: center;
            }
            .actions {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .action-btn {
                margin: 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">${data.organizationName}</div>
            <div class="title">Booking Confirmed!</div>
            <div class="subtitle">Your consultation has been scheduled</div>
        </div>

        <div class="booking-details">
            <div class="detail-row">
                <span class="detail-label">Service:</span>
                <span class="detail-value">${data.resourceTitle}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${formatDate(data.startTime)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${formatTime(data.startTime)} - ${formatTime(data.endTime)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">${duration} minutes</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Host:</span>
                <span class="detail-value">${data.hostName}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Location:</span>
                <span class="detail-value">${data.location}</span>
            </div>
        </div>

        ${data.meetingUrl ? `
        <div class="meeting-link">
            <strong>Join Meeting:</strong><br>
            <a href="${data.meetingUrl}" target="_blank">${data.meetingUrl}</a>
            ${data.meetingCode ? `<br><small>Meeting Code: ${data.meetingCode}</small>` : ''}
        </div>
        ` : ''}

        <div class="calendar-section">
            <h3>Add to Calendar</h3>
            <p>Add this booking to your calendar to receive reminders:</p>
            <div class="calendar-buttons">
                <a href="${data.calendarUrls.google}" class="calendar-btn" target="_blank">Google Calendar</a>
                <a href="${data.calendarUrls.outlook}" class="calendar-btn outlook" target="_blank">Outlook</a>
                <a href="${data.icsUrl}" class="calendar-btn" download>Download ICS</a>
            </div>
        </div>

        <div class="actions">
            <a href="${data.rescheduleUrl}" class="action-btn reschedule-btn">Reschedule</a>
            <a href="${data.cancelUrl}" class="action-btn cancel-btn">Cancel</a>
        </div>

        <div class="footer">
            <p>This booking was created through ${data.organizationName}'s booking system.</p>
            <p>If you have any questions, please contact us at <a href="mailto:${data.hostEmail}">${data.hostEmail}</a></p>
            <p><small>You can reschedule or cancel this booking using the links above.</small></p>
        </div>
    </div>
</body>
</html>
  `.trim()
}

export function generateBookingConfirmationText(data: BookingConfirmationData): string {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  const duration = Math.round((data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60))

  return `
BOOKING CONFIRMATION - ${data.resourceTitle}

Hello ${data.artistName},

Your consultation has been successfully scheduled!

BOOKING DETAILS:
- Service: ${data.resourceTitle}
- Date: ${formatDate(data.startTime)}
- Time: ${formatTime(data.startTime)} - ${formatTime(data.endTime)}
- Duration: ${duration} minutes
- Host: ${data.hostName}
- Location: ${data.location}

${data.meetingUrl ? `MEETING LINK: ${data.meetingUrl}${data.meetingCode ? `\nMeeting Code: ${data.meetingCode}` : ''}` : ''}

CALENDAR LINKS:
- Google Calendar: ${data.calendarUrls.google}
- Outlook: ${data.calendarUrls.outlook}
- Download ICS: ${data.icsUrl}

MANAGE YOUR BOOKING:
- Reschedule: ${data.rescheduleUrl}
- Cancel: ${data.cancelUrl}

If you have any questions, please contact ${data.hostEmail}.

Best regards,
${data.organizationName} Team
  `.trim()
}

















