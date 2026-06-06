package com.margelo.nitro.nitrowallet

import com.google.android.gms.common.api.ApiException
import com.google.android.gms.common.api.CommonStatusCodes

internal fun Throwable.toWalletException(): WalletException = when (this) {
    is WalletException -> this

    is ApiException -> {
        val statusMessage = CommonStatusCodes.getStatusCodeString(statusCode)
        WalletException(
            "Google Wallet API error. Status code: $statusCode ($statusMessage).",
            this
        )
    }

    else -> WalletException(message ?: "Google Wallet save flow failed.", this)
}
