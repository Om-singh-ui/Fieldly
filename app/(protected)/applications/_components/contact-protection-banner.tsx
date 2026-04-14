// app/(protected)/applications/_components/contact-protection-banner.tsx
'use client'

import { AlertTriangle, Shield, Lock, Eye, EyeOff } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

export function ContactProtectionBanner() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Alert className="mb-6 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
        <Shield className="h-5 w-5 text-amber-600 dark:text-amber-500" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <AlertTitle className="text-amber-800 dark:text-amber-200 font-semibold">
              Platform Communication Only
            </AlertTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                {isOpen ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent>
            <AlertDescription className="text-amber-700 dark:text-amber-300 mt-2">
              <p>
                To protect your privacy and ensure secure transactions, all communication 
                must stay on our platform. 
              </p>
              <ul className="mt-3 space-y-2">
                <li className="flex items-start gap-2">
                  <Lock className="h-4 w-4 mt-0.5 shrink-0" />
                  <span className="text-sm">
                    <strong>Do not share</strong> phone numbers, email addresses, or social media handles
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Lock className="h-4 w-4 mt-0.5 shrink-0" />
                  <span className="text-sm">
                    Our messaging system keeps your contact information private
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span className="text-sm">
                    <strong>Violations may result</strong> in account suspension or termination
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-0.5 shrink-0" />
                  <span className="text-sm">
                    All payments and agreements are processed securely through our platform
                  </span>
                </li>
              </ul>
              
              <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  <strong>Why this matters:</strong> Keeping communication on-platform ensures:
                </p>
                <ul className="mt-2 space-y-1 text-xs text-amber-700 dark:text-amber-300">
                  <li>• Verified identities and reduced fraud risk</li>
                  <li>• Complete transaction history and dispute protection</li>
                  <li>• Secure payment processing and escrow services</li>
                  <li>• Access to customer support and mediation</li>
                </ul>
              </div>
            </AlertDescription>
          </CollapsibleContent>
          
          {!isOpen && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              Click the eye icon to learn why this is important
            </p>
          )}
        </div>
      </Alert>
    </Collapsible>
  )
}