#!/bin/bash

echo "Starting FHEVM Development Environment..."
echo ""
echo "This will open 3 terminal windows:"
echo "  1. Hardhat Node (blockchain)"
echo "  2. Contract Deployment"
echo "  3. Next.js Frontend"
echo ""
echo "Press Enter to continue..."
read

echo "Opening Terminal 1: Hardhat Node..."
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "npx pnpm chain; exec bash"
elif command -v xterm &> /dev/null; then
    xterm -e "npx pnpm chain" &
else
    echo "Please open a new terminal and run: npx pnpm chain"
fi

echo "Waiting 5 seconds for Hardhat to start..."
sleep 5

echo "Opening Terminal 2: Deploy Contracts..."
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "npx pnpm deploy:localhost; echo ''; echo 'Deployment complete!'; exec bash"
elif command -v xterm &> /dev/null; then
    xterm -e "npx pnpm deploy:localhost" &
else
    echo "Please open a new terminal and run: npx pnpm deploy:localhost"
fi

echo "Waiting 10 seconds for deployment..."
sleep 10

echo "Opening Terminal 3: Next.js App..."
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "npx pnpm start; exec bash"
elif command -v xterm &> /dev/null; then
    xterm -e "npx pnpm start" &
else
    echo "Please open a new terminal and run: npx pnpm start"
fi

echo ""
echo "All terminals started!"
echo ""
echo "Terminal 1: Hardhat Node (keep running)"
echo "Terminal 2: Deploy Contracts (will finish, can close)"
echo "Terminal 3: Next.js App (keep running)"
echo ""
echo "Open http://localhost:3000 in your browser"
echo ""
