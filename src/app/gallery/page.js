import { getImages } from '@/lib/images';
import GalleryClient from './GalleryClient';

export default async function GalleryPage({ searchParams }) {
  const params = await searchParams;
  const category = params.category;
  const validCategories = ['anime', 'landscape', 'portrait'];
  
  // 如果指定了有效分类,获取该分类的图片,否则获取全部
  const { pc, mobile, all } = getImages(
    validCategories.includes(category) ? category : null
  );
  
  const imagesList = all || [
    ...pc.map(img => ({ ...img, type: 'PC' })),
    ...mobile.map(img => ({ ...img, type: 'Mobile' }))
  ];
  
  const allImages = imagesList.sort(() => Math.random() - 0.5);

  return <GalleryClient initialImages={allImages} currentCategory={category} />;
}
