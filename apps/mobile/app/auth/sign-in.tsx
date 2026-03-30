import { useSignIn } from '@clerk/expo'
import { Link, useRouter } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return
    try {
      const result = await signIn.create({ identifier: emailAddress, password })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.replace('/')
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, emailAddress, password])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SIGN IN</Text>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Email"
        placeholderTextColor="#666"
        onChangeText={setEmailAddress}
        style={styles.input}
      />
      <TextInput
        value={password}
        placeholder="Password"
        placeholderTextColor="#666"
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />
      <Pressable onPress={onSignInPress} style={styles.button}>
        <Text style={styles.buttonText}>AUTHENTICATE</Text>
      </Pressable>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <Link href="/(auth)/sign-up">
          <Text style={styles.link}>Sign up</Text>
        </Link>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#0e0e0e' },
  title: { fontSize: 28, fontWeight: '900', color: '#ABFF02', marginBottom: 32, fontStyle: 'italic' },
  input: { backgroundColor: '#1a1a1a', color: '#fff', padding: 14, marginBottom: 12, fontSize: 14 },
  button: { backgroundColor: '#ABFF02', padding: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#0e0e0e', fontWeight: '700', fontSize: 12, letterSpacing: 2 },
  footer: { flexDirection: 'row', gap: 4, marginTop: 24, justifyContent: 'center' },
  footerText: { color: '#666' },
  link: { color: '#ABFF02', fontWeight: '700' },
})
