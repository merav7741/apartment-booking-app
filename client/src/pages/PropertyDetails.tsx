import { useParams } from 'react-router-dom'

export default function PropertyDetails() {
  const { id } = useParams()

  return (
    <div className="property-details">
      <h1>פרטי דירה #{id}</h1>

      <div className="property-info">
        <h2>דירה יפה בתל אביב</h2>
        <p>מחיר: ₪5,000</p>
        <p>מיקום: תל אביב, ישראל</p>
        <p>חדרים: 3</p>
        <p>שטח: 85 מ"ר</p>
      </div>

      <div className="property-images">
        <p>כאן יופיעו תמונות הדירה...</p>
      </div>

      <button>צור קשר</button>
    </div>
  )
}