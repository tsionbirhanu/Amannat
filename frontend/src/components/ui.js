// Shared UI building blocks. Every page uses these so spacing, colour and type
// stay consistent. Colours come from tailwind.config.js:
//   brand  = deep green (primary actions, navigation)
//   accent = amber (main call to action, the assistant)
//   danger = red (emergencies only)
//   sand   = warm neutral backgrounds
import Link from 'next/link';

const cx = (...classes) => classes.filter(Boolean).join(' ');

export function Icon({ name, filled = false, className = '' }) {
  return (
    <span aria-hidden="true" className={cx('material-symbols-outlined leading-none select-none', filled && 'filled', className)}>
      {name}
    </span>
  );
}

const BUTTON_VARIANTS = {
  primary: 'bg-brand-800 text-white hover:bg-brand-900',
  accent: 'bg-accent-500 text-stone-900 hover:bg-accent-400',
  secondary: 'bg-white text-stone-800 border border-stone-300 hover:bg-sand-100',
  danger: 'bg-danger-600 text-white hover:bg-danger-700',
  ghost: 'text-brand-700 hover:bg-brand-50',
};
const BUTTON_SIZES = {
  md: 'h-12 px-5 text-[15px] rounded-xl gap-2',
  sm: 'h-9 px-3.5 text-sm rounded-lg gap-1.5',
};

/** A button, or a link styled as one when `href` is given. */
export function Button({ variant = 'primary', size = 'md', icon, href, className = '', children, ...props }) {
  const classes = cx(
    'inline-flex items-center justify-center font-semibold transition-colors active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap',
    BUTTON_VARIANTS[variant],
    BUTTON_SIZES[size],
    className
  );
  const content = (
    <>
      {icon && <Icon name={icon} className={size === 'sm' ? 'text-[18px]' : 'text-[20px]'} />}
      {children}
    </>
  );
  if (href) {
    const external = /^https?:/.test(href);
    return external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>{content}</a>
    ) : (
      <Link href={href} className={classes} {...props}>{content}</Link>
    );
  }
  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}

export function Card({ as: Tag = 'section', className = '', children, ...props }) {
  return (
    <Tag className={cx('bg-white rounded-2xl border border-sand-200 p-5', className)} {...props}>
      {children}
    </Tag>
  );
}

/** Page title with an optional back link and action on the right. */
export function PageHeader({ title, subtitle, backHref, action }) {
  return (
    <header className="flex items-start justify-between gap-4 mb-6">
      <div className="flex items-start gap-3 min-w-0">
        {backHref && (
          <Link
            href={backHref}
            aria-label="Back"
            className="mt-0.5 w-10 h-10 shrink-0 rounded-full bg-white border border-sand-200 flex items-center justify-center text-stone-700 hover:bg-sand-100"
          >
            <Icon name="arrow_back" className="text-[20px]" />
          </Link>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900 leading-tight">{title}</h1>
          {subtitle && <p className="text-[15px] text-stone-600 mt-1">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

export function SectionTitle({ children, action }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-3">
      <h2 className="text-base font-semibold text-stone-900">{children}</h2>
      {action}
    </div>
  );
}

const NOTICE_TONES = {
  info: 'bg-brand-50 text-brand-900 border-brand-100',
  success: 'bg-brand-50 text-brand-800 border-brand-200',
  warning: 'bg-accent-50 text-accent-700 border-accent-100',
  error: 'bg-danger-50 text-danger-700 border-danger-100',
};
const NOTICE_ICONS = { info: 'info', success: 'check_circle', warning: 'warning', error: 'error' };

export function Notice({ tone = 'info', children, className = '' }) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cx('flex items-start gap-2.5 rounded-xl border px-4 py-3 text-[15px]', NOTICE_TONES[tone], className)}
    >
      <Icon name={NOTICE_ICONS[tone]} className="text-[20px] mt-px shrink-0" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

const BADGE_TONES = {
  success: 'bg-brand-50 text-brand-700',
  warning: 'bg-accent-50 text-accent-700',
  danger: 'bg-danger-50 text-danger-700',
  neutral: 'bg-sand-100 text-stone-700',
};

export function Badge({ tone = 'neutral', icon, children }) {
  return (
    <span className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[13px] font-semibold', BADGE_TONES[tone])}>
      {icon && <Icon name={icon} className="text-[16px]" />}
      {children}
    </span>
  );
}

export const inputClass =
  'w-full h-12 rounded-xl border border-stone-300 bg-white px-4 text-[15px] text-stone-900 placeholder:text-stone-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20';
export const textareaClass =
  'w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-[15px] text-stone-900 placeholder:text-stone-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20';

/** Label + control + optional hint, stacked. */
export function Field({ label, hint, htmlFor, children, className = '' }) {
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-stone-700">{label}</label>
      {children}
      {hint && <p className="text-sm text-stone-500">{hint}</p>}
    </div>
  );
}

/** A tappable row: icon, title, optional subtitle, chevron. */
export function ListLink({ href, icon, title, subtitle, onClick, tone = 'brand' }) {
  const iconTone = tone === 'danger' ? 'bg-danger-50 text-danger-600' : tone === 'accent' ? 'bg-accent-50 text-accent-700' : 'bg-brand-50 text-brand-700';
  const inner = (
    <>
      <span className={cx('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', iconTone)}>
        <Icon name={icon} className="text-[22px]" />
      </span>
      <span className="flex-1 min-w-0 text-left">
        <span className="block text-[15px] font-semibold text-stone-900">{title}</span>
        {subtitle && <span className="block text-sm text-stone-500 mt-0.5">{subtitle}</span>}
      </span>
      <Icon name="chevron_right" className="text-[22px] text-stone-400 rtl:rotate-180" />
    </>
  );
  const classes = 'flex items-center gap-3.5 w-full p-4 bg-white rounded-2xl border border-sand-200 hover:border-brand-200 hover:bg-brand-50/30 transition-colors';
  return href ? (
    <Link href={href} className={classes}>{inner}</Link>
  ) : (
    <button type="button" onClick={onClick} className={classes}>{inner}</button>
  );
}

export function EmptyState({ icon, title, children, action }) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-4">
      <span className="w-14 h-14 rounded-2xl bg-sand-100 text-stone-500 flex items-center justify-center mb-3">
        <Icon name={icon} className="text-[28px]" />
      </span>
      <p className="text-base font-semibold text-stone-900">{title}</p>
      {children && <p className="text-[15px] text-stone-600 mt-1 max-w-sm">{children}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Spinner({ label = 'Loading…' }) {
  return (
    <div role="status" className="flex items-center gap-2 text-stone-500 text-[15px] py-6 justify-center">
      <span className="w-4 h-4 rounded-full border-2 border-stone-300 border-t-brand-600 animate-spin" />
      {label}
    </div>
  );
}
