import Foundation

extension AddPkPassFromUrlOptions {
  func urlRequest() throws -> URLRequest {
    guard let url = URL(string: self.url) else {
      throw WalletError.invalidUrl(self.url)
    }

    var request = URLRequest(url: url)
    request.httpMethod = "GET"

    for header in self.headers ?? [] {
      request.setValue(header.value, forHTTPHeaderField: header.name)
    }

    return request
  }
}
