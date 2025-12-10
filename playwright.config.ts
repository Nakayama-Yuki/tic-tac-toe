import { defineConfig, devices } from "@playwright/test";

/**
 * ファイルから環境変数を読み込む。
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* 全てのテストを並行して実行する */
  fullyParallel: true,
  /* ソースコードにtest.onlyを誤って残した場合、CIでビルドを失敗させる。*/
  forbidOnly: !!process.env.CI,
  /* CIの場合のみリトライする */
  retries: process.env.CI ? 2 : 0,
  /* CIの場合は並行テストを無効にする */
  workers: process.env.CI ? 1 : undefined,
  /* 使用するレポーター。 See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* 直下の全てのプロジェクトで共有される設定。See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* 失敗したテストをリトライする際にトレースを収集する。See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* 主要なブラウザ向けのプロジェクトを設定する */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    /* モバイルのビューポートでテストする。 */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* 特定のブラウザでテストする */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* テストを開始する前にローカルの開発サーバーを起動する */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
