import Image from 'next/image'
import { CoverPlaceholder } from './CoverPlaceholder'

// Warm beige blur placeholder (3:2, color --mi-bg-paper #f4e9d2) — evita CLS al cargar portadas
const BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzIiBoZWlnaHQ9IjIiPjxyZWN0IHdpZHRoPSIzIiBoZWlnaHQ9IjIiIGZpbGw9IiNmNGU5ZDIiLz48L3N2Zz4='

type Variant = 'thumb' | 'hero' | 'in-flow'

type Props = {
  piece: {
    coverImage: string | null
    title:      string
    country:    string
    ejePrincipal: string
  }
  variant:   Variant
  priority?: boolean
}

const DIMS = {
  thumb:     { w: 600,  h: 400  },
  hero:      { w: 1500, h: 1000 },
  'in-flow': { w: 900,  h: 600  },
}

export function CoverImage({ piece, variant, priority }: Props) {
  if (!piece.coverImage) {
    if (variant === 'in-flow') return null
    return <CoverPlaceholder piece={piece} variant={variant === 'hero' ? 'hero' : 'thumb'} />
  }

  const { w, h } = DIMS[variant]

  const shadow =
    variant === 'hero'    ? 'var(--mi-shadow-hero)' :
    variant === 'in-flow' ? 'var(--mi-shadow-card)' :
    'var(--mi-shadow-card)'

  return (
    <div
      className={`mi-cover mi-cover--${variant}`}
      style={{
        aspectRatio:  '3 / 2',
        border:       '2px solid var(--mi-ink)',
        boxShadow:    shadow,
        overflow:     'hidden',
        width:        '100%',
        marginBottom: variant === 'hero' ? 'var(--mi-space-6)' : undefined,
      }}
    >
      <Image
        src={piece.coverImage}
        alt={`Portada: ${piece.title}`}
        width={w}
        height={h}
        priority={priority}
        sizes={
          variant === 'hero'
            ? '(min-width: 1200px) 1200px, 100vw'
            : variant === 'in-flow'
              ? '(min-width: 920px) 820px, calc(100vw - 40px)'
              : '(min-width: 1200px) 400px, 50vw'
        }
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  )
}
