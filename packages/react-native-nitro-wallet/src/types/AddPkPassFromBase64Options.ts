// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Wallet } from '../specs/Wallet.nitro'

/**
 * Options for presenting an Apple Wallet `.pkpass` file from base64 data.
 *
 * @see {@linkcode Wallet.addPkPassFromBase64}
 */
export interface AddPkPassFromBase64Options {
  /**
   * Base64-encoded bytes of a complete `.pkpass` file.
   */
  base64Data: string
}
