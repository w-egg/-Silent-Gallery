import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { signIn } from 'next-auth/react';
import SignInPage from '@/app/auth/signin/page';

jest.mock('next-auth/react');

describe('SignInPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('サインインフォームを表示する', () => {
    render(<SignInPage />);

    expect(screen.getByText('Silent Galleryへようこそ')).toBeInTheDocument();
    expect(screen.getByText('GitHubでサインイン')).toBeInTheDocument();
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
  });

  it('GitHubサインインボタンをクリックするとsignInが呼ばれる', async () => {
    const mockSignIn = signIn as jest.Mock;
    mockSignIn.mockResolvedValueOnce(undefined);

    render(<SignInPage />);

    const githubButton = screen.getByText('GitHubでサインイン');
    fireEvent.click(githubButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('github', { callbackUrl: '/gallery' });
    });
  });

  it('メールアドレスを入力してサインインできる', async () => {
    const mockSignIn = signIn as jest.Mock;
    mockSignIn.mockResolvedValueOnce(undefined);

    render(<SignInPage />);

    const emailInput = screen.getByLabelText('メールアドレス');
    const submitButton = screen.getByText('メールでサインイン');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('resend', {
        email: 'test@example.com',
        redirect: false,
      });
    });
  });

  it('メール送信後に確認画面を表示する', async () => {
    const mockSignIn = signIn as jest.Mock;
    mockSignIn.mockResolvedValueOnce(undefined);

    render(<SignInPage />);

    const emailInput = screen.getByLabelText('メールアドレス');
    const submitButton = screen.getByText('メールでサインイン');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('メールを確認してください')).toBeInTheDocument();
      expect(screen.getByText(/test@example.com にサインインリンクを送信しました/)).toBeInTheDocument();
    });
  });

  it('別のメールアドレスを試すボタンでフォームに戻る', async () => {
    const mockSignIn = signIn as jest.Mock;
    mockSignIn.mockResolvedValueOnce(undefined);

    render(<SignInPage />);

    const emailInput = screen.getByLabelText('メールアドレス');
    const submitButton = screen.getByText('メールでサインイン');

    // メール送信
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('メールを確認してください')).toBeInTheDocument();
    });

    // 戻るボタン
    const backButton = screen.getByText('別のメールアドレスを試す');
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByText('Silent Galleryへようこそ')).toBeInTheDocument();
    });
  });

  it('メールアドレスが空の場合はボタンが無効化される', () => {
    render(<SignInPage />);

    const submitButton = screen.getByText('メールでサインイン');
    expect(submitButton).toBeDisabled();
  });

  it('ローディング中はボタンが無効化される', async () => {
    const mockSignIn = signIn as jest.Mock;
    mockSignIn.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(<SignInPage />);

    const emailInput = screen.getByLabelText('メールアドレス');
    const submitButton = screen.getByText('メールでサインイン');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    // ローディング中のテキストを確認
    await waitFor(() => {
      expect(screen.getByText('送信中...')).toBeInTheDocument();
    });

    // ボタンが無効化されていることを確認
    expect(submitButton).toBeDisabled();
  });
});
