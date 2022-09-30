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

### assertSnapshotXSS 関数の定義

- snapshot テスト用、返り値はなんでもよい

```javascript
export const assertSnapshotXSS = async ({ url }) => {
  return url;
};
```

### オプションの設定

- 以下はデフォルト値

```json
export const setting = {
  disableWebServer: false, //webServerを起動しない
  testConcurrent: false, //同カテゴリ下のテストを並行実行する
  fileExtensions: ['.html'], //テストする拡張子指定
  skipSanitizedSamples: false, //無害化サンプルテストをスキップする
  snapshotWebserverPort: 8888, //snapshotテスト時のwebサーバのポート、0でauto
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
  "test:open": "vitest --ui",
  "test-u": "vitest -u"
}
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

# バージョンの変更基準について

`major.minor.patch` の形式

|        | 変更基準                           |
| ------ | ---------------------------------- |
| major  | サンプルの変更                     |
| mainor | ユーザ側での設定変更が必要         |
| patch  | その他(ユーザ側での設定変更は不要) |

個別の詳細は [Releases](https://github.com/yusuke-hata-code/xss-test/releases) にて

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
