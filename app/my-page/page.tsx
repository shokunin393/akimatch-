"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Star, Trash2, Edit, StarOff } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

interface Favorite {
  id: number;
  user_id: string;
  post_id: number;
  created_at: string;
  post: Post;
}

interface User {
  id: string;
  user_type: "contractor" | "client";
}

export default function MyPage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userType, setUserType] = useState<"contractor" | "client" | null>(
    null
  );
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      fetchUserData();
    };

    checkUser();
  }, []);

  const fetchUserData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user type
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("user_type")
        .eq("id", user.id)
        .single();

      if (userError) throw userError;
      setUserType(userData.user_type);

      if (userData.user_type === "contractor") {
        // Fetch user's posts (only for clients)
        const { data: postsData } = await supabase
          .from("posts")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        setPosts(postsData || []);
      }

      // Fetch user's favorites with post details
      const { data: favoritesData } = await supabase
        .from("favorites")
        .select(
          `
          *,
          post:posts(*)
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setFavorites(favoritesData || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: "エラー",
        description: "ユーザーデータの取得中にエラーが発生しました。",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    setDeletePostId(postId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletePostId) return;

    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", deletePostId);
      if (error) throw error;

      setPosts(posts.filter((post) => post.id !== deletePostId));
      toast({
        title: "削除完了",
        description: "投稿を削除しました",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "エラー",
        description: "投稿の削除中にエラーが発生しました。",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletePostId(null);
    }
  };

  const handleRemoveFavorite = async (favoriteId: number) => {
    try {
      await supabase.from("favorites").delete().eq("id", favoriteId);
      setFavorites(favorites.filter((fav) => fav.id !== favoriteId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const toggleFavorite = async (postId: number) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const existingFavorite = favorites.find((fav) => fav.post_id === postId);

      if (existingFavorite) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("id", existingFavorite.id);

        if (error) throw error;
        setFavorites(favorites.filter((fav) => fav.id !== existingFavorite.id));
      } else {
        const { error } = await supabase.from("favorites").insert({
          user_id: user.id,
          post_id: postId,
        });

        if (error) throw error;
        fetchUserData();
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "エラー",
        description: "お気に入りの更新中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-800">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">マイページ</h1>
        {userType === "contractor" && (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="posts">登録済みスケジュール</TabsTrigger>
              <TabsTrigger value="favorites">お気に入り</TabsTrigger>
            </TabsList>

            <TabsContent value="posts">
              <div className="space-y-4">
                <Button
                  onClick={() => router.push("/register-availability")}
                  className="mb-4 bg-blue-600 hover:bg-blue-700"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  新しいスケジュールを登録
                </Button>

                {posts.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-gray-500">
                      登録済みのスケジュールはありません
                    </CardContent>
                  </Card>
                ) : (
                  posts.map((post) => (
                    <Card key={post.id}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-xl text-blue-900">
                            {post.company_name}
                          </CardTitle>
                          <CardDescription>
                            <p className="text-sm text-gray-500 mt-1">
                              {post.contact_person}
                            </p>
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.push(`/post/${post.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-blue-900">
                              対応可能地域
                            </p>
                            <p className="text-sm text-gray-600">
                              {post.areas.join("、")}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-900">
                              対応可能業種
                            </p>
                            <p className="text-sm text-gray-600">
                              {post.work_types.slice(0, 3).join("、")}
                              {post.work_types.length > 3 &&
                                ` 他${post.work_types.length - 3}件`}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm font-medium text-blue-900">
                            対応可能期間
                          </p>
                          <p className="text-sm text-gray-600">
                            {format(
                              new Date(post.start_date),
                              "yyyy年MM月dd日",
                              {
                                locale: ja,
                              }
                            )}{" "}
                            〜{" "}
                            {format(new Date(post.end_date), "yyyy年MM月dd日", {
                              locale: ja,
                            })}
                          </p>
                        </div>
                        {post.description && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-blue-900">
                              補足情報
                            </p>
                            <p className="text-sm text-gray-600">
                              {post.description}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="favorites">
              <div className="space-y-4">
                {favorites.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-gray-500">
                      お気に入りの "スケジュール" はありません
                    </CardContent>
                  </Card>
                ) : (
                  favorites.map((favorite) => (
                    <Card key={favorite.id}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-xl text-blue-900">
                            {favorite.post.company_name}
                          </CardTitle>
                          <CardDescription>
                            <p className="text-sm text-gray-500 mt-1">
                              {favorite.post.contact_person}
                            </p>
                          </CardDescription>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveFavorite(favorite.id)}
                        >
                          <StarOff className="h-4 w-4 text-yellow-500" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-blue-900">
                              対応可能地域
                            </p>
                            <p className="text-sm text-gray-600">
                              {favorite.post.areas.join("、")}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-900">
                              対応可能業種
                            </p>
                            <p className="text-sm text-gray-600">
                              {favorite.post.work_types.slice(0, 3).join("、")}
                              {favorite.post.work_types.length > 3 &&
                                ` 他${favorite.post.work_types.length - 3}件`}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm font-medium text-blue-900">
                            対応可能期間
                          </p>
                          <p className="text-sm text-gray-600">
                            {format(
                              new Date(favorite.post.start_date),
                              "yyyy年MM月dd日",
                              { locale: ja }
                            )}{" "}
                            〜{" "}
                            {format(
                              new Date(favorite.post.end_date),
                              "yyyy年MM月dd日",
                              { locale: ja }
                            )}
                          </p>
                        </div>
                        {favorite.post.description && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-blue-900">
                              補足情報
                            </p>
                            <p className="text-sm text-gray-600">
                              {favorite.post.description}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>投稿の削除</DialogTitle>
            <DialogDescription>
              この投稿を削除してもよろしいですか？
              <br />
              この操作は取り消すことができません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              削除する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
