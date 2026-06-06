package com.margelo.nitro.nitrowallet

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.google.android.gms.pay.Pay
import com.google.android.gms.pay.PayApiAvailabilityStatus
import com.google.android.gms.pay.PayClient
import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.Promise

@Keep
@DoNotStrip
final class HybridWallet : HybridWalletSpec() {
  private val savePassCoordinator = GoogleWalletSavePassCoordinator()

  override fun getCapabilities(): Promise<WalletCapabilities> {
    return Promise.async {
      val canSaveGoogleWalletPasses = canUseGoogleWalletSavePasses()
      WalletCapabilities(
        supportedProviders = arrayOf(WalletProvider.GOOGLE_WALLET),
        canAddPasses = canSaveGoogleWalletPasses,
        canAddPkPasses = false,
        canSaveGoogleWalletPasses = canSaveGoogleWalletPasses,
        canQueryPasses = false,
        canOpenPasses = false,
        canRemovePasses = false,
      )
    }
  }

  override fun canAddPasses(provider: WalletProvider): Promise<Boolean> {
    return when (provider) {
      WalletProvider.APPLE_WALLET -> Promise.resolved(false)
      WalletProvider.GOOGLE_WALLET -> Promise.async {
        canUseGoogleWalletSavePasses()
      }
    }
  }

  override fun addPkPassFromUrl(options: AddPkPassFromUrlOptions): Promise<AddPassResult> {
    return Promise.rejected(WalletException("Apple .pkpass files are only supported on iOS."))
  }

  override fun addPkPassFromBase64(options: AddPkPassFromBase64Options): Promise<AddPassResult> {
    return Promise.rejected(WalletException("Apple .pkpass files are only supported on iOS."))
  }

  override fun saveGoogleWalletPass(
    options: SaveGoogleWalletPassOptions,
  ): Promise<SaveGoogleWalletPassResult> {
    val context = NitroModules.applicationContext
      ?: return Promise.rejected(WalletException("No React Native application context is available."))

    return savePassCoordinator.save(
      context = context,
      payClient = Pay.getClient(context),
      options = options,
    )
  }

  override fun hasPass(identifier: WalletPassIdentifier): Promise<Boolean> {
    return Promise.rejected(WalletException("Local pass lookup is only supported on iOS."))
  }

  override fun openPass(identifier: WalletPassIdentifier): Promise<Boolean> {
    return Promise.rejected(WalletException("Opening local wallet passes is only supported on iOS."))
  }

  override fun removePass(identifier: WalletPassIdentifier): Promise<Boolean> {
    return Promise.rejected(WalletException("Removing local wallet passes is only supported on iOS."))
  }

  private suspend fun canUseGoogleWalletSavePasses(): Boolean {
    val context = NitroModules.applicationContext ?: return false
    val status = Pay.getClient(context)
      .getPayApiAvailabilityStatus(PayClient.RequestType.SAVE_PASSES)
      .await()

    return status == PayApiAvailabilityStatus.AVAILABLE
  }
}
