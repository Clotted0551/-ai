import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Baby, User, UserCog } from 'lucide-react'

const AgeSelection = ({ onSelect }) => {
  return (
    <div className="flex justify-center space-x-4">
      <Card className="w-32 h-32 cursor-pointer" onClick={() => onSelect('청년층')}>
        <CardContent className="flex flex-col items-center justify-center h-full">
          <Baby size={32} />
          <span className="mt-2">청년층</span>
        </CardContent>
      </Card>
      <Card className="w-32 h-32 cursor-pointer" onClick={() => onSelect('중년층')}>
        <CardContent className="flex flex-col items-center justify-center h-full">
          <User size={32} />
          <span className="mt-2">중년층</span>
        </CardContent>
      </Card>
      <Card className="w-32 h-32 cursor-pointer" onClick={() => onSelect('장년층')}>
        <CardContent className="flex flex-col items-center justify-center h-full">
          <UserCog size={32} />
          <span className="mt-2">장년층</span>
        </CardContent>
      </Card>
    </div>
  )
}

export default AgeSelection

