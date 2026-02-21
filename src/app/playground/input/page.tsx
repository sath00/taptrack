'use client'

import React, { useRef, useState } from 'react'
import Input, { TextArea, Select } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { User, Lock, Phone, Hash } from 'lucide-react'

export default function InputTestPage() {
  const [nameValue, setNameValue] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [username, setUsername] = useState('')
  const [quantity, setQuantity] = useState('')
  const [code, setCode] = useState('')
  const [phone, setPhone] = useState('')
  const [keyboardInput, setKeyboardInput] = useState('')
  const [textAreaValue, setTextAreaValue] = useState('')
  const [selectValue, setSelectValue] = useState('')
  const [errorFieldValue, setErrorFieldValue] = useState('')
  const [errorTextAreaValue, setErrorTextAreaValue] = useState('')
  const [errorSelectValue, setErrorSelectValue] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [eventLog, setEventLog] = useState('No focus/blur events yet')
  const focusInputRef = useRef<HTMLInputElement>(null)

  const handleEmailValidation = (email: string) => {
    setInputValue(email)
    // Basic email validation
    setEmailError(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length > 0)
  }

  return (
    <div className="min-h-screen bg-bg-tertiary p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-bg-primary rounded-lg shadow-md border border-border-primary p-4 sm:p-6 lg:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-6 sm:mb-8 text-center">
            Input Component Testing
          </h1>

          {/* Input Variants and States */}
          <section className="mb-8 sm:mb-10">
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary mb-4">Core Input Props</h2>
            <div className="space-y-6">
              <Input
                label="Name"
                placeholder="Enter your name..."
                helperText="This is a standard input field."
                value={nameValue}
                onChange={setNameValue}
                id="full-name"
                name="full_name"
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                helperText={emailError ? 'Please enter a valid email address.' : 'Used for communication.'}
                error={emailError}
                value={inputValue}
                onChange={handleEmailValidation}
              />
              <Input
                label="Search with Icon"
                variant="search"
                placeholder="Search anything..."
                value={searchValue}
                onChange={setSearchValue}
              />
              <Input
                label="Username"
                placeholder="Username"
                icon={<User size={18} />}
                value={username}
                onChange={setUsername}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Password"
                icon={<Lock size={18} />}
                disabled
              />
            </div>
          </section>

          {/* Input Sizes */}
          <section className="mb-8 sm:mb-10">
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary mb-4">Input Sizes</h2>
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <Input placeholder="Small Input" size="sm" label="Small" />
              <Input placeholder="Medium Input" size="md" label="Medium" />
              <Input placeholder="Large Input" size="lg" label="Large" />
            </div>
          </section>

          {/* Type and Constraint Variations */}
          <section className="mb-8 sm:mb-10">
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary mb-4">Type, Min/Max, Length, Input Mode</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="number"
                label="Quantity"
                icon={<Hash size={18} />}
                placeholder="0 to 100"
                value={quantity}
                onChange={setQuantity}
                min={0}
                max={100}
                step={0.5}
                inputMode="decimal"
                helperText="Uses type, min, max, step, and inputMode."
              />
              <Input
                type="text"
                label="Access Code"
                placeholder="4 to 8 characters"
                value={code}
                onChange={setCode}
                minLength={4}
                maxLength={8}
                helperText={`Length: ${code.length}/8`}
              />
              <Input
                type="tel"
                label="Mobile Number"
                icon={<Phone size={18} />}
                placeholder="09XXXXXXXXX"
                value={phone}
                onChange={setPhone}
                inputMode="tel"
                onFocus={() => setEventLog('Phone input focused')}
                onBlur={() => setEventLog('Phone input blurred')}
              />
              <Input
                label="Keyboard Test"
                placeholder="Press Enter to trigger onKeyDown"
                value={keyboardInput}
                onChange={setKeyboardInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setEventLog(`Enter pressed with value: ${keyboardInput || '(empty)'}`)
                  }
                }}
              />
            </div>
            <p className="mt-3 text-sm text-secondary">Event log: {eventLog}</p>
          </section>

          {/* Ref and Auto Focus */}
          <section className="mb-8 sm:mb-10">
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary mb-4">Input Ref and Auto Focus</h2>
            <div className="space-y-4">
              <Input
                label="Focusable by Ref"
                placeholder="Click button below to focus me"
                inputRef={focusInputRef}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => focusInputRef.current?.focus()}
              >
                Focus Input via inputRef
              </Button>
              <Input
                label="Auto Focus Field"
                placeholder="Autofocus applies on initial render"
                autoFocus
              />
            </div>
          </section>

          {/* TextArea Component */}
          <section className="mb-8 sm:mb-10">
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary mb-4">TextArea Component</h2>
            <div className="space-y-6">
              <TextArea
                label="Message"
                placeholder="Type your message here..."
                helperText="This textarea is resizable vertically."
                value={textAreaValue}
                onChange={setTextAreaValue}
                onBlur={() => setEventLog('Textarea blurred')}
              />
              <TextArea
                label="Disabled Message"
                placeholder="This is disabled"
                value="You can't type here."
                disabled
                rows={3}
              />
              <TextArea
                label="Error Message"
                placeholder="This has an error"
                error
                helperText="This field is required!"
              />
            </div>
          </section>

          {/* Select Component */}
          <section className="mb-8 sm:mb-10">
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary mb-4">Select Component</h2>
            <div className="space-y-6">
              <Select
                label="Country"
                value={selectValue}
                onChange={setSelectValue}
                onBlur={() => setEventLog('Select blurred')}
              >
                <option value="" disabled>Select a country</option>
                <option value="usa">United States</option>
                <option value="ca">Canada</option>
                <option value="uk">United Kingdom</option>
              </Select>
              <Select label="Disabled Select" disabled>
                <option>Option 1</option>
                <option>Option 2</option>
              </Select>
            </div>
          </section>

          {/* Error States */}
          <section className="mb-8 sm:mb-10">
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary mb-4">Error States</h2>
            <div className="space-y-6">
              <Input
                label="Input Error"
                placeholder="Type to test error styling"
                value={errorFieldValue}
                onChange={setErrorFieldValue}
                error
                helperText="This input has an error state."
              />
              <TextArea
                label="TextArea Error"
                placeholder="Type to test error styling"
                value={errorTextAreaValue}
                onChange={setErrorTextAreaValue}
                error
                helperText="This textarea has an error state."
              />
              <Select
                label="Select Error"
                value={errorSelectValue}
                onChange={setErrorSelectValue}
                error
                helperText="Please select a valid option."
              >
                <option value="" disabled>Select one option</option>
                <option value="one">Option One</option>
                <option value="two">Option Two</option>
              </Select>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
