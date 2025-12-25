# meshi-megane (飯眼鏡) 🍚👓

カメラと位置情報を活用した、直感的な AR レストラン検索アプリです。
スマートフォンのカメラをかざすだけで、周囲にある飲食店の情報を AR（拡張現実）で表示します。

## 🌟 特徴

- **AR ビュー**: カメラ越しに周囲の店舗情報をリアルタイムで表示。現在の向き（コンパス）に合わせて店舗のアイコンが浮かび上がります。
- **直感的な検索**: キーワードやカテゴリーを指定して、近くの美味しいお店を素早く見つけられます。
- **詳細情報**: 店舗の評価、距離、ジャンルなどの詳細をその場で確認。
- **お気に入り機能**: 気になるお店を保存して、後で簡単にアクセス（Firebase 認証を利用）。

## 🛠 技術スタック

- **Framework**: [React Native](https://reactnative.dev/) / [Expo](https://expo.dev/)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/)
- **Animation**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) (スムーズな AR 表示と UI アニメーション)
- **Backend**: [Firebase](https://firebase.google.com/) (Authentication, Cloud Firestore)
- **APIs**: [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/), [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/), [Expo Sensors](https://docs.expo.dev/versions/latest/sdk/sensors/)
- **Icons**: [FontAwesome](https://fontawesome.com/)

## 📁 ディレクトリ構成

```text
src/
├── components/   # 再利用可能な UI コンポーネント (ARPanel, SearchModal など)
├── services/     # ビジネスロジック、外部 API 連携 (Auth, Shop データ取得)
├── screens/      # 各画面のルートコンポーネント
├── hooks/        # カスタム React Hooks
├── config/       # Firebase 等の各種設定
├── constants/    # 定数管理
└── assets/       # 画像、アイコン等の静的ファイル
```

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example` を参考に、`.env` ファイルを作成し、Firebase の API キー等を設定してください。

### 3. アプリの起動

```bash
# 開発サーバーの起動
npx expo start

# 特定のプラットフォームで起動
npm run ios     # iOS
npm run android # Android
npm run web     # Web
```

## 📝 ライセンス

このプロジェクトはプライベートプロジェクトです。
