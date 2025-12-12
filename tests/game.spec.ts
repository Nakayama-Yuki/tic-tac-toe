import { test, expect } from '@playwright/test';

test.describe('Tic Tac Toe Game', () => {
  test.beforeEach(async ({ page }) => {
    // ゲームページへのナビゲーション
    await page.goto('http://localhost:3000');
  });

  test('should display game board with status on page load', async ({ page }) => {
    // ゲームステータス（Next player: X）が表示されている確認
    const status = page.locator('div.status');
    await expect(status).toBeVisible();
    await expect(status).toContainText('Next player');

    // ボードに9個のマス目が表示されている確認
    const squares = page.locator('button.square');
    await expect(squares).toHaveCount(9);
  });

  test('should display initial game state', async ({ page }) => {
    // 初期状態では全てのマス目が空（テキストが空）であることを確認
    const squares = page.locator('button.square');
    const squareCount = await squares.count();
    expect(squareCount).toBe(9);

    // 全てのマス目が空であることを確認
    for (let i = 0; i < squareCount; i++) {
      const text = await squares.nth(i).textContent();
      expect(text).toBe('');
    }
  });
});
