import PassKit

extension PKPassLibrary {
  func matchingPass(for identifier: WalletPassIdentifier) -> PKPass? {
    for pass in passes() {
      guard pass.passTypeIdentifier == identifier.passTypeIdentifier else {
        continue
      }

      guard let serialNumber = identifier.serialNumber else {
        return pass
      }

      if pass.serialNumber == serialNumber {
        return pass
      }
    }

    return nil
  }
}
