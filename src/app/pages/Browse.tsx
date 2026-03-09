import { useState } from 'react';
import { User, Search, SlidersHorizontal, X } from 'lucide-react';
import { allJobs } from '../data/jobsDatabase';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';

export function Browse() {
  const navigate = useNavigate();
  const { isJobSaved, toggleSaveJob, isJobApplied } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    locationType: 'all',
    location: 'all',
    skills: [] as string[],
    deadline: 'all'
  });

  // Get unique values for filters
  const locationTypes = ['all', 'Remote', 'Hybrid', 'In-Person'];
  const locations = ['all', ...Array.from(new Set(allJobs.map(j => j.location)))];
  const allSkills = Array.from(new Set(allJobs.flatMap(j => j.skills))).sort();

  // Filter jobs
  const filteredJobs = allJobs.filter(job => {
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLocationType = filters.locationType === 'all' || job.locationType === filters.locationType;
    const matchesLocation = filters.location === 'all' || job.location === filters.location;
    const matchesSkills = filters.skills.length === 0 || 
      filters.skills.some(skill => job.skills.includes(skill));

    let matchesDeadline = true;
    if (filters.deadline !== 'all') {
      const jobDeadline = new Date(job.deadline);
      const today = new Date('2026-03-06');
      const diffDays = Math.ceil((jobDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (filters.deadline === 'week') matchesDeadline = diffDays <= 7;
      else if (filters.deadline === 'month') matchesDeadline = diffDays <= 30;
      else if (filters.deadline === 'soon') matchesDeadline = diffDays <= 14;
    }

    return matchesSearch && matchesLocationType && matchesLocation && matchesSkills && matchesDeadline;
  });

  const toggleSkillFilter = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const clearFilters = () => {
    setFilters({
      locationType: 'all',
      location: 'all',
      skills: [],
      deadline: 'all'
    });
  };

  const activeFilterCount = 
    (filters.locationType !== 'all' ? 1 : 0) +
    (filters.location !== 'all' ? 1 : 0) +
    filters.skills.length +
    (filters.deadline !== 'all' ? 1 : 0);

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Browse Jobs</h1>
        <button
          onClick={() => navigate('/profile')}
          className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
        >
          <User className="w-6 h-6 text-blue-600" />
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs, companies, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="relative w-12 h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50"
        >
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Filters</h3>
            <button onClick={clearFilters} className="text-sm text-blue-600 font-medium">
              Clear All
            </button>
          </div>

          {/* Location Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Work Type</label>
            <div className="flex gap-2 flex-wrap">
              {locationTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilters(prev => ({ ...prev, locationType: type }))}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    filters.locationType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700'
                  }`}
                >
                  {type === 'all' ? 'All' : type}
                </button>
              ))}
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
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
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
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-gray-600 mb-4">
        {filteredJobs.length} jobs found
      </p>

      {/* Job listings */}
      <div className="space-y-3">
        {filteredJobs.map(job => {
          const saved = isJobSaved(job.id);
          const applied = isJobApplied(job.id);
          const deadline = new Date(job.deadline);
          const today = new Date('2026-03-06');
          const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

          return (
            <div
              key={job.id}
              onClick={() => navigate(`/job/${job.id}`)}
              className="bg-gray-50 rounded-2xl p-4 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{job.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{job.company}</p>
                  <p className="text-sm text-gray-500">
                    {job.location} • {job.locationType}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveJob(job.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    saved
                      ? 'bg-blue-600 text-white'
                      : applied
                      ? 'bg-green-500 text-white'
                      : 'bg-white border-2 border-blue-600 text-blue-600'
                  }`}
                >
                  {applied ? 'Applied' : saved ? 'Saved' : 'Save'}
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                {job.skills.slice(0, 3).map(skill => (
                  <span key={skill} className="px-2 py-1 bg-white rounded text-xs font-medium text-gray-700">
                    {skill}
                  </span>
                ))}
                {job.skills.length > 3 && (
                  <span className="px-2 py-1 bg-white rounded text-xs font-medium text-gray-700">
                    +{job.skills.length - 3} more
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
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