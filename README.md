# In-Game Wallet App

This is a mock project designed to simulate an in-game purchasing experience. With a clean and responsive UI, users can sign up, log in, add funds to their wallet using Braintree, purchase virtual game items, and view their transaction history.

## Features

- **User Authentication**: 
  - Email/password signup and login.
  - Google authentication for quick access.
    
- **Wallet Management**: 
  - Add funds securely using Braintree's payment gateway.
  - View transaction history for all wallet activities, including fund additions and purchases.
  - **Important Security Note**: Use Braintree's [dummy credit card numbers](https://developer.paypal.com/braintree/docs/guides/credit-cards/testing-go-live) for testing purposes.
    
- **Game Item Store**: 
  - Browse and purchase in-game items with your wallet balance.
  - Visuals for items sourced from Freepik (credited below).
    
- **API for Payment Handling**: 
  - Integrated API built within Next.js to handle Braintree interactions seamlessly.

## Live Demo

Explore the app without installing by visiting the live demo:  
https://magicalwallet.vercel.app/

## Tech Stack

- **Next.js**: Framework for building the app.
- **Tailwind CSS & shadcn**: For crafting a clean, responsive UI.
- **Firebase**: For user authentication and data storage.
- **Braintree**: For secure wallet funding and payment processing.

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aysenurcaglar/in-game-wallet-app.git
   cd in-game-wallet-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a project in [Firebase Console](https://console.firebase.google.com/).
   - Enable email/password and Google authentication.
   - Obtain the Firebase config object and add it to your `.env.local` file.

4. Set up Braintree:
   - Sign up for a [Braintree sandbox account](https://sandbox.braintreegateway.com/).
   - Obtain your merchant ID, public key, and private key.
   - Add these credentials to your `.env.local` file.

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Visit `http://localhost:3000` to use the app.

## Important Notes

- **Testing Payments**:  
  Please **DO NOT** use real credit card information during testing. Refer to Braintree's [testing documentation](https://developer.paypal.com/braintree/docs/guides/credit-cards/testing-go-live) for dummy credit card numbers.  
- **Credits**:  
  Item images used in the store are sourced from **[Freepik](https://www.freepik.com/)**.

## Contributing

This project is for demonstration purposes only. Contributions are not expected but are welcome for educational collaboration.

---

Let me know if there's anything else you'd like to include!
