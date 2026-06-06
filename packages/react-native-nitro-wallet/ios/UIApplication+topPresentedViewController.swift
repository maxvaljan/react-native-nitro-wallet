import UIKit

extension UIApplication {
  func topPresentedViewController() -> UIViewController? {
    guard
      let windowScene = connectedScenes
        .compactMap({ $0 as? UIWindowScene })
        .first(where: { $0.activationState == .foregroundActive }),
      let root = windowScene.windows.first(where: { $0.isKeyWindow })?.rootViewController
    else {
      return nil
    }

    var top = root
    while let presented = top.presentedViewController {
      top = presented
    }
    return top
  }
}
