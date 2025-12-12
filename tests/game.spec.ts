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

  test('Phase 2: should place X and O alternately on click', async ({ page }) => {
    await test.step('Click first square and verify X appears', async () => {
      const firstSquare = page.locator('button.square').nth(0);
      await firstSquare.click();
      await expect(firstSquare).toHaveText('X');
      
      // ステータスが次のプレイヤー（O）を表示
      const status = page.locator('div.status');
      await expect(status).toContainText('Next player: O');
    });

    await test.step('Click second square and verify O appears', async () => {
      const secondSquare = page.locator('button.square').nth(1);
      await secondSquare.click();
      await expect(secondSquare).toHaveText('O');
      
      // ステータスが次のプレイヤー（X）を表示
      const status = page.locator('div.status');
      await expect(status).toContainText('Next player: X');
    });

    await test.step('Click third square and verify X appears again', async () => {
      const thirdSquare = page.locator('button.square').nth(2);
      await thirdSquare.click();
      await expect(thirdSquare).toHaveText('X');
      
      // ステータスが次のプレイヤー（O）を表示
      const status = page.locator('div.status');
      await expect(status).toContainText('Next player: O');
    });
  });

  test('Phase 2: should not overwrite already filled square', async ({ page }) => {
    await test.step('Fill first square with X', async () => {
      const firstSquare = page.locator('button.square').nth(0);
      await firstSquare.click();
      await expect(firstSquare).toHaveText('X');
    });

    await test.step('Try to click same square again', async () => {
      const firstSquare = page.locator('button.square').nth(0);
      await firstSquare.click();
      // X のまま変わらないことを確認
      await expect(firstSquare).toHaveText('X');
      
      // ステータスは次のプレイヤー（O）のまま
      const status = page.locator('div.status');
      await expect(status).toContainText('Next player: O');
    });
  });

  test('Phase 3: should detect horizontal win for X', async ({ page }) => {
    await test.step('Create horizontal winning line (top row)', async () => {
      // X: 0, 1, 2 (横一列)
      // O: 3, 4
      const squares = page.locator('button.square');
      
      await squares.nth(0).click(); // X
      await squares.nth(3).click(); // O
      await squares.nth(1).click(); // X
      await squares.nth(4).click(); // O
      await squares.nth(2).click(); // X - 勝利
    });

    await test.step('Verify winner message appears', async () => {
      const status = page.locator('div.status');
      await expect(status).toContainText('Winner: X');
    });

    await test.step('Verify winning squares are highlighted', async () => {
      // 勝利したマス目が highlight クラスを持つことを確認
      const winningSquares = page.locator('button.square.highlight');
      await expect(winningSquares).toHaveCount(3);
    });
  });

  test('Phase 3: should detect vertical win for O', async ({ page }) => {
    await test.step('Create vertical winning line (left column)', async () => {
      // X: 1, 2, 4
      // O: 0, 3, 6 (縦一列)
      const squares = page.locator('button.square');
      
      await squares.nth(1).click(); // X
      await squares.nth(0).click(); // O
      await squares.nth(2).click(); // X
      await squares.nth(3).click(); // O
      await squares.nth(4).click(); // X
      await squares.nth(6).click(); // O - 勝利
    });

    await test.step('Verify winner message appears', async () => {
      const status = page.locator('div.status');
      await expect(status).toContainText('Winner: O');
    });

    await test.step('Verify winning squares are highlighted', async () => {
      const winningSquares = page.locator('button.square.highlight');
      await expect(winningSquares).toHaveCount(3);
    });
  });

  test('Phase 3: should detect diagonal win for X', async ({ page }) => {
    await test.step('Create diagonal winning line (top-left to bottom-right)', async () => {
      // X: 0, 4, 8 (斜め一列)
      // O: 1, 2
      const squares = page.locator('button.square');
      
      await squares.nth(0).click(); // X
      await squares.nth(1).click(); // O
      await squares.nth(4).click(); // X
      await squares.nth(2).click(); // O
      await squares.nth(8).click(); // X - 勝利
    });

    await test.step('Verify winner message appears', async () => {
      const status = page.locator('div.status');
      await expect(status).toContainText('Winner: X');
    });

    await test.step('Verify winning squares are highlighted', async () => {
      const winningSquares = page.locator('button.square.highlight');
      await expect(winningSquares).toHaveCount(3);
    });
  });

  test('Phase 3: should prevent further moves after game is won', async ({ page }) => {
    await test.step('Create winning condition', async () => {
      const squares = page.locator('button.square');
      
      await squares.nth(0).click(); // X
      await squares.nth(3).click(); // O
      await squares.nth(1).click(); // X
      await squares.nth(4).click(); // O
      await squares.nth(2).click(); // X - 勝利
    });

    await test.step('Try to make another move', async () => {
      const emptySquare = page.locator('button.square').nth(5);
      await emptySquare.click();
      
      // 空のままであることを確認（移動が無効）
      await expect(emptySquare).toHaveText('');
      
      // 勝者メッセージが維持される
      const status = page.locator('div.status');
      await expect(status).toContainText('Winner: X');
    });
  });
});
