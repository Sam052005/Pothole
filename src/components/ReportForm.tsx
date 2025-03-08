
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { AlertTriangle, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from './ImageUpload';
import Map from './Map';

interface FormData {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

const ReportForm = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
  const [step, setStep] = useState(1);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      severity: 'medium',
    },
  });

  const handleLocationSelect = (selectedLocation: { lat: number; lng: number; address?: string }) => {
    setLocation(selectedLocation);
  };

  const handleImagesChange = (uploadedImages: string[]) => {
    setImages(uploadedImages);
  };

  const nextStep = () => {
    if (step === 1 && !location) {
      toast({
        title: "Location Required",
        description: "Please select a location on the map.",
        variant: "destructive",
      });
      return;
    }
    
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const onSubmit = (data: FormData) => {
    if (!location) {
      toast({
        title: "Location Required",
        description: "Please select a location on the map.",
        variant: "destructive",
      });
      return;
    }

    // Simulate form submission
    setSubmitting(true);
    setTimeout(() => {
      console.log({
        ...data,
        location,
        images,
        dateReported: new Date(),
        status: 'reported',
        id: Math.random().toString(36).substring(2, 9),
        reportedBy: 'Anonymous User',
        upvotes: 0,
      });

      setSubmitting(false);
      
      toast({
        title: "Report Submitted",
        description: "Thank you for your report. It has been successfully submitted.",
      });
      
      // Reset form
      setValue('title', '');
      setValue('description', '');
      setValue('severity', 'medium');
      setLocation(null);
      setImages([]);
      setStep(1);
    }, 1500);
  };

  const watchTitle = watch('title');
  const watchDescription = watch('description');
  const watchSeverity = watch('severity');

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Progress indicator */}
        <div className="mb-10 relative">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((stepNumber) => (
              <motion.button
                key={stepNumber}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm relative z-10 ${
                  step >= stepNumber
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => step > stepNumber && setStep(stepNumber)}
                disabled={step < stepNumber}
              >
                {stepNumber}
              </motion.button>
            ))}
          </div>
          <div className="absolute top-5 left-0 right-0 h-[2px] bg-muted -z-0">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ 
                width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" 
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Select Location</h2>
                <p className="text-foreground/70">Pinpoint the exact location of the pothole or road hazard.</p>
              </div>

              <Map onLocationSelect={handleLocationSelect} />

              {location && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-primary/5 rounded-lg border border-primary/20"
                >
                  <div className="flex items-start">
                    <Check className="text-primary mr-2 mt-0.5" size={18} />
                    <div>
                      <h4 className="font-medium">Location Selected</h4>
                      <p className="text-sm text-foreground/70">
                        {location.address || `Coordinates: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-32"
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Upload Photos</h2>
                <p className="text-foreground/70">Add photos to help authorities identify and assess the issue.</p>
              </div>

              <ImageUpload onImagesChange={handleImagesChange} />

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="w-32"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-32"
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Report Details</h2>
                <p className="text-foreground/70">Provide additional information about the road hazard.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="E.g., Large pothole on Main Street"
                    {...register('title', { required: 'Title is required' })}
                    className={errors.title ? 'border-destructive' : ''}
                  />
                  {errors.title && (
                    <p className="text-destructive text-sm mt-1 flex items-center">
                      <AlertTriangle size={12} className="mr-1" />
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the issue in detail (size, depth, any damage it might cause, etc.)"
                    rows={4}
                    {...register('description', { required: 'Description is required' })}
                    className={errors.description ? 'border-destructive' : ''}
                  />
                  {errors.description && (
                    <p className="text-destructive text-sm mt-1 flex items-center">
                      <AlertTriangle size={12} className="mr-1" />
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="severity">Severity</Label>
                  <Select 
                    onValueChange={(value) => setValue('severity', value as 'low' | 'medium' | 'high')}
                    defaultValue={watchSeverity}
                  >
                    <SelectTrigger id="severity">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Minor issue, not urgent</SelectItem>
                      <SelectItem value="medium">Medium - Moderate hazard</SelectItem>
                      <SelectItem value="high">High - Dangerous, needs immediate attention</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="w-32"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-32"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting
                    </>
                  ) : (
                    'Submit'
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default ReportForm;
