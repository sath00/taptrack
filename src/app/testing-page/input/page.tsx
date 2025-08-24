'use client'

import React, { useState } from 'react'
import Input, { TextArea, Select } from '../../components/ui/Input'
import { Mail, User, Lock } from 'lucide-react'

export default function InputTestPage() {
  const [inputValue, setInputValue] = useState('')
  const [textAreaValue, setTextAreaValue] = useState('')
  const [selectValue, setSelectValue] = useState('')
  const [emailError, setEmailError] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaValue(e.target.value)
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value)
  }

  const handleEmailValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setInputValue(email)
    // Basic email validation
    setEmailError(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length > 0)
  }

  return (
    <div className="min-h-screen bg-bg-tertiary p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-bg-primary rounded-lg shadow-md border border-border-primary p-8">
          <h1 className="text-3xl font-bold text-text-primary mb-8 text-center">
            Form Component Testing
          </h1>

          {/* Input Variants and States */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Input Component</h2>
            <div className="space-y-6">
              <Input
                label="Name"
                placeholder="Enter your name..."
                helperText="This is a standard input field."
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
              />
              <Input
                label="Username"
                placeholder="Username"
                icon={<User size={18} />}
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
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Input Sizes</h2>
            <div className="flex flex-col md:flex-row items-end gap-4">
              <Input placeholder="Small Input" size="sm" label="Small" />
              <Input placeholder="Medium Input" size="md" label="Medium" />
              <Input placeholder="Large Input" size="lg" label="Large" />
            </div>
          </section>

          {/* TextArea Component */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-text-primary mb-4">TextArea Component</h2>
            <div className="space-y-6">
              <TextArea
                label="Message"
                placeholder="Type your message here..."
                helperText="This textarea is resizable vertically."
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
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Select Component</h2>
            <div className="space-y-6">
              <Select label="Country" value={selectValue} onChange={handleSelectChange}>
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
          
        </div>
      </div>
    </div>
  )
}