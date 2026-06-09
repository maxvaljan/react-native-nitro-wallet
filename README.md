

https://github.com/user-attachments/assets/47124d9e-c41c-4a9b-b5b1-838acc97db73





# @maxvaljan/react-native-nitro-wallet-manager

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

Native formatting and linting:

```sh
brew install swiftformat swiftlint ktlint detekt
bun run format:native
bun run lint:native
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

## Release

Releases are driven from the publishable package with `release-it`:

```sh
bun run release
```

The release command runs `bun run prerelease` before versioning or publishing. That gate includes
the TypeScript checks, JS lint, tests, native linting, and a dry-run package pack. The GitHub Actions
release workflow uses npm trusted publishing/provenance; configure the package as a trusted
publisher on npm before running it from GitHub.
