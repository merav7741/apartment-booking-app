require('dotenv').config();
const mongoose = require('mongoose');
const Apartment = require('./models/Apartment');

// התחבר לדטאביס
async function migrateAmenities() {
  try {
    const connectionString = process.env.CONNECTION_STRING;
    if (!connectionString) {
      throw new Error('CONNECTION_STRING לא מוגדר ב-.env');
    }

    // התחבר ל-MongoDB באמצעות אותו קונקשן שבו משתמש השרת
    await mongoose.connect(connectionString);
    console.log('✅ התחברנו לדטאביס בהצלחה');

    // חפש את כל הדירות שיש להן amenities
    const apartmentsWithAmenities = await Apartment.find({ amenities: { $exists: true, $ne: [] } });
    console.log(`📊 מצאנו ${apartmentsWithAmenities.length} דירות עם amenities`);

    if (apartmentsWithAmenities.length === 0) {
      console.log('✨ אין דירות שיש להן amenities - הכל כבר מעודכן!');
      await mongoose.connection.close();
      return;
    }

    // עדכן את כל הדירות
    let updatedCount = 0;
    for (const apartment of apartmentsWithAmenities) {
      try {
        // העבר amenities ל-characteristics
        const updateResult = await Apartment.findByIdAndUpdate(
          apartment._id,
          {
            characteristics: apartment.amenities || [],
            $unset: { amenities: 1 } // מחק את amenities
          },
          { new: true }
        );

        updatedCount++;
        console.log(`✓ עודכנה דירה: ${apartment.name} (${updatedCount}/${apartmentsWithAmenities.length})`);
      } catch (err) {
        console.error(`❌ שגיאה בעדכון דירה ${apartment.name}:`, err.message);
      }
    }

    console.log(`\n🎉 בוצע בהצלחה! עודכנו ${updatedCount} דירות`);
    
  } catch (err) {
    console.error('❌ שגיאה:', err);
  } finally {
    // סגור את החיבור
    await mongoose.connection.close();
    console.log('🔌 סגרנו את חיבור הדטאביס');
    process.exit(0);
  }
}

// הרץ את ה-migration
migrateAmenities();
