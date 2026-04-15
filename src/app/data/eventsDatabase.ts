export interface CareerEvent {
  id: string;
  type: 'CAREER FAIR' | 'WORKSHOP' | 'INFO SESSION' | 'NETWORKING' | 'PANEL';
  title: string;
  date: string; // ISO date
  time: string;
  location: string;
  locationDetail?: string;
  description: string;
  host: string;
  capacity?: number;
  registeredCount?: number;
  tags: string[];
  isRegistered?: boolean;
}

export const events: CareerEvent[] = [
  {
    id: 'tech-expo-apr18',
    type: 'CAREER FAIR',
    title: 'Tech & Engineering Expo',
    date: '2026-04-18',
    time: '10:00 AM – 3:00 PM',
    location: 'Main Campus',
    locationDetail: 'Student Union Building, Hall A',
    description: 'Meet recruiters from 40+ top tech and engineering companies. Bring your resume and dress professionally. Companies include Shopify, Google, RBC, Deloitte, and more.',
    host: 'Career Services',
    capacity: 500,
    registeredCount: 342,
    tags: ['Engineering', 'Technology', 'Finance', 'In-Person'],
  },
  {
    id: 'resume-workshop-apr21',
    type: 'WORKSHOP',
    title: 'Resume & LinkedIn Review',
    date: '2026-04-21',
    time: '2:00 PM – 4:00 PM',
    location: 'Online (Zoom)',
    description: 'Get personalized feedback on your resume and LinkedIn profile from career advisors. Limited spots — register early!',
    host: 'Sarah Liu, Career Advisor',
    capacity: 30,
    registeredCount: 24,
    tags: ['Resume', 'LinkedIn', 'Online', 'Workshop'],
  },
  {
    id: 'amazon-info-apr22',
    type: 'INFO SESSION',
    title: 'Amazon Internship Info Session',
    date: '2026-04-22',
    time: '5:00 PM – 6:30 PM',
    location: 'Online (Zoom)',
    description: 'Hear from Amazon recruiters and current interns about the internship experience, application process, and what it\'s like to work at Amazon.',
    host: 'Amazon Campus Recruiting',
    capacity: 200,
    registeredCount: 89,
    tags: ['Amazon', 'Technology', 'Online', 'Internship'],
  },
  {
    id: 'networking-apr24',
    type: 'NETWORKING',
    title: 'Engineering Alumni Mixer',
    date: '2026-04-24',
    time: '6:00 PM – 8:00 PM',
    location: 'Main Campus',
    locationDetail: 'Engineering Building, Atrium',
    description: 'Connect with engineering alumni working at top companies. Casual networking event with light refreshments. Great chance to ask questions and expand your professional network.',
    host: 'Engineering Alumni Association',
    capacity: 100,
    registeredCount: 67,
    tags: ['Networking', 'Engineering', 'Alumni', 'In-Person'],
  },
  {
    id: 'interview-workshop-apr25',
    type: 'WORKSHOP',
    title: 'Technical Interview Bootcamp',
    date: '2026-04-25',
    time: '1:00 PM – 4:00 PM',
    location: 'Library, Room 204',
    description: 'Practice LeetCode-style problems with peers and get tips from students who have successfully completed technical interviews at top companies.',
    host: 'CS Student Society',
    capacity: 40,
    registeredCount: 38,
    tags: ['Coding', 'Interview Prep', 'Technology', 'In-Person'],
  },
  {
    id: 'women-in-tech-apr28',
    type: 'PANEL',
    title: 'Women in Tech Panel',
    date: '2026-04-28',
    time: '4:00 PM – 6:00 PM',
    location: 'Online (Zoom)',
    description: 'Hear from women leaders in the tech industry as they share their career journeys, challenges, and advice for students entering the field.',
    host: 'Women in STEM Club',
    capacity: 300,
    registeredCount: 112,
    tags: ['Women in Tech', 'Diversity', 'Panel', 'Online'],
  },
  {
    id: 'finance-fair-apr29',
    type: 'CAREER FAIR',
    title: 'Finance & Business Career Fair',
    date: '2026-04-29',
    time: '11:00 AM – 4:00 PM',
    location: 'Main Campus',
    locationDetail: 'Business Building, Main Hall',
    description: 'Connect with recruiters from top banks, consulting firms, and finance companies including RBC, TD, Deloitte, PwC, KPMG, and more.',
    host: 'Career Services',
    capacity: 400,
    registeredCount: 201,
    tags: ['Finance', 'Business', 'Consulting', 'In-Person'],
  },
  {
    id: 'design-portfolio-may2',
    type: 'WORKSHOP',
    title: 'Design Portfolio Workshop',
    date: '2026-05-02',
    time: '3:00 PM – 5:00 PM',
    location: 'Art & Design Building, Room 110',
    description: 'Get feedback on your design portfolio from industry professionals and peers. Bring your laptop with your portfolio ready.',
    host: 'Priya Sharma, Career Advisor',
    capacity: 20,
    registeredCount: 15,
    tags: ['Design', 'Portfolio', 'UX/UI', 'In-Person'],
  },
];

export function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function getUpcomingEvents(count?: number): CareerEvent[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = events
    .filter(e => new Date(e.date + 'T00:00:00') >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return count ? upcoming.slice(0, count) : upcoming;
}
