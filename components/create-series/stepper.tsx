import { cn } from '@/lib/utils'
import type { Step } from '@/lib/data/steps'

interface Props {
  steps: Step[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: Props) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-3">
        {steps.map(step => (
          <div key={step.id} className="flex-1">
            <div className={cn(
              'h-2 w-full rounded-full transition-all duration-500 ease-in-out',
              currentStep >= step.id ? 'bg-primary' : 'bg-secondary',
            )} />
          </div>
        ))}
      </div>
      <div className="flex justify-between px-1">
        {steps.map(step => (
          <span
            key={step.id}
            className={cn(
              'text-[10px] sm:text-xs font-semibold transition-colors duration-300',
              currentStep >= step.id ? 'text-primary' : 'text-muted-foreground',
              currentStep === step.id && 'scale-110 transform',
            )}
          >
            {step.name}
          </span>
        ))}
      </div>
    </div>
  )
}
