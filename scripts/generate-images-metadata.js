const fs = require('fs');
const path = require('path');
const { imageSize } = require('image-size');
const sharp = require('sharp');

const isImage = (filename) => /\.(jpg|jpeg|png|gif|webp|bmp|tiff)$/i.test(filename);

async function generateMetadata() {
  const publicDir = path.join(process.cwd(), 'public');
  const imagesDir = path.join(publicDir, 'images');
  const thumbDir = path.join(imagesDir, '.thumbnails');
  const pc = [];
  const mobile = [];
  
  // 分类映射
  const categories = {
    'anime': [],
    'landscape': [],
    'portrait': []
  };

  if (!fs.existsSync(publicDir)) {
    console.log('❌ public directory not found');
    return;
  }

  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  if (!fs.existsSync(thumbDir)) {
    fs.mkdirSync(thumbDir, { recursive: true });
  }

  const walk = async (currentDir, category = null) => {
    const list = fs.readdirSync(currentDir);
    for (const file of list) {
      if (file === '.thumbnails' || file === 'images') continue;
      
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // 检查是否是分类文件夹
        if (categories.hasOwnProperty(file)) {
          await walk(filePath, file);
        } else {
          await walk(filePath, category);
        }
      } else if (isImage(file) && file !== 'index.html' && file !== 'notfound.jpg') {
        try {
          const buffer = fs.readFileSync(filePath);
          const dimensions = imageSize(buffer);
          // 计算相对于 public 目录的路径，然后去掉 'public/' 前缀
          const relativeToPublic = path.relative(publicDir, filePath).replace(/\\/g, '/');
          const size = (stat.size / 1024).toFixed(2) + ' KB';

          // 生成缩略图文件名
          const thumbFileName = relativeToPublic.replace(/\//g, '_');
          const thumbPath = path.join(thumbDir, thumbFileName);
          let hasThumb = false;
          
          try {
            if (!fs.existsSync(thumbPath)) {
              await sharp(filePath)
                .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
                .toFile(thumbPath);
            }
            hasThumb = true;
          } catch (sharpErr) {
            console.warn(`⚠️ 缩略图生成失败: ${filePath}`, sharpErr.message);
          }

          const imgData = {
            src: relativeToPublic,
            thumb: hasThumb ? `images/.thumbnails/${thumbFileName}` : null,
            width: dimensions.width,
            height: dimensions.height,
            size: size,
            category: category || 'all'
          };

          if (dimensions.width > dimensions.height) {
            pc.push(imgData);
          } else {
            mobile.push(imgData);
          }

          // 添加到对应分类
          if (category && categories.hasOwnProperty(category)) {
            categories[category].push(imgData);
          }
        } catch (err) {
          console.warn(`⚠️ 无法读取图片尺寸 or 生成缩略图: ${filePath}`, err.message);
        }
      }
    }
  };

  console.log('🔍 Scanning images and generating thumbnails...');
  await walk(publicDir);

  const metadata = { 
    pc, 
    mobile, 
    categories,
    updatedAt: new Date().toISOString() 
  };
  const outputPath = path.join(process.cwd(), 'src', 'lib', 'images-metadata.json');
  
  fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));
  console.log(`✅ Metadata generated: ${pc.length} PC images, ${mobile.length} Mobile images`);
  console.log(`📁 Categories: anime(${categories.anime.length}), landscape(${categories.landscape.length}), portrait(${categories.portrait.length})`);
  console.log(`📂 Saved to: ${outputPath}`);
}

generateMetadata();
