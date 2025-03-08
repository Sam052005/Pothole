
import React from 'react';
import { motion } from 'framer-motion';
import { Eye, ThumbsUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Report } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface ReportCardProps {
  report: Report;
  onView?: (report: Report) => void;
  onUpvote?: (report: Report) => void;
}

const ReportCard = ({ report, onView, onUpvote }: ReportCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'medium':
        return <AlertTriangle size={16} className="text-amber-500" />;
      case 'low':
        return <AlertTriangle size={16} className="text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reported':
        return <Clock size={16} />;
      case 'in-progress':
        return <Clock size={16} />;
      case 'resolved':
        return <CheckCircle size={16} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-xl overflow-hidden h-full flex flex-col border border-border"
    >
      <div className="relative h-40 overflow-hidden">
        {report.images.length > 0 ? (
          <img
            src={report.images[0]}
            alt={report.title}
            className="w-full h-full object-cover transition-transform duration-400 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center text-foreground/40">
            No image available
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className={`flex items-center gap-1 ${getStatusColor(report.status)}`}>
            {getStatusIcon(report.status)}
            <span className="capitalize">{report.status.replace('-', ' ')}</span>
          </Badge>
          
          <Badge variant="secondary" className="flex items-center gap-1">
            {getSeverityIcon(report.severity)}
            <span className="capitalize">{report.severity}</span>
          </Badge>
        </div>
      </div>
      
      <div className="flex flex-col flex-grow p-4">
        <h3 className="text-lg font-medium mb-2 line-clamp-1">{report.title}</h3>
        <p className="text-sm text-foreground/70 mb-4 line-clamp-2">{report.description}</p>
        
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between text-xs text-foreground/60">
            <span>Reported {formatDistanceToNow(new Date(report.dateReported), { addSuffix: true })}</span>
            <span>{report.upvotes} upvotes</span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onUpvote?.(report)}
            >
              <ThumbsUp size={14} className="mr-1" />
              Upvote
            </Button>
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => onView?.(report)}
            >
              <Eye size={14} className="mr-1" />
              View
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportCard;
