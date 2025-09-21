# Survey System Technical Implementation Guide

## 🏗️ Architecture Overview

### Current Structure
```
app/
├── survey/[id]/page.tsx          # Survey form page
├── api/surveys/[id]/route.ts     # Survey details API
├── api/surveys/submit/route.ts   # Survey submission API
└── api/organizations/by-slug/[slug]/surveys/route.ts  # Org surveys API

components/
├── survey/
│   ├── SurveyInvitation.tsx      # Survey invitation component
│   ├── SurveyForm.tsx            # Main survey form (NEW)
│   ├── FormField.tsx             # Reusable form field (NEW)
│   ├── ProgressIndicator.tsx     # Progress tracking (NEW)
│   └── ThankYouPage.tsx          # Post-submission page (NEW)
└── ui/
    ├── toast.tsx                 # Toast notifications (NEW)
    └── loading.tsx               # Loading states (NEW)

lib/
├── validation/
│   ├── survey-schemas.ts         # Zod schemas (NEW)
│   └── form-utils.ts             # Form utilities (NEW)
└── analytics/
    └── survey-analytics.ts       # Analytics utilities (NEW)
```

## 📋 Phase 1: Form Validation & Error Handling

### 1.1 Install Dependencies
```bash
npm install zod react-hook-form @hookform/resolvers react-hot-toast
npm install @radix-ui/react-toast @radix-ui/react-progress
npm install framer-motion # For animations
npm install lucide-react # For icons
```

### 1.2 Create Zod Validation Schemas
```typescript
// lib/validation/survey-schemas.ts
import { z } from 'zod';

export const staffOnboardingSchema = z.object({
  role: z.string().min(1, "Please select your role"),
  digital_comfort: z.number().min(1, "Please rate your comfort level").max(5),
  current_tools: z.array(z.string()).min(1, "Please select at least one tool"),
  challenges: z.string().optional(),
  training_interests: z.array(z.string()).optional(),
  mobile_usage: z.string().min(1, "Please select your mobile usage frequency"),
  feedback: z.string().optional()
});

export const appFeedbackSchema = z.object({
  user_type: z.string().min(1, "Please select how you use the app"),
  app_rating: z.number().min(1, "Please rate the app").max(5),
  favorite_features: z.array(z.string()).optional(),
  improvement_areas: z.array(z.string()).optional(),
  missing_features: z.string().optional(),
  technical_issues: z.string().optional(),
  recommendation: z.number().min(0, "Please provide a recommendation score").max(10)
});

export type StaffOnboardingForm = z.infer<typeof staffOnboardingSchema>;
export type AppFeedbackForm = z.infer<typeof appFeedbackSchema>;
```

### 1.3 Create Reusable Form Components
```typescript
// components/survey/FormField.tsx
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  description?: string;
}

export function FormField({ label, error, required, children, description }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900 dark:text-white">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
```

### 1.4 Enhanced Survey Form Component
```typescript
// components/survey/SurveyForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export function SurveyForm({ survey, organization }: SurveyFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(getSchemaForSurvey(survey.category)),
    mode: 'onChange'
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/surveys/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyId: survey.id,
          organizationId: organization.id,
          responses: data,
          metadata: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        })
      });

      if (response.ok) {
        toast.success('Survey submitted successfully!');
        // Redirect to thank you page
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      toast.error('Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <ProgressIndicator 
        currentStep={currentStep} 
        totalSteps={survey.form_schema.questions.length} 
      />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderQuestion(survey.form_schema.questions[currentStep], form)}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        
        {currentStep === survey.form_schema.questions.length - 1 ? (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Survey'}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => setCurrentStep(prev => prev + 1)}
          >
            Next
          </Button>
        )}
      </div>
    </form>
  );
}
```

## 🎨 Phase 2: Modern UI/UX Design

### 2.1 Organization-Branded Navigation
```typescript
// components/survey/SurveyNavigation.tsx
export function SurveyNavigation({ organization, survey }: SurveyNavigationProps) {
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <OrganizationLogo 
              organizationSlug={organization.slug} 
              variant="horizontal" 
              size="md" 
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {survey.title}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {organization.name}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

### 2.2 Interactive Rating Components
```typescript
// components/survey/RatingScale.tsx
export function RatingScale({ 
  value, 
  onChange, 
  scale = 5, 
  labels = { low: 'Poor', high: 'Excellent' } 
}: RatingScaleProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {Array.from({ length: scale }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className={cn(
              "w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-200 hover:scale-110",
              value === i + 1
                ? "border-blue-600 bg-blue-600 text-white shadow-lg"
                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400"
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{labels.low}</span>
        <span>{labels.high}</span>
      </div>
    </div>
  );
}
```

### 2.3 Animated Progress Indicator
```typescript
// components/survey/ProgressIndicator.tsx
export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>Question {currentStep + 1} of {totalSteps}</span>
        <span>{Math.round(progress)}% complete</span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <motion.div
          className="bg-blue-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
```

## 🎉 Phase 3: Post-Submission Experience

### 3.1 Thank You Page with CTAs
```typescript
// components/survey/ThankYouPage.tsx
export function ThankYouPage({ organization, survey }: ThankYouPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="text-center p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-6"
          >
            <CheckCircle className="h-24 w-24 text-green-500" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Thank You!
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Your feedback helps {organization.name} improve our services and better support our community.
          </p>
          
          <div className="space-y-4">
            <Button size="lg" className="w-full">
              <Mail className="h-5 w-5 mr-2" />
              Join Our Newsletter
            </Button>
            
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">
                <Globe className="h-4 w-4 mr-2" />
                Visit Website
              </Button>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Follow Us
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
```

## 📊 Phase 4: Analytics Dashboard

### 4.1 Admin Analytics Page
```typescript
// app/admin/surveys/[surveyId]/analytics/page.tsx
export default function SurveyAnalyticsPage({ params }: { params: { surveyId: string } }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchAnalytics(params.surveyId);
  }, [params.surveyId]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Survey Analytics</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Share className="h-4 w-4 mr-2" />
            Share Report
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Responses"
          value={analytics?.totalResponses || 0}
          change="+12%"
          trend="up"
        />
        <MetricCard
          title="Completion Rate"
          value={`${analytics?.completionRate || 0}%`}
          change="+5%"
          trend="up"
        />
        <MetricCard
          title="Avg. Time"
          value={`${analytics?.avgTime || 0}m`}
          change="-2m"
          trend="down"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResponseChart data={analytics?.responseData} />
        <CompletionChart data={analytics?.completionData} />
      </div>
    </div>
  );
}
```

## 🔧 Implementation Steps

### Step 1: Set up Dependencies
```bash
npm install zod react-hook-form @hookform/resolvers react-hot-toast
npm install @radix-ui/react-toast @radix-ui/react-progress
npm install framer-motion lucide-react
```

### Step 2: Create Validation Schemas
- Create `lib/validation/survey-schemas.ts`
- Define Zod schemas for each survey type
- Export TypeScript types

### Step 3: Build Form Components
- Create `components/survey/FormField.tsx`
- Create `components/survey/SurveyForm.tsx`
- Create `components/survey/ProgressIndicator.tsx`

### Step 4: Enhance Survey Page
- Update `app/survey/[id]/page.tsx`
- Add organization navigation
- Implement step-by-step form
- Add validation and error handling

### Step 5: Create Thank You Experience
- Create `components/survey/ThankYouPage.tsx`
- Add CTAs and next steps
- Implement animations

### Step 6: Build Analytics Dashboard
- Create admin analytics pages
- Implement data visualization
- Add export functionality

This implementation will transform our survey system into a modern, accessible, and engaging platform that rivals the best survey tools in the market.
