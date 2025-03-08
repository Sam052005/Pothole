
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReportList from '@/components/ReportList';
import Map from '@/components/Map';
import { Report } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Sample data for demonstration
const generateSampleReports = (): Report[] => {
  const statuses: ('reported' | 'in-progress' | 'resolved')[] = ['reported', 'in-progress', 'resolved'];
  const severities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
  
  return Array.from({ length: 12 }).map((_, i) => ({
    id: `report-${i + 1}`,
    title: `Pothole on ${['Main Street', 'Maple Avenue', 'Oak Lane', 'Cedar Road', 'Pine Drive'][i % 5]}`,
    description: `A ${['small', 'medium', 'large', 'dangerous'][i % 4]} pothole that ${['could damage vehicles', 'is causing traffic to slow down', 'has already damaged multiple vehicles', 'is creating a hazard for cyclists'][i % 4]}.`,
    location: {
      lat: 40 + (Math.random() * 10 - 5),
      lng: -74 + (Math.random() * 10 - 5),
      address: `${100 + i} ${['Main Street', 'Maple Avenue', 'Oak Lane', 'Cedar Road', 'Pine Drive'][i % 5]}, Cityville`
    },
    severity: severities[i % 3],
    status: statuses[i % 3],
    images: i % 3 === 0 ? [] : [`https://source.unsplash.com/random/300x200?pothole&sig=${i}`],
    reportedBy: `User${i + 1}`,
    upvotes: Math.floor(Math.random() * 50),
    dateReported: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
  }));
};

const Dashboard = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from an API
    const timer = setTimeout(() => {
      setReports(generateSampleReports());
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
  };

  const handleUpvoteReport = (report: Report) => {
    setReports(prevReports => 
      prevReports.map(r => 
        r.id === report.id 
          ? { ...r, upvotes: r.upvotes + 1 } 
          : r
      )
    );
    
    toast({
      title: "Upvoted Report",
      description: `You've upvoted '${report.title}'`,
    });
  };

  const getMapMarkers = () => {
    return reports.map(report => ({
      id: report.id,
      lat: report.location.lat,
      lng: report.location.lng,
      title: report.title
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col"
    >
      <Header />
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Community Reports Dashboard
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-foreground/80 max-w-2xl mx-auto"
            >
              Track the status of reported road hazards in your community and view real-time updates.
            </motion.p>
          </div>
          
          <Tabs defaultValue="list" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="map">Map View</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="list" className="mt-0">
              {loading ? (
                <div className="py-20 text-center">
                  <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
                  <p className="text-foreground/70">Loading reports...</p>
                </div>
              ) : (
                <ReportList 
                  reports={reports} 
                  onViewReport={handleViewReport}
                  onUpvoteReport={handleUpvoteReport}
                />
              )}
            </TabsContent>
            
            <TabsContent value="map" className="mt-0">
              <div className="h-[600px] w-full rounded-xl overflow-hidden border border-border mb-6">
                <Map 
                  markers={getMapMarkers()} 
                  selectedMarkerId={selectedReport?.id}
                  interactive={true}
                />
              </div>
              
              {selectedReport && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-xl p-6 border border-border"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {selectedReport.images.length > 0 && (
                      <div className="md:w-1/3">
                        <img 
                          src={selectedReport.images[0]} 
                          alt={selectedReport.title} 
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-medium mb-2">{selectedReport.title}</h3>
                      <p className="text-foreground/80 mb-4">{selectedReport.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-foreground/60 block">Location:</span>
                          <span>{selectedReport.location.address}</span>
                        </div>
                        <div>
                          <span className="text-foreground/60 block">Status:</span>
                          <span className="capitalize">{selectedReport.status.replace('-', ' ')}</span>
                        </div>
                        <div>
                          <span className="text-foreground/60 block">Severity:</span>
                          <span className="capitalize">{selectedReport.severity}</span>
                        </div>
                        <div>
                          <span className="text-foreground/60 block">Date Reported:</span>
                          <span>{new Date(selectedReport.dateReported).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Dashboard;
