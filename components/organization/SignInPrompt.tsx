'use client'

interface SignInPromptProps {
  organizationName: string
}

export function SignInPrompt({ organizationName }: SignInPromptProps) {
  return (
    <div className="mb-6 xl:mb-8 2xl:mb-10 3xl:mb-12">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg xl:text-xl 2xl:text-2xl font-semibold mb-2">
              Join {organizationName}
            </h3>
            <p className="text-blue-100 text-sm xl:text-base 2xl:text-lg">
              Sign in to access exclusive content, workshops, and connect with our community.
            </p>
          </div>
          <div className="flex space-x-3">
            <a
              href="/sign-in"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Sign In
            </a>
            <a
              href="/sign-up"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-400 transition-colors"
            >
              Join Now
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
