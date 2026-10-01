const fs = require('fs');

let content = fs.readFileSync('src/app/home/page.js', 'utf8');

// Import useState
if (!content.includes('import { useState }')) {
  content = content.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport { useState } from 'react';");
}

// Add state to component
const stateDecl = 
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState('IN 2 HOURS');
  
  const handleCheckIn = () => {
    setIsCheckedIn(true);
    // Reset check-in state after 5 seconds just for demo purposes
    setTimeout(() => setIsCheckedIn(false), 5000);
  };
  
  const handleChangeTime = () => {
    const times = ['IN 2 HOURS', 'IN 4 HOURS', 'IN 8 HOURS', 'TOMORROW'];
    const currentIndex = times.indexOf(checkInTime);
    setCheckInTime(times[(currentIndex + 1) % times.length]);
  };
;

content = content.replace("  const t = translations[language] || translations['English'];", "  const t = translations[language] || translations['English'];" + stateDecl);

// Change t.in2Hours to use dynamic state, or fallback if translation is not mapped for others
// Actually, since we only have 'in2Hours' translated, let's keep it simple or just use the state string.
// Let's replace the button's onClick handlers.
content = content.replace('<span>{t.in2Hours}</span>', '<span>{isCheckedIn ? "CHECKED IN" : checkInTime === "IN 2 HOURS" ? t.in2Hours : checkInTime}</span>');

content = content.replace(
  '<button className="w-full bg-[#D9913D]',
  '<button onClick={handleCheckIn} className={w-full  '
);

content = content.replace(
  '<span>{t.imSafe}</span>',
  '<span>{isCheckedIn ? "Safe Confirmed" : t.imSafe}</span>'
);

content = content.replace(
  '<button className="w-full bg-[#254F49]',
  '<button onClick={handleChangeTime} className="w-full bg-[#254F49]'
);

// Fix Portable Records Button to Link
content = content.replace(
  '<button className="w-full bg-white p-3.5 md:p-5 rounded-2xl md:rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] border border-stone-100 flex items-center justify-between text-left hover:border-stone-200 transition-all active:scale-[0.98]" type="button">',
  '<Link href="/records" className="w-full bg-white p-3.5 md:p-5 rounded-2xl md:rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] border border-stone-100 flex items-center justify-between text-left hover:border-stone-200 transition-all active:scale-[0.98]">'
);
content = content.replace(
  '</button>\n                </section>',
  '</Link>\n                </section>'
);

// Exit buttons to Link href="/register"
content = content.replace(
  '<button className="md:hidden flex items-center space-x-1 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors text-stone-700 text-xs font-medium" type="button">',
  '<Link href="/register" className="md:hidden flex items-center space-x-1 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors text-stone-700 text-xs font-medium">'
);
content = content.replace(
  '<span>{t.exit}</span>\n              </button>',
  '<span>{t.exit}</span>\n              </Link>'
);

content = content.replace(
  '<button className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors text-stone-700 text-sm font-medium" type="button">',
  '<Link href="/register" className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors text-stone-700 text-sm font-medium">'
);
content = content.replace(
  '<span>{t.exitDisguise}</span>\n          </button>',
  '<span>{t.exitDisguise}</span>\n          </Link>'
);

fs.writeFileSync('src/app/home/page.js', content);
