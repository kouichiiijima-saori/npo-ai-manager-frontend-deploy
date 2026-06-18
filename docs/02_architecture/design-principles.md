# 設計原則

---

# 1. MVP原則

本システムは、

MVP完成を最優先とする。

---

MVPでは、

```text
単一団体運用
```

を前提とする。

---

以下は将来拡張とする。

```text
認証

権限管理

マルチテナント

RAG

ローカルLLM
```

---

# 2. AI原則

AIは判断者ではない。

AIは、

```text
整理

比較

根拠提示

不足情報抽出
```

を行う。

---

AIによる

```text
自動意思決定

自動申請

採択保証
```

は行わない。

---

最終判断は利用者が行う。

---

説明可能性を重視する。

---

# 3. データ原則

現在状態と履歴を分離する。

---

## 現在状態

```text
GrantCase
```

---

## 監査履歴

```text
EvaluationHistory
```

---

## 応募要件確認

```text
GrantRequirementsCheck
```

---

## 実務タスク

```text
NextAction
```

---

AI判定履歴は監査ログとして扱う。

以下は禁止する。

```text
編集

削除
```

---

案件データの物理削除は最小化する。

完了案件はアーカイブ管理とする。

---

# 4. 実装原則

責務を混在させない。

---

React

```text
Screen Component

Hooks

Utils

Api

Axios
```

に責務を分離する。

---

Spring Boot

```text
Controller

Service

Mapper

Entity
```

に責務を分離する。

---

業務用語を優先して命名する。

---

# 5. ドキュメント原則

仕様変更時は設計書を更新する。

---

正式設計書を優先する。

議論メモは一時利用とし、

設計書へ反映後は削除する。

---

設計書群は、

```text
screen-design

table-design

architecture

future-roadmap
```

を中心に構成する。
