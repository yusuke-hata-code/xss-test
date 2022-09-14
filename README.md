テストを追加する場合

- samples 以下にジャンル名でディレクトリを作り、そのディレクトリ内に Source ごとにディレクトリと作ってその中に Sink ごとに html ファイルを追加してください

- test 以下に、ジャンル.test.mjs ファイルを作ってください

```
test
- ジャンル.test.mjs
- samples/
  - ジャンル/
    - Source 名前のディレクトリ/
      - Sink の名前.html
      - Sink の名前.html
      - Sink の名前.html
```

- ジャンル.test.mjs の内容は以下の通り、expectBoolean のみ指定してください

```javascript
import { makeBoolTest } from './lib/makeTest.js';
makeBoolTest({ FILENAME: __filename, DIRNAME: __dirname, expectBoolean: true }
```

- lib/assrtXSS.mjs の中の isXSS 関数を自分の検知システムを実行するように変更してください。返り値が Boolean になるようにしてください
