"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import {
  CalendarDays,
  Building2,
  MapPin,
  User,
  Phone,
  Mail,
  Search,
  SlidersHorizontal,
  Star,
  StarOff,
  ArrowUpDown,
  Bell,
} from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

// サンプル協力会社データ
const partners = [
  {
    id: 1,
    companyName: "東京足場工業株式会社",
    contactPerson: "田中一郎",
    phone: "03-1234-5678",
    email: "tanaka@tokyo-ashiba.co.jp",
    prefectures: ["東京都", "神奈川県", "埼玉県"],
    workTypes: ["足場工事", "とび工事"],
    availableFrom: new Date(2024, 5, 1), // 6月1日
    availableTo: new Date(2024, 7, 31), // 8月31日
    period: "2024年6月1日〜8月31日",
    description: "足場組立等作業主任者、安全衛生責任者の資格を保有。商業施設の施工実績多数。",
    registeredAt: new Date(2024, 4, 15),
    views: 156,
  },
  {
    id: 2,
    companyName: "横浜電設",
    contactPerson: "佐藤次郎",
    phone: "045-2345-6789",
    email: "sato@yokohama-densetsu.com",
    prefectures: ["神奈川県", "東京都"],
    workTypes: ["電気工事", "通信工事"],
    availableFrom: new Date(2024, 6, 15), // 7月15日
    availableTo: new Date(2024, 8, 30), // 9月30日
    period: "2024年7月15日〜9月30日",
    description: "第一種電気工事士、高圧電気取扱安全衛生特別教育修了。マンション改修工事が得意。",
    registeredAt: new Date(2024, 5, 1),
    views: 203,
  },
  {
    id: 3,
    companyName: "新宿内装工房",
    contactPerson: "山田三郎",
    phone: "03-3456-7890",
    email: "yamada@shinjuku-naisou.jp",
    prefectures: ["東京都"],
    workTypes: ["内装工事", "建具工事", "塗装工事"],
    availableFrom: new Date(2024, 7, 1), // 8月1日
    availableTo: new Date(2024, 9, 15), // 10月15日
    period: "2024年8月1日〜10月15日",
    description: "内装仕上げ施工技能士、石綿作業主任者技能講習修了。オフィスビル内装工事の実績豊富。",
    registeredAt: new Date(2024, 5, 20),
    views: 189,
  },
  {
    id: 4,
    companyName: "埼玉屋根工事",
    contactPerson: "高橋四郎",
    phone: "048-4567-8901",
    email: "takahashi@saitama-yane.co.jp",
    prefectures: ["埼玉県", "東京都"],
    workTypes: ["屋根工事", "防水工事"],
    availableFrom: new Date(2024, 5, 20), // 6月20日
    availableTo: new Date(2024, 6, 20), // 7月20日
    period: "2024年6月20日〜7月20日",
    description: "屋根工事技能士、高所作業車運転技能講習修了。戸建住宅の屋根工事が専門。",
    registeredAt: new Date(2024, 4, 25),
    views: 134,
  },
  {
    id: 5,
    companyName: "千葉鉄工",
    contactPerson: "伊藤五郎",
    phone: "043-5678-9012",
    email: "ito@chiba-tekko.com",
    prefectures: ["千葉県", "東京都", "神奈川県"],
    workTypes: ["鉄骨工事", "とび工事"],
    availableFrom: new Date(2024, 8, 1), // 9月1日
    availableTo: new Date(2024, 11, 31), // 12月31日
    period: "2024年9月1日〜12月31日",
    description: "鉄骨組立て作業主任者、玉掛け技能講習修了、移動式クレーン運転士。大型工場建設の実績あり。",
    registeredAt: new Date(2024, 6, 10),
    views: 267,
  },
  {
    id: 6,
    companyName: "世田谷舗装",
    contactPerson: "木村六郎",
    phone: "03-6789-0123",
    email: "kimura@setagaya-hosou.jp",
    prefectures: ["東京都"],
    workTypes: ["舗装工事", "土木工事"],
    availableFrom: new Date(2024, 6, 1), // 7月1日
    availableTo: new Date(2024, 7, 15), // 8月15日
    period: "2024年7月1日〜8月15日",
    description: "舗装施工管理技術者、交通誘導警備業務検定。夜間作業も対応可能。",
    registeredAt: new Date(2024, 5, 5),
    views: 178,
  },
]

export default function PartnerListPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPrefecture, setSelectedPrefecture] = useState("")
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([])
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [favorites, setFavorites] = useState<number[]>([])
  const [sortOption, setSortOption] = useState("registeredAt")
  const [sortDirection, setSortDirection] = useState("desc")
  const [viewMode, setViewMode] = useState("card")

  // お気に入り機能
  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  // 並び替え機能
  const handleSort = (option: string) => {
    if (sortOption === option) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortOption(option)
      setSortDirection("desc")
    }
  }

  // フィルタリングロジック
  const filteredPartners = partners
    .filter((partner) => {
      const matchesSearch =
        partner.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesPrefecture = !selectedPrefecture || partner.prefectures.includes(selectedPrefecture)

      const matchesWorkType =
        selectedWorkTypes.length === 0 || selectedWorkTypes.some((type) => partner.workTypes.includes(type))

      // 期間フィルター
      const matchesDateRange =
        (!startDate || partner.availableTo >= startDate) && (!endDate || partner.availableFrom <= endDate)

      return matchesSearch && matchesPrefecture && matchesWorkType && matchesDateRange
    })
    .sort((a, b) => {
      // 並び替えロジック
      if (sortOption === "registeredAt") {
        return sortDirection === "asc"
          ? a.registeredAt.getTime() - b.registeredAt.getTime()
          : b.registeredAt.getTime() - a.registeredAt.getTime()
      } else if (sortOption === "availableFrom") {
        return sortDirection === "asc"
          ? a.availableFrom.getTime() - b.availableFrom.getTime()
          : b.availableFrom.getTime() - a.availableFrom.getTime()
      } else if (sortOption === "views") {
        return sortDirection === "asc" ? a.views - b.views : b.views - a.views
      }
      return 0
    })

  const handleWorkTypeChange = (workType: string, checked: boolean) => {
    if (checked) {
      setSelectedWorkTypes([...selectedWorkTypes, workType])
    } else {
      setSelectedWorkTypes(selectedWorkTypes.filter((type) => type !== workType))
    }
  }

  // フィルターリセット
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedPrefecture("")
    setSelectedWorkTypes([])
    setStartDate(undefined)
    setEndDate(undefined)
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="search" className="text-sm font-medium text-blue-900">
          キーワード検索
        </Label>
        <div className="relative mt-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-blue-500" />
          <Input
            id="search"
            placeholder="会社名や内容で検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 border-blue-200 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="prefecture" className="text-sm font-medium text-blue-900">
          対応地域
        </Label>
        <Select value={selectedPrefecture} onValueChange={setSelectedPrefecture}>
          <SelectTrigger className="mt-1 border-blue-200">
            <SelectValue placeholder="都道府県を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべての地域</SelectItem>
            {prefectures.map((prefecture) => (
              <SelectItem key={prefecture} value={prefecture}>
                {prefecture}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium text-blue-900">対応業種</Label>
        <ScrollArea className="h-40 mt-2 rounded-md border border-blue-200 p-2">
          <div className="grid grid-cols-2 gap-2">
            {workTypes.map((workType) => (
              <div key={workType} className="flex items-center space-x-2">
                <Checkbox
                  id={workType}
                  checked={selectedWorkTypes.includes(workType)}
                  onCheckedChange={(checked) => handleWorkTypeChange(workType, checked as boolean)}
                  className="text-blue-600"
                />
                <Label htmlFor={workType} className="text-xs">
                  {workType}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div>
        <Label className="text-sm font-medium text-blue-900">対応可能期間</Label>
        <div className="grid grid-cols-1 gap-2 mt-2">
          <div>
            <Label htmlFor="startDate" className="text-xs text-gray-600">
              開始日
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-blue-200",
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
            <Label htmlFor="endDate" className="text-xs text-gray-600">
              終了日
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-blue-200",
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

      <Button
        variant="outline"
        onClick={resetFilters}
        className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
      >
        フィルターをリセット
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-blue-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-md border-b border-blue-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <CalendarDays className="h-8 w-8 text-blue-600" />
              <div className="ml-2">
                <span className="text-xl font-bold text-blue-900">あきマッチ</span>
                <span className="text-sm text-blue-600 ml-2">Akimatch</span>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8 items-center">
              <a href="#" className="text-blue-700 hover:text-blue-500 font-medium">
                案件一覧
              </a>
              <a href="#" className="text-blue-700 hover:text-blue-500 font-medium">
                空きスケジュール登録
              </a>
              <Button className="bg-blue-600 hover:bg-blue-700">無料登録はこちら</Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5 text-blue-600" />
                      <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500"></span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>新着の空き協力会社があります</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </nav>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">空き協力会社・事業者一覧</h1>
          <p className="text-xl text-blue-100">対応可能な協力会社・事業者を検索・閲覧できます</p>
        </div>
      </section>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* サイドバー（デスクトップ） */}
          <aside className="hidden lg:block w-80 bg-white rounded-lg shadow-md p-6 h-fit border border-blue-100">
            <div className="flex items-center mb-4">
              <SlidersHorizontal className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-blue-900">協力会社検索</h2>
            </div>
            <FilterContent />
          </aside>

          {/* モバイル用フィルターボタン */}
          <div className="lg:hidden">
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="mb-4 border-blue-500 text-blue-600">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  協力会社検索
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>協力会社検索</SheetTitle>
                  <SheetDescription>条件を指定して空き協力会社を絞り込めます</SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* 協力会社一覧 */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-blue-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-blue-900">空き協力会社・事業者一覧</h2>
                  <p className="text-blue-600">{filteredPartners.length}社・事業者が見つかりました</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="sort" className="mr-2 text-sm text-blue-700">
                      並び替え:
                    </Label>
                    <Select value={sortOption} onValueChange={(value) => handleSort(value)}>
                      <SelectTrigger className="w-[140px] h-9 border-blue-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="registeredAt">登録日</SelectItem>
                        <SelectItem value="availableFrom">対応開始日</SelectItem>
                        <SelectItem value="views">閲覧数</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                      className="ml-1"
                    >
                      <ArrowUpDown className={`h-4 w-4 text-blue-600 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                    </Button>
                  </div>
                  <div className="flex border rounded-md overflow-hidden">
                    <Button
                      variant={viewMode === "card" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("card")}
                      className={viewMode === "card" ? "bg-blue-600" : "text-blue-600"}
                    >
                      カード
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={viewMode === "list" ? "bg-blue-600" : "text-blue-600"}
                    >
                      リスト
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {viewMode === "card" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPartners.map((partner) => (
                  <Card key={partner.id} className="hover:shadow-lg transition-shadow border border-blue-100">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-wrap gap-1">
                          {partner.workTypes.slice(0, 2).map((workType) => (
                            <Badge key={workType} variant="secondary" className="text-xs">
                              {workType}
                            </Badge>
                          ))}
                          {partner.workTypes.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{partner.workTypes.length - 2}
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(partner.id)
                          }}
                          className="h-8 w-8"
                        >
                          {favorites.includes(partner.id) ? (
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                          ) : (
                            <StarOff className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </div>
                      <CardTitle className="text-lg text-blue-800">{partner.companyName}</CardTitle>
                      <CardDescription>{partner.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                          {partner.prefectures.join("、")}
                        </div>
                        <div className="flex items-center">
                          <CalendarDays className="h-4 w-4 mr-2 text-blue-500" />
                          対応可能期間: {partner.period}
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-blue-500" />
                          担当者: {partner.contactPerson}
                        </div>
                        <div className="bg-blue-50 p-2 rounded text-xs text-blue-700">
                          <Building2 className="h-3 w-3 inline mr-1" />
                          閲覧数: {partner.views}回
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex gap-2">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700" size="sm">
                        <Phone className="h-4 w-4 mr-1" />
                        電話で連絡
                      </Button>
                      <Button variant="outline" className="flex-1 border-blue-300 text-blue-600" size="sm">
                        <Mail className="h-4 w-4 mr-1" />
                        メール
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md border border-blue-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          会社名
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          対応地域
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          対応業種
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          対応可能期間
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          担当者
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          連絡
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-100">
                      {filteredPartners.map((partner) => (
                        <tr key={partner.id} className="hover:bg-blue-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-blue-800">{partner.companyName}</div>
                            <div className="text-xs text-gray-500">{partner.description.substring(0, 30)}...</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {partner.prefectures.join("、")}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {partner.workTypes.slice(0, 2).map((workType) => (
                                <Badge key={workType} variant="secondary" className="text-xs">
                                  {workType}
                                </Badge>
                              ))}
                              {partner.workTypes.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{partner.workTypes.length - 2}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{partner.period}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{partner.contactPerson}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Phone className="h-3 w-3 mr-1" />
                                電話
                              </Button>
                              <Button variant="outline" size="sm" className="border-blue-300 text-blue-600">
                                <Mail className="h-3 w-3 mr-1" />
                                メール
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {filteredPartners.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-md border border-blue-100">
                <p className="text-blue-800 text-lg">条件に合う協力会社・事業者が見つかりませんでした。</p>
                <p className="text-blue-600 mt-2">検索条件を変更してお試しください。</p>
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={resetFilters}>
                  フィルターをリセット
                </Button>
              </div>
            )}

            {filteredPartners.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Button variant="outline" className="border-blue-300 text-blue-600">
                  もっと見る
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
