package com.margelo.nitro.nitrowallet

import com.google.android.gms.common.api.ApiException
import com.google.android.gms.common.api.CommonStatusCodes

internal fun Throwable.toWalletException(): WalletException {
  if (this is WalletException) {
    return this
  }

  if (this is ApiException) {
    val statusMessage = CommonStatusCodes.getStatusCodeString(statusCode)
    return WalletException(
      "Google Wallet API error. Status code: $statusCode ($statusMessage).",
      this,
    )
  }

  return WalletException(message ?: "Google Wallet save flow failed.", this)
}
