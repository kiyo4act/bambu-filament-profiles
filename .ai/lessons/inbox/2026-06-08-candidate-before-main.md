# Candidate releaseはmain統合前のテスト版にする

Date: 2026-06-08
Scope: project
Confidence: high
Proposed destination: AGENTS.md

## 症状

一時的に `main` pushでCandidate Pre-releaseを作る実装にしてしまい、ユーザーが期待している「Pre-releaseでBambu Studio確認後、OKならmainへ統合して本リリース」という流れと逆になった。

## 原因

Actions artifactとRelease assetsの不足を急いで直す際に、candidateの役割を「main上の配布確認」だと扱ってしまった。実際にはcandidateはmain統合前の検証用成果物である。

## 次回からの正しい振る舞い

AIは更新ブランチへ正規化JSONをpushし、そこで `candidate-YYYYMMDD-HHMM-<short_sha>` のPre-releaseを作る。ユーザーが候補版をBambu Studioで確認してOKした後にmainへ統合し、profile変更がmainに入った時だけStable releaseを作る。

## 根拠

ユーザーから「これPre-Releaseはテスト版で、OKならmainに統合されて本リリースが出るんですよね？」と確認があり、その運用が本来の意図であることが明確になった。

## 提案する変更

AGENTS.md、operations、workflowを「更新ブランチcandidate、main stable」の前提で維持する。main pushでcandidateを作る実装に戻さない。
