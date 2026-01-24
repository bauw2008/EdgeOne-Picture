import { getImages } from '@/lib/images';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const typeParam = searchParams.get('type');
  
  // 获取动漫分类的图片
  const { pc, mobile } = getImages('anime');

  let list;

  if (typeParam === 'pc') {
    list = pc;
  } else if (typeParam === 'mobile' || typeParam === 'phone') {
    list = mobile;
  } else {
    const userAgent = request.headers.get('user-agent') || '';
    const isMobileDevice = /mobile|android|iphone|ipad|ipod/i.test(userAgent);
    list = isMobileDevice ? mobile : pc;
  }

  if (list.length === 0) {
    list = list === pc ? mobile : pc;
  }

  if (list.length === 0) {
    return new Response('No anime images found', { status: 404 });
  }

  const randomImage = list[Math.floor(Math.random() * list.length)];
  const imageUrl = `/${randomImage.src}`;

  if (searchParams.get('redirect') === 'false') {
    return NextResponse.json({ url: imageUrl });
  }

  const redirectUrl = encodeURI(imageUrl);

  return new Response(null, {
    status: 302,
    headers: {
      'Location': redirectUrl,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}