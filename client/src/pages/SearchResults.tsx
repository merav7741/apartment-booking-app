export default function SearchResults() {
  return (
    <div className="search-results">
      <h1>תוצאות חיפוש</h1>

      <div className="filters">
        <input type="number" placeholder="מחיר מקסימום" />
        <input type="text" placeholder="מיקום" />
        <button>סנן</button>
      </div>

      <div className="results">
        <p>כאן יופיעו תוצאות החיפוש...</p>
      </div>
    </div>
  )
}