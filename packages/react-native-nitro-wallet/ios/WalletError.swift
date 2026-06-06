import NitroModules

enum WalletError {
  static func invalidUrl(_ url: String) -> RuntimeError {
    walletError("INVALID_URL", "The pass URL is invalid: \(url)")
  }
}

func walletError(_ code: String, _ message: String) -> RuntimeError {
  RuntimeError("\(code): \(message)")
}
