export default function Addapartment() {
  return (
    <div >
      <h1>הוסף דירה חדשה</h1>

      <form>
        <div>
          <label>כותרת:</label>
          <input type="text" placeholder="כותרת הדירה" />
        </div>

        <div>
          <label>מחיר:</label>
          <input type="number" placeholder="מחיר לחודש" />
        </div>

        <div>
          <label>מיקום:</label>
          <input type="text" placeholder="עיר, רחוב" />
        </div>

        <div>
          <label>מספר חדרים:</label>
          <input type="number" placeholder="2, 3, 4..." />
        </div>

        <div>
          <label>תיאור:</label>
          <textarea placeholder="תאר את הדירה..."></textarea>
        </div>

        <button type="submit">פרסם דירה</button>
      </form>
    </div>
  )
}