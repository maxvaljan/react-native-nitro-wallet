# react-native-nitro-wallet

Open-source React Native Nitro Module for wallet pass workflows:

- iOS: Apple Wallet `.pkpass` add, query, open, and remove flows through PassKit.
- Android: Google Wallet save flows through Google Play services Pay.

The publishable package lives in `packages/react-native-nitro-wallet`. A React Native example app lives in `apps/example`.

## Development

```sh
bun install
bun run specs
bun run --cwd packages/react-native-nitro-wallet typecheck
bun run --cwd packages/react-native-nitro-wallet lint-ci
bun run --cwd apps/example lint
bunx tsc --noEmit -p apps/example/tsconfig.json
```

Native validation:

```sh
cd apps/example/ios && pod install
cd apps/example/android && ./gradlew assembleDebug
```

The Android build requires a local JDK. The iOS build requires an installed Xcode iOS simulator/device runtime.

## Package

```sh
cd packages/react-native-nitro-wallet
bun pm pack --dry-run
```

Generated Nitrogen files in `packages/react-native-nitro-wallet/nitrogen/generated` are intentionally included so consumers can build the native module without running codegen themselves.
