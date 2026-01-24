import metadata from './images-metadata.json';

export function getImages(category = null) {
  const pc = metadata.pc || [];
  const mobile = metadata.mobile || [];
  const categories = metadata.categories || {};

  // 如果指定了分类,返回该分类的图片
  if (category && categories[category]) {
    const categoryImages = categories[category];
    return {
      pc: categoryImages.filter(img => img.width > img.height),
      mobile: categoryImages.filter(img => img.width <= img.height),
      all: categoryImages
    };
  }

  return {
    pc,
    mobile,
    categories
  };
}
