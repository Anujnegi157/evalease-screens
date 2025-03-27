
import React from 'react';
import Card from '@/components/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Users, 
  PhoneCall, 
  PhoneOff, 
  UserCheck, 
  BarChart2, 
  TrendingUp 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Analytics = () => {
  // Mock data for charts and stats
  const callStats = [
    { name: 'Total Calls', value: 32, icon: <PhoneCall size={20} className="text-primary" />, change: '+12%' },
    { name: 'Completed', value: 24, icon: <UserCheck size={20} className="text-green-500" />, change: '+8%' },
    { name: 'Missed', value: 8, icon: <PhoneOff size={20} className="text-red-500" />, change: '-3%' },
    { name: 'Candidates', value: 28, icon: <Users size={20} className="text-amber-500" />, change: '+15%' }
  ];
  
  const monthlyData = [
    { name: 'Jan', calls: 4 },
    { name: 'Feb', calls: 7 },
    { name: 'Mar', calls: 5 },
    { name: 'Apr', calls: 8 },
    { name: 'May', calls: 12 },
    { name: 'Jun', calls: 16 },
    { name: 'Jul', calls: 32 }
  ];
  
  const scoreDistribution = [
    { range: '1-3', count: 2 },
    { range: '4-6', count: 8 },
    { range: '7-8', count: 10 },
    { range: '9-10', count: 4 }
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">
          Track and analyze your screening call performance
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {callStats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.name}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                {stat.icon}
              </div>
            </div>
            <div className={cn(
              "text-xs flex items-center mt-2",
              stat.change.startsWith('+') ? "text-green-500" : "text-red-500"
            )}>
              <TrendingUp size={12} className="mr-1" />
              {stat.change} last month
            </div>
          </Card>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Calls Chart */}
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <BarChart2 size={20} className="text-primary mr-2" />
            <h2 className="text-lg font-semibold">Monthly Calls</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar dataKey="calls" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        {/* Score Distribution Chart */}
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <BarChart2 size={20} className="text-primary mr-2" />
            <h2 className="text-lg font-semibold">Candidate Score Distribution</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={scoreDistribution}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
