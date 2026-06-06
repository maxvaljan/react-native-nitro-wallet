// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Wallet } from '../specs/Wallet.nitro'

/**
 * Identifies a native wallet provider that {@linkcode Wallet} can target.
 *
 * @see {@linkcode Wallet.canAddPasses}
 */
export type WalletProvider = 'apple-wallet' | 'google-wallet'
