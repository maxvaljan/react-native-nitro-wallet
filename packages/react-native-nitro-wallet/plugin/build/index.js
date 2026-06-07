"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("expo/config-plugins");
const pkg = require('../../package.json');
const PASS_TYPE_IDENTIFIERS_KEY = 'com.apple.developer.pass-type-identifiers';
const normalizePassTypeIdentifiers = (passTypeIdentifiers) => {
    if (passTypeIdentifiers === undefined) {
        return [];
    }
    if (!Array.isArray(passTypeIdentifiers)) {
        throw new Error('@maxvaljan/react-native-nitro-wallet-manager: passTypeIdentifiers must be an array of strings.');
    }
    const normalized = passTypeIdentifiers.map((identifier) => {
        if (typeof identifier !== 'string' || identifier.trim().length === 0) {
            throw new Error('@maxvaljan/react-native-nitro-wallet-manager: passTypeIdentifiers must contain non-empty strings.');
        }
        return identifier.trim();
    });
    return Array.from(new Set(normalized));
};
const withApplePassTypeIdentifiers = (config, passTypeIdentifiers) => (0, config_plugins_1.withEntitlementsPlist)(config, (entitlementsConfig) => {
    const existing = entitlementsConfig.modResults[PASS_TYPE_IDENTIFIERS_KEY];
    const current = Array.isArray(existing) ? existing : [];
    const merged = Array.from(new Set([...current, ...passTypeIdentifiers]));
    entitlementsConfig.modResults[PASS_TYPE_IDENTIFIERS_KEY] = merged;
    return entitlementsConfig;
});
const withNitroWallet = (config, options) => {
    // Android requires no extra native config: Google Play services Pay is pulled
    // in by the library's own build.gradle, and React Native autolinking plus
    // Nitro's generated autolinking wire up the module on both platforms.
    const passTypeIdentifiers = normalizePassTypeIdentifiers(options === null || options === void 0 ? void 0 : options.passTypeIdentifiers);
    if (passTypeIdentifiers.length > 0) {
        return withApplePassTypeIdentifiers(config, passTypeIdentifiers);
    }
    return config;
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withNitroWallet, pkg.name, pkg.version);
