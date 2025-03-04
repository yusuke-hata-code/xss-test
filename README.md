# 使い方

## 1. submodule の追加

自身のシステムに本リポジトリを submodule として取り込む

```bash
git submodule add git@github.com:yusuke-hata-code/xss-test.git
```

バージョンを指定する場合

```bash
cd xss-test
# バージョン一覧
git tag
git checkout 1.1.0
```

> **Note**
> submodule の更新方法
>
> ```bash
> git submodule foreach git pull origin main
> ```

## 2. xss-test.mjs の作成

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
export const assertXSS = async ({ fullPath }) => {
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

### assertSnapshotXSS 関数の定義

- snapshot テスト用、返り値はなんでもよい

```javascript
export const assertSnapshotXSS = async ({ url }) => {
  return url;
};
```

### オプションの設定

- 以下はデフォルト値とオプションの説明

```javascript
export const setting = {
  disableWebServer: false, //webServerを起動しないかどうか
  testConcurrent: false, //同カテゴリ下のテストを並行実行
  fileExtensions: ['.html'], //テストする拡張子
  skipSanitizedSamples: false, //無害化サンプルテストをスキップ
  snapshotWebserverPort: 8888, //snapshotテスト時のwebサーバのポート、0でauto
};
```

## 3. vitest の install

```bash
npm i -D vitest @vitest/ui serve-handler
```

自リポジトリの package.json に以下を追記

```json
"scripts": {
  "test": "vitest -w false",
  "test:open": "vitest --ui",
  "test-u": "vitest -u -w false",
  "test-samples": "npm run test -- xss-test/*.test.mjs",
  "test-snapshot": "npm run test -- xss-test/*.spec.mjs"
}
```

自リポジトリ直下に vitest.config.ts を作成

```javascript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    resolveSnapshotPath: (testPath, snapExtension) => {
      return path.join(
        path.dirname(testPath),
        '../__snapshots__',
        path.basename(testPath) + snapExtension
      );
    },
  },
});
```

実行

```bash
# CUI
npm run test
# GUI
npm run test:open
# snapshotの更新
npm run test-u
```

- 並列処理によってテストが上手くいかない場合

[Vitest の thread オプション](https://vitest.dev/config/#threads)

# バージョンの変更基準について

`major.minor.patch` の形式

|       | 変更基準                                   |
| ----- | ------------------------------------------ |
| major | サンプルの追加                             |
| minor | ユーザ側での設定変更が必要かサンプルの修正 |
| patch | その他(ユーザ側での設定変更は不要)         |

個別の詳細は [Releases](https://github.com/yusuke-hata-code/xss-test/releases) にて

# テストサンプルの概要

合計 221 サンプル
| カテゴリ|サンプル数|概要|
| ---- | ---- |----|
| [address](./samples/address/) | 29 |firing range の Address DOM XSS サンプル|
| [address-sanitized](./samples/address-sanitized/) | 20 |firing range の Address DOM XSS サンプルを無害化したもの|
| [dom](./samples/dom/) | 54 |firing range の Address DOM XSS サンプル|
| [dom-sanitized](./samples/dom-sanitized/) | 32 |firing range の Address DOM XSS サンプルを無害化したもの|
|[urldom](./samples/urldom/)|26|firing range の UIRL-based DOM XSS サンプル|
|[recentAPI](./samples/recentAPI/)|7|Firing Range に含まれていなかった Sink や記法|
|[jQuery](./samples/jQuery/)|13|jQuery の Sink API サンプル|
|[TrustedTypes-bypass](./samples/TrustedTypes-bypass)|5|Trusted Types を設定していても XSS 攻撃を防ぐことができないサンプル|
|[lack-sanitized](./samples/lack-sanitized)|36|サニタイズが不十分なサンプル|
|[separateFlow](./samples/separateFlow)|1|SourceとSinkの間に直接のデータフローが存在しないサンプル|

- 無害化は DOMPurify.sanitized()を用いてサニタイズを行っている．
- dom は 1 サンプルに sync Trigger と Async Trigger の 2 つ Sink が含まれていたものが 20 サンプルあったため，これらを別ファイルに分割している．また，同様に dom-sanitized に関しても 12 サンプル増えている．

# テストサンプルの追加方法

- samples 以下にカテゴリ名でディレクトリを作り、そのディレクトリ内に Source ごとにディレクトリと作ってその中に Sink ごとに html ファイルを追加してください

- test 以下に、カテゴリ.test.mjs ファイルを作ってください

```text
xss-test
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
