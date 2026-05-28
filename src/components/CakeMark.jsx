import React from 'react'

// Inline holographic Cake wordmark. The gradient ID is unique-prefixed
// so multiple instances on a page don't conflict.
export default function CakeMark({ size = 56, holo = true, id = 'mark' }) {
  const gradId = `cake-holo-${id}`
  return (
    <svg
      viewBox="0 0 200 90"
      width={size * (200 / 90)}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
      aria-label="Cake"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd1dc">
            <animate attributeName="stop-color"
              values="#ffd1dc;#b8e0ff;#d4b8ff;#ffe4b8;#b8ffd4;#ffd1dc"
              dur="8s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="#d4b8ff">
            <animate attributeName="stop-color"
              values="#d4b8ff;#ffe4b8;#b8ffd4;#ffd1dc;#b8e0ff;#d4b8ff"
              dur="8s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#b8ffd4">
            <animate attributeName="stop-color"
              values="#b8ffd4;#ffd1dc;#b8e0ff;#d4b8ff;#ffe4b8;#b8ffd4"
              dur="8s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      {/* Flame mark */}
      <path
        d="M 30 18 Q 22 30 28 42 Q 32 50 28 56 Q 36 52 40 44 Q 44 36 38 26 Q 34 20 30 18 Z"
        fill={holo ? `url(#${gradId})` : 'currentColor'}
      />
      {/* "cake" wordmark — custom forms */}
      <g fill={holo ? `url(#${gradId})` : 'currentColor'}>
        {/* c */}
        <path d="M 60 38 Q 60 28 72 28 Q 80 28 82 34 L 76 36 Q 75 32 72 32 Q 66 32 66 38 L 66 52 Q 66 58 72 58 Q 75 58 76 54 L 82 56 Q 80 62 72 62 Q 60 62 60 52 Z" />
        {/* a */}
        <path d="M 88 62 L 88 40 Q 88 28 100 28 Q 112 28 112 40 L 112 62 L 106 62 L 106 56 Q 103 62 97 62 Q 88 62 88 54 Q 88 46 100 46 L 106 46 L 106 40 Q 106 32 100 32 Q 94 32 94 40 L 94 42 L 88 42 Z M 106 50 L 100 50 Q 94 50 94 54 Q 94 58 98 58 Q 106 58 106 52 Z" />
        {/* k */}
        <path d="M 120 62 L 120 16 L 126 16 L 126 42 L 138 28 L 146 28 L 134 42 L 148 62 L 140 62 L 130 48 L 126 52 L 126 62 Z" />
        {/* e */}
        <path d="M 152 50 Q 152 62 164 62 Q 172 62 175 56 L 170 54 Q 168 58 164 58 Q 158 58 158 52 L 158 48 L 176 48 L 176 40 Q 176 28 164 28 Q 152 28 152 40 Z M 158 44 L 158 40 Q 158 32 164 32 Q 170 32 170 40 L 170 44 Z" />
      </g>
    </svg>
  )
}
