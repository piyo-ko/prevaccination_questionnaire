# 新型コロナワクチン接種の予診票の入力フォームを試作してみた

## これは何？
[このスレッド](https://twitter.com/tweeting_drtaka/status/1431952943771648001)を拝見して試しに作ってみたものです。
[フォーム](https://piyo-ko.github.io/prevaccination_questionnaire/index.html)に入力してボタンをタップすると、紙の予診票のレイアウトで記入済みの状態の PNG 画像を生成し、それをダウンロードします。

## 注意事項
* 試作品なので、入力値のチェックもしていませんし、デバッグもあまりしていません。
* クライアントサイドの JavaScript のみで動きます。
* ダウンロードした PNG 画像をどう使うか、というところまではカバーしていません。
* [生成される画像の解像度の問題](https://developer.mozilla.org/ja/docs/Web/API/HTMLCanvasElement/toBlob)があるかもしれませんが、うまく解決できなかったのでとりあえず放置してあります。

## 予診票の画像について
[厚生労働省のサイト](https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/vaccine_yoshinhyouetc.html#h2_free1)にある[予診票の PDF ファイル](https://www.mhlw.go.jp/content/000739379.pdf)をダウンロードし、それを macOS の「プレビュー」で変換した PNG 画像を使っています（ここでは `questionnaire.png` という名前で保存しました）。
うまくオプション設定できれば、ImageMagick でも使ってコマンドラインで良い感じのものを生成できるかと思いますが、詳しくないのでプレビューを使いました。
なお、厚生労働省の[「利用規約・リンク・著作権等」](https://www.mhlw.go.jp/chosakuken/index.html)から、このような形での加工・公開に著作権上の問題はなかろう、と判断しました。
