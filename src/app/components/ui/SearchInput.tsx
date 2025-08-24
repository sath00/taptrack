import React from 'react'
import { Search } from 'lucide-react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = ""
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={18}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-icon-secondary"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-border-primary rounded-lg
                   bg-bg-primary text-text-primary placeholder-text-tertiary
                   focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-primary/20
                   transition-all duration-200"
      />
    </div>
  )
}

export default SearchInput