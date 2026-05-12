import React from 'react'

type ImageCarouselProps = {
  imageUrls: string[]
  activeIndex: number
  onPrev: () => void
  onNext: () => void
  onSelect: (index: number) => void
}

export default function ImageCarousel({ imageUrls, activeIndex, onPrev, onNext, onSelect }: ImageCarouselProps) {
  return (
    <div style={carouselWrapperStyle as React.CSSProperties}>
      <img
        src={imageUrls[activeIndex] || 'https://via.placeholder.com/1200x700?text=No+Image'}
        style={mainImgStyle}
      />

      {imageUrls.length > 1 && (
        <div style={carouselControlsStyle as React.CSSProperties}>
          <button type="button" onClick={onPrev} style={carouselNavButtonStyle as React.CSSProperties}>‹</button>
          <button type="button" onClick={onNext} style={carouselNavButtonStyle as React.CSSProperties}>›</button>
        </div>
      )}

      {imageUrls.length > 1 && (
        <div style={thumbsRowStyle}>
          {imageUrls.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => onSelect(index)}
              style={thumbButtonStyle(index === activeIndex)}
            >
              <img src={src} style={thumbImgStyle} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const carouselWrapperStyle = { position: 'relative', marginBottom: '25px' };
const mainImgStyle = { width: '100%', height: '500px', objectFit: 'cover' as const, borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' };
const carouselControlsStyle = { position: 'absolute', top: '50%', left: 0, right: 0, display: 'flex', justifyContent: 'space-between', transform: 'translateY(-50%)', padding: '0 10px', pointerEvents: 'none' };
const carouselNavButtonStyle = { pointerEvents: 'auto', width: '44px', height: '44px', borderRadius: '999px', border: 'none', backgroundColor: 'rgba(15,23,42,0.78)', color: 'white', fontSize: '24px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(0,0,0,0.18)', transition: 'transform 0.2s' };
const thumbsRowStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '12px', marginTop: '18px' };
const thumbButtonStyle = (isActive: boolean): React.CSSProperties => ({
  border: isActive ? '2px solid #2563eb' : '1px solid #e5e7eb',
  borderRadius: '16px',
  overflow: 'hidden',
  padding: 0,
  background: 'white',
  cursor: 'pointer'
});
const thumbImgStyle = { width: '100%', height: '80px', objectFit: 'cover' as const, display: 'block' };
