import { SignUp } from '@clerk/nextjs'
import { Suspense } from 'react'

const appearance = {
  variables: {
    colorPrimary: '#7c3aed',
    colorBackground: 'transparent',
    colorText: '#f1f5f9',
    colorTextSecondary: '#94a3b8',
    colorInputBackground: 'rgba(255,255,255,0.05)',
    colorInputText: '#f1f5f9',
    colorNeutral: '#cbd5e1',
    colorAlphaShade: 'white',
    borderRadius: '0.75rem',
    spacingUnit: '1rem',
    fontSize: '0.9375rem',
    fontWeight: { normal: 400, medium: 500, bold: 600 },
  },
  layout: {
    socialButtonsVariant: 'blockButton' as const,
    socialButtonsPlacement: 'top' as const,
  },
  elements: {
    rootBox: 'w-full',
    card: 'shadow-none p-0 bg-transparent border-0',
    headerTitle: 'hidden',
    headerSubtitle: 'hidden',
    socialButtonsBlockButton:
      'h-11 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
    socialButtonsBlockButtonText: 'font-medium text-sm',
    socialButtonsProviderIcon: 'w-4 h-4',
    dividerRow: 'my-5',
    dividerText: 'text-xs uppercase tracking-widest px-3',
    formFieldInput: 'input-aurora h-11 rounded-xl text-sm',
    formFieldLabel: 'text-sm font-medium mb-1.5',
    formFieldLabelRow: 'mb-1.5',
    formButtonPrimary:
      'btn-aurora h-11 w-full rounded-xl text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
    footerActionLink: 'font-semibold text-sm transition-colors duration-150',
    footerActionText: 'text-sm',
    footer: 'mt-4',
    formFieldSuccessText: 'text-xs mt-1',
    formFieldErrorText: 'text-xs mt-1',
    alertText: 'text-sm',
    alert: 'rounded-xl px-4 py-3',
    formResendCodeLink: 'text-sm font-semibold',
    otpCodeFieldInput: '!w-11 !h-11 rounded-xl text-center font-semibold',
    alternativeMethodsBlockButton: 'h-11 rounded-xl text-sm transition-colors duration-150',
    formFieldInputShowPasswordButton: 'text-sm',
  },
}

export default function SignUpPage() {
  return (
    <div>
      <div className="mb-7">
        <h1
          className="text-[1.6rem] font-bold tracking-tight"
          style={{
            backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #e2d9f3 60%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Create your account
        </h1>
        <p className="text-sm mt-1.5" style={{ color: 'rgba(148,163,184,0.8)' }}>
          Start building your brand — free, forever.
        </p>
      </div>
      <Suspense>
        <SignUp appearance={appearance} />
      </Suspense>
    </div>
  )
}
