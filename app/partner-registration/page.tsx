"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { CalendarDays, CheckCircle, ArrowLeft, Building2, MapPin, Users } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { format, addDays } from "date-fns"
import { ja } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"

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

export default function PartnerRegistration() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    phone: "",
    email: "",
    description: "",
  })
  const [selectedPrefectures, setSelectedPrefectures] = useState<string[]>([])
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  })

  const handleWorkTypeChange = (workType: string, checked: boolean) => {
    if (checked) {
      setSelectedWorkTypes([...selectedWorkTypes, workType])
    } else {
      setSelectedWorkTypes(selectedWorkTypes.filter((type) => type !== workType))
    }
  }

  const handlePrefectureChange = (prefecture: string, checked: boolean) => {
    if (checked) {
      setSelectedPrefectures([...selectedPrefectures, prefecture])
    } else {
      setSelectedPrefectures(selectedPrefectures.filter((pref) => pref !== prefecture))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ここで実際の登録処理を行う
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-blue-50">
        {/* ヘッダー */}
        <header className="bg-white shadow-md border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <CalendarDays className="h-8 w-8 text-blue-600" />
                <div className="ml-2">
                  <span className="text-xl font-bold text-blue-900">あきマッチ</span>
                  <span className="text-sm text-blue-600 ml-2">Akimatch</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 完了画面 */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center border-blue-100">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-blue-900">登録が完了しました</CardTitle>
              <CardDescription className="text-lg">協力会社の空きスケジュール情報を受け付けました。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 text-sm">
                  登録いただいた情報は、元請業者が空き協力会社を検索する際に表示されます。
                  <br />
                  案件のお問い合わせがあった場合は、直接ご連絡いたします。
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="border-blue-300 text-blue-600"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  新しい空きスケジュールを登録
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <a href="/" className="flex items-center">
                    案件一覧に戻る
                  </a>
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
      {/* ヘッダー */}
      <header className="bg-white shadow-md border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <CalendarDays className="h-8 w-8 text-blue-600" />
              <div className="ml-2">
                <span className="text-xl font-bold text-blue-900">あきマッチ</span>
                <span className="text-sm text-blue-600 ml-2">Akimatch</span>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-blue-700 hover:text-blue-500 font-medium">
                案件一覧
              </a>
              <a href="/partner-list" className="text-blue-700 hover:text-blue-500 font-medium">
                空き協力会社一覧
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">協力会社の空きスケジュール登録</h1>
          <p className="text-blue-700">
            空いている期間や対応可能な業種を登録することで、元請業者からの案件依頼を受けることができます。
            法人・個人事業主問わずご利用いただけます。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 基本情報 */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-900">
                <Building2 className="h-5 w-5 mr-2" />
                基本情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="companyName" className="text-blue-900">
                    会社名・事業者名 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="株式会社○○建設"
                    required
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson" className="text-blue-900">
                    担当者名 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="山田太郎"
                    required
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone" className="text-blue-900">
                    電話番号 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="03-1234-5678"
                    required
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-blue-900">
                    メールアドレス <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="info@example.com"
                    required
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 対応地域 */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-900">
                <MapPin className="h-5 w-5 mr-2" />
                対応地域 <span className="text-red-500">*</span>
              </CardTitle>
              <CardDescription>対応可能な都道府県を選択してください（複数選択可）</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-40 rounded-md border border-blue-200 p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                <div className="mt-4">
                  <p className="text-sm text-blue-700 mb-2">選択中の地域:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPrefectures.map((prefecture) => (
                      <Badge key={prefecture} variant="secondary" className="bg-blue-100 text-blue-800">
                        {prefecture}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 対応業種 */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-900">
                <Users className="h-5 w-5 mr-2" />
                対応業種 <span className="text-red-500">*</span>
              </CardTitle>
              <CardDescription>対応可能な作業種別を選択してください（複数選択可）</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-60 rounded-md border border-blue-200 p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                <div className="mt-4">
                  <p className="text-sm text-blue-700 mb-2">選択中の業種:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedWorkTypes.map((workType) => (
                      <Badge key={workType} variant="secondary" className="bg-blue-100 text-blue-800">
                        {workType}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 空いている期間 */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-900">
                <CalendarDays className="h-5 w-5 mr-2" />
                対応可能日程 <span className="text-red-500">*</span>
              </CardTitle>
              <CardDescription>空いている期間を選択してください</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-blue-900">開始日</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-blue-200",
                          !dateRange?.from && "text-muted-foreground",
                        )}
                      >
                        <CalendarDays className="mr-2 h-4 w-4 text-blue-500" />
                        {dateRange?.from ? format(dateRange.from, "yyyy年MM月dd日", { locale: ja }) : "開始日を選択"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange?.from}
                        onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                        initialFocus
                        locale={ja}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-blue-900">終了日</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-blue-200",
                          !dateRange?.to && "text-muted-foreground",
                        )}
                      >
                        <CalendarDays className="mr-2 h-4 w-4 text-blue-500" />
                        {dateRange?.to ? format(dateRange.to, "yyyy年MM月dd日", { locale: ja }) : "終了日を選択"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange?.to}
                        onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                        initialFocus
                        locale={ja}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              {dateRange?.from && dateRange?.to && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    対応可能期間: {format(dateRange.from, "yyyy年MM月dd日", { locale: ja })} 〜{" "}
                    {format(dateRange.to, "yyyy年MM月dd日", { locale: ja })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 補足情報 */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-900">補足情報</CardTitle>
              <CardDescription>特記事項や得意分野などがあれば記載してください（任意）</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="例：夜間作業対応可能、クレーン作業得意、小規模案件歓迎など"
                rows={4}
                className="border-blue-200 focus:border-blue-500"
              />
            </CardContent>
          </Card>

          {/* 送信ボタン */}
          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 px-12"
              disabled={
                !formData.companyName ||
                !formData.contactPerson ||
                !formData.phone ||
                !formData.email ||
                selectedPrefectures.length === 0 ||
                selectedWorkTypes.length === 0 ||
                !dateRange?.from ||
                !dateRange?.to
              }
            >
              空きスケジュールを登録する
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
