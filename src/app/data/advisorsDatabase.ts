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
    bookedSlots: ['2026-05-20T10:00', '2026-05-21T14:00'],
    availableSlots: [
      { date: '2026-05-20', time: '1:00 PM' },
      { date: '2026-05-20', time: '3:00 PM' },
      { date: '2026-05-21', time: '10:00 AM' },
      { date: '2026-05-22', time: '2:00 PM' },
      { date: '2026-05-23', time: '11:00 AM' },
      { date: '2026-05-26', time: '9:00 AM' },
      { date: '2026-05-26', time: '3:30 PM' },
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
    bookedSlots: ['2026-06-05T11:00'],
    availableSlots: [
      { date: '2026-06-05', time: '11:00 AM' },
      { date: '2026-06-06', time: '2:00 PM' },
      { date: '2026-06-07', time: '10:00 AM' },
      { date: '2026-06-08', time: '1:00 PM' },
      { date: '2026-06-12', time: '10:00 AM' },
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
    availabilityLabel: 'NEXT AVAILABLE: JUL 10',
    bio: 'Priya works with design, media, and creative students. She has connections across top design agencies and tech companies with strong design teams.',
    specializations: ['Portfolio Review', 'UX/UI Careers', 'Creative Internships', 'LinkedIn Optimization'],
    bookedSlots: [],
    availableSlots: [
      { date: '2026-07-10', time: '10:00 AM' },
      { date: '2026-07-10', time: '2:00 PM' },
      { date: '2026-07-11', time: '11:00 AM' },
      { date: '2026-07-12', time: '3:00 PM' },
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
    availabilityLabel: 'RETURNS AUG 5',
    bio: 'James specializes in science and research career pathways. He helps students navigate graduate school applications, research assistant roles, and science-adjacent industry jobs.',
    specializations: ['Research Roles', 'Grad School Prep', 'Science Internships', 'Academic CVs'],
    bookedSlots: [],
    availableSlots: [
      { date: '2026-08-05', time: '1:00 PM' },
      { date: '2026-08-06', time: '10:00 AM' },
      { date: '2026-08-07', time: '2:00 PM' },
    ],
    avatarColor: '#FF9800',
  },
  {
    id: 'alex-chen',
    name: 'Alex Chen',
    initials: 'AC',
    role: 'Career Advisor',
    department: 'Career Services · Humanities & Social Sciences',
    availabilityStatus: 'available',
    availabilityLabel: 'AVAILABLE THIS WEEK',
    bio: 'Alex helps students in humanities, social sciences, and liberal arts find meaningful career paths. With experience at NGOs, government, and academia, Alex guides students toward roles in policy, research, and social impact.',
    specializations: ['Government Careers', 'NGO/Non-Profit', 'Policy Work', 'Research Positions', 'Graduate School Applications'],
    bookedSlots: ['2026-06-20T09:00'],
    availableSlots: [
      { date: '2026-06-18', time: '2:00 PM' },
      { date: '2026-06-19', time: '11:00 AM' },
      { date: '2026-06-20', time: '3:00 PM' },
      { date: '2026-06-21', time: '10:00 AM' },
      { date: '2026-06-24', time: '1:00 PM' },
    ],
    avatarColor: '#9C27B0',
  },
  {
    id: 'dr-lisa-patel',
    name: 'Dr. Lisa Patel',
    initials: 'LP',
    role: 'Senior Career Advisor',
    department: 'Career Services · Health Sciences',
    availabilityStatus: 'busy',
    availabilityLabel: 'NEXT AVAILABLE: JUL 25',
    bio: 'Dr. Patel specializes in healthcare and life sciences careers. As a former medical researcher and healthcare administrator, she helps students navigate careers in medicine, research, healthcare administration, and biotech.',
    specializations: ['Healthcare Careers', 'Medical Research', 'Biotech', 'Pharmacy', 'Public Health', 'Medical School Prep'],
    bookedSlots: [],
    availableSlots: [
      { date: '2026-07-25', time: '9:00 AM' },
      { date: '2026-07-26', time: '2:00 PM' },
      { date: '2026-07-28', time: '11:00 AM' },
      { date: '2026-07-29', time: '3:30 PM' },
    ],
    avatarColor: '#607D8B',
  },
];

// The "featured" advisor shown on the home screen
export const featuredAdvisor = advisors[0];
