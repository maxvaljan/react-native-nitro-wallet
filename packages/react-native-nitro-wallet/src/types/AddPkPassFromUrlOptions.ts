// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Wallet } from '../specs/Wallet.nitro'
import type { HttpHeader } from './HttpHeader'

/**
 * Options for downloading and presenting an Apple Wallet `.pkpass` file.
 *
 * @see {@linkcode Wallet.addPkPassFromUrl}
 */
export interface AddPkPassFromUrlOptions {
  /**
   * Absolute URL that returns an Apple Wallet `.pkpass` file.
   */
  url: string

  /**
   * Request headers sent while downloading the pass file.
   */
  headers?: HttpHeader[]
}
