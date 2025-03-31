// 上传和使用图片指南

/**
 * 如何在网站中使用图片
 *
 * 1. 本地图片（推荐）：
 *    - 将图片文件放入 public 文件夹
 *    - 示例: /logo.png, /my-image.jpg
 *    - 使用方法：
 *      <img src="/my-image.jpg" alt="描述" />
 *
 *      或使用 Next.js Image 组件（推荐，自动优化）:
 *      import Image from "next/image";
 *      <Image src="/my-image.jpg" alt="描述" width={500} height={300} />
 *
 * 2. 远程图片：
 *    - 使用外部图片托管服务如 Cloudinary, Imgur 等
 *    - 示例: https://example.com/my-image.jpg
 *    - 使用方法：
 *      <img src="https://example.com/my-image.jpg" alt="描述" />
 *
 *      或使用 Next.js Image 组件:
 *      import Image from "next/image";
 *      <Image
 *        src="https://example.com/my-image.jpg"
 *        alt="描述"
 *        width={500}
 *        height={300}
 *      />
 *
 * 3. 替换网站中的图片：
 *    - 找到对应的数据文件（如 videos/page.tsx 或 design/page.tsx）
 *    - 将图片 URL 替换为您自己的图片 URL
 *    - 如果是本地图片，使用 "/your-image.jpg" 格式
 *    - 如果是远程图片，使用完整的 URL
 *
 * 4. 图片优化建议：
 *    - 使用 .webp 或 .jpg 格式以获得更好的性能
 *    - 图片尺寸适中，推荐宽度不超过 1920px
 *    - 缩略图推荐使用 4:3 或 1:1 比例
 */
