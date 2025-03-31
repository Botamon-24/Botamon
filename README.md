# Botamon Portfolio

基于 Next.js 和 Tailwind CSS 构建的作品集网站，以 Blue Lock 动漫为主题。

## 如何使用 Visual Studio Code 修改网站内容

### 步骤 1: 克隆仓库到本地

```bash
git clone [您的仓库URL]
cd botamon-portfolio
```

### 步骤 2: 安装依赖

```bash
bun install
```

### 步骤 3: 启动开发服务器

```bash
bun run dev
```

### 步骤 4: 修改内容

#### 修改视频内容
编辑 `src/app/videos/page.tsx` 文件中的 `videosData` 数组：
- 修改标题、描述、日期
- 更换缩略图URL
- 更新视频链接（YouTube 或 Vimeo）

#### 修改设计作品内容
编辑 `src/app/design/page.tsx` 文件中的 `designWorks` 数组：
- 修改标题、描述、日期
- 更换缩略图和作品图片URL
- 分类可选："graphic", "3d", "ui", "illustration"

#### 修改 Logo
编辑 `src/components/layout/logo.tsx` 文件：
- 更改文字 Logo
- 或使用图片 Logo（取消相关注释）

### 步骤 5: 添加自己的图片

1. 将图片文件放入 `public` 文件夹
2. 使用时路径为 `/您的图片名称.扩展名`，例如：`/my-logo.png`

示例：
```jsx
// 使用本地图片
<img src="/my-logo.png" alt="我的 Logo" />
```

## 如何部署网站

### 部署到 Netlify

1. 在 Netlify 注册并创建新项目
2. 连接您的 Git 仓库
3. 配置构建设置：
   - 构建命令: `bun run build`
   - 发布目录: `.next`

### 部署到 Vercel

1. 在 Vercel 注册并创建新项目
2. 连接您的 Git 仓库
3. Vercel 会自动检测 Next.js 项目并配置正确的设置

## 如何上传到自己的 Git 仓库

### 创建新仓库

1. 在 GitHub/GitLab 上创建新仓库
2. 初始化本地仓库并添加远程地址：

```bash
git init
git add .
git commit -m "初始提交"
git branch -M main
git remote add origin [您的仓库URL]
git push -u origin main
```

### 更新现有仓库

```bash
git add .
git commit -m "更新内容"
git push
```

## 文件结构说明

- `/src/app/` - 页面组件
- `/src/components/` - 可复用组件
- `/public/` - 静态资源（图像、图标等）
- `/src/lib/` - 工具函数
