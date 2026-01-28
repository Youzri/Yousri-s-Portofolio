
/*
  ========================================
  Google Calendar Booking System
  ========================================
*/

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the booking system
  initBookingSystem();
});

// Your Google Calendar API credentials - in a real application, these should be secured
// For demo purposes only - you would need to create a proper Google Cloud project 
// and use OAuth for secure authentication
const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key when deploying
const CALENDAR_ID = 'primary'; // Replace with your calendar ID
const CLIENT_ID = 'YOUR_CLIENT_ID'; // Replace with your client ID
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

// Global variables
let selectedDate = null;
let selectedTime = null;
let availableTimeSlots = [];
let authInstance = null;

// Initialize the booking system
function initBookingSystem() {
  // Load the Google API client
  loadCalendarAPI();
  
  // Initialize the calendar component
  initCalendar();
  
  // Hide booking form initially
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.style.display = 'none';
  }
  
  // Initialize the booking form
  initBookingForm();
}

// Load Google Calendar API
function loadCalendarAPI() {
  // In a production environment, you would load the Google API client with your credentials
  console.log('Google Calendar API would be loaded here in a production environment');
  
  // For demonstration, we'll proceed without actually connecting to Google
  // In a real implementation, you would use something like:
  /*
  gapi.load('client:auth2', () => {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: SCOPES
    }).then(() => {
      authInstance = gapi.auth2.getAuthInstance();
      // Check if user is already signed in
      if (authInstance.isSignedIn.get()) {
        // User is signed in, you can proceed to fetch available slots
      } else {
        // User is not signed in, you might want to show a sign-in button
      }
    });
  });
  */
}

// Initialize the calendar UI
function initCalendar() {
  const calendarGrid = document.getElementById('calendarGrid');
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');
  const currentMonthElement = document.getElementById('currentMonth');
  const timeSlots = document.getElementById('timeSlots');
  
  if (!calendarGrid || !prevMonthBtn || !nextMonthBtn || !currentMonthElement || !timeSlots) return;
  
  // Hide time slots initially
  timeSlots.style.display = 'none';
  
  // Set initial date to today
  let currentDate = new Date();
  
  // Render the calendar for the current month
  renderCalendar(currentDate);
  
  // Event listeners for month navigation
  prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });
  
  nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });
  
  // Function to render the calendar
  function renderCalendar(date) {
    // Clear previous calendar
    calendarGrid.innerHTML = '';
    
    // Update the month display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December'];
    currentMonthElement.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    
    // Add day of week headers
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
      const dayElement = document.createElement('div');
      dayElement.className = 'day-of-week';
      dayElement.textContent = day;
      calendarGrid.appendChild(dayElement);
    });
    
    // Get the first day of the month
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    // Get the last day of the month
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    
    // Get the current date for highlighting today
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'calendar-day inactive';
      calendarGrid.appendChild(emptyCell);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= lastDayOfMonth; day++) {
      const dayCell = document.createElement('div');
      dayCell.className = 'calendar-day';
      dayCell.textContent = day;
      
      // Check if this day is today
      if (day === currentDay && date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        dayCell.classList.add('today');
      }
      
      // Check if this day is before today (past days are not selectable)
      const checkDate = new Date(date.getFullYear(), date.getMonth(), day);
      if (checkDate < new Date(currentYear, currentMonth, currentDay)) {
        dayCell.classList.add('inactive');
      } else {
        // Add click event for selecting a date
        dayCell.addEventListener('click', () => {
          // Remove selected class from all days
          document.querySelectorAll('.calendar-day').forEach(cell => {
            cell.classList.remove('selected');
          });
          
          // Add selected class to clicked day
          dayCell.classList.add('selected');
          
          // Update selected date
          selectedDate = new Date(date.getFullYear(), date.getMonth(), day);
          
          // Update the displayed selected date
          const selectedDateElement = document.getElementById('selectedDate');
          if (selectedDateElement) {
            selectedDateElement.textContent = selectedDate.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            });
          }
          
          // Show time slots
          timeSlots.style.display = 'block';
          
          // Fetch and render available time slots
          fetchAvailableTimeSlots(selectedDate);
        });
      }
      
      calendarGrid.appendChild(dayCell);
    }
  }
}

// Fetch available time slots for the selected date
function fetchAvailableTimeSlots(date) {
  // In a real application, you would fetch this from Google Calendar API
  // For demo purposes, we'll generate some time slots
  
  const slotsContainer = document.getElementById('slotsContainer');
  if (!slotsContainer) return;
  
  // Clear previous time slots
  slotsContainer.innerHTML = '';
  
  // In a real implementation, you would fetch busy times from Google Calendar like:
  /*
  gapi.client.calendar.freebusy.query({
    resource: {
      timeMin: date.toISOString(),
      timeMax: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).toISOString(),
      items: [{ id: CALENDAR_ID }]
    }
  }).then(response => {
    const busyTimes = response.result.calendars[CALENDAR_ID].busy;
    // Generate available time slots based on busy times
  });
  */
  
  // For demo, generate available time slots between 9 AM and 5 PM (30-minute intervals)
  availableTimeSlots = [];
  const startHour = 9;
  const endHour = 17;
  const interval = 30; // minutes
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      // Skip some times randomly to simulate busy slots
      if (Math.random() > 0.7) continue;
      
      const time = new Date(date);
      time.setHours(hour, minute, 0, 0);
      
      availableTimeSlots.push(time);
      
      // Create a time slot element
      const timeSlotElement = document.createElement('div');
      timeSlotElement.className = 'time-slot';
      timeSlotElement.textContent = formatTime(time);
      
      // Add click event for selecting a time slot
      timeSlotElement.addEventListener('click', () => {
        // Remove selected class from all time slots
        document.querySelectorAll('.time-slot').forEach(slot => {
          slot.classList.remove('selected');
        });
        
        // Add selected class to clicked time slot
        timeSlotElement.classList.add('selected');
        
        // Update selected time
        selectedTime = time;
        
        // Show booking form
        const bookingForm = document.getElementById('bookingForm');
        if (bookingForm) {
          bookingForm.style.display = 'block';
        }
      });
      
      slotsContainer.appendChild(timeSlotElement);
    }
  }
  
  // If no time slots are available
  if (availableTimeSlots.length === 0) {
    const noSlotsElement = document.createElement('p');
    noSlotsElement.textContent = 'No available time slots for this date. Please select another date.';
    slotsContainer.appendChild(noSlotsElement);
  }
}

// Format time as "hh:mm AM/PM"
function formatTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  
  return `${hours}:${formattedMinutes} ${ampm}`;
}

// Initialize the booking form
function initBookingForm() {
  const meetingForm = document.getElementById('meetingForm');
  
  if (!meetingForm) return;
  
  meetingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate form
    const name = document.getElementById('bookingName').value;
    const email = document.getElementById('bookingEmail').value;
    const topic = document.getElementById('bookingTopic').value;
    const notes = document.getElementById('bookingNotes').value;
    
    if (!name || !email || !topic || !selectedDate || !selectedTime) {
      alert('Please fill in all required fields and select a date and time.');
      return;
    }
    
    // Create calendar event
    createCalendarEvent(name, email, topic, notes);
  });
}

// Create a calendar event
function createCalendarEvent(name, email, topic, notes) {
  // In a real application, you would create an event in Google Calendar
  
  // For demo purposes, we'll just log the event details
  console.log('Creating calendar event with the following details:');
  console.log('Date:', selectedDate.toLocaleDateString());
  console.log('Time:', formatTime(selectedTime));
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Topic:', topic);
  console.log('Notes:', notes);
  
  // In a real implementation, you would create an event like:
  /*
  const event = {
    'summary': `Meeting with ${name}: ${topic}`,
    'description': notes,
    'start': {
      'dateTime': selectedTime.toISOString(),
      'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    'end': {
      'dateTime': new Date(selectedTime.getTime() + 30 * 60000).toISOString(),
      'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    'attendees': [
      {'email': email}
    ],
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10}
      ]
    }
  };
  
  gapi.client.calendar.events.insert({
    'calendarId': CALENDAR_ID,
    'resource': event
  }).then(response => {
    // Show success message
  }).catch(error => {
    // Handle error
  });
  */
  
  // Show success message
  alert('Meeting booked successfully! In a real application, you would receive a confirmation email with the details.');
  
  // Reset form and state
  document.getElementById('meetingForm').reset();
  
  // Hide booking form
  document.getElementById('bookingForm').style.display = 'none';
  
  // Reset selected date and time
  selectedDate = null;
  selectedTime = null;
  
  // Clear selected classes
  document.querySelectorAll('.calendar-day').forEach(cell => {
    cell.classList.remove('selected');
  });
  
  document.querySelectorAll('.time-slot').forEach(slot => {
    slot.classList.remove('selected');
  });
  
  // Hide time slots
  document.getElementById('timeSlots').style.display = 'none';
}

/*
  ========================================
  Helper Functions for Date & Time
  ========================================
*/
// Check if two dates are the same day
function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

// Format date as "YYYY-MM-DD"
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}
