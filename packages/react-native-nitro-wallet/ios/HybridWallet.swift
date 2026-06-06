import Foundation
import NitroModules
import PassKit
import UIKit

final class HybridWallet: HybridWalletSpec {
  private var addPassCoordinator: AddPassCoordinator?

  func getCapabilities() throws -> Promise<WalletCapabilities> {
    let canAddPkPasses = PKAddPassesViewController.canAddPasses()
    let isPassLibraryAvailable = PKPassLibrary.isPassLibraryAvailable()
    return Promise.resolved(
      withResult: WalletCapabilities(
        supportedProviders: [.appleWallet],
        canAddPasses: canAddPkPasses,
        canAddPkPasses: canAddPkPasses,
        canSaveGoogleWalletPasses: false,
        canQueryPasses: isPassLibraryAvailable,
        canOpenPasses: isPassLibraryAvailable,
        canRemovePasses: isPassLibraryAvailable
      )
    )
  }

  func canAddPasses(provider: WalletProvider) throws -> Promise<Bool> {
    switch provider {
    case .appleWallet:
      Promise.resolved(withResult: PKAddPassesViewController.canAddPasses())
    case .googleWallet:
      Promise.resolved(withResult: false)
    }
  }

  func addPkPassFromUrl(options: AddPkPassFromUrlOptions) throws -> Promise<AddPassResult> {
    let promise = Promise<AddPassResult>()
    let request: URLRequest

    do {
      request = try options.urlRequest()
    } catch {
      return Promise.rejected(withError: error)
    }

    URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
      if let error {
        promise.reject(withError: walletError("NETWORK_ERROR", error.localizedDescription))
        return
      }

      if let httpResponse = response as? HTTPURLResponse,
         !(200 ... 299).contains(httpResponse.statusCode) {
        promise.reject(withError: walletError("HTTP_ERROR", "HTTP \(httpResponse.statusCode)"))
        return
      }

      guard let data else {
        promise.reject(withError: walletError("INVALID_DATA", "No data received"))
        return
      }

      DispatchQueue.main.async {
        guard let self else {
          promise.reject(withError: walletError("CONTROLLER_ERROR", "Wallet object was released before presenting pass"))
          return
        }
        self.showAddPassController(with: data, promise: promise)
      }
    }.resume()

    return promise
  }

  func addPkPassFromBase64(options: AddPkPassFromBase64Options) throws -> Promise<AddPassResult> {
    guard let data = Data(base64Encoded: options.base64Data) else {
      return Promise.rejected(withError: walletError("INVALID_DATA", "Invalid base64 pass data"))
    }

    let promise = Promise<AddPassResult>()
    DispatchQueue.main.async { [weak self] in
      guard let self else {
        promise.reject(withError: walletError("CONTROLLER_ERROR", "Wallet object was released before presenting pass"))
        return
      }
      showAddPassController(with: data, promise: promise)
    }
    return promise
  }

  func saveGoogleWalletPass(options _: SaveGoogleWalletPassOptions) throws -> Promise<SaveGoogleWalletPassResult> {
    Promise.rejected(
      withError: walletError("UNSUPPORTED_PLATFORM", "Google Wallet save flows are only available on Android")
    )
  }

  func hasPass(identifier: WalletPassIdentifier) throws -> Promise<Bool> {
    let promise = Promise<Bool>()
    DispatchQueue.main.async {
      promise.resolve(withResult: PKPassLibrary().matchingPass(for: identifier) != nil)
    }
    return promise
  }

  func openPass(identifier: WalletPassIdentifier) throws -> Promise<Bool> {
    let promise = Promise<Bool>()
    DispatchQueue.main.async {
      guard let pass = PKPassLibrary().matchingPass(for: identifier),
            let passUrl = pass.passURL
      else {
        promise.resolve(withResult: false)
        return
      }

      UIApplication.shared.open(passUrl, options: [:]) { success in
        promise.resolve(withResult: success)
      }
    }
    return promise
  }

  func removePass(identifier: WalletPassIdentifier) throws -> Promise<Bool> {
    let promise = Promise<Bool>()
    DispatchQueue.main.async {
      let library = PKPassLibrary()
      guard let pass = library.matchingPass(for: identifier) else {
        promise.resolve(withResult: false)
        return
      }

      library.removePass(pass)
      promise.resolve(withResult: true)
    }
    return promise
  }

  @MainActor
  private func showAddPassController(with data: Data, promise: Promise<AddPassResult>) {
    guard addPassCoordinator == nil else {
      promise.reject(withError: walletError("CONTROLLER_ERROR", "Another pass is already being added"))
      return
    }

    guard let pass = try? PKPass(data: data) else {
      promise.reject(withError: walletError("INVALID_PASS", "Failed to parse pass data"))
      return
    }

    let passLibrary = PKPassLibrary()
    if passLibrary.containsPass(pass) {
      promise.resolve(withResult: AddPassResult(status: .alreadyAdded))
      return
    }

    guard let presenter = UIApplication.shared.topPresentedViewController() else {
      promise.reject(withError: walletError("NO_VIEW_CONTROLLER", "No root view controller found"))
      return
    }

    guard let controller = PKAddPassesViewController(pass: pass) else {
      promise.reject(withError: walletError("CONTROLLER_ERROR", "Failed to create pass controller"))
      return
    }

    let coordinator = AddPassCoordinator(
      pass: pass,
      library: passLibrary,
      promise: promise
    ) { [weak self] in
      self?.addPassCoordinator = nil
    }
    addPassCoordinator = coordinator
    controller.delegate = coordinator
    presenter.present(controller, animated: true)
  }
}
