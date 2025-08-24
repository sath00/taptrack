'use client'

import React, { useState } from 'react'
import Button from '../../components/ui/Button'
import { Plus, Download, Trash2, Save, Edit } from 'lucide-react'

export default function ButtonTestPage() {
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({})

  const toggleLoading = (buttonId: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [buttonId]: !prev[buttonId]
    }))

    // Auto-reset after 3 seconds
    setTimeout(() => {
      setLoadingStates(prev => ({
        ...prev,
        [buttonId]: false
      }))
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-bg-tertiary p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-bg-primary rounded-lg shadow-md border border-border-primary p-8">
          <h1 className="text-3xl font-bold text-text-primary mb-8 text-center">
            Button Component Testing
          </h1>

          {/* Button Variants */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Button Variants</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="success">Success</Button>
            </div>
          </section>

          {/* Button Sizes */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Button Sizes</h2>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
            </div>
          </section>

          {/* Buttons with Icons */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Buttons with Icons</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button variant="primary">
                <Plus size={16} />
                Add New
              </Button>
              <Button variant="secondary">
                <Download size={16} />
                Download
              </Button>
              <Button variant="outline">
                <Edit size={16} />
                Edit
              </Button>
              <Button variant="success">
                <Save size={16} />
                Save
              </Button>
              <Button variant="danger">
                <Trash2 size={16} />
                Delete
              </Button>
              <Button variant="ghost">
                <Edit size={16} />
                Settings
              </Button>
            </div>
          </section>

          {/* Loading States */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Loading States</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button 
                variant="primary" 
                loading={loadingStates.primary}
                onClick={() => toggleLoading('primary')}
              >
                {loadingStates.primary ? 'Loading...' : 'Click to Load'}
              </Button>
              <Button 
                variant="secondary" 
                loading={loadingStates.secondary}
                onClick={() => toggleLoading('secondary')}
              >
                {loadingStates.secondary ? 'Processing...' : 'Process'}
              </Button>
              <Button 
                variant="danger" 
                loading={loadingStates.danger}
                onClick={() => toggleLoading('danger')}
              >
                {loadingStates.danger ? 'Deleting...' : 'Delete All'}
              </Button>
            </div>
          </section>

          {/* Disabled States */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Disabled States</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button variant="primary" disabled>Primary Disabled</Button>
              <Button variant="secondary" disabled>Secondary Disabled</Button>
              <Button variant="outline" disabled>Outline Disabled</Button>
              <Button variant="ghost" disabled>Ghost Disabled</Button>
              <Button variant="danger" disabled>Danger Disabled</Button>
              <Button variant="success" disabled>Success Disabled</Button>
            </div>
          </section>

          {/* Full Width Buttons */}
          <section className="mb-10">
            <h2 className="text-xl font-semibent text-text-primary mb-4">Full Width Buttons</h2>
            <div className="space-y-3">
              <Button variant="primary" fullWidth>
                <Plus size={16} />
                Create New Project
              </Button>
              <Button variant="secondary" fullWidth>
                <Download size={16} />
                Download All Files
              </Button>
              <Button variant="outline" fullWidth>
                <Save size={16} />
                Save Draft
              </Button>
            </div>
          </section>

          {/* Mixed Size Demo */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Mixed Sizes Demo</h2>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="danger" size="sm">
                <Trash2 size={14} />
                Delete
              </Button>
              <Button variant="outline" size="md">
                <Edit size={16} />
                Edit Item
              </Button>
              <Button variant="primary" size="lg">
                <Save size={18} />
                Save Changes
              </Button>
            </div>
          </section>

          {/* Action Bar Example */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Action Bar Example</h2>
            <div className="bg-bg-secondary rounded-lg p-4 border border-border-secondary">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit size={14} />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download size={14} />
                    Export
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Cancel</Button>
                  <Button variant="primary" size="sm">
                    <Save size={14} />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Form Example */}
          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">Form Example</h2>
            <div className="bg-bg-secondary rounded-lg p-6 border border-border-secondary">
              <form className="space-y-4">
                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    className="
                      w-full rounded-lg px-4 py-2
                      border border-border-primary
                      bg-bg-primary text-text-primary placeholder-text-tertiary
                      focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-primary-300
                      disabled:bg-bg-disabled disabled:text-text-disabled disabled:cursor-not-allowed
                    "
                  />
                  <input 
                    type="email" 
                    placeholder="Your email"
                    className="
                      w-full rounded-lg px-4 py-2
                      border border-border-primary
                      bg-bg-primary text-text-primary placeholder-text-tertiary
                      focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-primary-300
                      disabled:bg-bg-disabled disabled:text-text-disabled disabled:cursor-not-allowed
                    "
                  />
                </div>

                {/* Textarea */}
                <textarea 
                  placeholder="Your message"
                  rows={4}
                  className="
                    w-full rounded-lg px-4 py-2
                    border border-border-primary
                    bg-bg-primary text-text-primary placeholder-text-tertiary
                    focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-primary-300
                    disabled:bg-bg-disabled disabled:text-text-disabled disabled:cursor-not-allowed
                  "
                />

                {/* Actions */}
                <div className="flex flex-wrap gap-3 justify-end">
                  <Button variant="ghost">Clear Form</Button>
                  <Button variant="outline">Save Draft</Button>
                  <Button variant="primary" type="submit">
                    <Send size={16} />
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

// Add Send icon import
const Send = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="m22 2-7 20-4-9-9-4 20-7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 2 11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)