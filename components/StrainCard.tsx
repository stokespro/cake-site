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
  const topTerpenes = strain.flavor_notes?.slice(0, 3).join(', ') || 'Myrcene, Limonene, Caryophyllene';

  return (
    <Link href={`/strains/${strain.slug}`}>
      <motion.div
        className="relative h-[500px] overflow-hidden rounded-lg cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 bg-black">
          {strain.image_url ? (
            <Image
              src={strain.image_url}
              alt={strain.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <span className="text-6xl font-black text-white/10">{strain.name[0]}</span>
            </div>
          )}
        </div>

        {/* Base Overlay (always visible) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Strain Name (always visible) */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h2 className="text-5xl md:text-6xl font-black text-white leading-none mb-2">
            {strain.name}
          </h2>
          <p className="text-white/80 text-lg">{strain.type}</p>
        </div>

        {/* Hover Details Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/90 flex items-center justify-center"
        >
          <div className="text-white p-8 space-y-4 max-w-lg">
            {strain.lineage && (
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide">Lineage</p>
                <p className="text-lg font-medium">{strain.lineage}</p>
              </div>
            )}
            
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide">Effects</p>
              <p className="text-lg font-medium">{topEffects}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide">Terpenes</p>
              <p className="text-lg font-medium">{topTerpenes}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide">THC</p>
              <p className="text-2xl font-bold">{formatPercent(strain.thc_percent)}</p>
            </div>

            <button className="mt-6 border-2 border-white text-white px-6 py-3 rounded font-bold hover:bg-white hover:text-black transition-colors">
              View Full Details →
            </button>
          </div>
        </motion.div>

        {/* Featured Badge */}
        {strain.featured && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded font-bold text-sm">
            Featured
          </div>
        )}
      </motion.div>
    </Link>
  );
}
