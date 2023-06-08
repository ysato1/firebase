# 写真をアップロードすると、特定の条件に当てはまった商品名と価格を抽出する機能

## 紹介と使い方

  - photo.html、photo.jsが今回の課題でメインで実装した機能です。
  - 画像をアップロードすると、テキスト抽出を行い、画面上に表示する機能です。
  - また、特定の条件に当てはまったものについては、商品名と価格を抽出してfirebaseに登録できます。
  - ※今回は画像の中に「レタス」という文字列と「円」が含まれていると、firebaseに登録できるようにしました。


## 工夫した点

  - 今後つくっていきたいサービスから逆算して機能を実装した点。
    - firebaseの課題だけではなく、サービスのトップ画面を作成し、前回の課題で作った機能も表示するようにしました。 
  - google Cloud Vision APIのテキスト抽出機能を使った点。

## 苦戦した点

  - 講義ではHTML上にfirebaseとの接続部分を記載していましたが、javascript単体のファイルにしたときに、そのままコピーしても機能せず、それを修正するのに苦戦しました。
  - また、一旦簡易なものをつくろうと、商品マスタを手元でもつことを考えましたが（レタスという文字列を条件にデータベースに登録する部分）、マスタにない文字列（れたす　や　レ　タ　ス等）だとデータベースに登録できないので、ユーザ自身がデータベースを持つことも考えて行こうと思います。

## 参考にした web サイトなど

  -　 google Cloud Vision API, chatGPT
