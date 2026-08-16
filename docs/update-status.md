---
title: 全メーカー更新状況
status: candidate公開済み（Bambu Studio確認待ち）
updated: 2026-08-16
summary: PolymakerとTINMORRYの更新をPR #16へ反映し、全checksとcandidate公開まで完了しました。次はBambu Studioで1,405 configsのインポート確認です。
---

## 前回からの変化

- **「TINMORRYの通常入力」という表現を訂正**しました。手動配置ではなく、`sources.yml` に登録済みの2つの公式リポジトリから、許可形式として収集した入力を指していました。今回の新しい `incoming/` 手動配置は0件です。
- **Polymaker公式更新を反映**しました。503→605プロファイル、66→68材料、12→13機種となり、既存503件も公式値へ更新しました。
- **TINMORRY公式リポジトリ更新を反映**しました。156→165プロファイルとなり、H2S PETG-CFの置換値と、ZIP内のX2D Galaxy PETGも採用しました。
- TINMORRYの既採用P2S PETG Matteとリポジトリ校正版H2C PETG Matteは保持しました。H2Cは更新前とバイト差分がありません。
- 新機種 **Bambu Lab A2L** の認識、未知プリンターの判断依頼化、採用済み配布物の保持、Windows長パス処理を回帰検証へ追加しました。
- 全1,405 normalized JSONの検証と、1,294 machine-scoped `.bbsflmt` bundleの実生成が成功しました。
- [PR #16](https://github.com/kiyo4act/bambu-filament-profiles/pull/16) はmerge可能かつchecks成功です。candidateから再取得したmanifestとZIPでも1,405 profiles／1,294 bundlesを確認しました。

## 各メーカー状況

| メーカー | 状態 | 今回の扱い | 最終構成・差分 |
|---|---|---|---|
| eSUN | **差分なし** | 公式配布ZIP（2026-05-11）が採用済み入力とバイト単位・SHA-256一致のため現状維持 | 572プロファイル |
| Polymaker | **公式更新を反映済み** | `a3d6d8b2`（2026-08-14）を採用し、Bambu system presetへの継承342件を展開 | 605プロファイル。追加102・変更503・削除0。68材料、13機種、A2L 47件 |
| SUNLU | **手動管理を継続** | 公式sourceが未設定のため、設定されるまでは既存の手動採用セットを維持 | 63プロファイル、H2C/P2S。今回差分なし |
| TINMORRY | **公式リポジトリ更新を反映済み** | Bambu側 `59dd16f4` を採用、legacy側は不変。H2S PETG-CFとX2D Galaxy PETGを含む | 165プロファイル。追加9・変更131・削除0。28材料、13機種 |

### Polymakerで反映した主な内容

- 新材料は **HT-PLA Pro** 12件と **Polylite ASA for TYC Americas** 4件です。
- 新機種A2Lは47件。ほかにH2S 17件、H2D 12件、P2S 9件などが追加されました。
- 追加だけでなく既存503件も公式更新へ追従しています。継承342件はローカルのBambu system presetから展開し、最終成果物の `inherits` はすべて空です。
- 公式入力自体の注意点として、PolyMax PETGのH2D/H2S/X2DはPC presetを継承しており、最終 `filament_type` もPCです。X2Dは今回、PETG設定からPC設定（bed 70→110℃など）へ変わりました。正規化の誤りではないため公式値を保持し、candidateで重点確認します。
- Fiberon PET-CF17 H2Sは、公式入力でもnozzle温度70℃に対して許容範囲270–300℃です。今回の回帰ではなく既存値ですが、確認が済むまで実機利用時の注意対象とします。

### TINMORRYを詳しく確認した結果

| 入力経路 | 優先度 | 件数 | 今回の意味 |
|---|---:|---:|---|
| 登録済みBambuStudioリポジトリの `.bbsflmt` | 100 | 34 | 追加9・不変25。手動入力ではありません |
| 登録済みlegacy JSONリポジトリ | 50 | 91 | 全91件不変。手動入力ではありません |
| 公式リポジトリ内のZIP配布物 | 個別レビュー | 2 | P2S PETG Matteは既採用、X2D Galaxy PETGを今回追加採用 |
| `incoming/` の新規手動配置 | 200 | 0 | 今回は何も置かれていません |

- BambuStudio公式リポジトリのGit差分は**追加10ファイル、変更0、削除0**です。通常収集できる `.bbsflmt` が9件、ZIP内配布物のX2D Galaxy PETGが1件でした。
- 9件の通常追加は、A2L 5件、A1 mini TPU95A、H2C ASA、H2C PLA-CF、H2S PETG-CFです。H2S PETG-CFは同じnormalized出力を持つため、優先度100の新Bambu版が優先度50のlegacy版を置き換えました。
- X2D Galaxy PETGは名前の語順が上流では `PETG Galaxy` ですが、既存の `galaxy-petg/x2d` familyへ正規化しています。
- H2C PETG Matteは上流入力ではなく、過去にリポジトリで採用・校正したプロファイルです。上流側に削除はないため今回も明示保持し、更新前との完全一致を確認しました。

### TINMORRY H2S PETG-CFの主な置換値

| 設定 | 更新前 | 更新後 |
|---|---:|---:|
| 最大体積速度 | 11.5 | 12 |
| flow ratio | 0.96 / nil | 0.95 / 0.95 |
| hot plate温度 | 70 | 80 |
| nozzle温度 | 260 / nil | 260 / 255 |
| nozzle温度上限 | 280 | 270 |
| required nozzle HRC | 40 | 3 |
| version | 2.2.0.3 | 2.7.0.8 |

材料familyの整合性を守るため、最終normalized JSONの `filament_type` は従来どおり `PETG-CF` です。それ以外の上記公式値は反映しています。

## 判断待ち

入力採用についての追加判断はありません。Polymaker公式更新、TINMORRY公式更新、H2S PETG-CF、X2D Galaxy PETGはすべて反映済みです。

Bambu Studioでのインポート確認が必要です。特にPolymakerの広範な既存設定更新と、TINMORRY H2S PETG-CFのrequired nozzle HRC 3を実機利用前に確認対象とします。

## 次にすること

1. [GitHub Releases](https://github.com/kiyo4act/bambu-filament-profiles/releases) の最新candidateから `all-bbsflmt.zip` を取得する。
2. Bambu Studioへ必要なprinter folderをインポートし、期待件数、表示、代表プロファイルを確認する。
3. PolyMax PETG H2D/H2S/X2D、Fiberon PET-CF17 H2S、TINMORRY H2S PETG-CFを重点確認し、問題なければ[PR #16](https://github.com/kiyo4act/bambu-filament-profiles/pull/16)をmergeする。
