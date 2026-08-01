'use client';

import { useState } from 'react';
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

const FIELD =
  'w-full border border-white/20 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/25 outline-none transition-colors focus:border-white/60';
const LABEL = 'micro mb-2 block text-white/45';
const ERROR = 'mt-2 text-sm text-cake-soft';

export function SampleRequestForm({ strains, preselectedStrain }: SampleRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      {/* Success Message */}
      {submitStatus === 'success' && (
        <div className="holo-border mb-10">
          <div className="p-7">
            <h3 className="display text-2xl text-white">Request Received</h3>
            <p className="mt-3 max-w-[52ch] leading-relaxed text-white/70">
              Thanks for your interest in CAKE products. We&apos;ll reach out within 24
              hours to arrange your samples.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {submitStatus === 'error' && (
        <div className="mb-10 border border-cake/60 bg-cake/10 p-7">
          <h3 className="display text-2xl text-white">Something Went Wrong</h3>
          <p className="mt-3 max-w-[52ch] leading-relaxed text-white/70">
            Please try again, or contact us directly using the information below.
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-9">
        {/* Contact Information */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="contact_name" className={LABEL}>
              YOUR NAME *
            </label>
            <input
              {...register('contact_name')}
              type="text"
              id="contact_name"
              className={FIELD}
              placeholder="John Smith"
            />
            {errors.contact_name && <p className={ERROR}>{errors.contact_name.message}</p>}
          </div>

          <div>
            <label htmlFor="dispensary_name" className={LABEL}>
              DISPENSARY NAME *
            </label>
            <input
              {...register('dispensary_name')}
              type="text"
              id="dispensary_name"
              className={FIELD}
              placeholder="Your Dispensary Name"
            />
            {errors.dispensary_name && (
              <p className={ERROR}>{errors.dispensary_name.message}</p>
            )}
          </div>
        </div>

        {/* OMMA License */}
        <div>
          <label htmlFor="omma_license" className={LABEL}>
            OMMA LICENSE NUMBER *
          </label>
          <input
            {...register('omma_license')}
            type="text"
            id="omma_license"
            className={FIELD}
            placeholder="DAAA-XXXX-XXXX"
          />
          {errors.omma_license && <p className={ERROR}>{errors.omma_license.message}</p>}
          <p className="mt-2 text-sm text-white/45">
            We&apos;ll use this to check if you&apos;re already in our system.
          </p>
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="email" className={LABEL}>
              EMAIL *
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className={FIELD}
              placeholder="you@dispensary.com"
            />
            {errors.email && <p className={ERROR}>{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="phone" className={LABEL}>
              PHONE *
            </label>
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              className={FIELD}
              placeholder="(555) 123-4567"
            />
            {errors.phone && <p className={ERROR}>{errors.phone.message}</p>}
          </div>
        </div>

        {/* Strain Selection */}
        <div>
          <span className={LABEL}>WHICH STRAINS ARE YOU INTERESTED IN? * (SELECT ALL)</span>
          {strains.length === 0 ? (
            <p className="border border-white/15 px-4 py-5 text-white/50">
              Strain list is unavailable right now — tell us what you&apos;re after in the
              notes below and we&apos;ll follow up.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {strains.map((strain) => (
                <label
                  key={strain.id}
                  className="flex cursor-pointer items-start border border-white/15 p-4 transition-colors hover:border-white/45"
                >
                  <input
                    {...register('strain_slugs')}
                    type="checkbox"
                    value={strain.slug}
                    className="mr-3 mt-1 accent-cake"
                  />
                  <span>
                    <span className="display block text-base text-white">{strain.name}</span>
                    <span className="micro mt-1 block text-white/40">{strain.type}</span>
                  </span>
                </label>
              ))}
            </div>
          )}
          {errors.strain_slugs && <p className={ERROR}>{errors.strain_slugs.message}</p>}
        </div>

        {/* Additional Notes */}
        <div>
          <label htmlFor="notes" className={LABEL}>
            ADDITIONAL NOTES (OPTIONAL)
          </label>
          <textarea
            {...register('notes')}
            id="notes"
            rows={4}
            className={FIELD}
            placeholder="Any additional information or questions..."
          />
        </div>

        {/* Submit */}
        <div className="holo-border w-full sm:w-auto sm:inline-block">
          <button
            type="submit"
            disabled={isSubmitting}
            className="micro w-full px-9 py-5 text-white transition-colors duration-300 hover:!bg-transparent hover:text-ink disabled:cursor-not-allowed disabled:text-white/40 disabled:hover:!bg-ink disabled:hover:text-white/40"
          >
            {isSubmitting ? 'SUBMITTING…' : 'REQUEST SAMPLES'}
          </button>
        </div>
      </form>
    </div>
  );
}
