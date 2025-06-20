'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

export function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userType, setUserType] = useState<'contractor' | 'client'>('client')
  const [companyName, setCompanyName] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (password !== confirmPassword) {
      toast.error('パスワードが一致しません')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      toast.error('パスワードは6文字以上で入力してください')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      
      // Register the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/confirm`,
          data: {
            user_type: userType,
            company_name: companyName,
            contact_person: contactPerson,
            phone: phone,
          },
        },
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          throw new Error('このメールアドレスは既に登録されています')
        } else if (authError.message.includes('invalid email')) {
          throw new Error('有効なメールアドレスを入力してください')
        } else {
          throw authError
        }
      }

      toast.success('登録が完了しました。メールをご確認ください。')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleRegister} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="userType">アカウント種別</Label>
          <Select
            value={userType}
            onValueChange={(value: 'contractor' | 'client') => setUserType(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="アカウント種別を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client">元請業者（ゼネコン・工務店等）</SelectItem>
              <SelectItem value="contractor">協力会社・建設業者</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            type="email"
            placeholder="メールアドレスを入力"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="password">パスワード</Label>
          <Input
            id="password"
            type="password"
            placeholder="パスワードを入力"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">パスワード（確認）</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="パスワードを再入力"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">
                  {userType === 'client' ? '会社名' : '会社名・事業者名'}
                </Label>
                <Input
                  id="companyName"
                  placeholder={userType === 'client' ? '株式会社○○建設' : '株式会社○○建設 または 個人事業主名'}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="contactPerson">担当者名</Label>
                <Input
                  id="contactPerson"
                  placeholder="山田太郎"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">電話番号</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="03-1234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? '登録中...' : '登録する'}
      </Button>
    </form>
  )
} 