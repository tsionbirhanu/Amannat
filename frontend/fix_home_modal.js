const fs = require('fs');

let content = fs.readFileSync('src/app/home/page.js', 'utf8');

// Ensure useEffect is imported
if (!content.includes('import { useState, useEffect }')) {
  content = content.replace("import { useState }", "import { useState, useEffect }");
}

const newLogic = 
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTimeStr, setCheckInTimeStr] = useState('IN 2 HOURS');
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [checkInExpiry, setCheckInExpiry] = useState(null);

  useEffect(() => {
    // Check every second if the check-in has expired
    const interval = setInterval(() => {
      if (isCheckedIn && checkInExpiry && new Date() > checkInExpiry) {
        setIsCheckedIn(false);
        setCheckInExpiry(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isCheckedIn, checkInExpiry]);
  
  const handleCheckIn = () => {
    setIsCheckedIn(true);
    // Parse the checkInTimeStr roughly to set an expiry
    let expiry = new Date();
    if (checkInTimeStr.includes('2 HOURS')) {
      expiry.setHours(expiry.getHours() + 2);
    } else if (checkInTimeStr.includes('4 HOURS')) {
      expiry.setHours(expiry.getHours() + 4);
    } else if (checkInTimeStr.includes('8 HOURS')) {
      expiry.setHours(expiry.getHours() + 8);
    } else if (checkInTimeStr.includes('TOMORROW')) {
      expiry.setDate(expiry.getDate() + 1);
    } else if (selectedDate) {
      expiry = new Date(selectedDate);
    } else {
      expiry.setMinutes(expiry.getMinutes() + 1); // fallback 1 min
    }
    setCheckInExpiry(expiry);
  };
  
  const handleChangeTime = () => {
    setShowTimeModal(true);
  };

  const handleSaveTime = () => {
    setShowTimeModal(false);
    if (selectedDate) {
      const d = new Date(selectedDate);
      // Format simple string
      setCheckInTimeStr(d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
    }
  };
;

content = content.replace(/  const \[isCheckedIn, setIsCheckedIn\] = useState\(false\);[\s\S]*?  const handleChangeTime = \(\) => {[\s\S]*?  };/, newLogic);

// Add the modal HTML before the final </main> tag
const modalHtml = 
        {showTimeModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl flex flex-col space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Set Check-in Time</h3>
              <p className="text-sm text-stone-500">Choose when you want your next safety check-in to be due.</p>
              
              <input 
                type="datetime-local" 
                className="w-full bg-stone-100 border border-stone-200 rounded-xl px-4 py-3 text-stone-700 outline-none focus:ring-2 focus:ring-teal-500"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              
              <div className="flex space-x-3 pt-2">
                <button 
                  onClick={() => setShowTimeModal(false)}
                  className="flex-1 py-3 px-4 bg-stone-100 text-stone-700 font-medium rounded-xl hover:bg-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveTime}
                  className="flex-1 py-3 px-4 bg-[#183B36] text-white font-medium rounded-xl hover:bg-[#254F49] transition-colors"
                >
                  Save Time
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
;

content = content.replace('      </main>', modalHtml);

// Fix the display of time
content = content.replace(
  '{isCheckedIn ? "CHECKED IN" : checkInTime === \\'IN 2 HOURS\\' ? t.in2Hours : checkInTime}',
  '{isCheckedIn ? "CHECKED IN" : checkInTimeStr === \\'IN 2 HOURS\\' ? t.in2Hours : checkInTimeStr}'
);
content = content.replace(
  '{isCheckedIn ? "CHECKED IN" : checkInTime === \\'IN 2 HOURS\\' ? t.in2Hours : checkInTime}',
  '{isCheckedIn ? "CHECKED IN" : checkInTimeStr === \\'IN 2 HOURS\\' ? t.in2Hours : checkInTimeStr}'
); // doing it twice in case or just use global replace if needed. Let's just fix it.

content = content.replace(/checkInTime === /g, 'checkInTimeStr === ');
content = content.replace(/{isCheckedIn \? "CHECKED IN" : checkInTimeStr === 'IN 2 HOURS' \? t\.in2Hours : checkInTime}/g, '{isCheckedIn ? "CHECKED IN" : checkInTimeStr === \\'IN 2 HOURS\\' ? t.in2Hours : checkInTimeStr}');


fs.writeFileSync('src/app/home/page.js', content);
