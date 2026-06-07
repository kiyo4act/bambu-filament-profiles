# リリースには期待インポート数を出し、個別bbsflmtを並べない

Date: 2026-06-07
Scope: project
Confidence: high
Proposed destination: project-policy

## 症状

候補リリースに個別 `.bbsflmt` が多数添付され、GitHub Releasesのアセット一覧が見づらくなった。また、Bambu Studioインポート時に表示される件数が事前にリリース本文へ明記されていなかった。

## 原因

初回実装で `dist/bbsflmt/**/*.bbsflmt` をRelease assetsへ直接添付したため、素材数ぶんのアセットが露出した。リリースノートも素材別件数だけで、合計の期待インポート数を冒頭に出していなかった。

## 次回からの正しい振る舞い

候補リリースと正式リリースは `all-bbsflmt.zip`、`all-json.zip`、`manifest.json` を基本アセットにする。リリース本文の冒頭に、Bambu Studioで期待される合計インポート数、素材バンドル数、vendor数を明記する。

## 根拠

ユーザーがBambu Studioで `There are 154 configs imported` を確認し、リリースアセットが多すぎるため個別 `.bbsflmt` は不要だと指摘した。

## 提案する変更

この運用ルールを `AGENTS.md` またはプロジェクトポリシーへ反映し、Release作成workflowでは個別 `.bbsflmt` を添付しない。
