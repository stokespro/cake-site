'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Strain } from '@/lib/types';

const sampleRequestSchema = z.object({
  contact_name: z.string().min(2, 'Name is required'),
  dispensary_name: z.string().min(2, 'Dispensary name is required'),
  omma_license: z.string().min(5, 'Valid OMMA license number is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  strain_slugs: z.array(z.string()).min(1, 'Select at least one strain'),
  notes: z.string().optional(),
});

type SampleRequestForm = z.infer<typeof sampleRequestSchema>;

interface SampleRequestFormProps {
  strains: Strain[];
  preselectedStrain?: string;
}

export function SampleRequestForm({ strains, preselectedStrain }: SampleRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SampleRequestForm>({
    resolver: zodResolver(sampleRequestSchema),
    defaultValues: {
      strain_slugs: preselectedStrain ? [preselectedStrain] : [],
    },
  });

  const onSubmit = async (data: SampleRequestForm) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/sample-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      setSubmitStatus('success');
      reset();
      
      // Scroll to success message
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Success Message */}
      {submitStatus === 'success' && (
        <div className="mb-8 p-6 bg-green-50 border-2 border-green-600 rounded-lg">
          <h3 className="text-2xl font-bold text-green-900 mb-2">
            Request Received!
          </h3>
          <p className="text-green-800">
            Thanks for your interest in CAKE products. We'll reach out within 24 hours 
            to arrange your samples.
          </p>
        </div>
      )}

      {/* Error Message */}
      {submitStatus === 'error' && (
        <div className="mb-8 p-6 bg-red-50 border-2 border-red-600 rounded-lg">
          <h3 className="text-2xl font-bold text-red-900 mb-2">
            Something Went Wrong
          </h3>
          <p className="text-red-800">
            Please try again or contact us directly at the information below.
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="contact_name" className="block text-sm font-bold mb-2">
              Your Name *
            </label>
            <input
              {...register('contact_name')}
              type="text"
              id="contact_name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:border-black outline-none transition-colors"
              placeholder="John Smith"
            />
            {errors.contact_name && (
              <p className="mt-1 text-sm text-red-600">{errors.contact_name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="dispensary_name" className="block text-sm font-bold mb-2">
              Dispensary Name *
            </label>
            <input
              {...register('dispensary_name')}
              type="text"
              id="dispensary_name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:border-black outline-none transition-colors"
              placeholder="Your Dispensary Name"
            />
            {errors.dispensary_name && (
              <p className="mt-1 text-sm text-red-600">{errors.dispensary_name.message}</p>
            )}
          </div>
        </div>

        {/* OMMA License */}
        <div>
          <label htmlFor="omma_license" className="block text-sm font-bold mb-2">
            OMMA License Number *
          </label>
          <input
            {...register('omma_license')}
            type="text"
            id="omma_license"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:border-black outline-none transition-colors"
            placeholder="DAAA-XXXX-XXXX"
          />
          {errors.omma_license && (
            <p className="mt-1 text-sm text-red-600">{errors.omma_license.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-600">
            We'll use this to check if you're already in our system
          </p>
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-bold mb-2">
              Email *
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:border-black outline-none transition-colors"
              placeholder="you@dispensary.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-bold mb-2">
              Phone *
            </label>
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:border-black outline-none transition-colors"
              placeholder="(555) 123-4567"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Strain Selection */}
        <div>
          <label className="block text-sm font-bold mb-4">
            Which strains are you interested in? * (Select all that apply)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strains.map((strain) => (
              <label
                key={strain.id}
                className="flex items-start p-4 border-2 border-gray-300 rounded cursor-pointer hover:border-black transition-colors"
              >
                <input
                  {...register('strain_slugs')}
                  type="checkbox"
                  value={strain.slug}
                  className="mt-1 mr-3"
                />
                <div>
                  <div className="font-bold">{strain.name}</div>
                  <div className="text-sm text-gray-600">{strain.type}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.strain_slugs && (
            <p className="mt-2 text-sm text-red-600">{errors.strain_slugs.message}</p>
          )}
        </div>

        {/* Additional Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-bold mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            {...register('notes')}
            id="notes"
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:border-black outline-none transition-colors"
            placeholder="Any additional information or questions..."
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 text-white py-4 px-6 rounded font-bold text-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Request Samples'}
          </button>
        </div>
      </form>
    </div>
  );
}
