export function formatDate(dateString: string): string {
  try {
    let date: Date;
    
    if (dateString.includes('-')) {
      // Handle ISO format (2024-10-08)
      const [year, month, day] = dateString.split('-');
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      // Handle long format (October 8, 2024)
      date = new Date(dateString);
    }

    // Get month abbreviation (first 3 letters)
    const month = date.toLocaleString('en-US', { month: 'short' });
    // Get day of month
    const day = date.getDate();

    return `${month} ${day}`;
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return dateString; // Return original string if parsing fails
  }
}

export function getDateStatus(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();
  
  // Reset time portion for accurate date comparison
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  
  const isPast = date < today;
  const isToday = date.getTime() === today.getTime();
  const isFuture = date > today;

  return {
    type: isToday ? 'today' : isPast ? 'past' : 'future',
    isPast,
    isToday,
    isFuture
  };
} 