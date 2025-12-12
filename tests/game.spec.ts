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

  test('Phase 4: should detect draw when board is full with no winner', async ({ page }) => {
    await test.step('Fill board to create draw condition', async () => {
      // X: 0, 1, 5, 6, 7
      // O: 2, 3, 4, 8
      // 引き分けのパターン:
      // X X O
      // O O X
      // X X O
      const squares = page.locator('button.square');
      
      await squares.nth(0).click(); // X
      await squares.nth(2).click(); // O
      await squares.nth(1).click(); // X
      await squares.nth(3).click(); // O
      await squares.nth(5).click(); // X
      await squares.nth(4).click(); // O
      await squares.nth(6).click(); // X
      await squares.nth(8).click(); // O
      await squares.nth(7).click(); // X - 引き分け
    });

    await test.step('Verify draw message appears', async () => {
      const status = page.locator('div.status');
      await expect(status).toContainText('引き分け');
    });

    await test.step('Verify no squares are highlighted', async () => {
      const highlightedSquares = page.locator('button.square.highlight');
      await expect(highlightedSquares).toHaveCount(0);
    });
  });

  test('Phase 5: should display move history', async ({ page }) => {
    await test.step('Make several moves', async () => {
      const squares = page.locator('button.square');
      
      await squares.nth(0).click(); // X at (1, 1)
      await squares.nth(4).click(); // O at (2, 2)
      await squares.nth(8).click(); // X at (3, 3)
    });

    await test.step('Verify move history is displayed', async () => {
      // 履歴リスト内のアイテムを確認（ol > li）
      const historyItems = page.locator('.game-info ol li');
      
      // 少なくとも4つのアイテムがあることを確認（start + 3手）
      await expect(historyItems).toHaveCount(4);
      
      // "Go to game start" ボタンが存在
      const gameStartButton = page.locator('.game-info ol button', { hasText: 'Go to game start' });
      await expect(gameStartButton).toBeVisible();
    });
  });

  test('Phase 5: should jump to previous move using history', async ({ page }) => {
    await test.step('Make several moves to create history', async () => {
      const squares = page.locator('button.square');
      
      await squares.nth(0).click(); // X at (1, 1)
      await squares.nth(4).click(); // O at (2, 2)
      await squares.nth(8).click(); // X at (3, 3)
    });

    await test.step('Jump to move #1', async () => {
      // 履歴ボタンから "Go to move #1" をクリック
      const move1Button = page.locator('.game-info ol button', { hasText: 'Go to move #1' });
      await move1Button.click();
    });

    await test.step('Verify board state reverted to move #1', async () => {
      const squares = page.locator('button.square');
      
      // 0番目のマス目にXがある
      await expect(squares.nth(0)).toHaveText('X');
      
      // 4番目と8番目は空
      await expect(squares.nth(4)).toHaveText('');
      await expect(squares.nth(8)).toHaveText('');
      
      // ステータスはOのターン
      const status = page.locator('div.status');
      await expect(status).toContainText('Next player: O');
    });
  });

  test('Phase 5: should jump to game start', async ({ page }) => {
    await test.step('Make several moves', async () => {
      const squares = page.locator('button.square');
      
      await squares.nth(0).click(); // X
      await squares.nth(1).click(); // O
      await squares.nth(2).click(); // X
    });

    await test.step('Click "Go to game start" button', async () => {
      const gameStartButton = page.locator('.game-info ol button', { hasText: 'Go to game start' });
      await gameStartButton.click();
    });

    await test.step('Verify all squares are empty', async () => {
      const squares = page.locator('button.square');
      const squareCount = await squares.count();
      
      for (let i = 0; i < squareCount; i++) {
        await expect(squares.nth(i)).toHaveText('');
      }
      
      // ステータスはXのターン
      const status = page.locator('div.status');
      await expect(status).toContainText('Next player: X');
    });
  });

  test('Phase 5: should allow new moves after jumping to previous state', async ({ page }) => {
    await test.step('Create initial moves', async () => {
      const squares = page.locator('button.square');
      
      await squares.nth(0).click(); // X
      await squares.nth(1).click(); // O
      await squares.nth(2).click(); // X
    });

    await test.step('Jump to move #1', async () => {
      const move1Button = page.locator('.game-info ol button', { hasText: 'Go to move #1' });
      await move1Button.click();
    });

    await test.step('Make a new move from that state', async () => {
      const squares = page.locator('button.square');
      
      // 4番目のマス目に O を配置（move #1 の後なので O のターン）
      await squares.nth(4).click();
      await expect(squares.nth(4)).toHaveText('O');
      
      // 元々あった move #2 と #3 は履歴から消える
      // 新しい履歴は: start, move #1 (X), move #2 (新しい O)
      const historyItems = page.locator('.game-info ol li');
      await expect(historyItems).toHaveCount(3);
    });
  });

  test('Phase 5: should toggle sort order of move history', async ({ page }) => {
    await test.step('Make several moves', async () => {
      const squares = page.locator('button.square');
      
      await squares.nth(0).click(); // X
      await squares.nth(1).click(); // O
      await squares.nth(2).click(); // X
    });

    await test.step('Verify initial ascending order', async () => {
      const historyList = page.locator('.game-info ol li').first();
      await expect(historyList).toContainText('Go to game start');
    });

    await test.step('Click sort toggle button', async () => {
      const sortButton = page.locator('.game-info button', { hasText: '降順にソート' });
      await sortButton.click();
    });

    await test.step('Verify descending order', async () => {
      // 降順の場合、最新の move が最初に来る
      const firstItem = page.locator('.game-info ol li').first();
      await expect(firstItem).toContainText('You are at move #3');
      
      // ボタンのテキストが変わる
      const sortButton = page.locator('.game-info button', { hasText: '昇順にソート' });
      await expect(sortButton).toBeVisible();
    });

    await test.step('Toggle back to ascending', async () => {
      const sortButton = page.locator('.game-info button', { hasText: '昇順にソート' });
      await sortButton.click();
      
      // 昇順に戻る
      const firstItem = page.locator('.game-info ol li').first();
      await expect(firstItem).toContainText('Go to game start');
    });
  });
});
