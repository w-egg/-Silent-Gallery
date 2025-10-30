import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { nanoid } from 'nanoid';
import { auth } from '@/auth';

export const runtime = 'nodejs';

const isDevelopment = process.env.NODE_ENV === 'development';
const useVercelBlob = process.env.BLOB_READ_WRITE_TOKEN && !isDevelopment;

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // ファイル拡張子を取得
    const ext = file.name.split('.').pop() || 'jpg';
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (!allowedExtensions.includes(ext.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // ファイルサイズチェック（10MB制限）
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // ユニークなファイル名を生成
    const imageKey = `${nanoid()}.${ext}`;

    if (useVercelBlob) {
      // Vercel Blobにアップロード（本番環境）
      const blob = await put(imageKey, file, {
        access: 'public',
        addRandomSuffix: false,
      });

      return NextResponse.json({
        imageKey,
        url: blob.url,
        message: 'File uploaded successfully',
      });
    } else {
      // ローカルファイルシステムにアップロード（開発環境）
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // アップロードディレクトリを作成（存在しない場合）
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });

      // ファイルを保存
      const filePath = join(uploadDir, imageKey);
      await writeFile(filePath, buffer);

      return NextResponse.json({
        imageKey,
        url: `/uploads/${imageKey}`,
        message: 'File uploaded successfully',
      });
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
