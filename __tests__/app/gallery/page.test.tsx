import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import GalleryPage from '@/app/gallery/page';

// Mock fetch
global.fetch = jest.fn();

describe('GalleryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ローディング状態を表示する', () => {
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<GalleryPage />);
    expect(screen.getByText('静けさを待っています...')).toBeInTheDocument();
  });

  it('投稿がない場合は空の状態を表示する', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ posts: [] }),
    });

    render(<GalleryPage />);

    await waitFor(() => {
      expect(screen.getByText('今週の写真はまだありません。')).toBeInTheDocument();
    });
  });

  it('投稿を正しく表示する', async () => {
    const mockPosts = [
      {
        id: 'post-1',
        authorId: 'user-1',
        imageKey: 'image1.jpg',
        publishAt: new Date('2025-10-25'),
        expireAt: new Date('2025-11-01'),
        visible: true,
        createdAt: new Date('2025-10-25'),
      },
      {
        id: 'post-2',
        authorId: 'user-2',
        imageKey: 'image2.jpg',
        publishAt: new Date('2025-10-26'),
        expireAt: new Date('2025-11-02'),
        visible: true,
        createdAt: new Date('2025-10-26'),
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ posts: mockPosts }),
    });

    render(<GalleryPage />);

    await waitFor(() => {
      expect(screen.getByText('1 / 2')).toBeInTheDocument();
    });
  });

  it('次へボタンで次の写真に移動する', async () => {
    const mockPosts = [
      {
        id: 'post-1',
        authorId: 'user-1',
        imageKey: 'image1.jpg',
        publishAt: new Date('2025-10-25'),
        expireAt: new Date('2025-11-01'),
        visible: true,
        createdAt: new Date('2025-10-25'),
      },
      {
        id: 'post-2',
        authorId: 'user-2',
        imageKey: 'image2.jpg',
        publishAt: new Date('2025-10-26'),
        expireAt: new Date('2025-11-02'),
        visible: true,
        createdAt: new Date('2025-10-26'),
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ posts: mockPosts }),
    });

    render(<GalleryPage />);

    await waitFor(() => {
      expect(screen.getByText('1 / 2')).toBeInTheDocument();
    });

    const nextButton = screen.getByLabelText('次の写真');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('2 / 2')).toBeInTheDocument();
    });
  });

  it('前へボタンで前の写真に移動する', async () => {
    const mockPosts = [
      {
        id: 'post-1',
        authorId: 'user-1',
        imageKey: 'image1.jpg',
        publishAt: new Date('2025-10-25'),
        expireAt: new Date('2025-11-01'),
        visible: true,
        createdAt: new Date('2025-10-25'),
      },
      {
        id: 'post-2',
        authorId: 'user-2',
        imageKey: 'image2.jpg',
        publishAt: new Date('2025-10-26'),
        expireAt: new Date('2025-11-02'),
        visible: true,
        createdAt: new Date('2025-10-26'),
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ posts: mockPosts }),
    });

    render(<GalleryPage />);

    await waitFor(() => {
      expect(screen.getByText('1 / 2')).toBeInTheDocument();
    });

    // 次へ移動
    const nextButton = screen.getByLabelText('次の写真');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('2 / 2')).toBeInTheDocument();
    });

    // 前へ移動
    const prevButton = screen.getByLabelText('前の写真');
    fireEvent.click(prevButton);

    await waitFor(() => {
      expect(screen.getByText('1 / 2')).toBeInTheDocument();
    });
  });

  it('最後の写真で終了メッセージを表示する', async () => {
    const mockPosts = [
      {
        id: 'post-1',
        authorId: 'user-1',
        imageKey: 'image1.jpg',
        publishAt: new Date('2025-10-25'),
        expireAt: new Date('2025-11-01'),
        visible: true,
        createdAt: new Date('2025-10-25'),
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ posts: mockPosts }),
    });

    render(<GalleryPage />);

    await waitFor(() => {
      expect(screen.getByText('今週の静寂はここまで。')).toBeInTheDocument();
    });
  });

  it('リアクションボタンをクリックできる', async () => {
    const mockPosts = [
      {
        id: 'post-1',
        authorId: 'user-1',
        imageKey: 'image1.jpg',
        publishAt: new Date('2025-10-25'),
        expireAt: new Date('2025-11-01'),
        visible: true,
        createdAt: new Date('2025-10-25'),
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ posts: mockPosts }),
    });

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(<GalleryPage />);

    await waitFor(() => {
      expect(screen.getByText('1 / 1')).toBeInTheDocument();
    });

    const moonButton = screen.getByLabelText('moon reaction');
    fireEvent.click(moonButton);

    expect(consoleSpy).toHaveBeenCalledWith('Reaction:', 'moon', 'for post:', 'post-1');

    consoleSpy.mockRestore();
  });
});
