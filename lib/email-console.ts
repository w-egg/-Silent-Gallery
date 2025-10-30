/**
 * 開発環境用：メール認証URLをコンソールに出力するためのユーティリティ
 */

export function logEmailUrl(email: string, url: string): void {
  console.log('\n' + '='.repeat(80));
  console.log('📧 メール認証リンク (開発環境)');
  console.log('='.repeat(80));
  console.log(`宛先: ${email}`);
  console.log(`URL: ${url}`);
  console.log('='.repeat(80) + '\n');
}
