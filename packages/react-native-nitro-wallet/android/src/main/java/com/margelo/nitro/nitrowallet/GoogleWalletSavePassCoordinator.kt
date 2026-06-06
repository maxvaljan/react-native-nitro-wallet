package com.margelo.nitro.nitrowallet

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.google.android.gms.pay.PayClient
import com.margelo.nitro.core.Promise

final class GoogleWalletSavePassCoordinator {
  private val lock = Any()
  private var pendingPromise: Promise<SaveGoogleWalletPassResult>? = null
  private var registeredContext: ReactApplicationContext? = null

  private val activityEventListener = object : BaseActivityEventListener() {
    override fun onActivityResult(
      activity: Activity,
      requestCode: Int,
      resultCode: Int,
      data: Intent?,
    ) {
      if (requestCode != ADD_TO_GOOGLE_WALLET_REQUEST_CODE) {
        return
      }

      when (resultCode) {
        Activity.RESULT_OK -> resolvePending(SaveGoogleWalletPassResult(SaveGoogleWalletPassStatus.SAVED))
        Activity.RESULT_CANCELED -> resolvePending(
          SaveGoogleWalletPassResult(SaveGoogleWalletPassStatus.CANCELLED)
        )
        PayClient.SavePassesResult.API_UNAVAILABLE -> rejectPending(
          WalletException("Google Wallet save passes API is unavailable.")
        )
        PayClient.SavePassesResult.INTERNAL_ERROR -> rejectPending(
          WalletException("Google Wallet reported an internal save error.")
        )
        PayClient.SavePassesResult.SAVE_ERROR -> {
          val message = data?.getStringExtra(PayClient.EXTRA_API_ERROR_MESSAGE)
            ?: "Google Wallet failed to save the pass."
          rejectPending(WalletException(message))
        }
        else -> rejectPending(WalletException("Google Wallet returned unknown result code $resultCode."))
      }
    }
  }

  fun save(
    context: ReactApplicationContext,
    payClient: PayClient,
    options: SaveGoogleWalletPassOptions,
  ): Promise<SaveGoogleWalletPassResult> {
    val activity = context.currentActivity
      ?: return Promise.rejected(WalletException("Current Android Activity is unavailable."))

    val promise = Promise<SaveGoogleWalletPassResult>()
    synchronized(lock) {
      if (pendingPromise != null) {
        return Promise.rejected(WalletException("Another Google Wallet save flow is already in progress."))
      }

      pendingPromise = promise
      registeredContext = context
      context.addActivityEventListener(activityEventListener)
    }

    activity.runOnUiThread {
      try {
        when (options.format) {
          GoogleWalletPassFormat.JWT -> payClient.savePassesJwt(
            options.value,
            activity,
            ADD_TO_GOOGLE_WALLET_REQUEST_CODE,
          )
          GoogleWalletPassFormat.JSON -> payClient.savePasses(
            options.value,
            activity,
            ADD_TO_GOOGLE_WALLET_REQUEST_CODE,
          )
        }
      } catch (error: Throwable) {
        rejectPending(error.toWalletException())
      }
    }

    return promise
  }

  private fun resolvePending(result: SaveGoogleWalletPassResult) {
    val promise = clearPending()
    promise?.resolve(result)
  }

  private fun rejectPending(error: Throwable) {
    val promise = clearPending()
    promise?.reject(error)
  }

  private fun clearPending(): Promise<SaveGoogleWalletPassResult>? {
    val context: ReactApplicationContext?
    val promise: Promise<SaveGoogleWalletPassResult>?

    synchronized(lock) {
      promise = pendingPromise
      context = registeredContext
      pendingPromise = null
      registeredContext = null
    }

    context?.removeActivityEventListener(activityEventListener)
    return promise
  }
  companion object {
    private const val ADD_TO_GOOGLE_WALLET_REQUEST_CODE = 13045
  }
}
