import Foundation
import NitroModules
import PassKit
import UIKit

final class AddPassCoordinator: NSObject, PKAddPassesViewControllerDelegate {
  private let pass: PKPass
  private let library: PKPassLibrary
  private let promise: Promise<AddPassResult>
  private let onFinish: () -> Void
  private var isFinished = false

  init(
    pass: PKPass,
    library: PKPassLibrary,
    promise: Promise<AddPassResult>,
    onFinish: @escaping () -> Void
  ) {
    self.pass = pass
    self.library = library
    self.promise = promise
    self.onFinish = onFinish
  }

  func addPassesViewControllerDidFinish(_ controller: PKAddPassesViewController) {
    controller.dismiss(animated: true) { [weak self] in
      guard let self else { return }
      let status: AddPassStatus = library.containsPass(pass) ? .added : .cancelled
      resolve(status: status)
      controller.delegate = nil
    }
  }

  func resolve(status: AddPassStatus) {
    guard !isFinished else { return }
    isFinished = true
    promise.resolve(withResult: AddPassResult(status: status))
    onFinish()
  }

  func reject(error: Error) {
    guard !isFinished else { return }
    isFinished = true
    promise.reject(withError: error)
    onFinish()
  }
}
