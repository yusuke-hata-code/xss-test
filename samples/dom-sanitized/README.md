取得元
https://public-firing-range.appspot.com/dom/dompropagation/

## 含めていないもの

LocalStorage
Within a script include:

LocalStorage - Array - eval
LocalStorage - Array - Function
LocalStorage - Function - innerHTML
LocalStorage - Function - documentWrite
LocalStorage - Property - documentWrite

SessionStorage
Within a script include:

SessionStorage - Array - eval
SessionStorage - Function - eval
SessionStorage - Function - innerHTML
SessionStorage - Function - documentWrite
SessionStorage - Property - documentWrite

## 取得元からの改変点

以下の 21 サンプルは sync Trigger と Async Trigger が混在している．
Async Trigger を新たに[source]/[sink]\_async.html として分離した．結果的に syncTrigger21 サンプル asyncTrigger 20 サンプルで，合計サンプル数は取得元からは 21 サンプル増加している．

- cookie/eval.html
- cookie_set/documentWrite.html
- cookie_set/eval.html
- cookie_set/innerHtml.html
- localstorage_array/eval.html
- localstorage_function/documentWrite.html
- localstorage_function/eval.html
- localstorage_function/innerHtml.html
- localstorage_property/documentWrite.html
- name/documentWrite.html
- name/eval.html
- name/innerHtml.html
- referrer/documentWrite.html
- referrer/eval.html
- referrer/innerHtml.html
- sessionstorage_array/eval.html
- sessionstorage_function/documentWrite.html
- sessionstorage_function/eval.html
- sessionstorage_function/innerHtml.html
- sessionstorage_property/documentWrite.html

cookie/eval_async.html サンプルは 有効な async Trigger が存在しなかったため(firing range 側のバグだと思われる)，async Trigger として以下のコードを利用した．

```javascript
setTimeout(function () {
  trigger(lookupCookie('ThisCookieIsTotallyRandomAndCantPossiblyBeSet'));
}, 10);
```

## その他の async Trigger が混在していると思われるサンプル

以下の 6 サンプルは async Trigger のコメントがあるが，発火するか不明なため分離していない．

- formSubmission/documentWrite.html
- formSubmission/eval.html
- formSubmission/innerHtml.html
- inputTyping/documentWrite.html
- inputTyping/eval.html
- inputTyping/innerHtml.html
