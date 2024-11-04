import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, User, LogOut } from 'lucide-react'

export default function Main() {
  const navigate = useNavigate()

  const handleMyPageClick = () => {
    navigate('/mypage')
  }

  const handleLogout = () => {
    // 로그아웃 로직을 여기에 구현합니다.
    // 예: localStorage에서 토큰 제거
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Learning Platform</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">사용자</p>
                  <p className="text-xs leading-none text-muted-foreground">user@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleMyPageClick}>
                <User className="mr-2 h-4 w-4" />
                <span>마이 페이지</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>로그아웃</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="space-y-6 text-center">
          <h2 className="text-3xl font-bold">환영합니다, 사용자님!</h2>
          <p className="text-xl">학습 여정을 시작할 준비가 되셨나요?</p>
          <div className="flex space-x-4 justify-center">
            <Button size="lg" className="w-40">
              <BookOpen className="mr-2 h-4 w-4" />
              배치고사
            </Button>
            <Button size="lg" className="w-40">
              학습 시작
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}