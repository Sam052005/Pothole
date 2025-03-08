
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Search, ArrowUpDown } from 'lucide-react';
import { Report } from '@/lib/types';
import ReportCard from './ReportCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ReportListProps {
  reports: Report[];
  onViewReport?: (report: Report) => void;
  onUpvoteReport?: (report: Report) => void;
}

const ReportList = ({ reports, onViewReport, onUpvoteReport }: ReportListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleSeverityChange = (value: string) => {
    setSeverityFilter(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch = 
      searchTerm === '' || 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      report.status === statusFilter;
    
    const matchesSeverity = 
      severityFilter === 'all' || 
      report.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.dateReported).getTime() - new Date(a.dateReported).getTime();
      case 'oldest':
        return new Date(a.dateReported).getTime() - new Date(b.dateReported).getTime();
      case 'upvotes':
        return b.upvotes - a.upvotes;
      case 'severity':
        const severityOrder = { high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity as keyof typeof severityOrder] - 
               severityOrder[a.severity as keyof typeof severityOrder];
      default:
        return 0;
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div>
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" size={18} />
          <Input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 bg-background focus-visible:ring-primary"
          />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="w-full sm:w-auto">
            <Select onValueChange={handleStatusChange} defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="reported">Reported</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-auto">
            <Select onValueChange={handleSeverityChange} defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-auto ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Sort by
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSortChange('newest')}>
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange('oldest')}>
                  Oldest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange('upvotes')}>
                  Most Upvotes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange('severity')}>
                  Severity (High to Low)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {sortedReports.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {sortedReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onView={onViewReport}
                onUpvote={onUpvoteReport}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-secondary/30 rounded-xl border border-border">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SlidersHorizontal size={48} className="mx-auto mb-4 text-foreground/40" />
            <h3 className="text-xl font-medium mb-2">No reports found</h3>
            <p className="text-foreground/60 max-w-md mx-auto">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ReportList;
