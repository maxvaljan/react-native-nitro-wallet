# react-native-nitro-wallet

React Native Nitro Module for Apple Wallet `.pkpass` flows on iOS and Google Wallet save flows on Android.

## Features

- Check wallet capabilities at runtime.
- Add Apple Wallet `.pkpass` files from a URL or base64 data on iOS.
- Query, open, and remove locally accessible Apple Wallet passes on iOS.
- Start Google Wallet save flows from JWT or JSON payloads on Android.
- Nitro-generated Swift/Kotlin bindings with generated C++ autolinking files included in the package.

## Install

```sh
bun add react-native-nitro-wallet react-native-nitro-modules
```

Run your normal native install, prebuild, or development-build flow after installing.

### Requirements

- React Native `>=0.75`
- `react-native-nitro-modules >=0.35.0 <0.36.0`
- iOS with PassKit/Wallet support
- Android with Google Play services and Google Wallet availability

### Expo

No Expo config plugin is required for the standard Apple Wallet add-pass flow, Google Wallet save
flow, or native module linking. React Native autolinking plus Nitro's generated autolinking files
handle the native integration.

For Expo apps, install the package and run your usual prebuild or development-build workflow:

```sh
bun add react-native-nitro-wallet react-native-nitro-modules
bun expo prebuild
```

The package also ships an optional config plugin for iOS Wallet pass-library access. Use it only
when your app needs Apple pass type identifiers for querying, opening, removing, or otherwise
managing passes exposed by PassKit:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-nitro-wallet",
        {
          "passTypeIdentifiers": ["$(TeamIdentifierPrefix)*"]
        }
      ]
    ]
  }
}
```

The plugin does not modify Android configuration.

### iOS notes

Adding a `.pkpass` presents Apple's native add-pass UI. Querying, opening, or removing existing
passes only works for passes that PassKit exposes to the app; Apple limits pass-library access by
entitlement and pass ownership.

### Android notes

Google Wallet save flows use Google Play services' Pay API. Your app must run on a device where
`PayClient.getPayApiAvailabilityStatus(PayClient.RequestType.SAVE_PASSES)` reports availability,
and the payload passed to `saveGoogleWalletPass` must be a valid Google Wallet JWT or JSON payload.

## Usage

```ts
import { wallet } from 'react-native-nitro-wallet'

const canAddApplePass = await wallet.canAddPasses('apple-wallet')

const appleResult = await wallet.addPkPassFromUrl({
  url: 'https://example.com/ticket.pkpass',
  headers: [{ name: 'Authorization', value: 'Bearer token' }],
})

const googleResult = await wallet.saveGoogleWalletPass({
  format: 'jwt',
  value: googleWalletJwt,
})
```

## Capabilities

```ts
const capabilities = await wallet.getCapabilities()

if (capabilities.canAddPkPasses) {
  await wallet.addPkPassFromBase64({ base64Data })
}

if (capabilities.canSaveGoogleWalletPasses) {
  await wallet.saveGoogleWalletPass({ format: 'json', value: passJson })
}
```

## API

- `getCapabilities()`
- `canAddPasses(provider)`
- `addPkPassFromUrl({ url, headers })`
- `addPkPassFromBase64({ base64Data })`
- `saveGoogleWalletPass({ format, value })`
- `hasPass({ passTypeIdentifier, serialNumber })`
- `openPass({ passTypeIdentifier, serialNumber })`
- `removePass({ passTypeIdentifier, serialNumber })`

Apple pass-library queries are iOS-only. Google Wallet save flows are Android-only.

`openPass` and `removePass` are best-effort operations. `openPass` returns the result reported by
`UIApplication.open`. `removePass` returns `true` once a matching accessible pass is handed to
PassKit for removal; PassKit may do nothing if the app lacks the required access.

## Development

From the repository root:

```sh
bun install
bun run check
```

From this package directory:

```sh
bun run specs
bun run typecheck
bun run lint-ci
bun run test
bun run pack:dry-run
```

Generated files under `nitrogen/generated` are part of the package and should be regenerated from the `.nitro.ts` spec instead of edited by hand.

Native wallet UI behavior should be verified on real devices with real Apple Wallet and Google
Wallet payloads. The included automated checks cover TypeScript, linting, package contents, example
rendering, Android native compilation, and iOS CocoaPods compilation.
