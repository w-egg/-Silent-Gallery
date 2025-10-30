'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Upload, X, ArrowLeft, Clock } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface PostClientProps {
  canPost: boolean;
  nextPostAt: Date | null;
}

export default function PostClient({ canPost, nextPostAt }: PostClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const timeUntilNextPost = nextPostAt
    ? Math.max(0, Math.ceil((new Date(nextPostAt).getTime() - Date.now()) / (1000 * 60 * 60)))
    : 0;

  const handleFileSelect = useCallback(async (file: File) => {
    // ファイルタイプチェック
    if (!file.type.startsWith('image/')) {
      setError('画像ファイルを選択してください');
      return;
    }

    // ファイルサイズチェック（10MB）
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('ファイルサイズは10MB以下にしてください');
      return;
    }

    try {
      // 画像を圧縮・EXIF除去
      const options = {
        maxSizeMB: 5,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
        // EXIF情報を除去（位置情報やカメラ情報を削除）
        preserveExif: false,
        fileType: 'image/webp',
        initialQuality: 0.8,
      };

      const compressedFile = await imageCompression(file, options);

      console.log(`元のサイズ: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      console.log(`圧縮後: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);

      setSelectedFile(compressedFile);
      setError(null);

      // プレビュー生成
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
    } catch (err) {
      console.error('Error processing image:', err);
      setError('画像の処理中にエラーが発生しました');
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('画像を選択してください');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // 1. 画像をアップロード
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'アップロードに失敗しました');
      }

      const uploadData = await uploadResponse.json();

      // 2. 投稿を作成
      const postResponse = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageKey: uploadData.imageKey,
        }),
      });

      if (!postResponse.ok) {
        const errorData = await postResponse.json();
        throw new Error(errorData.error || '投稿に失敗しました');
      }

      // 成功したらマイページへリダイレクト
      router.push('/profile');
    } catch (err) {
      console.error('Error posting:', err);
      setError(err instanceof Error ? err.message : '投稿に失敗しました');
    } finally {
      setIsUploading(false);
    }
  };

  if (!canPost) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              Silent Gallery
            </Link>
            <Link href="/profile" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              マイページ
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-12 text-center">
            <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">投稿できません</h1>
            <p className="text-gray-600 mb-2">24時間に1回のみ投稿できます</p>
            <p className="text-gray-500">次の投稿まで約{timeUntilNextPost}時間</p>
            <Link
              href="/profile"
              className="inline-block mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              マイページに戻る
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Silent Gallery
          </Link>
          <Link href="/profile" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            マイページ
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">写真を投稿</h1>

          {/* Upload Area */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {!previewUrl ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition ${
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-700 mb-2">
                  クリックして画像を選択、またはドラッグ&ドロップ
                </p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF, WEBP（最大10MB）</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div>
                <div className="relative aspect-square mb-4">
                  <Image
                    src={previewUrl}
                    alt="プレビュー"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <button
                  onClick={handleClearFile}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition"
                >
                  <X className="h-5 w-5" />
                  画像を削除
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Drift Publishingについて</h3>
            <p className="text-sm text-blue-800 mb-2">
              投稿した写真は、0〜3時間のランダムな遅延後にギャラリーに公開されます。
              これにより、匿名性が高まり、より自由な表現が可能になります。
            </p>
            <p className="text-xs text-blue-700">
              ※ 画像は自動的にEXIF情報（位置情報・撮影日時等）を除去し、WebP形式に変換・圧縮されます。
            </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || isUploading}
            className={`w-full py-4 rounded-lg font-semibold text-white transition ${
              !selectedFile || isUploading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isUploading ? '投稿中...' : '投稿する'}
          </button>
        </div>
      </main>
    </div>
  );
}
