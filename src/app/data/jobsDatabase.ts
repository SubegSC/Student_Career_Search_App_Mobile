export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  locationType: 'Remote' | 'Hybrid' | 'In-Person';
  term: string;
  deadline: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  gpaRequirement?: string;
  materials: string[];
  salary?: string;
}

const companies = [
  'Shopify', 'Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Tesla',
  'RBC', 'TD Bank', 'Scotiabank', 'BMO', 'CIBC', 'Deloitte', 'PwC', 'EY', 'KPMG',
  'IBM', 'Oracle', 'Salesforce', 'Adobe', 'Intuit', 'Uber', 'Lyft', 'Airbnb',
  'Spotify', 'Slack', 'Zoom', 'Dropbox', 'Square', 'Stripe', 'PayPal', 'eBay',
  'LinkedIn', 'Twitter', 'Snap', 'Pinterest', 'Reddit', 'Twitch', 'Discord',
  'Nvidia', 'AMD', 'Intel', 'Qualcomm', 'Cisco', 'Dell', 'HP', 'Lenovo',
  'Samsung', 'LG', 'Sony', 'Panasonic', 'Toshiba', 'Fujitsu', 'Hitachi', 'NEC',
  'Accenture', 'Capgemini', 'Infosys', 'TCS', 'Wipro', 'Cognizant', 'HCL',
  'SAP', 'VMware', 'ServiceNow', 'Workday', 'Atlassian', 'Zendesk', 'Asana',
  'Palantir', 'Snowflake', 'Databricks', 'Confluent', 'MongoDB', 'Redis',
  'Shoppers Drug Mart', 'Canadian Tire', 'Loblaws', 'Metro', 'Sobeys',
  'Air Canada', 'WestJet', 'Porter Airlines', 'CN Rail', 'CP Rail',
  'Bell', 'Telus', 'Rogers', 'Shaw', 'Cogeco', 'Videotron',
  'Enbridge', 'TransCanada', 'Suncor', 'Imperial Oil', 'Husky Energy',
  'Bombardier', 'CAE', 'Magna', 'Linamar', 'Martinrea', 'Celestica',
  'OpenText', 'CGI', 'Constellation Software', 'Kinaxis', 'D2L'
];

const cities = [
  'Toronto, ON', 'Vancouver, BC', 'Montreal, QC', 'Calgary, AB', 'Ottawa, ON',
  'Edmonton, AB', 'Mississauga, ON', 'Winnipeg, MB', 'Quebec City, QC', 'Hamilton, ON',
  'Kitchener, ON', 'London, ON', 'Victoria, BC', 'Halifax, NS', 'Oshawa, ON',
  'Windsor, ON', 'Saskatoon, SK', 'Regina, SK', 'Sherbrooke, QC', 'Barrie, ON',
  'Kelowna, BC', 'Abbotsford, BC', 'Kingston, ON', 'Trois-Rivières, QC', 'Guelph, ON',
  'Remote (Canada)', 'Remote (North America)', 'Mountain View, CA', 'Seattle, WA',
  'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Boston, MA', 'Chicago, IL'
];

const jobTitles = [
  'Software Engineering Intern', 'Software Developer Intern', 'Backend Developer Intern',
  'Frontend Developer Intern', 'Full Stack Developer Intern', 'Mobile Developer Intern',
  'Data Science Intern', 'Data Analyst Intern', 'Data Engineer Intern',
  'Machine Learning Intern', 'AI Research Intern', 'ML Engineer Intern',
  'UX Design Intern', 'UI/UX Designer Intern', 'Product Design Intern',
  'Graphic Design Intern', 'Web Designer Intern', 'Motion Designer Intern',
  'Product Management Intern', 'Project Manager Intern', 'Business Analyst Intern',
  'Marketing Intern', 'Digital Marketing Intern', 'Content Marketing Intern',
  'Financial Analyst Intern', 'Investment Banking Intern', 'Accounting Intern',
  'DevOps Intern', 'Cloud Engineer Intern', 'Security Engineer Intern',
  'QA Engineer Intern', 'Test Automation Intern', 'Site Reliability Engineer Intern',
  'Cybersecurity Intern', 'Network Engineer Intern', 'Systems Administrator Intern',
  'Research Intern', 'Strategy Consultant Intern', 'Operations Intern',
  'Supply Chain Intern', 'HR Intern', 'Recruiter Intern', 'Sales Intern'
];

const skills = {
  backend: ['Java', 'Python', 'Node.js', 'C++', 'Go', 'Ruby', 'PHP', 'C#', '.NET', 'Spring Boot', 'Django', 'Flask', 'Express.js', 'APIs', 'REST', 'GraphQL', 'Microservices'],
  frontend: ['React', 'Angular', 'Vue.js', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind', 'Next.js', 'Redux', 'Webpack', 'Responsive Design'],
  data: ['SQL', 'Python', 'R', 'Tableau', 'Power BI', 'Excel', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Statistics', 'Data Visualization'],
  ml: ['TensorFlow', 'PyTorch', 'scikit-learn', 'Keras', 'Deep Learning', 'NLP', 'Computer Vision', 'Neural Networks'],
  design: ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InDesign', 'After Effects', 'Prototyping', 'User Research', 'Wireframing'],
  cloud: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Terraform', 'Linux'],
  database: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server', 'DynamoDB', 'Cassandra'],
  other: ['Git', 'Agile', 'Scrum', 'JIRA', 'Communication', 'Problem Solving', 'Team Collaboration']
};

function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateDeadline(): string {
  const start = new Date(2026, 3, 6);
  const end = new Date(2026, 5, 30);
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function formatDeadline(deadline: string): string {
  const date = new Date(deadline);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function generateJobs(): Job[] {
  const jobs: Job[] = [];
  
  for (let i = 0; i < 150; i++) {
    const title = getRandomItem(jobTitles);
    const company = getRandomItem(companies);
    const location = getRandomItem(cities);
    const locationType = getRandomItem(['Remote', 'Hybrid', 'In-Person'] as const);
    const deadline = generateDeadline();
    
    let relevantSkills: string[] = [];
    if (title.includes('Backend') || title.includes('Software')) {
      relevantSkills = [...skills.backend, ...skills.database, ...skills.other];
    } else if (title.includes('Frontend') || title.includes('Web')) {
      relevantSkills = [...skills.frontend, ...skills.other];
    } else if (title.includes('Full Stack')) {
      relevantSkills = [...skills.backend, ...skills.frontend, ...skills.database, ...skills.other];
    } else if (title.includes('Data')) {
      relevantSkills = [...skills.data, ...skills.database, ...skills.other];
    } else if (title.includes('Machine Learning') || title.includes('AI')) {
      relevantSkills = [...skills.ml, ...skills.data, ...skills.other];
    } else if (title.includes('Design')) {
      relevantSkills = [...skills.design, ...skills.other];
    } else if (title.includes('DevOps') || title.includes('Cloud')) {
      relevantSkills = [...skills.cloud, ...skills.other];
    } else {
      relevantSkills = [...skills.other, 'Microsoft Office', 'Excel', 'PowerPoint'];
    }
    
    const jobSkills = getRandomItems(relevantSkills, Math.floor(Math.random() * 4) + 3);
    const requirements = getRandomItems(relevantSkills, Math.floor(Math.random() * 3) + 2);
    
    const gpa = Math.random() > 0.5 ? `${(Math.random() * 0.7 + 3.0).toFixed(1)}+` : undefined;
    
    jobs.push({
      id: `job-${i + 1}`,
      title,
      company,
      location,
      locationType,
      term: getRandomItem(['Summer 2026', 'Fall 2026', 'Winter 2027', '4-month', '8-month', '12-month']),
      deadline,
      description: `Join ${company} as a ${title} and work on exciting projects that impact millions of users. This is a great opportunity to learn from industry experts and gain hands-on experience with cutting-edge technologies.`,
      responsibilities: [
        `Collaborate with cross-functional teams to deliver high-quality solutions`,
        `Participate in code reviews and contribute to technical discussions`,
        `Work on real-world projects that directly impact ${company}'s products`,
        `Learn and apply industry best practices and modern development methodologies`
      ],
      requirements,
      skills: jobSkills,
      gpaRequirement: gpa,
      materials: ['Resume', 'Cover Letter', ...(Math.random() > 0.7 ? ['Transcript'] : []), ...(title.includes('Design') ? ['Portfolio'] : [])],
      salary: Math.random() > 0.3 ? `$${Math.floor(Math.random() * 20 + 25)}/hr` : undefined
    });
  }
  
  return jobs;
}

export const allJobs = generateJobs();

// Pre-defined featured jobs for the home page
export const featuredJobs: Job[] = [
  {
    id: 'shopify-backend',
    title: 'Software Engineering Intern (Backend)',
    company: 'Shopify',
    location: 'Remote (Canada)',
    locationType: 'Remote',
    term: 'Summer 2026',
    deadline: '2026-03-12',
    description: 'Join Shopify and help build the future of commerce. Work on scalable backend systems that power millions of merchants worldwide.',
    responsibilities: [
      'Build and maintain scalable APIs using Ruby on Rails and GraphQL',
      'Collaborate with product teams to design new features',
      'Optimize database queries and improve system performance',
      'Participate in code reviews and contribute to technical documentation'
    ],
    requirements: ['Currently enrolled in Computer Science or related field', 'Strong problem-solving skills'],
    skills: ['Java', 'APIs', 'Databases', 'Ruby on Rails', 'GraphQL', 'SQL'],
    gpaRequirement: '3.0+',
    materials: ['Resume', 'Cover Letter'],
    salary: '$35/hr'
  },
  {
    id: 'google-ux',
    title: 'UX Design Intern',
    company: 'Google',
    location: 'Mountain View, CA',
    locationType: 'In-Person',
    term: 'Summer 2026',
    deadline: '2026-03-20',
    description: 'Design beautiful and intuitive user experiences for Google products used by billions of people worldwide.',
    responsibilities: [
      'Create wireframes, prototypes, and high-fidelity mockups',
      'Conduct user research and usability testing',
      'Collaborate with engineers and product managers',
      'Present design concepts to stakeholders'
    ],
    requirements: ['Portfolio demonstrating UX/UI design work', 'Currently enrolled in Design or HCI program'],
    skills: ['Figma', 'Sketch', 'Prototyping', 'User Research', 'Usability Testing'],
    gpaRequirement: '3.3+',
    materials: ['Resume', 'Portfolio', 'Cover Letter'],
    salary: '$45/hr'
  },
  {
    id: 'rbc-software',
    title: 'Software Developer Intern',
    company: 'RBC',
    location: 'Toronto, ON',
    locationType: 'Hybrid',
    term: 'Summer 2026',
    deadline: '2026-03-14',
    description: 'Work on innovative fintech solutions at Canada\'s largest bank. Build applications that serve millions of customers.',
    responsibilities: [
      'Develop and maintain web applications using Java and Spring Boot',
      'Write clean, testable code following best practices',
      'Collaborate with senior developers on feature development',
      'Participate in agile ceremonies and sprint planning'
    ],
    requirements: ['Knowledge of object-oriented programming', 'Understanding of software development lifecycle'],
    skills: ['Java', 'Spring Boot', 'SQL', 'REST APIs', 'Git'],
    gpaRequirement: '3.3+',
    materials: ['Resume', 'Cover Letter', 'Transcript'],
    salary: '$32/hr'
  },
  {
    id: 'amazon-data',
    title: 'Data Analyst Intern',
    company: 'Amazon',
    location: 'Vancouver, BC',
    locationType: 'Hybrid',
    term: 'Summer 2026',
    deadline: '2026-03-18',
    description: 'Analyze data to drive business decisions at one of the world\'s most data-driven companies.',
    responsibilities: [
      'Extract insights from large datasets using SQL and Python',
      'Create dashboards and visualizations in Tableau',
      'Collaborate with business teams to understand requirements',
      'Present findings to stakeholders'
    ],
    requirements: ['Strong analytical and quantitative skills', 'Experience with data analysis tools'],
    skills: ['SQL', 'Python', 'Excel', 'Tableau', 'Statistics'],
    gpaRequirement: '3.2+',
    materials: ['Resume', 'Cover Letter'],
    salary: '$33/hr'
  }
];
