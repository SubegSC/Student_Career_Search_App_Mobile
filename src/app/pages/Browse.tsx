import { useState, useMemo } from 'react';
import { User, Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { allJobs } from '../data/jobsDatabase';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';

// ── Job area taxonomy ──────────────────────────────────────────────────────────
const JOB_AREAS: Record<string, string[]> = {
  'Software & Computing': [
    'Software Engineering', 'Frontend', 'Backend', 'Full Stack', 'Mobile',
    'DevOps', 'Cloud', 'Security', 'QA', 'Site Reliability'
  ],
  'Data & AI': [
    'Data Science', 'Data Analyst', 'Data Engineer', 'Machine Learning', 'AI Research', 'ML Engineer'
  ],
  'Design & Creative': [
    'UX Design', 'UI/UX', 'Graphic Design', 'Web Design', 'Product Design', 'Motion Design'
  ],
  'Business & Management': [
    'Product Management', 'Project Manager', 'Business Analyst', 'Strategy', 'Operations', 'Consulting'
  ],
  'Finance & Accounting': [
    'Financial Analyst', 'Investment Banking', 'Accounting', 'Fintech'
  ],
  'Marketing & Communications': [
    'Marketing', 'Digital Marketing', 'Content Marketing', 'PR', 'Sales'
  ],
  'Natural Sciences': [
    'Chemistry', 'Biology', 'Physics', 'Environmental', 'Research', 'Lab Science'
  ],
  'Engineering (Non-Software)': [
    'Mechanical', 'Electrical', 'Civil', 'Chemical', 'Aerospace', 'Industrial'
  ],
  'Human Resources': ['HR', 'Recruiting', 'Talent Acquisition', 'People Operations'],
  'Supply Chain & Logistics': ['Supply Chain', 'Operations', 'Logistics', 'Procurement'],
  'Political & Social Sciences': ['Political Science', 'Policy', 'Public Affairs', 'Sociology', 'Economics'],
};

// Map title keywords to job areas
function getTitleArea(title: string): string[] {
  const t = title.toLowerCase();
  const areas: string[] = [];
  if (t.includes('software') || t.includes('backend') || t.includes('frontend') || t.includes('full stack') || t.includes('devops') || t.includes('cloud') || t.includes('security') || t.includes('qa') || t.includes('mobile') || t.includes('site reliability') || t.includes('network') || t.includes('systems')) {
    areas.push('Software & Computing');
  }
  if (t.includes('data') || t.includes('machine learning') || t.includes('ai ') || t.includes(' ai') || t.includes('ml ') || t.includes('analytics')) {
    areas.push('Data & AI');
  }
  if (t.includes('design') || t.includes('ux') || t.includes('ui')) {
    areas.push('Design & Creative');
  }
  if (t.includes('product manager') || t.includes('project manager') || t.includes('business analyst') || t.includes('strategy') || t.includes('operations') || t.includes('consultant')) {
    areas.push('Business & Management');
  }
  if (t.includes('financial') || t.includes('investment') || t.includes('accounting') || t.includes('finance')) {
    areas.push('Finance & Accounting');
  }
  if (t.includes('marketing') || t.includes('content') || t.includes('sales') || t.includes('digital')) {
    areas.push('Marketing & Communications');
  }
  if (t.includes('hr') || t.includes('recruiter') || t.includes('human resource')) {
    areas.push('Human Resources');
  }
  if (t.includes('supply chain') || t.includes('logistics')) {
    areas.push('Supply Chain & Logistics');
  }
  return areas.length > 0 ? areas : ['Business & Management'];
}

type SortOption = 'relevance' | 'deadline-asc' | 'deadline-desc' | 'recent' | 'salary-desc';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance',    label: 'Relevance' },
  { value: 'deadline-asc', label: 'Deadline (Soonest)' },
  { value: 'deadline-desc',label: 'Deadline (Latest)' },
  { value: 'recent',       label: 'Recently Posted' },
  { value: 'salary-desc',  label: 'Highest Pay' },
];

export function Browse() {
  const navigate = useNavigate();
  const { isJobSaved, toggleSaveJob, isJobApplied } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [filters, setFilters] = useState({
    locationType: 'all',
    skills: [] as string[],
    deadline: 'all',
    // New filters
    salaryMin: 0,           // $/hr
    jobType: 'all',         // 'all' | 'internship' | 'part-time' | 'full-time'
    entryLevel: false,
    jobAreas: [] as string[],
    visaSponsorship: false,
  });

  const today = new Date('2026-03-06');

  // Get unique values for filters
  const locationTypes = ['all', 'Remote', 'Hybrid', 'In-Person'];
  const allSkills = Array.from(new Set(allJobs.flatMap(j => j.skills))).sort();

  // Filter jobs
  const filteredAndSorted = useMemo(() => {
    let result = allJobs.filter(job => {
      const matchesSearch = searchQuery === '' ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesLocationType = filters.locationType === 'all' || job.locationType === filters.locationType;

      const matchesSkills = filters.skills.length === 0 ||
        filters.skills.some(skill => job.skills.includes(skill));

      let matchesDeadline = true;
      if (filters.deadline !== 'all') {
        const jobDeadline = new Date(job.deadline);
        const diffDays = Math.ceil((jobDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (filters.deadline === 'week')  matchesDeadline = diffDays <= 7;
        else if (filters.deadline === 'month') matchesDeadline = diffDays <= 30;
        else if (filters.deadline === 'soon')  matchesDeadline = diffDays <= 14;
      }

      // Salary filter
      let matchesSalary = true;
      if (filters.salaryMin > 0 && job.salary) {
        const salaryNum = parseInt(job.salary.replace(/[^0-9]/g, ''), 10);
        matchesSalary = !isNaN(salaryNum) && salaryNum >= filters.salaryMin;
      } else if (filters.salaryMin > 0 && !job.salary) {
        matchesSalary = false;
      }

      // Job type filter (term-based heuristic)
      let matchesJobType = true;
      if (filters.jobType === 'internship') {
        matchesJobType = job.title.toLowerCase().includes('intern') ||
          job.term.toLowerCase().includes('summer') ||
          job.term.toLowerCase().includes('fall') ||
          job.term.toLowerCase().includes('winter') ||
          job.term.toLowerCase().includes('month');
      } else if (filters.jobType === 'part-time') {
        matchesJobType = job.term.toLowerCase().includes('part') || job.term.toLowerCase().includes('4-month');
      } else if (filters.jobType === 'full-time') {
        matchesJobType = job.term.toLowerCase().includes('full') || job.term.toLowerCase().includes('12-month');
      }

      // Entry level filter
      let matchesEntryLevel = true;
      if (filters.entryLevel) {
        matchesEntryLevel = !job.gpaRequirement || parseFloat(job.gpaRequirement) <= 3.2;
      }

      // Job areas filter
      let matchesJobArea = true;
      if (filters.jobAreas.length > 0) {
        const titleAreas = getTitleArea(job.title);
        matchesJobArea = filters.jobAreas.some(area => titleAreas.includes(area));
      }

      // Visa sponsorship (mock — tag jobs without explicit GPA as likely sponsoring)
      let matchesVisa = true;
      if (filters.visaSponsorship) {
        matchesVisa = job.locationType === 'Remote' || !job.gpaRequirement;
      }

      return matchesSearch && matchesLocationType && matchesSkills &&
        matchesDeadline && matchesSalary && matchesJobType &&
        matchesEntryLevel && matchesJobArea && matchesVisa;
    });

    // Sort
    switch (sortBy) {
      case 'deadline-asc':
        result = [...result].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        break;
      case 'deadline-desc':
        result = [...result].sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
        break;
      case 'recent':
        // Simulate "recent" by reversing index order (higher id = more recent)
        result = [...result].sort((a, b) => {
          const aNum = parseInt(a.id.replace('job-', ''), 10) || 0;
          const bNum = parseInt(b.id.replace('job-', ''), 10) || 0;
          return bNum - aNum;
        });
        break;
      case 'salary-desc':
        result = [...result].sort((a, b) => {
          const aS = a.salary ? parseInt(a.salary.replace(/[^0-9]/g, ''), 10) : 0;
          const bS = b.salary ? parseInt(b.salary.replace(/[^0-9]/g, ''), 10) : 0;
          return bS - aS;
        });
        break;
      default:
        // relevance — default order
        break;
    }

    return result;
  }, [searchQuery, filters, sortBy]);

  const toggleSkillFilter = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const toggleJobArea = (area: string) => {
    setFilters(prev => ({
      ...prev,
      jobAreas: prev.jobAreas.includes(area)
        ? prev.jobAreas.filter(a => a !== area)
        : [...prev.jobAreas, area]
    }));
  };

  const clearFilters = () => {
    setFilters({
      locationType: 'all',
      skills: [],
      deadline: 'all',
      salaryMin: 0,
      jobType: 'all',
      entryLevel: false,
      jobAreas: [],
      visaSponsorship: false,
    });
  };

  const activeFilterCount =
    (filters.locationType !== 'all' ? 1 : 0) +
    filters.skills.length +
    (filters.deadline !== 'all' ? 1 : 0) +
    (filters.salaryMin > 0 ? 1 : 0) +
    (filters.jobType !== 'all' ? 1 : 0) +
    (filters.entryLevel ? 1 : 0) +
    filters.jobAreas.length +
    (filters.visaSponsorship ? 1 : 0);

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label || 'Sort';

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-2">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Browse Jobs</h1>
        <button 
          onClick={() => navigate('/profile')}
          className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
        >
          <User className="w-6 h-6 text-primary" />
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs, companies, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="relative w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center"
        >
          <SlidersHorizontal className="w-5 h-5 dark:text-gray-300" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Sort row */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredAndSorted.length} jobs found
        </p>
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {currentSortLabel}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {showSortMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-20 overflow-hidden">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setSortBy(opt.value); setShowSortMenu(false); }}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    sortBy === opt.value ? 'text-primary font-semibold' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Filters</h3>
            <button onClick={clearFilters} className="text-sm text-primary dark:text-primary/90 font-medium">
              Clear All
            </button>
          </div>

          {/* Work Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Work Type</label>
            <div className="flex gap-2 flex-wrap">
              {locationTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilters(prev => ({ ...prev, locationType: type }))}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    filters.locationType === type
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  {type === 'all' ? 'All' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Job Type</label>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'All' },
                { value: 'internship', label: 'Internship' },
                { value: 'part-time', label: 'Part-time' },
                { value: 'full-time', label: 'Full-time' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setFilters(prev => ({ ...prev, jobType: opt.value }))}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    filters.jobType === opt.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Salary Range */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Min. Salary: {filters.salaryMin > 0 ? `$${filters.salaryMin}/hr` : 'Any'}
            </label>
            <input
              type="range"
              min={0}
              max={60}
              step={5}
              value={filters.salaryMin}
              onChange={e => setFilters(prev => ({ ...prev, salaryMin: Number(e.target.value) }))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Any</span>
              <span>$20/hr</span>
              <span>$40/hr</span>
              <span>$60/hr</span>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium mb-2">Deadline</label>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'All' },
                { value: 'week', label: 'This Week' },
                { value: 'soon', label: 'Within 2 Weeks' },
                { value: 'month', label: 'This Month' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setFilters(prev => ({ ...prev, deadline: option.value }))}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    filters.deadline === option.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Job Areas */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Job Areas {filters.jobAreas.length > 0 && `(${filters.jobAreas.length} selected)`}
            </label>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(JOB_AREAS).map(area => (
                <button
                  key={area}
                  onClick={() => toggleJobArea(area)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    filters.jobAreas.includes(area)
                      ? 'bg-blue-600 dark:bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle filters */}
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium">Entry Level / No Experience Required</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">GPA 3.2 or lower requirement</p>
              </div>
              <button
                onClick={() => setFilters(prev => ({ ...prev, entryLevel: !prev.entryLevel }))}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${filters.entryLevel ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${filters.entryLevel ? 'translate-x-5' : ''}`} />
              </button>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium">Visa Sponsorship Available</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Positions that may offer sponsorship</p>
              </div>
              <button
                onClick={() => setFilters(prev => ({ ...prev, visaSponsorship: !prev.visaSponsorship }))}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${filters.visaSponsorship ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${filters.visaSponsorship ? 'translate-x-5' : ''}`} />
              </button>
            </label>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Skills ({filters.skills.length} selected)
            </label>
            <div className="flex gap-2 flex-wrap max-h-32 overflow-y-auto">
              {allSkills.slice(0, 30).map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkillFilter(skill)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    filters.skills.includes(skill)
                      ? 'bg-blue-600 dark:bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {activeFilterCount > 0 && !showFilters && (
        <div className="flex gap-2 flex-wrap mb-4">
          {filters.locationType !== 'all' && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              {filters.locationType}
              <button onClick={() => setFilters(p => ({ ...p, locationType: 'all' }))}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.jobType !== 'all' && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              {filters.jobType}
              <button onClick={() => setFilters(p => ({ ...p, jobType: 'all' }))}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.salaryMin > 0 && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              ${filters.salaryMin}+/hr
              <button onClick={() => setFilters(p => ({ ...p, salaryMin: 0 }))}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.entryLevel && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              Entry Level
              <button onClick={() => setFilters(p => ({ ...p, entryLevel: false }))}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.visaSponsorship && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              Visa Sponsorship
              <button onClick={() => setFilters(p => ({ ...p, visaSponsorship: false }))}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.jobAreas.map(area => (
            <span key={area} className="flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {area}
              <button onClick={() => toggleJobArea(area)}><X className="w-3 h-3" /></button>
            </span>
          ))}
          {filters.skills.map(skill => (
            <span key={skill} className="flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {skill}
              <button onClick={() => toggleSkillFilter(skill)}><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      )}

      {/* Job listings */}
      <div className="space-y-3">
        {filteredAndSorted.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-2">No jobs match your filters</p>
            <button onClick={clearFilters} className="text-primary text-sm font-medium">Clear all filters</button>
          </div>
        ) : filteredAndSorted.map(job => {
          const saved = isJobSaved(job.id);
          const applied = isJobApplied(job.id);
          const deadline = new Date(job.deadline);
          const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

          return (
            <div
              key={job.id}
              onClick={() => navigate(`/job/${job.id}`)}
              className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl p-4 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{job.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{job.company}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {job.location} • {job.locationType}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveJob(job.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex-shrink-0 ml-2 ${
                    saved
                      ? 'bg-primary text-primary-foreground'
                      : applied
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-white dark:bg-gray-900 border-2 border-primary text-primary'
                  }`}
                >
                  {applied ? 'Applied' : saved ? 'Saved' : 'Save'}
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                {job.skills.slice(0, 3).map(skill => (
                  <span key={skill} className="px-2 py-1 dark:bg-gray-600 bg-white rounded text-xs font-medium text-gray-700 dark:text-gray-200">
                    {skill}
                  </span>
                ))}
                {job.skills.length > 3 && (
                  <span className="px-2 py-1 bg-white dark:bg-gray-600 rounded text-xs font-medium text-gray-700 dark:text-gray-200">
                    +{job.skills.length - 3} more
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className={daysUntilDeadline <= 7 ? 'text-red-600 font-medium' : ''}>
                  Deadline: {deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {daysUntilDeadline <= 7 && ` (${daysUntilDeadline} days left)`}
                </span>
                {job.salary && ` • ${job.salary}`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}