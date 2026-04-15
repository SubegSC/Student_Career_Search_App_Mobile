export interface Advisor {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  availabilityStatus: 'available' | 'busy' | 'away';
  availabilityLabel: string;
  bio: string;
  specializations: string[];
  bookedSlots: string[]; // ISO date strings already booked
  availableSlots: { date: string; time: string }[];
  avatarColor: string;
}

export const advisors: Advisor[] = [
  {
    id: 'sarah-liu',
    name: 'Sarah Liu',
    initials: 'SL',
    role: 'Career Advisor',
    department: 'Career Services · Engineering',
    availabilityStatus: 'available',
    availabilityLabel: 'AVAILABLE THIS WEEK',
    bio: 'Sarah specializes in helping engineering and CS students land their first internship. She has 8+ years of experience in university career services and previously worked at Google and Shopify.',
    specializations: ['Resume Review', 'Interview Prep', 'Tech Internships', 'Networking'],
    bookedSlots: ['2026-04-15T10:00', '2026-04-16T14:00'],
    availableSlots: [
      { date: '2026-04-15', time: '1:00 PM' },
      { date: '2026-04-15', time: '3:00 PM' },
      { date: '2026-04-16', time: '10:00 AM' },
      { date: '2026-04-17', time: '2:00 PM' },
      { date: '2026-04-18', time: '11:00 AM' },
      { date: '2026-04-21', time: '9:00 AM' },
      { date: '2026-04-21', time: '3:30 PM' },
    ],
    avatarColor: '#4CAF50',
  },
  {
    id: 'marcus-osei',
    name: 'Marcus Osei',
    initials: 'MO',
    role: 'Career Advisor',
    department: 'Career Services · Business',
    availabilityStatus: 'available',
    availabilityLabel: 'AVAILABLE THIS WEEK',
    bio: 'Marcus focuses on business, finance, and consulting careers. He has helped hundreds of students secure positions at top banks, consulting firms, and startups.',
    specializations: ['Finance Internships', 'Consulting', 'Cover Letters', 'Case Interview Prep'],
    bookedSlots: ['2026-04-16T11:00'],
    availableSlots: [
      { date: '2026-04-15', time: '11:00 AM' },
      { date: '2026-04-16', time: '2:00 PM' },
      { date: '2026-04-17', time: '10:00 AM' },
      { date: '2026-04-18', time: '1:00 PM' },
      { date: '2026-04-22', time: '10:00 AM' },
    ],
    avatarColor: '#2196F3',
  },
  {
    id: 'priya-sharma',
    name: 'Priya Sharma',
    initials: 'PS',
    role: 'Career Advisor',
    department: 'Career Services · Design & Arts',
    availabilityStatus: 'busy',
    availabilityLabel: 'NEXT AVAILABLE: APR 21',
    bio: 'Priya works with design, media, and creative students. She has connections across top design agencies and tech companies with strong design teams.',
    specializations: ['Portfolio Review', 'UX/UI Careers', 'Creative Internships', 'LinkedIn Optimization'],
    bookedSlots: [],
    availableSlots: [
      { date: '2026-04-21', time: '10:00 AM' },
      { date: '2026-04-21', time: '2:00 PM' },
      { date: '2026-04-22', time: '11:00 AM' },
      { date: '2026-04-23', time: '3:00 PM' },
    ],
    avatarColor: '#E91E63',
  },
  {
    id: 'james-walker',
    name: 'James Walker',
    initials: 'JW',
    role: 'Senior Career Advisor',
    department: 'Career Services · Sciences',
    availabilityStatus: 'away',
    availabilityLabel: 'RETURNS APR 22',
    bio: 'James specializes in science and research career pathways. He helps students navigate graduate school applications, research assistant roles, and science-adjacent industry jobs.',
    specializations: ['Research Roles', 'Grad School Prep', 'Science Internships', 'Academic CVs'],
    bookedSlots: [],
    availableSlots: [
      { date: '2026-04-22', time: '1:00 PM' },
      { date: '2026-04-23', time: '10:00 AM' },
      { date: '2026-04-24', time: '2:00 PM' },
    ],
    avatarColor: '#FF9800',
  },
];

// The "featured" advisor shown on the home screen
export const featuredAdvisor = advisors[0];
