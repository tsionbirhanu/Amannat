export default function Logo({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className={className}>
      <rect width="48" height="48" rx="12" fill="#0F172A"/>
      <path d="M24 8L36 13V22C36 30 24 38 24 38C24 38 12 30 12 22V13L24 8Z" fill="#059669" fillOpacity="0.2" stroke="#10B981" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M24 16V30" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M19 20C19 20 20.5 24 24 24C27.5 24 29 20 29 20" stroke="#F8FAFC" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="24" cy="18" r="2.5" fill="#F8FAFC"/>
      <path d="M16 23C15 25 15 27 16.5 29" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
      <path d="M32 23C33 25 33 27 31.5 29" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
