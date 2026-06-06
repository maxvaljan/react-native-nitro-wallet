// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Wallet } from '../specs/Wallet.nitro'

/**
 * Identifies a pass in wallet providers that expose local pass-library access.
 *
 * @see {@linkcode Wallet.hasPass}
 */
export interface WalletPassIdentifier {
  /**
   * Apple Wallet pass type identifier.
   */
  passTypeIdentifier: string

  /**
   * Pass serial number. If omitted, the first accessible pass with the type identifier matches.
   */
  serialNumber?: string
}
