import React from 'react'
import Input from './Input'

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
    <Input
      type="text"
      variant="search"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      size="sm"
    />
  )
}

export default SearchInput
