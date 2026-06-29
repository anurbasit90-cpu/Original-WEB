import React from 'react'

export default function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white text-[#003366] font-extrabold text-sm sm:text-base flex items-center justify-center rounded-md shadow-sm">
        AKS
      </div>
      <div className="hidden sm:block text-white font-semibold">
        <div className="leading-tight text-sm">Aryatek</div>
        <div className="leading-tight text-xs">Kontrol Sejahtera</div>
      </div>
    </div>
  )
}
