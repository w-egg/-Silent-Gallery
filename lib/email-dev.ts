/**
 * 開発環境用のメール送信関数
 * 実際にメールを送らずにコンソールに出力する
 */

export async function sendVerificationRequestDev({
  identifier: email,
  url,
}: {
  identifier: string;
  url: string;
}): Promise<void> {
  console.log('\n' + '='.repeat(80));
  console.log('📧 メール認証リンク (開発環境)');
  console.log('='.repeat(80));
  console.log(`宛先: ${email}`);
  console.log(`認証URL: ${url}`);
  console.log('\nこのURLをブラウザで開いてサインインを完了してください。');
  console.log('='.repeat(80) + '\n');
}
