// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Wallet } from '../specs/Wallet.nitro'

/**
 * Outcome of a Google Wallet save-pass activity.
 *
 * @see {@linkcode SaveGoogleWalletPassResult.status}
 */
export type SaveGoogleWalletPassStatus = 'saved' | 'cancelled'

/**
 * Result returned after the Google Wallet save activity finishes.
 *
 * @see {@linkcode Wallet.saveGoogleWalletPass}
 */
export interface SaveGoogleWalletPassResult {
  /**
   * Final state reported by the Google Wallet save activity.
   */
  status: SaveGoogleWalletPassStatus
}
