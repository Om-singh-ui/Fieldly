import React from 'react'
import HeroSection from "./_components/hero"
import WhatWeDoSection from "./_components/WhatWeDoSection"
import FieldlyBentoSection from './_components/FieldlyBentoSection'
import ProblemSolutionSection from './_components/ProblemSolutionSection'

const page = () => {
  return (
    <div>
      <HeroSection />
      <ProblemSolutionSection />
      <FieldlyBentoSection />
      <WhatWeDoSection />
    </div>
  )
}

export default page