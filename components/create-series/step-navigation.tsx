import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  onBack?: () => void
  onNext?: () => void
  nextLabel?: string
  nextDisabled?: boolean
  isPending?: boolean
}

export function StepNavigation({
  onBack,
  onNext,
  nextLabel = 'Continue',
  nextDisabled = false,
  isPending = false,
}: Props) {
  return (
    <div className={`flex mt-10 ${onBack ? 'justify-between' : 'justify-end'}`}>
      {onBack && (
        <Button
          variant="outline"
          size="lg"
          onClick={onBack}
          className="rounded-xl px-8 h-14 text-lg font-medium shadow-sm transition-all duration-300 hover:bg-accent cursor-pointer"
        >
          Go Back
        </Button>
      )}
      {onNext && (
        <Button
          size="lg"
          onClick={onNext}
          disabled={nextDisabled || isPending}
          className="rounded-xl px-12 h-14 text-lg font-bold shadow-xl shadow-primary/25 transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-primary/40 bg-gradient-to-r from-primary to-primary/90 cursor-pointer disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isPending && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
          {nextLabel}
        </Button>
      )}
    </div>
  )
}
