
import React, { useState } from 'react';
import { Call } from '@/types';
import CallLogItem from '@/components/CallLogItem';
import CallDetails from '@/components/CallDetails';
import { Search, Filter, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

const CallLogs = () => {
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Fetch call logs from the API
  const { data: apiCalls, isLoading, error } = useQuery({
    queryKey: ['callLogs'],
    queryFn: async () => {
      const response = await fetch("https://api.vapi.ai/call", {
        method: "GET",
        headers: {
          "Authorization": "Bearer 335f14fd-894a-44da-b89b-0c425f9dcc78"
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch call logs');
      }
      
      const data = await response.json();
      return data;
    }
  });
  
  // Transform API data to match our Call type structure
  const transformedCalls: Call[] = React.useMemo(() => {
    if (!apiCalls) return [];
    
    return apiCalls.map((call: any) => ({
      id: call.id,
      candidateName: call.customer?.name || 'Unknown',
      candidatePhone: call.customer?.number || 'No number',
      jobDescription: 'Job details unavailable', // These fields aren't in the API response
      questionnaire: 'Questionnaire unavailable', // These fields aren't in the API response
      dateTime: call.createdAt,
      status: call.status === 'ended' ? 'completed' : 
              call.status === 'queued' ? 'scheduled' : 'missed',
      duration: call.duration ? Math.ceil(call.duration / 60) : undefined, // Convert seconds to minutes
      evaluation: call.status === 'ended' ? {
        score: 0, // Default values since API doesn't provide evaluation
        strengths: [],
        weaknesses: [],
        recommendation: '',
        fit: 'medium' as 'high' | 'medium' | 'low'
      } : undefined
    }));
  }, [apiCalls]);
  
  // Filter and search logic
  const filteredCalls = transformedCalls
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

  // For debugging
  console.log('API Calls:', apiCalls);
  console.log('Transformed Calls:', transformedCalls);

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
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading call logs...</span>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-500">Failed to load call logs. Please try again later.</p>
        </div>
      )}
      
      {/* Call Logs List */}
      {!isLoading && !error && (
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
      )}
      
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
