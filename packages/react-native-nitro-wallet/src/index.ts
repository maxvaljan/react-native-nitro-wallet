import { NitroModules } from 'react-native-nitro-modules'
import type { Wallet as WalletSpec } from './specs/Wallet.nitro'

export const wallet = NitroModules.createHybridObject<WalletSpec>('Wallet')
export default wallet

export type { Wallet } from './specs/Wallet.nitro'
export type { AddPassResult, AddPassStatus } from './types/AddPassResult'
export type { AddPkPassFromBase64Options } from './types/AddPkPassFromBase64Options'
export type { AddPkPassFromUrlOptions } from './types/AddPkPassFromUrlOptions'
export type { GoogleWalletPassFormat } from './types/GoogleWalletPassFormat'
export type { HttpHeader } from './types/HttpHeader'
export type { SaveGoogleWalletPassOptions } from './types/SaveGoogleWalletPassOptions'
export type {
  SaveGoogleWalletPassResult,
  SaveGoogleWalletPassStatus,
} from './types/SaveGoogleWalletPassResult'
export type { WalletCapabilities } from './types/WalletCapabilities'
export type { WalletPassIdentifier } from './types/WalletPassIdentifier'
export type { WalletProvider } from './types/WalletProvider'
