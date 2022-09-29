# 使い方

## 1. submodule の追加

自身のシステムに本リポジトリを submodule として取り込む

```bash
git submodule add git@github.com:yusuke-hata-code/xss-test.git
```

submodule の更新方法

```bash
git submodule foreach git pull origin main
```

## 2. assertXSS.mjs の作成

- サブモジュールと同じ階層に `xss-test.mjs` を作成
- assertXSS 関数の定義
- setting の定義(optional)

### assertXSS 関数の定義

- 検知結果を Boolean で返す

```javascript
// 最小構成例
/**
 * 検知システムを実行（サンプル毎に呼び出される）
 * @param {string} fullPath サンプルのローカルファイルパス
 * @param {string} url url
 * @return {boolean} 検知結果
 */
export const assertXSS = async ({ fullPath, url }) => {
  return true;
};
```

サンプルのローカルファイルパスを用いる例

```javascript
export  const assertXSS = ({ fullPath }) => {
  const result = await YOUR_ANALYZE_SYSTEM(fullPath);
  return Boolean(result);
};
```

サンプルの url を用いる例

```javascript
export const assertXSS = async ({ url }) => {
  const result = await YOUR_ANALYZE_SYSTEM(url);
  return Boolean(result);
};
```

### オプションの設定

- 以下はデフォルト値

```json
export const setting = {
  webServer: false, //webServerを起動する
  testConcurrent: false, //同カテゴリ下のテストを並行実行する
  fileExtensions: ['.html'], //テストする拡張子指定
  skipSanitizedSamples: false, //無害化サンプルテストをスキップする
};
```

## 3. vitest の install

`vitest` と `@vitest/ui` を自身のリポジトリにインストールする

```bash
npm i -D vitest @vitest/ui serve-handler
```

package.json に以下を追記

```json
"scripts": {
  "test": "vitest -w false",
  "test:open": "vitest --ui"
}
```

実行

```bash
# CUI
npm run test
# GUI
npm run test:open
```

## 4. vite.config(並列処理では動かない場合)

並列処理を停止したい->以下のようにvite.config.jsを自身のリポジトリのrootに追加する
```javascript
/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    threads: false,
    testTimeout: 6000,
  },
});
```

# テストサンプルの概要

合計178サンプル
| カテゴリ|サンプル数|概要|
| ---- | ---- |----|
|  [address](./samples/address/) |  29  |firing rangeのAddress DOM XSSサンプル|
|  [address-sanitized](./samples/address-sanitized/) |  29  |firing rangeのAddress DOM XSSサンプルを無害化したもの|
|  [dom](./samples/dom/) |  34  |firing rangeのAddress DOM XSSサンプル|
|  [dom-sanitized](./samples/dom-sanitized/) |  34  |firing rangeのAddress DOM XSSサンプルを無害化したもの|
|[urldom](./samples/urldom/)|26|firing rangeのUIRL-based DOM XSSサンプル|
|[urldom-sanitized](./samples/urldom-sanitized/)|26|firing rangeのUIRL-based DOM XSSサンプルを無害化したもの|

- 無害化はDOMPurify.sanitized()を用いてサニタイズを行っている．

# テストサンプルの追加方法

- samples 以下にカテゴリ名でディレクトリを作り、そのディレクトリ内に Source ごとにディレクトリと作ってその中に Sink ごとに html ファイルを追加してください

- test 以下に、カテゴリ.test.mjs ファイルを作ってください

```text
test
- カテゴリ.test.mjs
- samples/
  - カテゴリ/
    - Source 名前のディレクトリ/
      - Sink の名前.html
      - Sink の名前.html
      - Sink の名前.html
```

- カテゴリ.test.mjs の内容は以下の通り、expectBoolean のみ指定してください

```javascript
import { makeBoolTest } from './lib/makeTest.js';
makeBoolTest({ FILENAME: __filename, DIRNAME: __dirname, expectBoolean: true }
```

- lib/assrtXSS.mjs の中の isXSS 関数を自分の検知システムを実行するように変更してください。返り値が Boolean になるようにしてください