package com.margelo.nitro.nitrowallet

import com.google.android.gms.tasks.Task
import java.util.concurrent.CancellationException
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlinx.coroutines.isActive
import kotlinx.coroutines.suspendCancellableCoroutine

suspend fun <T> Task<T>.await(): T {
  return suspendCancellableCoroutine { continuation ->
    addOnSuccessListener { result ->
      if (continuation.isActive) {
        continuation.resume(result)
      }
    }
    addOnFailureListener { error ->
      if (continuation.isActive) {
        continuation.resumeWithException(error)
      }
    }
    addOnCanceledListener {
      if (continuation.isActive) {
        continuation.resumeWithException(CancellationException("Google Play services task was cancelled."))
      }
    }
  }
}
