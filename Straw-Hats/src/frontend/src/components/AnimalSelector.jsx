import { Check } from 'lucide-react'

/* ── Custom SVG icon components (no emojis) ─────────────────────── */

function CattleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 18c2-6 6-6 8 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
      <path d="M46 18c2-6 6-6 8 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
      <ellipse cx="32" cy="30" rx="18" ry="12" fill="currentColor" opacity="0.5"/>
      <circle cx="24" cy="26" r="2.5" fill="currentColor" opacity="0.9"/>
      <circle cx="40" cy="26" r="2.5" fill="currentColor" opacity="0.9"/>
      <ellipse cx="32" cy="34" rx="7" ry="4.5" fill="currentColor" opacity="0.25"/>
      <circle cx="29" cy="34" r="1.2" fill="currentColor" opacity="0.6"/>
      <circle cx="35" cy="34" r="1.2" fill="currentColor" opacity="0.6"/>
      <rect x="18" y="40" width="4" height="12" rx="2" fill="currentColor" opacity="0.6"/>
      <rect x="42" y="40" width="4" height="12" rx="2" fill="currentColor" opacity="0.6"/>
      <path d="M50 44c4 2 6 0 6-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
    </svg>
  )
}

function GoatIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 14l-4-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
      <path d="M44 14l4-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
      <ellipse cx="32" cy="30" rx="16" ry="11" fill="currentColor" opacity="0.5"/>
      <circle cx="25" cy="26" r="2" fill="currentColor" opacity="0.9"/>
      <circle cx="39" cy="26" r="2" fill="currentColor" opacity="0.9"/>
      <path d="M30 34c1 1.5 3 1.5 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <path d="M28 38c2 3 6 3 8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
      <rect x="20" y="39" width="3.5" height="12" rx="1.75" fill="currentColor" opacity="0.6"/>
      <rect x="40" y="39" width="3.5" height="12" rx="1.75" fill="currentColor" opacity="0.6"/>
    </svg>
  )
}

function PoultryIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="36" rx="14" ry="12" fill="currentColor" opacity="0.5"/>
      <circle cx="32" cy="20" r="9" fill="currentColor" opacity="0.6"/>
      <circle cx="29" cy="18" r="1.8" fill="currentColor" opacity="0.9"/>
      <path d="M38 20l6-1-6 3z" fill="currentColor" opacity="0.7"/>
      <path d="M30 10c0-3 4-3 4 0v4h-4z" fill="currentColor" opacity="0.5"/>
      <path d="M32 28c-2 2-4 0-4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      <rect x="26" y="46" width="3" height="8" rx="1.5" fill="currentColor" opacity="0.6"/>
      <rect x="35" y="46" width="3" height="8" rx="1.5" fill="currentColor" opacity="0.6"/>
      <path d="M46 32c4-2 6 2 4 4l-4-2" fill="currentColor" opacity="0.3"/>
    </svg>
  )
}

function PigIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="32" rx="18" ry="14" fill="currentColor" opacity="0.5"/>
      <circle cx="24" cy="26" r="2.5" fill="currentColor" opacity="0.9"/>
      <circle cx="40" cy="26" r="2.5" fill="currentColor" opacity="0.9"/>
      <ellipse cx="32" cy="36" rx="8" ry="5" fill="currentColor" opacity="0.3"/>
      <circle cx="29" cy="36" r="1.5" fill="currentColor" opacity="0.6"/>
      <circle cx="35" cy="36" r="1.5" fill="currentColor" opacity="0.6"/>
      <path d="M14 22c-2-4 0-6 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <path d="M50 22c2-4 0-6-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <rect x="19" y="44" width="4" height="8" rx="2" fill="currentColor" opacity="0.6"/>
      <rect x="41" y="44" width="4" height="8" rx="2" fill="currentColor" opacity="0.6"/>
      <path d="M48 42c4 1 5-1 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
    </svg>
  )
}

function SheepIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="32" rx="20" ry="16" fill="currentColor" opacity="0.4"/>
      <circle cx="24" cy="22" r="6" fill="currentColor" opacity="0.5"/>
      <circle cx="32" cy="18" r="6" fill="currentColor" opacity="0.5"/>
      <circle cx="40" cy="22" r="6" fill="currentColor" opacity="0.5"/>
      <circle cx="46" cy="32" r="6" fill="currentColor" opacity="0.5"/>
      <circle cx="18" cy="32" r="6" fill="currentColor" opacity="0.5"/>
      <ellipse cx="14" cy="26" rx="3" ry="5" fill="currentColor" opacity="0.7"/>
      <ellipse cx="28" cy="26" rx="3" ry="5" fill="currentColor" opacity="0.7"/>
      <circle cx="21" cy="26" r="5" fill="currentColor" opacity="0.8"/>
      <rect x="22" y="44" width="4" height="10" rx="2" fill="currentColor" opacity="0.6"/>
      <rect x="38" y="44" width="4" height="10" rx="2" fill="currentColor" opacity="0.6"/>
    </svg>
  )
}

function HorseIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="30" width="24" height="12" rx="6" fill="currentColor" opacity="0.5"/>
      <path d="M22 34 L14 16 L20 14 Z" fill="currentColor" opacity="0.6"/>
      <ellipse cx="16" cy="16" rx="4" ry="6" fill="currentColor" opacity="0.7"/>
      <path d="M12 12 L14 8 L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
      <rect x="22" y="40" width="3" height="16" rx="1.5" fill="currentColor" opacity="0.6"/>
      <rect x="39" y="40" width="3" height="16" rx="1.5" fill="currentColor" opacity="0.6"/>
      <path d="M42 34 Q50 34 46 44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
    </svg>
  )
}

function DonkeyIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="30" width="22" height="14" rx="7" fill="currentColor" opacity="0.5"/>
      <path d="M24 34 L18 18 L24 18 Z" fill="currentColor" opacity="0.6"/>
      <ellipse cx="20" cy="18" rx="5" ry="7" fill="currentColor" opacity="0.7"/>
      <path d="M16 12 L18 4 L22 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
      <rect x="22" y="42" width="3" height="12" rx="1.5" fill="currentColor" opacity="0.6"/>
      <rect x="37" y="42" width="3" height="12" rx="1.5" fill="currentColor" opacity="0.6"/>
      <path d="M40 36 Q46 38 44 46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
    </svg>
  )
}

function RabbitIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="36" cy="40" rx="14" ry="10" fill="currentColor" opacity="0.5"/>
      <ellipse cx="24" cy="34" rx="8" ry="7" fill="currentColor" opacity="0.7"/>
      <ellipse cx="20" cy="22" rx="3" ry="12" fill="currentColor" opacity="0.6" transform="rotate(-15 20 22)"/>
      <ellipse cx="28" cy="20" rx="3" ry="12" fill="currentColor" opacity="0.6" transform="rotate(15 28 20)"/>
      <circle cx="22" cy="33" r="1.5" fill="currentColor" opacity="0.9"/>
      <circle cx="52" cy="40" r="3" fill="currentColor" opacity="0.4"/>
      <rect x="32" y="48" width="4" height="6" rx="2" fill="currentColor" opacity="0.6"/>
      <rect x="22" y="40" width="4" height="6" rx="2" fill="currentColor" opacity="0.6"/>
    </svg>
  )
}

function FishIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="34" cy="32" rx="16" ry="10" fill="currentColor" opacity="0.5"/>
      <path d="M50 32 L60 24 L58 40 Z" fill="currentColor" opacity="0.4"/>
      <circle cx="24" cy="30" r="1.5" fill="currentColor" opacity="0.9"/>
      <path d="M28 26 Q32 32 28 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      <path d="M34 22 L38 16 L42 22 Z" fill="currentColor" opacity="0.4"/>
      <path d="M34 42 L38 48 L42 42 Z" fill="currentColor" opacity="0.4"/>
    </svg>
  )
}

function DuckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="36" cy="38" rx="14" ry="10" fill="currentColor" opacity="0.5"/>
      <circle cx="24" cy="24" r="8" fill="currentColor" opacity="0.6"/>
      <path d="M16 26 Q10 26 12 22 Q16 22 18 24 Z" fill="currentColor" opacity="0.8"/>
      <circle cx="22" cy="22" r="1.5" fill="currentColor" opacity="0.9"/>
      <ellipse cx="36" cy="36" rx="8" ry="4" fill="currentColor" opacity="0.3"/>
      <path d="M32 46 L30 54 L34 54 Z" fill="currentColor" opacity="0.6"/>
      <path d="M40 46 L38 54 L42 54 Z" fill="currentColor" opacity="0.6"/>
    </svg>
  )
}

function OtherIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="4" opacity="0.4"/>
      <path d="M28 26 Q28 20 32 20 Q36 20 36 24 Q36 28 32 30 L32 36" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.7"/>
      <circle cx="32" cy="44" r="2.5" fill="currentColor" opacity="0.7"/>
    </svg>
  )
}

/* ── Data definitions ───────────────────────────────────────────── */

const ANIMALS = [
  { id: 'cattle',   label: 'Cattle / Buffalo', Icon: CattleIcon,  color: 'amber'  },
  { id: 'goat',     label: 'Goat',             Icon: GoatIcon,    color: 'lime'   },
  { id: 'sheep',    label: 'Sheep',             Icon: SheepIcon,   color: 'slate'  },
  { id: 'poultry',  label: 'Poultry / Chicken', Icon: PoultryIcon, color: 'orange' },
  { id: 'pig',      label: 'Pig',               Icon: PigIcon,     color: 'rose'   },
  { id: 'horse',    label: 'Horse',             Icon: HorseIcon,   color: 'brown'  },
  { id: 'donkey',   label: 'Donkey / Mule',     Icon: DonkeyIcon,  color: 'stone'  },
  { id: 'rabbit',   label: 'Rabbit',            Icon: RabbitIcon,  color: 'pink'   },
  { id: 'fish',     label: 'Fish / Aquaculture',Icon: FishIcon,    color: 'sky'    },
  { id: 'duck',     label: 'Duck / Waterfowl',  Icon: DuckIcon,    color: 'teal'   },
  { id: 'other',    label: 'Other Livestock',   Icon: OtherIcon,   color: 'violet' },
]

/* ── Tailwind color lookup (safe-listed with full class names) ── */

const COLOR_MAP = {
  amber:  { bg: 'bg-amber-50',  border: 'border-amber-400',  text: 'text-amber-700',  icon: 'text-amber-500',  hoverBorder: 'hover:border-amber-300', selectedBg: 'bg-amber-50',  ring: 'ring-amber-200'  },
  violet: { bg: 'bg-violet-50', border: 'border-violet-400', text: 'text-violet-700', icon: 'text-violet-500', hoverBorder: 'hover:border-violet-300', selectedBg: 'bg-violet-50', ring: 'ring-violet-200' },
  lime:   { bg: 'bg-lime-50',   border: 'border-lime-400',   text: 'text-lime-700',   icon: 'text-lime-500',   hoverBorder: 'hover:border-lime-300',   selectedBg: 'bg-lime-50',   ring: 'ring-lime-200'   },
  orange: { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-700', icon: 'text-orange-500', hoverBorder: 'hover:border-orange-300', selectedBg: 'bg-orange-50', ring: 'ring-orange-200' },
  rose:   { bg: 'bg-rose-50',   border: 'border-rose-400',   text: 'text-rose-700',   icon: 'text-rose-500',   hoverBorder: 'hover:border-rose-300',   selectedBg: 'bg-rose-50',   ring: 'ring-rose-200'   },
  sky:    { bg: 'bg-sky-50',    border: 'border-sky-400',    text: 'text-sky-700',    icon: 'text-sky-500',    hoverBorder: 'hover:border-sky-300',    selectedBg: 'bg-sky-50',    ring: 'ring-sky-200'    },
  slate:  { bg: 'bg-slate-50',  border: 'border-slate-400',  text: 'text-slate-700',  icon: 'text-slate-500',  hoverBorder: 'hover:border-slate-300',  selectedBg: 'bg-slate-50',  ring: 'ring-slate-200'  },
  brown:  { bg: 'bg-amber-100', border: 'border-amber-600',  text: 'text-amber-900',  icon: 'text-amber-700',  hoverBorder: 'hover:border-amber-400',  selectedBg: 'bg-amber-100', ring: 'ring-amber-300'  },
  stone:  { bg: 'bg-stone-50',  border: 'border-stone-400',  text: 'text-stone-700',  icon: 'text-stone-500',  hoverBorder: 'hover:border-stone-300',  selectedBg: 'bg-stone-50',  ring: 'ring-stone-200'  },
  pink:   { bg: 'bg-pink-50',   border: 'border-pink-400',   text: 'text-pink-700',   icon: 'text-pink-500',   hoverBorder: 'hover:border-pink-300',   selectedBg: 'bg-pink-50',   ring: 'ring-pink-200'   },
  teal:   { bg: 'bg-teal-50',   border: 'border-teal-400',   text: 'text-teal-700',   icon: 'text-teal-500',   hoverBorder: 'hover:border-teal-300',   selectedBg: 'bg-teal-50',   ring: 'ring-teal-200'   },
}

/* ── Component ──────────────────────────────────────────────────── */

export default function AnimalSelector({ value, onChange }) {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Select your animal
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Choose the type of livestock to diagnose
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {ANIMALS.map(animal => {
          const isSelected = value === animal.id
          const colors = COLOR_MAP[animal.color]
          return (
            <button
              key={animal.id}
              onClick={() => onChange(animal.id)}
              className={[
                'relative flex flex-col items-center justify-center',
                'p-4 rounded-2xl border-2 transition-all duration-200',
                isSelected
                  ? `${colors.border} ${colors.selectedBg} scale-[1.02] shadow-md ring-2 ${colors.ring}`
                  : `border-slate-200 bg-white ${colors.hoverBorder} hover:shadow-md hover:bg-slate-50`
              ].join(' ')}
            >
              <div className={[
                'w-12 h-12 rounded-xl flex items-center',
                'justify-center mb-2 transition-colors duration-200',
                isSelected ? colors.bg : 'bg-slate-100'
              ].join(' ')}>
                <animal.Icon className={[
                  'w-8 h-8 transition-colors duration-200',
                  isSelected ? colors.icon : 'text-slate-400'
                ].join(' ')} />
              </div>
              <span className={[
                'font-semibold text-xs text-center leading-tight',
                isSelected ? colors.text : 'text-slate-700'
              ].join(' ')}>
                {animal.label}
              </span>
              {isSelected && (
                <div className={[
                  'absolute top-2 right-2 rounded-full p-0.5 shadow-sm',
                  colors.border.replace('border-', 'bg-')
                ].join(' ')}>
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
