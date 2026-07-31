'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { pricing } from '@/lib/features'

const EASE = [0.16, 1, 0.3, 1] as const

/** Wholesale pricing lifted verbatim from the CAKEMENU2026 master. */
export function PricingBlock() {
  return (
    <section className="relative bg-bone px-5 py-24 text-ink md:px-10 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b-[3px] border-ink pb-5">
          <div className="flex items-end gap-6">
            {/* The holo mark only reads on a light ground — this is the one
                section where it can be used at full colour. */}
            <div className="relative hidden h-[62px] w-[90px] shrink-0 sm:block">
              <Image
                src="/brand/cake-holo.webp"
                alt="CAKE"
                fill
                sizes="90px"
                className="object-contain object-bottom"
              />
            </div>
            <h2 className="display text-[clamp(2.4rem,6vw,5rem)]">Wholesale</h2>
          </div>
          <div className="text-right">
            <div className="micro text-[#8a8a86]">FULL PANEL LABS</div>
            <div className="mt-1 text-[13px] font-bold">cakeoklahoma.com/labs</div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
          {pricing.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              className="bg-[#f4f4f2] p-7 md:p-10"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="display text-[clamp(1.8rem,3.2vw,2.6rem)]">{p.name}</h3>
                <span className="text-sm italic text-[#555]">{p.tagline}</span>
              </div>

              <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed">{p.desc}</p>
              <p className="micro mt-3 text-[#8a8a86]">{p.caseSize}</p>

              <table className="mt-8 w-full border-collapse text-[15px]">
                <thead>
                  <tr>
                    <th className="micro bg-ink px-3.5 py-2.5 text-left text-white">CASES</th>
                    <th className="micro bg-ink px-3.5 py-2.5 text-right text-white">UNIT PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  {p.rows.map((r) => (
                    <tr key={r.tier}>
                      <td className="border-b border-[#dcdcd8] bg-white px-3.5 py-3">{r.tier}</td>
                      <td className="border-b border-[#dcdcd8] bg-white px-3.5 py-3 text-right font-bold">
                        {r.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          ))}
        </div>

        <p className="micro mt-8 text-[#8a8a86]">
          PRICING CURRENT AS OF THE 2026 MENU · LICENSED OKLAHOMA DISPENSARIES ONLY
        </p>
      </div>
    </section>
  )
}
