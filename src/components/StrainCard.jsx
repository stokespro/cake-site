import React from 'react'
import { Link } from 'react-router-dom'
import './StrainCard.css'

// Renders a strain "package" card.
// When packaging_image_url is set, swaps in the real mylar photograph.
// Until then, generates an evocative placeholder that uses the strain's accent_color
// so the seven still feel visually distinct in the lineup.
export default function StrainCard({ strain, index = 0 }) {
  const hasImage = Boolean(strain.packaging_image_url)

  return (
    <Link
      to={`/strains/${strain.slug}`}
      className="sc"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="sc-frame">
        {strain.is_current_drop && (
          <span className="sc-tag mono">2026 · Current Drop</span>
        )}

        <div
          className="sc-package"
          style={{ '--accent': strain.accent_color }}
        >
          {hasImage ? (
            <img src={strain.packaging_image_url} alt={`${strain.name} packaging`} />
          ) : (
            <PackagePlaceholder strain={strain} />
          )}
        </div>

        <div className="sc-meta">
          <div className="sc-num mono">№ {String(strain.sort_order).padStart(2, '0')} / 07</div>
          <h3 className="sc-name display">{strain.name}</h3>
          <div className="sc-cross">{strain.cross}</div>
          <div className="sc-tail mono">
            <span>{strain.type}</span>
            <span className="sc-dot">·</span>
            <span>{strain.ratio}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Placeholder package — a mylar-bag silhouette with the strain's accent color
// glowing through. Replaced one-for-one when real photos arrive.
function PackagePlaceholder({ strain }) {
  return (
    <div className="pkg-ph">
      <div className="pkg-ph-bag">
        <div className="pkg-ph-glow" />
        <div className="pkg-ph-zip" />
        <div className="pkg-ph-label">
          <div className="pkg-ph-mark">cake</div>
          <div className="pkg-ph-strain">{strain.name}</div>
          <div className="pkg-ph-grams">3.5g</div>
        </div>
        <div className="pkg-ph-noise" />
      </div>
      <div className="pkg-ph-shadow" />
    </div>
  )
}
