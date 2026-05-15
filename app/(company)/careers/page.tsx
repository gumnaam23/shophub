'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  HeartIcon,
  GlobeAltIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import Button from '@/app/components/ui/Button';

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'remote' | 'contract';
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
}

export default function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);

  const departments = [
    { id: 'all', name: 'All Departments', count: 12 },
    { id: 'engineering', name: 'Engineering', count: 4 },
    { id: 'marketing', name: 'Marketing', count: 3 },
    { id: 'sales', name: 'Sales', count: 2 },
    { id: 'operations', name: 'Operations', count: 2 },
    { id: 'design', name: 'Design', count: 1 },
  ];

  const jobOpenings: JobOpening[] = [
    {
      id: '1',
      title: 'Senior Full Stack Developer',
      department: 'engineering',
      location: 'New York, NY (Hybrid)',
      type: 'full-time',
      experience: '5+ years',
      salary: '$120,000 - $150,000',
      description: 'We are looking for a Senior Full Stack Developer to join our growing engineering team. You will be responsible for building and maintaining our e-commerce platform, working with modern technologies like Next.js, React, Node.js, and MongoDB.',
      requirements: [
        '5+ years of experience with JavaScript/TypeScript',
        'Strong experience with React and Next.js',
        'Experience with Node.js and Express',
        'Knowledge of MongoDB or similar databases',
        'Experience with RESTful APIs and GraphQL',
        'Bachelor\'s degree in Computer Science or related field',
      ],
      benefits: [
        'Competitive salary and equity',
        'Health, dental, and vision insurance',
        '401(k) matching',
        'Flexible work hours',
        'Professional development budget',
        'Home office stipend',
      ],
      postedDate: '2024-01-15',
    },
    {
      id: '2',
      title: 'Frontend Developer',
      department: 'engineering',
      location: 'Remote (US-based)',
      type: 'remote',
      experience: '3+ years',
      salary: '$90,000 - $120,000',
      description: 'Join our frontend team to create beautiful, responsive user interfaces. You will work closely with designers and backend developers to deliver exceptional user experiences.',
      requirements: [
        '3+ years of experience with React',
        'Strong understanding of HTML5, CSS3, and JavaScript',
        'Experience with Tailwind CSS',
        'Knowledge of Next.js is a plus',
        'Good understanding of responsive design',
      ],
      benefits: [
        'Remote work allowance',
        'Flexible schedule',
        'Learning stipend',
        'Team retreats',
      ],
      postedDate: '2024-01-10',
    },
    {
      id: '3',
      title: 'Digital Marketing Manager',
      department: 'marketing',
      location: 'Los Angeles, CA',
      type: 'full-time',
      experience: '4+ years',
      salary: '$80,000 - $100,000',
      description: 'Lead our digital marketing efforts including SEO, SEM, social media, and email marketing. Drive customer acquisition and retention through data-driven strategies.',
      requirements: [
        '4+ years of digital marketing experience',
        'Experience with SEO/SEM tools',
        'Knowledge of Google Analytics',
        'Experience with email marketing platforms',
        'Strong analytical skills',
      ],
      benefits: [
        'Performance bonuses',
        'Marketing conference budget',
        'Health benefits',
        'Gym membership',
      ],
      postedDate: '2024-01-12',
    },
    {
      id: '4',
      title: 'Sales Representative',
      department: 'sales',
      location: 'Chicago, IL',
      type: 'full-time',
      experience: '2+ years',
      salary: '$60,000 + Commission',
      description: 'Join our sales team to help grow our customer base. You will be responsible for prospecting, qualifying, and closing deals with potential clients.',
      requirements: [
        '2+ years of sales experience',
        'Excellent communication skills',
        'Self-motivated and goal-oriented',
        'Experience with CRM software',
        'Bachelor\'s degree preferred',
      ],
      benefits: [
        'Uncapped commission',
        'Sales training',
        'Career advancement',
        'Team events',
      ],
      postedDate: '2024-01-08',
    },
    {
      id: '5',
      title: 'Operations Manager',
      department: 'operations',
      location: 'Dallas, TX',
      type: 'full-time',
      experience: '5+ years',
      salary: '$85,000 - $110,000',
      description: 'Oversee daily operations, manage logistics, and optimize processes to ensure efficient order fulfillment and customer satisfaction.',
      requirements: [
        '5+ years of operations management',
        'Experience with supply chain logistics',
        'Strong leadership skills',
        'Process improvement experience',
        'ERP system knowledge',
      ],
      benefits: [
        'Leadership training',
        'Performance bonus',
        'Comprehensive benefits',
        'Company car',
      ],
      postedDate: '2024-01-05',
    },
    {
      id: '6',
      title: 'UI/UX Designer',
      department: 'design',
      location: 'Remote (Global)',
      type: 'remote',
      experience: '3+ years',
      salary: '$75,000 - $95,000',
      description: 'Design intuitive and beautiful user interfaces for our web and mobile platforms. Conduct user research and create wireframes, prototypes, and high-fidelity designs.',
      requirements: [
        '3+ years of UI/UX design experience',
        'Proficiency in Figma or Sketch',
        'Portfolio demonstrating design work',
        'Understanding of user-centered design',
        'Experience with design systems',
      ],
      benefits: [
        'Remote work',
        'Design tools stipend',
        'Conference budget',
        'Flexible hours',
      ],
      postedDate: '2024-01-03',
    },
  ];

  const filteredJobs = jobOpenings.filter(job =>
    selectedDepartment === 'all' || job.department === selectedDepartment
  );

  const companyValues = [
    { icon: HeartIcon, title: 'Customer First', description: 'We prioritize customer satisfaction in everything we do' },
    { icon: RocketLaunchIcon, title: 'Innovation', description: 'Constantly pushing boundaries and trying new things' },
    { icon: UserGroupIcon, title: 'Collaboration', description: 'Working together to achieve common goals' },
    { icon: GlobeAltIcon, title: 'Diversity', description: 'Embracing different perspectives and backgrounds' },
  ];

  const employeeBenefits = [
    { icon: HeartIcon, title: 'Health & Wellness', items: ['Medical insurance', 'Dental & Vision', 'Mental health support', 'Gym membership'] },
    { icon: AcademicCapIcon, title: 'Learning & Growth', items: ['Learning stipend', 'Conference budget', 'Mentorship program', 'Career coaching'] },
    { icon: ChartBarIcon, title: 'Financial', items: ['Competitive salary', 'Equity options', '401(k) matching', 'Performance bonuses'] },
    { icon: ClockIcon, title: 'Work-Life Balance', items: ['Flexible hours', 'Remote work', 'Unlimited PTO', 'Parental leave'] },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
            <p className="text-xl text-gray-300 mb-6">
              Help us revolutionize the e-commerce experience
            </p>
            <Link href="#openings">
              <Button variant="primary" size="lg">
                View Open Positions
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Company Culture Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Why Join ShopHub?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {`We're building a company where people love to work, grow, and make an impact`}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {companyValues.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-white rounded-xl shadow-md"
              >
                <div className="inline-flex p-3 bg-black text-white rounded-full mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Benefits & Perks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {employeeBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold">{benefit.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {benefit.items.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Open Positions Section */}
        <div id="openings">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
            <p className="text-gray-600">Join our team and make a difference</p>
          </motion.div>

          {/* Department Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedDepartment === dept.id
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {dept.name}
                <span className="ml-1 text-xs opacity-75">({dept.count})</span>
              </button>
            ))}
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <button
                  onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <h3 className="font-bold text-xl mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <BriefcaseIcon className="w-4 h-4" />
                          <span className="capitalize">{job.type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CurrencyDollarIcon className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="w-4 h-4" />
                          <span>{job.experience}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        Posted {new Date(job.postedDate).toLocaleDateString()}
                      </span>
                      {expandedJob === job.id ? (
                        <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {expandedJob === job.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t p-6 bg-gray-50"
                    >
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-2">About the Role</h4>
                          <p className="text-gray-600">{job.description}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Requirements</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {job.requirements.map((req, idx) => (
                              <li key={idx}>{req}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Benefits</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {job.benefits.map((benefit, idx) => (
                              <li key={idx}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button
                            onClick={() => {
                              setSelectedJob(job);
                              setShowApplicationForm(true);
                            }}
                            variant="primary"
                            size="md"
                          >
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-gray-500">No open positions in this department.</p>
            </div>
          )}
        </div>

        {/* Why Work With Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 bg-gradient-to-r from-gray-900 to-black rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">{`Don't see the perfect role?`}</h3>
          <p className="text-gray-300 mb-6">
           {` We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.`}
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/contact">
              <Button variant="primary" size="md">
                Send Your Resume
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="md">
                Contact Recruiting
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Application Form Modal */}
      <AnimatePresence>
        {showApplicationForm && selectedJob && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setShowApplicationForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Apply for {selectedJob.title}</h2>
                <button onClick={() => setShowApplicationForm(false)}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input type="text" required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <input type="email" required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input type="tel" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">LinkedIn Profile</label>
                    <input type="url" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Cover Letter</label>
                    <textarea rows={4} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black" placeholder="Tell us why you're interested in this role..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Resume / CV *</label>
                    <input type="file" accept=".pdf,.doc,.docx" required className="w-full" />
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX (Max 5MB)</p>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button type="submit" variant="primary" size="lg" fullWidth>
                    Submit Application
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    fullWidth
                    onClick={() => setShowApplicationForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}