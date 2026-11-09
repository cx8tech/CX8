// Rules for the Register page and the register form in the tool popup.
// Returns the message to show, or '' when everything is valid.
export function registerFormError({ fullName, email, password, confirm }) {
  if (fullName.trim().length < 2) return 'Please enter your full name.'
  if (!email.trim()) return 'Please enter your email address.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Please enter a valid email address.'
  if (!password) return 'Please enter a password.'
  if (!password.trim()) return 'Your password cannot be only spaces.'
  if (password.length < 6) return 'Password must be at least 6 characters.'
  if (!confirm) return 'Please confirm your password.'
  if (password !== confirm) return 'Passwords do not match.'
  return ''
}
