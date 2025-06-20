import { CalendarDays, Shield } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-12 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <CalendarDays className="h-6 w-6 mr-2" />
              <div>
                <span className="text-lg font-bold">あきマッチ</span>
                <span className="text-sm text-blue-300 ml-2">Akimatch</span>
              </div>
            </div>
            <p className="text-blue-200 mb-4">
              空きスケジュールの見える化で建設業界の稼働率向上を支援する情報掲示板プラットフォーム
            </p>
            <div className="text-sm text-blue-300 space-y-1">
              <p>〒220-0004</p>
              <p>神奈川県横浜市西区北幸2丁目10-28 むつみビル3F</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">サービス</h3>
            <ul className="space-y-2 text-blue-200">
              <li>
                <Link href="/" className="hover:text-white">
                  空き案件一覧
                </Link>
              </li>
              <li>
                <Link href="/register-availability" className="hover:text-white">
                  協力会社登録
                </Link>
              </li>
              <li>
                <Link href="/post-project" className="hover:text-white">
                  案件掲載（無料）
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-white">
                  使い方ガイド
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">サポート</h3>
            <ul className="space-y-2 text-blue-200">
              <li>
                <Link href="/faq" className="hover:text-white">
                  よくある質問
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">お問い合わせ</h3>
            <ul className="space-y-2 text-blue-200">
              <li>TEL: 03-6823-3524</li>
              <li>FAX: 03-6730-7966</li>
              <li>E-mail: info@shokunin-san.com</li>
              <li>営業時間: 平日 9:00-18:00</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-300 text-sm">
              &copy; 2024 株式会社職人さんドットコム. All rights reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <Shield className="h-4 w-4 mr-2 text-blue-300" />
              <span className="text-blue-300 text-sm">
                安心・安全の情報掲示板
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 