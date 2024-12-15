import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Shield } from 'lucide-react'

const StrategySelection = ({ onSelect }) => {
  return (
    <div className="flex justify-center space-x-4">
      <Card className="w-32 h-32 cursor-pointer" onClick={() => onSelect('공격적')}>
        <CardContent className="flex flex-col items-center justify-center h-full">
          <TrendingUp size={32} />
          <span className="mt-2">공격적</span>
        </CardContent>
      </Card>
      <Card className="w-32 h-32 cursor-pointer" onClick={() => onSelect('수비적')}>
        <CardContent className="flex flex-col items-center justify-center h-full">
          <Shield size={32} />
          <span className="mt-2">수비적</span>
        </CardContent>
      </Card>
    </div>
  )
}

export default StrategySelection

