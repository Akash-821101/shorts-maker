'use client'

import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PREDEFINED_NICHES } from '@/lib/data/niches'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { StepNavigation } from '@/components/create-series/step-navigation'
import type { SeriesForm } from '@/lib/types/series-form'

interface Props {
  form: SeriesForm
}

export function StepNiche({ form }: Props) {
  const { selectedNiche, customNiche, setSelectedNiche, handleCustomNicheChange, handleNext } = form

  return (
    <div>
      <Card className="border-border/40 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-8 pt-8 px-8">
          <CardTitle className="text-2xl">Select a Niche</CardTitle>
          <CardDescription className="text-base">
            Choose from our high-performing niches or create your own custom niche.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <Tabs defaultValue="available" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 h-12 rounded-lg bg-accent/40 p-1">
              <TabsTrigger value="available" className="cursor-pointer rounded-md h-full text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
                Available Niches
              </TabsTrigger>
              <TabsTrigger value="custom" className="cursor-pointer rounded-md h-full text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
                Custom Niche
              </TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="mt-0">
              <ScrollArea className="h-[420px] pr-5 rounded-2xl border border-border/30 bg-accent/5 p-4 shadow-inner">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
                  {PREDEFINED_NICHES.map(niche => (
                    <div
                      key={niche.id}
                      onClick={() => setSelectedNiche(niche.id)}
                      className={cn(
                        'relative flex flex-col items-start p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md',
                        selectedNiche === niche.id
                          ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
                          : 'border-border/30 bg-background hover:border-primary/40',
                      )}
                    >
                      <div className={cn(
                        'p-2.5 rounded-lg mb-3 transition-colors',
                        selectedNiche === niche.id ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary',
                      )}>
                        <niche.icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold mb-1.5">{niche.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{niche.description}</p>
                      {selectedNiche === niche.id && (
                        <div className="absolute top-5 right-5">
                          <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="custom" className="mt-0">
              <div className="h-[420px] flex flex-col">
                <div className="flex-1 bg-background rounded-3xl border border-border/30 p-10 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                  <Zap className="w-16 h-16 text-primary mb-6 opacity-80 drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                  <h3 className="text-2xl font-bold mb-3">Create a Custom Niche</h3>
                  <p className="text-base text-muted-foreground mb-8 max-w-lg leading-relaxed">
                    Describe exactly what kind of shorts you want to generate. Be specific about the topic, tone, and your target audience.
                  </p>
                  <div className="w-full max-w-xl">
                    <Textarea
                      placeholder="e.g. Daily psychological tricks to improve social skills, presented in a mysterious and cinematic tone..."
                      className="w-full min-h-[160px] bg-accent/10 border-border/50 hover:border-primary/30 focus-visible:ring-primary/50 text-base p-5 resize-none rounded-2xl transition-colors shadow-sm"
                      value={customNiche}
                      onChange={e => handleCustomNicheChange(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <StepNavigation
        onNext={handleNext}
        nextLabel="Continue to Language"
        nextDisabled={!selectedNiche || (selectedNiche === 'custom' && !customNiche.trim())}
      />
    </div>
  )
}
