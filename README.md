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

- `xss-test/assertXSS.mjs`を作成
- 検知結果を Boolean で返す

```javascript
// 最小構成例
/**
 * 検知システムを実行（サンプル毎に呼び出される）
 * @param {string} baseDir samplesディレクトリの絶対パス
 * @param {string} pathName baseDir以下のパス
 * @return {boolean} 検知結果
 */
export default async ({ baseDir, pathName }) => {
  return true;
};
```

### サンプルのローカルファイルパスを用いる例

```javascript
import path from 'path';

export default async ({ baseDir, pathName }) => {
  const fullPath = `${path.join(baseDir, pathName)}`;
  const result = await YOUR_ANALYZE_SYSTEM(fullPath);
  return Boolean(result);
};
```

### サンプルの url を用いる例

```javascript
export default async ({ pathName }) => {
  const url = new URL(pathName, 'http://localhost:8888/').href;
  const result = await YOUR_ANALYZE_SYSTEM(url);
  return Boolean(result);
};
```

## 3. vitest の install

`vitest` と `@vitest/ui` を自身のリポジトリにインストールする

```bash
npm i vitest @vitest/ui
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
