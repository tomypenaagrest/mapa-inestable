const EJE_COLOR: Record<string, string> = {
  deculturacion:     'var(--mi-axis-deculturacion)',
  mediaciones:       'var(--mi-axis-mediaciones)',
  desrepresentacion: 'var(--mi-axis-desrepresentacion)',
  estetizacion:      'var(--mi-axis-estetizacion)',
  desorientacion:    'var(--mi-axis-desorientacion)',
  atencion:          'var(--mi-axis-atencion)',
}

type Variant = 'thumb' | 'hero'

type Props = {
  piece: { country: string; ejePrincipal: string; title: string }
  variant: Variant
}

export function CoverPlaceholder({ piece, variant }: Props) {
  const bg = EJE_COLOR[piece.ejePrincipal] ?? 'var(--mi-bg-dark)'
  const fontSize = variant === 'hero' ? 'clamp(28px, 4vw, 56px)' : 'var(--mi-text-3xl)'

  return (
    <div
      className={`mi-cover-placeholder mi-cover-placeholder--${variant} mi-grain`}
      style={{
        aspectRatio:     '3 / 2',
        backgroundColor: bg,
        border:          '2px solid var(--mi-ink)',
        boxShadow:       variant === 'hero' ? 'var(--mi-shadow-hero)' : 'var(--mi-shadow-card)',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        padding:         'var(--mi-space-4)',
        color:           'var(--mi-bg-paper)',
        textShadow:      '3px 3px 0 var(--mi-ink)',
        marginBottom:    variant === 'hero' ? 'var(--mi-space-6)' : undefined,
      }}
    >
      <h2
        style={{
          fontFamily:    'var(--mi-font-display)',
          fontSize,
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          lineHeight:    0.9,
          textAlign:     'center',
          margin:        0,
        }}
      >
        {piece.country}
      </h2>
    </div>
  )
}
