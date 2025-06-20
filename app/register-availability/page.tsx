"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { CalendarDays, CheckCircle, ArrowLeft } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// 建設業の作業種別（既存と同じ）
const workTypes = [
  // 建築工事関連
  "足場工事",
  "型枠工事",
  "鉄筋工事",
  "コンクリート工事",
  "鉄骨工事",
  "ALC工事",
  "PC工事",
  "左官工事",
  "タイル工事",
  "石工事",
  "ブロック工事",
  "屋根工事",
  "防水工事",
  "内装工事",
  "建具工事",
  "ガラス工事",
  "塗装工事",
  "吹付工事",
  "外壁工事",
  "解体工事",
  "とび工事",

  // 設備工事関連
  "電気工事",
  "通信工事",
  "消防設備工事",
  "給排水工事",
  "空調工事",
  "ダクト工事",
  "配管工事",
  "ガス工事",
  "衛生設備工事",
  "昇降機設備工事",
  "自動ドア工事",
  "太陽光発電設備工事",

  // 土木工事関連
  "土木工事",
  "舗装工事",
  "造園工事",
  "杭工事",
  "山留工事",
  "掘削工事",
  "基礎工事",
  "橋梁工事",
  "トンネル工事",
  "道路工事",
  "河川工事",
  "港湾工事",
  "上下水道工事",

  // その他
  "測量",
  "地質調査",
  "仮設工事",
  "交通誘導",
  "清掃",
  "産業廃棄物処理",
  "運搬",
]

const prefectures = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
]

const budgetRanges = [
  { label: "〜300万円", value: "0-300" },
  { label: "300万円〜500万円", value: "300-500" },
  { label: "500万円〜1000万円", value: "500-1000" },
  { label: "1000万円〜", value: "1000-" },
];
const urgencyOptions = ["通常", "高", "最高"];

export default function RegisterAvailability() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    phone: "",
    email: "",
    description: "",
  })
  const [selectedPrefectures, setSelectedPrefectures] = useState<string[]>([])
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [budgetRange, setBudgetRange] = useState("");
  const [urgency, setUrgency] = useState("");
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setLoading(false)
    }
    checkUser()
  }, [])

  const handlePrefectureChange = (prefecture: string, checked: boolean) => {
    if (checked) {
      setSelectedPrefectures([...selectedPrefectures, prefecture])
    } else {
      setSelectedPrefectures(selectedPrefectures.filter((p) => p !== prefecture))
    }
  }

  const handleWorkTypeChange = (workType: string, checked: boolean) => {
    if (checked) {
      setSelectedWorkTypes([...selectedWorkTypes, workType])
    } else {
      setSelectedWorkTypes(selectedWorkTypes.filter((type) => type !== workType))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          company_name: formData.companyName,
          contact_person: formData.contactPerson,
          phone: formData.phone,
          email: formData.email,
          description: formData.description,
          areas: selectedPrefectures,
          work_types: selectedWorkTypes,
          start_date: startDate?.toISOString(),
          end_date: endDate?.toISOString(),
          budget_range: budgetRange,
          urgency,
          created_at: new Date().toISOString(),
        })

      if (error) throw error

      toast({
        title: "登録完了",
        description: "スケジュールの登録が完了しました",
      })
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        title: "エラー",
        description: "登録中にエラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-800">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-blue-50">
        {/* 完了画面 */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-blue-900">登録が完了しました</CardTitle>
              <CardDescription className="text-lg">
                空きスケジュールの登録ありがとうございました。
                <br />
                元請業者からのお問い合わせをお待ちください。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 text-sm">
                  登録いただいた情報は、元請業者が空き協力会社を検索する際に表示されます。
                  <br />
                  お問い合わせがあった場合は、直接ご連絡いたします。
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => {
                    setIsSubmitted(false)
                    setFormData({
                      companyName: "",
                      contactPerson: "",
                      phone: "",
                      email: "",
                      description: "",
                    })
                    setSelectedPrefectures([])
                    setSelectedWorkTypes([])
                    setStartDate(undefined)
                    setEndDate(undefined)
                    setBudgetRange("");
                    setUrgency("");
                  }}
                  variant="outline"
                  className="border-blue-500 text-blue-600"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  新しい空きスケジュールを登録
                </Button>
                <Button 
                  onClick={() => router.push('/my-page')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <CalendarDays className="h-4 w-4 mr-2" />
                  マイページで確認
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">空きスケジュール登録</h1>
          <p className="text-blue-700">
            協力会社・事業者の空きスケジュールを登録して、元請業者からのお問い合わせを受け付けましょう。
            法人・個人事業主問わずご利用いただけます。
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-blue-900">基本情報</CardTitle>
            <CardDescription>会社・事業者情報と連絡先をご入力ください</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 基本情報 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="companyName" className="text-sm font-medium text-blue-900">
                    会社名・事業者名 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    placeholder="株式会社○○建設"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="mt-1 border-blue-200 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson" className="text-sm font-medium text-blue-900">
                    担当者名 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactPerson"
                    placeholder="山田太郎"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="mt-1 border-blue-200 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-blue-900">
                    電話番号 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0465-45-5660"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 border-blue-200 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-blue-900">
                    メールアドレス <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="info@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 border-blue-200 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* 対応地域 */}
              <div>
                <Label className="text-sm font-medium text-blue-900">
                  対応可能地域 <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-gray-600 mb-2">対応可能な都道府県を選択してください（複数選択可）</p>
                <ScrollArea className="h-40 mt-2 rounded-md border border-blue-200 p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {prefectures.map((prefecture) => (
                      <div key={prefecture} className="flex items-center space-x-2">
                        <Checkbox
                          id={`prefecture-${prefecture}`}
                          checked={selectedPrefectures.includes(prefecture)}
                          onCheckedChange={(checked) => handlePrefectureChange(prefecture, checked as boolean)}
                          className="text-blue-600"
                        />
                        <Label htmlFor={`prefecture-${prefecture}`} className="text-sm">
                          {prefecture}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                {selectedPrefectures.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-blue-700">
                      選択中: {selectedPrefectures.join("、")} ({selectedPrefectures.length}件)
                    </p>
                  </div>
                )}
              </div>

              {/* 対応業種 */}
              <div>
                <Label className="text-sm font-medium text-blue-900">
                  対応可能業種 <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-gray-600 mb-2">対応可能な作業種別を選択してください（複数選択可）</p>
                <ScrollArea className="h-48 mt-2 rounded-md border border-blue-200 p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {workTypes.map((workType) => (
                      <div key={workType} className="flex items-center space-x-2">
                        <Checkbox
                          id={`worktype-${workType}`}
                          checked={selectedWorkTypes.includes(workType)}
                          onCheckedChange={(checked) => handleWorkTypeChange(workType, checked as boolean)}
                          className="text-blue-600"
                        />
                        <Label htmlFor={`worktype-${workType}`} className="text-sm">
                          {workType}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                {selectedWorkTypes.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-blue-700">
                      選択中: {selectedWorkTypes.slice(0, 3).join("、")}
                      {selectedWorkTypes.length > 3 && ` 他${selectedWorkTypes.length - 3}件`} (
                      {selectedWorkTypes.length}件)
                    </p>
                  </div>
                )}
              </div>

              {/* 空き期間 */}
              <div>
                <Label className="text-sm font-medium text-blue-900">
                  対応可能期間 <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-gray-600 mb-2">対応可能な期間を指定してください</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate" className="text-sm text-gray-700">
                      開始日
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal border-blue-200 mt-1",
                            !startDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarDays className="mr-2 h-4 w-4 text-blue-500" />
                          {startDate ? format(startDate, "yyyy年MM月dd日", { locale: ja }) : "開始日を選択"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus locale={ja} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="endDate" className="text-sm text-gray-700">
                      終了日
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal border-blue-200 mt-1",
                            !endDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarDays className="mr-2 h-4 w-4 text-blue-500" />
                          {endDate ? format(endDate, "yyyy年MM月dd日", { locale: ja }) : "終了日を選択"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus locale={ja} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* 補足情報 */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-blue-900">
                  補足情報・アピールポイント
                </Label>
                <p className="text-xs text-gray-600 mb-2">
                  保有資格、得意分野、実績など、元請業者にアピールしたい内容をご記入ください
                </p>
                <Textarea
                  id="description"
                  placeholder="例：足場組立等作業主任者、安全衛生責任者の資格を保有。商業施設の施工実績多数。安全管理を最優先に、品質の高い施工を心がけています。"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 border-blue-200 focus:border-blue-500"
                  rows={4}
                />
              </div>

              {/* 予算範囲 */}
              <div>
                <Label htmlFor="budget" className="text-sm font-medium text-blue-900">
                  予算範囲 <span className="text-red-500">*</span>
                </Label>
                <Select value={budgetRange} onValueChange={setBudgetRange} required>
                  <SelectTrigger className="mt-1 border-blue-200">
                    <SelectValue placeholder="予算範囲を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 緊急度 */}
              <div>
                <Label htmlFor="urgency" className="text-sm font-medium text-blue-900">
                  緊急度 <span className="text-red-500">*</span>
                </Label>
                <Select value={urgency} onValueChange={setUrgency} required>
                  <SelectTrigger className="mt-1 border-blue-200">
                    <SelectValue placeholder="緊急度を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {urgencyOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 注意事項 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">ご注意</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 登録いただいた情報は元請業者に公開されます</li>
                  <li>• 虚偽の情報を登録することは禁止されています</li>
                  <li>• お問い合わせがあった場合は直接ご連絡いたします</li>
                  <li>• 登録情報は随時更新・削除が可能です</li>
                </ul>
              </div>

              {/* 送信ボタン */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 px-8"
                  disabled={
                    !formData.companyName ||
                    !formData.contactPerson ||
                    !formData.phone ||
                    !formData.email ||
                    selectedPrefectures.length === 0 ||
                    selectedWorkTypes.length === 0 ||
                    !startDate ||
                    !endDate ||
                    !budgetRange ||
                    !urgency
                  }
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  空きスケジュールを登録する
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
