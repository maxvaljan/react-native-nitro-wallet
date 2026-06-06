import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import packageJson from '../package.json'

const packageRoot = join(import.meta.dir, '..')

describe('npm package metadata', () => {
  test('does not publish dangling literal file entries', () => {
    const literalFileEntries = packageJson.files.filter(
      (entry) =>
        !entry.includes('*') &&
        !entry.includes('/') &&
        entry !== 'src' &&
        entry !== 'lib' &&
        entry !== 'nitrogen'
    )

    for (const entry of literalFileEntries) {
      expect(existsSync(join(packageRoot, entry))).toBe(true)
    }
  })

  test('includes native build inputs required by Nitro consumers', () => {
    expect(packageJson.files).toContain('nitrogen')
    expect(packageJson.files).toContain('nitro.json')
    expect(packageJson.files).toContain('*.podspec')
    expect(packageJson.files).toContain('android/build.gradle')
    expect(packageJson.files).toContain('android/CMakeLists.txt')
    expect(packageJson.files).toContain('android/src')
    expect(packageJson.files).toContain('ios/**/*.swift')
  })

  test('includes a compiled Expo config plugin entrypoint', async () => {
    expect(packageJson.files).toContain('app.plugin.js')
    expect(packageJson.files).toContain('plugin/build')
    expect(existsSync(join(packageRoot, 'app.plugin.js'))).toBe(true)
    expect(existsSync(join(packageRoot, 'plugin/build/index.js'))).toBe(true)

    const pluginModule = await import('../app.plugin.js')
    expect(typeof pluginModule.default).toBe('function')
  })

  test('declares native peer dependency floors instead of ABI-wide wildcards', () => {
    expect(packageJson.peerDependencies.react).toBe('>=18')
    expect(packageJson.peerDependencies['react-native']).toBe('>=0.75')
    expect(packageJson.peerDependencies['react-native-nitro-modules']).toBe(
      '>=0.35.0 <0.36.0'
    )
  })
})
