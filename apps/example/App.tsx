import React, { useState } from 'react';
import {
  Alert,
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  wallet,
  type WalletCapabilities,
} from '@maxvaljan/react-native-nitro-wallet-manager';

function App(): React.JSX.Element {
  const [capabilities, setCapabilities] = useState<WalletCapabilities>();
  const [pkPassUrl, setPkPassUrl] = useState('');
  const [passTypeIdentifier, setPassTypeIdentifier] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [googleJwt, setGoogleJwt] = useState('');
  const [result, setResult] = useState('Ready');

  const run = async (label: string, action: () => Promise<string>) => {
    try {
      setResult(`${label}...`);
      const message = await action();
      setResult(message);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setResult(`${label} failed: ${message}`);
      Alert.alert(label, message);
    }
  };

  const refreshCapabilities = () =>
    run('Capabilities', async () => {
      const nextCapabilities = await wallet.getCapabilities();
      setCapabilities(nextCapabilities);
      return JSON.stringify(nextCapabilities, null, 2);
    });

  const passIdentifier = {
    passTypeIdentifier,
    serialNumber: serialNumber.trim() || undefined,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Nitro Wallet</Text>
        <Text style={styles.platform}>Platform: {Platform.OS}</Text>

        <View style={styles.section}>
          <Text style={styles.heading}>Capabilities</Text>
          <Button title="Refresh" onPress={refreshCapabilities} />
          <Text style={styles.mono}>
            {capabilities ? JSON.stringify(capabilities, null, 2) : 'Not loaded'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Apple Wallet</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setPkPassUrl}
            placeholder="https://example.com/pass.pkpass"
            style={styles.input}
            value={pkPassUrl}
          />
          <Button
            title="Add .pkpass from URL"
            onPress={() =>
              run('Add .pkpass', async () => {
                const addResult = await wallet.addPkPassFromUrl({
                  url: pkPassUrl,
                });
                return `Add result: ${addResult.status}`;
              })
            }
          />
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setPassTypeIdentifier}
            placeholder="pass.com.example"
            style={styles.input}
            value={passTypeIdentifier}
          />
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setSerialNumber}
            placeholder="serial number"
            style={styles.input}
            value={serialNumber}
          />
          <View style={styles.buttonRow}>
            <Button
              title="Has"
              onPress={() =>
                run('Has pass', async () => {
                  const exists = await wallet.hasPass(passIdentifier);
                  return `Has pass: ${exists ? 'yes' : 'no'}`;
                })
              }
            />
            <Button
              title="Open"
              onPress={() =>
                run('Open pass', async () => {
                  const opened = await wallet.openPass(passIdentifier);
                  return `Opened pass: ${opened ? 'yes' : 'no'}`;
                })
              }
            />
            <Button
              title="Remove"
              onPress={() =>
                run('Remove pass', async () => {
                  const removed = await wallet.removePass(passIdentifier);
                  return `Removed pass: ${removed ? 'yes' : 'no'}`;
                })
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Google Wallet</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            multiline
            onChangeText={setGoogleJwt}
            placeholder="Google Wallet JWT"
            style={[styles.input, styles.multiline]}
            value={googleJwt}
          />
          <Button
            title="Save JWT"
            onPress={() =>
              run('Save Google Wallet JWT', async () => {
                const saveResult = await wallet.saveGoogleWalletPass({
                  format: 'jwt',
                  value: googleJwt,
                });
                return `Save result: ${saveResult.status}`;
              })
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Result</Text>
          <Text style={styles.mono}>{result}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f6f7f9',
    flex: 1,
  },
  container: {
    gap: 18,
    padding: 20,
  },
  title: {
    color: '#111827',
    fontSize: 30,
    fontWeight: '800',
  },
  platform: {
    color: '#4b5563',
    fontSize: 14,
  },
  section: {
    backgroundColor: '#ffffff',
    borderColor: '#d8dee8',
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 14,
  },
  heading: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#c8d0dc',
    borderRadius: 6,
    borderWidth: 1,
    color: '#111827',
    minHeight: 44,
    paddingHorizontal: 10,
  },
  multiline: {
    minHeight: 96,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  mono: {
    color: '#1f2937',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    fontSize: 12,
    lineHeight: 17,
  },
});

export default App;
