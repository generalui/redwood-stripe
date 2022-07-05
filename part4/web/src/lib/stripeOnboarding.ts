export async function stripeOnboarding(userId: number) {
  const response = await fetch(
    `${global.RWJS_API_URL}/createStripeAccountLink`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
      }),
    }
  )
  const { url } = await response.json()
  location.href = url
}
