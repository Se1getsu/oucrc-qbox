# oucrc-qbox

## 環境構築

```sh
mkdir env
mkdir -p firestore/exports
touch ./env/.env.local.json
```

## 環境変数

特に注意が必要なもの:

- `NEXTAUTH_SECRET`: 認証の動作に必要なので、適宜生成すること
- `NEXTAUTH_URL`: Vercelでは設定の必要がないローカルでのみ必要
