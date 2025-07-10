# GreenCred: A Blockchain-Based Personal Carbon Offset Wallet

GreenCred is a Next.js application designed to help climate-conscious individuals verify, track, and showcase their environmental impact. It solves the problem of greenwashing by providing a trustworthy system based on real-world actions and blockchain-certified rewards.

## (Core Features)

-   **User Authentication**: Secure sign-up and login flow using Supabase Auth.
-   **Carbon Footprint Logging**: Manually log activities like transport and diet to see your real-time carbon impact.
-   **Real-time Data Dashboard**: Visualize your carbon footprint with charts and an activity feed.
-   **Blockchain Rewards**: Earn (simulated) Carbon Offset NFTs for positive environmental actions, stored permanently.
-   **Social Reputation**: A "GreenCred Score" gamifies eco-habits and provides verifiable social proof.

## (Tech Stack)

-   **Frontend**: Next.js (App Router)
-   **Styling**: Tailwind CSS
-   **Database & Auth**: Supabase
-   **Data Visualization**: Recharts
-   **Animations**: Framer Motion
-   **Blockchain (Simulated)**: Ethers.js for wallet interaction, with NFT minting simulated via database entries for prototype speed.

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd greencred-app
