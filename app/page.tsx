"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  JapaneseYenIcon as Yen,
  Building2,
  Search,
  CalendarIcon,
  SlidersHorizontal,
  Star,
  StarOff,
  ArrowUpDown,
  Info,
  Share2,
  Printer,
  Download,
  Bell,
  Shield,
  Users,
  CalendarDays,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { createClient } from '@/utils/supabase/client'
import { toast } from "@/components/ui/use-toast";

interface Post {
  id: number;
  user_id: string;
  company_name: string;
  contact_person: string;
  phone: string;
  email: string;
  description: string;
  areas: string[];
  work_types: string[];
  start_date: string;
  end_date: string;
  budget_range: string;
  urgency: string;
  created_at: string;
  updated_at: string;
}

// 建設業の作業種別
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
];

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
];

// 予算範囲のオプション
const budgetRanges = [
  { label: "指定なし", value: "指定なし" },
  { label: "〜300万円", value: "0-300" },
  { label: "300万円〜500万円", value: "300-500" },
  { label: "500万円〜1000万円", value: "500-1000" },
  { label: "1000万円〜", value: "1000-" },
];

// 緊急度のオプション
const urgencyOptions = ["指定なし", "通常", "高", "最高"];

const sortOptions = [
  { value: "date", label: "登録日" },
  { value: "budget", label: "予算" },
  { value: "urgency", label: "緊急度" },
];

export default function AkimatchPlatform() {
  const [selectedProject, setSelectedProject] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrefecture, setSelectedPrefecture] = useState("");
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [sortOption, setSortOption] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedBudgetRange, setSelectedBudgetRange] = useState("指定なし");
  const [selectedUrgency, setSelectedUrgency] = useState("指定なし");
  const [viewMode, setViewMode] = useState("card");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  // Use useMemo for filtered projects
  const filteredProjects = useMemo(() => {
    console.log("Running filter with posts:", posts);
    return posts.filter((project) => {
      const matchesSearch =
        !searchTerm ||
        project.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPrefecture =
        !selectedPrefecture || project.areas.includes(selectedPrefecture);

      const matchesWorkType =
        selectedWorkTypes.length === 0 ||
        selectedWorkTypes.some(type => project.work_types.includes(type));

      const matchesBudget =
        selectedBudgetRange === "指定なし" ||
        project.budget_range === selectedBudgetRange;

      const matchesUrgency =
        selectedUrgency === "指定なし" || project.urgency === selectedUrgency;

      const result = matchesSearch && matchesPrefecture && matchesWorkType && matchesBudget && matchesUrgency;
      console.log("Filter result for project:", project.id, {
        matchesSearch,
        matchesPrefecture,
        matchesWorkType,
        matchesBudget,
        matchesUrgency,
        result
      });
      return result;
    });
  }, [posts, searchTerm, selectedPrefecture, selectedWorkTypes, selectedBudgetRange, selectedUrgency]);

  // Update the sorting logic
  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      if (sortOption === "date") {
        return sortDirection === "asc"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortOption === "budget") {
        return sortDirection === "asc"
          ? a.budget_range.localeCompare(b.budget_range)
          : b.budget_range.localeCompare(a.budget_range);
      } else if (sortOption === "urgency") {
        const urgencyOrder: Record<string, number> = { "最高": 3, "高": 2, "通常": 1, "低": 0 };
        const aOrder = urgencyOrder[a.urgency] || 0;
        const bOrder = urgencyOrder[b.urgency] || 0;
        return sortDirection === "asc"
          ? aOrder - bOrder
          : bOrder - aOrder;
      }
      return 0;
    });
  }, [filteredProjects, sortOption, sortDirection]);

  // Add console log to check filtered projects
  useEffect(() => {
    console.log("Current state:", {
      posts: posts,
      searchTerm,
      selectedPrefecture,
      selectedWorkTypes,
      selectedBudgetRange,
      selectedUrgency
    });
    console.log("Filtered projects:", filteredProjects);
  }, [posts, searchTerm, selectedPrefecture, selectedWorkTypes, selectedBudgetRange, selectedUrgency, filteredProjects]);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkUser();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("Starting to fetch posts...");
        const supabase = createClient();
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching posts:', error);
          return;
        }

        if (data) {
          console.log("Raw data from Supabase:", data);
          // Ensure dates are properly formatted
          const formattedData = data.map(post => ({
            ...post,
            start_date: new Date(post.start_date).toISOString(),
            end_date: new Date(post.end_date).toISOString(),
            created_at: new Date(post.created_at).toISOString(),
            updated_at: new Date(post.updated_at).toISOString()
          }));
          console.log("Formatted posts data:", formattedData);
          setPosts(formattedData);
        } else {
          console.log("No data received from Supabase");
        }
      } catch (error) {
        console.error('Unexpected error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  // Fetch user's favorites when they log in
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setFavorites([]);
        return;
      }

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('favorites')
          .select('post_id')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching favorites:', error);
          return;
        }

        if (data) {
          const favoriteIds = data.map(fav => fav.post_id);
          console.log('Fetched favorites:', favoriteIds);
          setFavorites(favoriteIds);
        }
      } catch (error) {
        console.error('Unexpected error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [user]);

  // Update favorites functionality
  const toggleFavorite = async (postId: number) => {
    if (!user) {
      toast({
        title: "お気に入り機能を利用するにはログインが必要です",
        description: "ログインしてください",
        variant: "destructive",
      });
      return;
    }

    try {
      const supabase = createClient();
      const isFavorite = favorites.includes(postId);

      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .match({ user_id: user.id, post_id: postId });

        if (error) {
          console.error('Error removing favorite:', error);
          toast({
            title: "お気に入りの削除に失敗しました",
            description: "もう一度お試しください",
            variant: "destructive",
          });
          return;
        }

        setFavorites(favorites.filter(id => id !== postId));
        toast({
          title: "お気に入りから削除しました",
          description: "お気に入りから削除されました",
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, post_id: postId });

        if (error) {
          console.error('Error adding favorite:', error);
          toast({
            title: "お気に入りの追加に失敗しました",
            description: "もう一度お試しください",
            variant: "destructive",
          });
          return;
        }

        setFavorites([...favorites, postId]);
        toast({
          title: "お気に入りに追加しました",
          description: "お気に入りに追加されました",
        });
      }
    } catch (error) {
      console.error('Unexpected error toggling favorite:', error);
      toast({
        title: "エラーが発生しました",
        description: "もう一度お試しください",
        variant: "destructive",
      });
    }
  };

  // 並び替え機能
  const handleSort = (option: string) => {
    if (sortOption === option) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortOption(option);
      setSortDirection("desc");
    }
  };

  const handleWorkTypeChange = (workType: string, checked: boolean) => {
    if (checked) {
      setSelectedWorkTypes([...selectedWorkTypes, workType]);
    } else {
      setSelectedWorkTypes(
        selectedWorkTypes.filter((type) => type !== workType)
      );
    }
  };

  // フィルターリセット
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedPrefecture("");
    setSelectedWorkTypes([]);
    setStartDate(undefined);
    setSelectedBudgetRange("指定なし");
    setSelectedUrgency("指定なし");
  };

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
            placeholder="案件名や内容で検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 border-blue-200 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <Label
          htmlFor="prefecture"
          className="text-sm font-medium text-blue-900"
        >
          地域
        </Label>
        <Select
          value={selectedPrefecture}
          onValueChange={setSelectedPrefecture}
        >
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
        <Label className="text-sm font-medium text-blue-900">作業種別</Label>
        <ScrollArea className="h-40 mt-2 rounded-md border border-blue-200 p-2">
          <div className="grid grid-cols-2 gap-2">
            {workTypes.map((workType) => (
              <div key={workType} className="flex items-center space-x-2">
                <Checkbox
                  id={workType}
                  checked={selectedWorkTypes.includes(workType)}
                  onCheckedChange={(checked) =>
                    handleWorkTypeChange(workType, checked as boolean)
                  }
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
        <Label
          htmlFor="startDate"
          className="text-sm font-medium text-blue-900"
        >
          空き開始日で検索
        </Label>
        <div className="mt-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal border-blue-200",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                {startDate
                  ? format(startDate, "yyyy年MM月dd日", { locale: ja })
                  : "日付を選択"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                locale={ja}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <Label htmlFor="budget" className="text-sm font-medium text-blue-900">
          予算範囲
        </Label>
        <Select
          value={selectedBudgetRange}
          onValueChange={setSelectedBudgetRange}
        >
          <SelectTrigger className="mt-1 border-blue-200">
            <SelectValue placeholder="予算範囲を選択" />
          </SelectTrigger>
          <SelectContent>
            {budgetRanges.map((range) => (
              <SelectItem key={range.label} value={range.label}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="urgency" className="text-sm font-medium text-blue-900">
          緊急度
        </Label>
        <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
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

      <Button
        variant="outline"
        onClick={resetFilters}
        className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
      >
        フィルターをリセット
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-blue-50">
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            空きの見える化で、稼働率が変わる
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            今月の"空き"を今すぐ埋める、建設業者向け案件掲示板
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50"
            >
              空き案件を探す
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-700"
            >
              案件掲載は無料
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-blue-800 bg-opacity-50 rounded-lg p-6">
              <CalendarDays className="h-12 w-12 text-blue-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                空きスケジュールの見える化
              </h3>
              <p className="text-blue-200 text-sm">
                協力会社の空きスケジュールと案件の作業期間をマッチング
              </p>
            </div>
            <div className="bg-blue-800 bg-opacity-50 rounded-lg p-6">
              <Users className="h-12 w-12 text-blue-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                建設業界の皆様が利用可能
              </h3>
              <p className="text-blue-200 text-sm">
                元請・協力会社・個人事業主まで幅広くご利用いただける信頼性の高いプラットフォーム
              </p>
            </div>
            <div className="bg-blue-800 bg-opacity-50 rounded-lg p-6">
              <Shield className="h-12 w-12 text-blue-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                完全合法の情報掲示板
              </h3>
              <p className="text-blue-200 text-sm">
                職業紹介・派遣ではない、案件情報の共有プラットフォーム
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 利用対象の明記 */}
      <section className="bg-white py-8 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">利用対象</h2>
            <div className="flex flex-col md:flex-row justify-center gap-8">
              <div className="flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600 mr-2" />
                <span className="text-lg text-blue-800">
                  元請業者（ゼネコン・工務店等）
                </span>
              </div>
              <div className="flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600 mr-2" />
                <span className="text-lg text-blue-800">
                  協力会社・建設業者・個人事業主
                </span>
              </div>
            </div>
            <p className="text-sm text-blue-600 mt-4">
              建設業に関わるすべての方にご利用いただける、安心・安全な情報共有プラットフォームです。
            </p>
          </div>
        </div>
      </section>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* サイドバー（デスクトップ） */}
          <aside className="hidden lg:block w-80 bg-white rounded-lg shadow-md p-6 h-fit border border-blue-100">
            <div className="flex items-center mb-4">
              <SlidersHorizontal className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-blue-900">
                空き案件検索
              </h2>
            </div>
            <FilterContent />
          </aside>

          {/* モバイル用フィルターボタン */}
          <div className="lg:hidden">
            <Sheet
              open={isMobileFilterOpen}
              onOpenChange={setIsMobileFilterOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="mb-4 border-blue-500 text-blue-600"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  空き案件検索
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>空き案件検索</SheetTitle>
                  <SheetDescription>
                    条件を指定して空き案件を絞り込めます
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* 案件一覧 */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-blue-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-blue-900">
                    空き案件一覧
                  </h2>
                  <div>
                    {sortedProjects.length}件の空き案件が見つかりました
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center">
                    <Label
                      htmlFor="sort"
                      className="mr-2 text-sm text-blue-700"
                    >
                      並び替え:
                    </Label>
                    <Select
                      value={sortOption}
                      onValueChange={(value) => handleSort(value)}
                    >
                      <SelectTrigger className="w-[140px] h-9 border-blue-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setSortDirection(
                          sortDirection === "asc" ? "desc" : "asc"
                        )
                      }
                      className="ml-1"
                    >
                      <ArrowUpDown
                        className={`h-4 w-4 text-blue-600 ${
                          sortDirection === "asc" ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </div>
                  <div className="flex border rounded-md overflow-hidden">
                    <Button
                      variant={viewMode === "card" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("card")}
                      className={
                        viewMode === "card" ? "bg-blue-600" : "text-blue-600"
                      }
                    >
                      カード
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={
                        viewMode === "list" ? "bg-blue-600" : "text-blue-600"
                      }
                    >
                      リスト
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {viewMode === "card" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="hover:shadow-lg transition-shadow border border-blue-100"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <Badge
                          variant={
                            project.urgency === "最高"
                              ? "destructive"
                              : project.urgency === "高"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {project.work_types[0]}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(project.id);
                          }}
                          className="h-8 w-8"
                        >
                          {favorites.includes(project.id) ? (
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                          ) : (
                            <StarOff className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </div>
                      <CardTitle className="text-lg text-blue-800">
                        {project.company_name}
                      </CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                          {project.areas.join(", ")}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-blue-500" />
                          作業期間: {`${format(new Date(project.start_date), 'yyyy年MM月dd日')}〜${format(new Date(project.end_date), 'yyyy年MM月dd日')}`}
                        </div>
                        <div className="flex items-center">
                          <Yen className="h-4 w-4 mr-2 text-blue-500" />
                          {project.budget_range}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => setSelectedProject(project)}
                          >
                            案件詳細を見る
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-xl text-blue-900">
                              {project.company_name}
                            </DialogTitle>
                            <div className="text-sm text-muted-foreground">
                              <div className="flex flex-wrap gap-2 mt-2">
                                {project.work_types.map((type, index) => (
                                  <Badge
                                    key={index}
                                    variant={
                                      project.urgency === "最高"
                                        ? "destructive"
                                        : project.urgency === "高"
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    {type}
                                  </Badge>
                                ))}
                                <Badge variant="outline">
                                  {project.areas.join(", ")}
                                </Badge>
                              </div>
                            </div>
                          </DialogHeader>
                          <Tabs defaultValue="details" className="mt-4">
                            <TabsList className="grid grid-cols-2">
                              <TabsTrigger value="details">案件詳細</TabsTrigger>
                              <TabsTrigger value="company">発注元情報</TabsTrigger>
                            </TabsList>
                            <TabsContent value="details" className="space-y-6 pt-4">
                              <div>
                                <h3 className="font-semibold mb-2 text-blue-900">案件概要</h3>
                                <div className="text-gray-700">{project.description}</div>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-2 text-blue-900">作業期間</h3>
                                <div className="text-gray-700">
                                  {`${format(new Date(project.start_date), 'yyyy年MM月dd日')}〜${format(new Date(project.end_date), 'yyyy年MM月dd日')}`}
                                </div>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-2 text-blue-900">作業種別</h3>
                                <div className="flex flex-wrap gap-2">
                                  {project.work_types.map((type, index) => (
                                    <Badge key={index} variant="secondary">
                                      {type}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-2 text-blue-900">想定予算</h3>
                                <div className="text-gray-700 text-lg font-medium">
                                  {project.budget_range}
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="company" className="space-y-6 pt-4">
                              <div>
                                <h3 className="font-semibold mb-2 text-blue-900">発注元企業</h3>
                                <p className="text-gray-700">{project.company_name}</p>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-2 text-blue-900">担当者</h3>
                                <p className="text-gray-700">{project.contact_person}</p>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-2 text-blue-900">連絡先</h3>
                                <div className="text-gray-700">
                                  <div>電話: {project.phone}</div>
                                  <div>メール: {project.email}</div>
                                </div>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-2 text-blue-900">緊急度</h3>
                                <Badge
                                  variant={
                                    project.urgency === "最高"
                                      ? "destructive"
                                      : project.urgency === "高"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {project.urgency}
                                </Badge>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-2 text-blue-900">登録日</h3>
                                <p className="text-gray-700">
                                  {format(new Date(project.created_at), "yyyy年MM月dd日", {
                                    locale: ja,
                                  })}
                                </p>
                              </div>
                            </TabsContent>
                          </Tabs>

                          <div className="flex flex-wrap gap-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 border-blue-300"
                              onClick={() => toggleFavorite(project.id)}
                            >
                              {favorites.includes(project.id) ? (
                                <>
                                  <Star className="h-4 w-4 mr-1 fill-yellow-500 text-yellow-500" />
                                  お気に入り解除
                                </>
                              ) : (
                                <>
                                  <Star className="h-4 w-4 mr-1" />
                                  お気に入り
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 border-blue-300"
                            >
                              <Share2 className="h-4 w-4 mr-1" />
                              共有
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 border-blue-300"
                            >
                              <Printer className="h-4 w-4 mr-1" />
                              印刷
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 border-blue-300"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              PDF保存
                            </Button>
                          </div>

                          <Separator className="my-4" />

                          <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                              size="lg"
                              onClick={() => {
                                const subject = encodeURIComponent(`【${project.company_name}】についての問い合わせ`);
                                const body = encodeURIComponent(
                                  `お世話になっております。\n\n${project.company_name}について問い合わせさせていただきます。\n\n`
                                );
                                window.location.href = `mailto:${project.email}?subject=${subject}&body=${body}`;
                              }}
                            >
                              この案件について問い合わせる
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 border-blue-300 text-blue-600"
                            >
                              <Info className="h-4 w-4 mr-2" />
                              詳細資料を請求
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            ※外部フォームまたはLINEでのお問い合わせとなります
                          </p>
                        </DialogContent>
                      </Dialog>
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
                          案件名
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          地域
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          作業種別
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          作業期間
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          予算
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          緊急度
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-100">
                      {filteredProjects.map((project) => (
                        <tr key={project.id} className="hover:bg-blue-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-blue-800">
                              {project.company_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {project.description.substring(0, 30)}...
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {project.areas.join(", ")}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex flex-wrap gap-2">
                              {project.work_types.map((type, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {`${format(new Date(project.start_date), 'yyyy年MM月dd日')}〜${format(new Date(project.end_date), 'yyyy年MM月dd日')}`}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {project.budget_range}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <Badge
                              variant={
                                project.urgency === "最高"
                                  ? "destructive"
                                  : project.urgency === "高"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {project.urgency}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    詳細
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="text-xl text-blue-900">
                                      {project.company_name}
                                    </DialogTitle>
                                    <div className="text-sm text-muted-foreground">
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        {project.work_types.map((type, index) => (
                                          <Badge
                                            key={index}
                                            variant={
                                              project.urgency === "最高"
                                                ? "destructive"
                                                : project.urgency === "高"
                                                ? "default"
                                                : "secondary"
                                            }
                                          >
                                            {type}
                                          </Badge>
                                        ))}
                                        <Badge variant="outline">
                                          {project.areas.join(", ")}
                                        </Badge>
                                      </div>
                                    </div>
                                  </DialogHeader>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleFavorite(project.id)}
                                className="h-8 w-8"
                              >
                                {favorites.includes(project.id) ? (
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                ) : (
                                  <StarOff className="h-4 w-4 text-gray-400" />
                                )}
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

            {filteredProjects.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-md border border-blue-100">
                <p className="text-blue-800 text-lg">
                  条件に合う空き案件が見つかりませんでした。
                </p>
                <p className="text-blue-600 mt-2">
                  検索条件を変更してお試しください。
                </p>
                <Button
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={resetFilters}
                >
                  フィルターをリセット
                </Button>
              </div>
            )}

            {filteredProjects.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="outline"
                  className="border-blue-300 text-blue-600"
                >
                  もっと見る
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* CTA セクション */}
      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            今すぐ空きスケジュールを活用しませんか？
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            案件掲載も協力会社登録も完全無料です
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              無料で案件を掲載する
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              協力会社として登録する
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
