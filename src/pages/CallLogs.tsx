
import React, { useState } from 'react';
import { Call } from '@/types';
import CallLogItem from '@/components/CallLogItem';
import CallDetails from '@/components/CallDetails';
import { Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

const CallLogs = () => {
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Mock data for call logs
  const mockCalls: Call[] = [
    {
      id: '1',
      candidateName: 'Michael Johnson',
      candidatePhone: '+1 (555) 123-4567',
      jobDescription: 'Senior Frontend Developer',
      questionnaire: 'React experience, team collaboration, problem-solving',
      dateTime: '2023-07-15T10:30:00',
      status: 'completed',
      duration: 12,
      evaluation: {
        score: 8.5,
        strengths: [
          'Strong React and TypeScript knowledge',
          'Excellent problem-solving skills',
          'Good communication abilities'
        ],
        weaknesses: [
          'Limited backend experience',
          'Could improve on system design knowledge'
        ],
        recommendation: 'Michael would be a great addition to the frontend team. His React skills are strong and he communicates well.',
        fit: 'high'
      }
    },
    {
      id: '2',
      candidateName: 'Sarah Wilson',
      candidatePhone: '+1 (555) 987-6543',
      jobDescription: 'Product Manager',
      questionnaire: 'Product strategy, team leadership, market analysis',
      dateTime: '2023-07-16T14:00:00',
      status: 'completed',
      duration: 15,
      evaluation: {
        score: 7.2,
        strengths: [
          'Good understanding of product development',
          'Previous experience with agile methodologies',
          'Strong analytical skills'
        ],
        weaknesses: [
          'Could improve on stakeholder management',
          'Limited technical background'
        ],
        recommendation: 'Sarah shows potential but may need additional support on technical aspects of product management.',
        fit: 'medium'
      }
    },
    {
      id: '3',
      candidateName: 'David Chen',
      candidatePhone: '+1 (555) 456-7890',
      jobDescription: 'Backend Developer',
      questionnaire: 'Node.js experience, database design, API development',
      dateTime: '2023-07-18T09:15:00',
      status: 'scheduled',
      questionnaire: 'Node.js experience, database design, API development'
    },
    {
      id: '4',
      candidateName: 'Emily Rodriguez',
      candidatePhone: '+1 (555) 234-5678',
      jobDescription: 'UX Designer',
      questionnaire: 'Design process, user research, prototyping tools',
      dateTime: '2023-07-14T11:00:00',
      status: 'missed',
      questionnaire: 'Design process, user research, prototyping tools'
    }
  ];
  
  // Filter and search logic
  const filteredCalls = mockCalls
    .filter(call => 
      statusFilter === 'all' || call.status === statusFilter
    )
    .filter(call => 
      call.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.candidatePhone.includes(searchQuery)
    );
    
  const handleCallClick = (call: Call) => {
    setSelectedCall(call);
  };
  
  const handleCloseDetails = () => {
    setSelectedCall(null);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Call Logs</h1>
        <p className="text-muted-foreground">
          View and manage all your candidate screening calls
        </p>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search candidates..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-accent rounded-lg hidden md:flex">
            <Filter size={18} className="text-muted-foreground" />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">All Calls</option>
            <option value="completed">Completed</option>
            <option value="scheduled">Scheduled</option>
            <option value="missed">Missed</option>
          </select>
        </div>
      </div>
      
      {/* Call Logs List */}
      <div className="space-y-4">
        {filteredCalls.length > 0 ? (
          filteredCalls.map(call => (
            <CallLogItem 
              key={call.id} 
              call={call} 
              onClick={handleCallClick}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-muted-foreground">No calls found matching your criteria</p>
          </div>
        )}
      </div>
      
      {/* Call Details Modal */}
      {selectedCall && (
        <CallDetails 
          call={selectedCall} 
          onClose={handleCloseDetails} 
        />
      )}
    </div>
  );
};

export default CallLogs;
