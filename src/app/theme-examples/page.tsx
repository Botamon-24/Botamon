import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ThemeExamplesPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <h1 className="mb-6 text-center text-3xl font-bold text-bl-blue-accent">
        颜色主题示例
      </h1>
      <p className="mb-16 text-center text-muted-foreground">
        下面展示了几种不同的颜色主题示例，您可以在 theme-color-guide 中了解如何修改网站的主题颜色。
      </p>

      <div className="mb-12">
        <h2 className="mb-6 text-center text-xl font-semibold">可用的颜色主题</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {/* 蓝色主题 */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center">
              <div className="mr-3 h-8 w-8 rounded-full bg-[#1353c9]"></div>
              <h3 className="text-lg font-medium">蓝色主题</h3>
            </div>
            <div className="mb-2 flex space-x-2">
              <div className="h-4 w-4 rounded-full bg-[#1353c9]" title="主色"></div>
              <div className="h-4 w-4 rounded-full bg-[#2a72e5]" title="亮色"></div>
              <div className="h-4 w-4 rounded-full bg-[#00c3ff]" title="强调色"></div>
              <div className="h-4 w-4 rounded-full bg-[#0a296e]" title="暗色"></div>
            </div>
            <div className="h-2 w-full rounded-full bg-gradient-to-r from-[#1353c9] to-[#00c3ff]"></div>
          </div>

          {/* 红色主题 */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center">
              <div className="mr-3 h-8 w-8 rounded-full bg-[#c91313]"></div>
              <h3 className="text-lg font-medium">红色主题</h3>
            </div>
            <div className="mb-2 flex space-x-2">
              <div className="h-4 w-4 rounded-full bg-[#c91313]" title="主色"></div>
              <div className="h-4 w-4 rounded-full bg-[#e52a2a]" title="亮色"></div>
              <div className="h-4 w-4 rounded-full bg-[#ff0000]" title="强调色"></div>
              <div className="h-4 w-4 rounded-full bg-[#6e0a0a]" title="暗色"></div>
            </div>
            <div className="h-2 w-full rounded-full bg-gradient-to-r from-[#c91313] to-[#ff0000]"></div>
          </div>

          {/* 绿色主题 */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center">
              <div className="mr-3 h-8 w-8 rounded-full bg-[#13c925]"></div>
              <h3 className="text-lg font-medium">绿色主题</h3>
            </div>
            <div className="mb-2 flex space-x-2">
              <div className="h-4 w-4 rounded-full bg-[#13c925]" title="主色"></div>
              <div className="h-4 w-4 rounded-full bg-[#2ae53a]" title="亮色"></div>
              <div className="h-4 w-4 rounded-full bg-[#00ff33]" title="强调色"></div>
              <div className="h-4 w-4 rounded-full bg-[#0a6e12]" title="暗色"></div>
            </div>
            <div className="h-2 w-full rounded-full bg-gradient-to-r from-[#13c925] to-[#00ff33]"></div>
          </div>

          {/* 紫色主题 */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center">
              <div className="mr-3 h-8 w-8 rounded-full bg-[#8913c9]"></div>
              <h3 className="text-lg font-medium">紫色主题</h3>
            </div>
            <div className="mb-2 flex space-x-2">
              <div className="h-4 w-4 rounded-full bg-[#8913c9]" title="主色"></div>
              <div className="h-4 w-4 rounded-full bg-[#a12ae5]" title="亮色"></div>
              <div className="h-4 w-4 rounded-full bg-[#c400ff]" title="强调色"></div>
              <div className="h-4 w-4 rounded-full bg-[#450a6e]" title="暗色"></div>
            </div>
            <div className="h-2 w-full rounded-full bg-gradient-to-r from-[#8913c9] to-[#c400ff]"></div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="mb-6 text-center text-xl font-semibold">颜色使用示例</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* 蓝色主题示例 */}
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-bold text-[#1353c9]">蓝色主题（当前）</h3>
            <div className="mb-4 h-2 w-full rounded-full bg-gradient-to-r from-[#1353c9] to-[#00c3ff]"></div>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              当前网站使用的是蓝色主题，灵感来自于 Blue Lock 动漫。蓝色给人一种专业、冷静且可靠的感觉。
            </p>
            <div className="flex space-x-2">
              <div className="rounded-lg bg-[#1353c9] px-4 py-2 text-white">主色按钮</div>
              <div className="rounded-lg bg-[#00c3ff] px-4 py-2 text-white">强调色按钮</div>
            </div>
          </div>

          {/* 红色主题示例 */}
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-bold text-[#c91313]">红色主题</h3>
            <div className="mb-4 h-2 w-full rounded-full bg-gradient-to-r from-[#c91313] to-[#ff0000]"></div>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              红色主题给人一种热情、大胆且充满活力的感觉，适合强调行动和紧迫感。
            </p>
            <div className="flex space-x-2">
              <div className="rounded-lg bg-[#c91313] px-4 py-2 text-white">主色按钮</div>
              <div className="rounded-lg bg-[#ff0000] px-4 py-2 text-white">强调色按钮</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="mb-6 text-center text-xl font-semibold">如何修改主题颜色</h2>
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <p className="mb-4 text-center">
            要修改网站的主题颜色，您需要编辑两个关键文件：
          </p>
          <ul className="mb-6 list-disc pl-8">
            <li className="mb-2"><code className="rounded-md bg-gray-100 px-2 py-1 text-sm dark:bg-gray-700">tailwind.config.ts</code> - 定义了网站的所有颜色变量</li>
            <li className="mb-2"><code className="rounded-md bg-gray-100 px-2 py-1 text-sm dark:bg-gray-700">src/app/globals.css</code> - 包含主题相关的 CSS 变量和样式</li>
          </ul>
          <p className="text-center">
            查看详细的修改指南，了解如何将网站的颜色从蓝色改为您喜欢的颜色。
          </p>
        </div>
      </div>

      <div className="mt-16 flex justify-center space-x-4">
        <Link href="/theme-color-guide">
          <Button className="bg-bl-blue text-white hover:bg-bl-blue-light">
            查看颜色修改指南
          </Button>
        </Link>
        <Link href="/guides">
          <Button variant="outline" className="border-bl-blue text-bl-blue hover:bg-bl-blue/10">
            返回指南列表
          </Button>
        </Link>
      </div>
    </div>
  );
}
