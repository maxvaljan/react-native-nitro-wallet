import Foundation

extension AddPkPassFromUrlOptions {
  func urlRequest() throws -> URLRequest {
    guard let url = URL(string: url) else {
      throw WalletError.invalidUrl(url)
    }

    var request = URLRequest(url: url)
    request.httpMethod = "GET"

    for header in headers ?? [] {
      request.setValue(header.value, forHTTPHeaderField: header.name)
    }

    return request
  }
}
