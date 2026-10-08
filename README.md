# AllWeb3 onboarding prototype

Open `index.html` in a browser. No server, installation, or internet connection is needed. Keep all HTML, CSS, JavaScript, and assets together.

- `index.html`: main page; select Creator or Brand, then Enter App.
- `creator-onboarding.html`: Creator onboarding.
- `project-onboarding.html`: Brand / Project onboarding.
- `portal.html`: mock signed-in portal welcome page.

## Sign in

Select Sign in on the account access screen. Email sign-in accepts any valid-looking email; Google sign-in uses a mock account chooser. Both go directly to the welcome page displaying “Welcome, you can operate our Portals”, without OTP or onboarding.

## Sign up

Email sign-up still accepts any six-digit OTP (e.g. 123456). Google sign-up uses the mock account chooser. Then choose an account type, verify a social channel, set up a profile, and choose preferences. Social verification closes automatically. Profile images are previewed locally, or you can choose a demo avatar.

## Preferences

Connect MetaMask, Coinbase Wallet, or Binance Wallet through a mock confirmation popup. The connected wallet’s full sample address is displayed. Switching providers replaces the connection; Disconnect clears it. Wallet connection is optional. Select one to three Verticals. Languages and Creator content format have been removed. Project accounts retain the campaign goal field.

Back navigation preserves values during the walkthrough. Refresh clears state. Authentication, social verification, and wallet connections are entirely simulated: no backend requests, wallet extensions, signatures, or transactions.

The main-page artwork and wordmark approximate the supplied screenshot in HTML/CSS. Onboarding background and icons are local Figma assets. Fonts use browser fallbacks.

Verified in Chrome: email and Google sign-in for both account types, Creator email OTP sign-up, Project Google sign-up, all three wallet providers, valid sample address formats, three-vertical limit, state retention, mobile layout, and completion. Also verified local file execution.
