
export interface Report {
  id: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  severity: 'low' | 'medium' | 'high';
  status: 'reported' | 'in-progress' | 'resolved';
  images: string[];
  reportedBy: string;
  upvotes: number;
  dateReported: Date;
  dateUpdated?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  reportsSubmitted: number;
  reportsResolved: number;
}
