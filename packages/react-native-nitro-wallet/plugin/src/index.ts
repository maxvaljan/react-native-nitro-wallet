import {
  type ConfigPlugin,
  createRunOncePlugin,
  withEntitlementsPlist,
} from '@expo/config-plugins'

declare const require: {
  (path: '../../package.json'): {
    name: string
    version: string
  }
}

const pkg = require('../../package.json') as {
  name: string
  version: string
}

const PASS_TYPE_IDENTIFIERS_KEY = 'com.apple.developer.pass-type-identifiers'

/**
 * Options for the `react-native-nitro-wallet` Expo config plugin.
 */
export interface NitroWalletPluginOptions {
  /**
   * Apple pass type identifiers to declare in the iOS entitlements, e.g.
   * `['pass.com.example.ticket']` or `['$(TeamIdentifierPrefix)*']`.
   *
   * Only required for issuer/associated-pass features. The standard add-pass
   * flow (`addPkPassFromUrl` / `addPkPassFromBase64`) needs no entitlement, so
   * this can be omitted entirely.
   */
  passTypeIdentifiers?: string[]
}

const normalizePassTypeIdentifiers = (
  passTypeIdentifiers: NitroWalletPluginOptions['passTypeIdentifiers']
): string[] => {
  if (passTypeIdentifiers === undefined) {
    return []
  }

  if (!Array.isArray(passTypeIdentifiers)) {
    throw new Error(
      'react-native-nitro-wallet: passTypeIdentifiers must be an array of strings.'
    )
  }

  const normalized = passTypeIdentifiers.map((identifier) => {
    if (typeof identifier !== 'string' || identifier.trim().length === 0) {
      throw new Error(
        'react-native-nitro-wallet: passTypeIdentifiers must contain non-empty strings.'
      )
    }

    return identifier.trim()
  })

  return Array.from(new Set(normalized))
}

const withApplePassTypeIdentifiers: ConfigPlugin<readonly string[]> = (
  config,
  passTypeIdentifiers
) =>
  withEntitlementsPlist(config, (entitlementsConfig) => {
    const existing = entitlementsConfig.modResults[PASS_TYPE_IDENTIFIERS_KEY]
    const current = Array.isArray(existing) ? (existing as string[]) : []
    const merged = Array.from(new Set([...current, ...passTypeIdentifiers]))
    entitlementsConfig.modResults[PASS_TYPE_IDENTIFIERS_KEY] = merged
    return entitlementsConfig
  })

const withNitroWallet: ConfigPlugin<NitroWalletPluginOptions | void> = (
  config,
  options
) => {
  // Android requires no extra native config: Google Play services Pay is pulled
  // in by the library's own build.gradle, and React Native autolinking plus
  // Nitro's generated autolinking wire up the module on both platforms.
  const passTypeIdentifiers = normalizePassTypeIdentifiers(
    options?.passTypeIdentifiers
  )
  if (passTypeIdentifiers.length > 0) {
    return withApplePassTypeIdentifiers(config, passTypeIdentifiers)
  }

  return config
}

export default createRunOncePlugin(withNitroWallet, pkg.name, pkg.version)
