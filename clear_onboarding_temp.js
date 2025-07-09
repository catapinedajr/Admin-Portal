// Test onboarding by clearing localStorage flag
if (typeof window !== 'undefined' && window.localStorage) {
  localStorage.removeItem('hodlearn-onboarding-completed');
  console.log('Onboarding flag cleared - refresh to see onboarding');
}
