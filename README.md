# EdgeOne Random Picture

## 🌟 特性

- **🚀 极速响应**：基于 EdgeOne 全球边缘节点实现图片分发。
- **📱 智能分发**：自动识别访问者设备类型（PC/移动端），精准推送适配尺寸的图片。
- **🖼️ 沉浸式图库**：内置瀑布流图库，支持 Lightbox 预览、原图下载及 GSAP 丝滑动画。
- **✨ 动感交互**：集成 GSAP 动画引擎，实现沉浸式首页缩放与页面无缝过渡。
- **🛠️ 架构优化**：采用构建时元数据生成技术。

## 🛠️ 快速开始

### 1. 准备图片

只需将您的图片素材直接**放入** `public/images` 目录即可：
- **无需重命名**：支持任何文件名。
- **格式无忧**：支持 `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.bmp`, `.tiff` 等主流格式。
- **支持子目录**：您可以创建文件夹对图片进行分类管理，系统会自动递归扫描。
- **自动分类**：系统会自动识别图片比例：
  - **横屏图片**（宽 > 高）：自动归类为 PC 端素材。
  - **竖屏图片**（高 >= 宽）：自动归类为 移动端素材。
- **构建优化**：图片元数据在构建时自动生成。

### 2. 安装与开发

```bash
# 安装依赖
pnpm install

# 启动本地开发服务器
pnpm dev
```

### 3. 部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?repository-url=https://github.com/H2O-ME/EdgeOne-Random-Picture)

点击上方一键按钮即可快速部署，相关配置应该会自动识别，也可以照下方参数填写：
- **框架预设**：选择 `Next.js`
- **构建命令**：`npm run build`
- **输出目录**：`.next`

## 📡 API 接口

- **随机图片重定向**: `GET /api/random`
- **指定类型**:
  - PC 端: `/api/random?type=pc`
  - 移动端: `/api/random?type=mobile`
- **JSON 格式**: `/api/random?redirect=false` (返回图片 URL 路径)
- **图库预览**: `GET /gallery`

## 引用

- [EdgeOne-Random-Picture](https://github.com/H2O-ME/EdgeOne-Random-Picture) — H2O-ME

## 📄 许可证

[MIT License](LICENSE)
