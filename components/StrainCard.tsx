'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Strain } from '@/lib/types';
import { formatPercent } from '@/lib/utils';

interface StrainCardProps {
  strain: Strain;
}

export function StrainCard({ strain }: StrainCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Get top 3 effects
  const topEffects = strain.effects?.slice(0, 3).join(', ') || 'Relaxing';

  // For terpenes, we'll show placeholder data if not available
  const topTerpenes =
    strain.flavor_notes?.slice(0, 3).join(', ') || 'Myrcene, Limonene, Caryophyllene';

  return (
    <Link href={`/strains/${strain.slug}`} className="block">
      <motion.div
        className="group relative h-[500px] cursor-pointer overflow-hidden border border-white/10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 bg-ink">
          {strain.image_url ? (
            <Image
              src={strain.image_url}
              alt={strain.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-smoke">
              <span className="display text-[9rem] leading-none text-white/[0.06]">
                {strain.name[0]}
              </span>
            </div>
          )}
        </div>

        {/* Base Overlay (always visible) */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

        {/* Strain Name (always visible) */}
        <div className="absolute inset-x-0 bottom-0 p-8">
          <h2 className="display display-tight text-[clamp(2rem,4vw,3.4rem)] text-white">
            {strain.name}
          </h2>
          <p className="micro mt-3 text-white/55">{strain.type}</p>
        </div>

        {/* Hover Details Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center bg-ink/95"
        >
          <dl className="max-w-lg space-y-5 p-8 text-white">
            {strain.lineage && (
              <div>
                <dt className="micro text-white/35">LINEAGE</dt>
                <dd className="mt-1 text-lg">{strain.lineage}</dd>
              </div>
            )}

            <div>
              <dt className="micro text-white/35">EFFECTS</dt>
              <dd className="mt-1 text-lg">{topEffects}</dd>
            </div>

            <div>
              <dt className="micro text-white/35">TERPENES</dt>
              <dd className="mt-1 text-lg">{topTerpenes}</dd>
            </div>

            <div>
              <dt className="micro text-white/35">THC</dt>
              <dd className="display mt-1 text-3xl">{formatPercent(strain.thc_percent)}</dd>
            </div>

            {/* A span, not a button: this whole card is already an <a>, and a
                button inside an anchor is invalid HTML. */}
            <span className="micro mt-7 inline-flex items-center gap-3 border border-white/40 px-6 py-4 text-white transition-colors group-hover:border-white">
              VIEW FULL DETAILS
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </dl>
        </motion.div>

        {/* Featured Badge */}
        {strain.featured && (
          <div className="micro absolute right-4 top-4 bg-cake px-4 py-2 text-white">
            FEATURED
          </div>
        )}
      </motion.div>
    </Link>
  );
}
