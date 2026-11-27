/** Shared DCC visual language for Clerk v4 hosted-in-app components.
 * Clerk retains password/OAuth/MFA/session handling. This affects only presentation.
 */
export const dccClerkAppearance = {
  variables: {
    colorPrimary: '#265b45',
    colorBackground: '#ffffff',
    colorForeground: '#192c25',
    colorMutedForeground: '#52685d',
  },
  elements: {
    rootBox: 'mx-auto w-full max-w-[420px]',
    card: 'w-full rounded-2xl border border-[#d4dfd6] bg-white p-4 shadow-sm sm:p-6',
    headerTitle: 'text-2xl font-semibold tracking-tight text-[#192c25]',
    headerSubtitle: 'text-sm text-[#52685d]',
    formButtonPrimary: 'min-h-[44px] rounded-xl bg-[#265b45] text-white hover:bg-[#204d3a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#265b45]',
    formFieldInput: 'min-h-[44px] rounded-xl border border-[#c7d6cd] bg-white text-[#192c25]',
    formFieldLabel: 'text-sm font-medium text-[#192c25]',
    footerActionLink: 'font-semibold text-[#265b45] hover:underline',
    socialButtonsBlockButton: 'min-h-[44px] rounded-xl border border-[#c7d6cd] bg-white text-[#192c25]',
    formResendCodeLink: 'text-[#265b45]',
    dividerLine: 'bg-[#d4dfd6]',
    dividerText: 'text-[#52685d]',
    identityPreviewText: 'text-[#192c25]',
    formFieldAction: 'text-[#265b45]',
    formFieldError: 'text-[#8b302e]',
  },
}