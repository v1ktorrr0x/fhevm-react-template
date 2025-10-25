#!/bin/bash

# Test Node.js Example Script
# This script helps you test the Node.js example

echo "🧪 Testing Node.js Example"
echo ""

# Check if Hardhat node is running
echo "1️⃣ Checking if Hardhat node is running..."
if curl -s http://localhost:8545 > /dev/null 2>&1; then
    echo "✅ Hardhat node is running"
else
    echo "❌ Hardhat node is NOT running"
    echo "   Please start it in another terminal: npx pnpm chain"
    exit 1
fi

# Check if contracts are deployed
echo ""
echo "2️⃣ Checking if contracts are deployed..."
if [ -f "packages/hardhat/deployments/localhost/FHECounter.json" ]; then
    echo "✅ Contracts are deployed"
    CONTRACT_ADDRESS=$(cat packages/hardhat/deployments/localhost/FHECounter.json | grep -o '"address":"[^"]*' | cut -d'"' -f4)
    echo "   Contract address: $CONTRACT_ADDRESS"
else
    echo "❌ Contracts are NOT deployed"
    echo "   Please deploy them: npx pnpm deploy:localhost"
    exit 1
fi

# Update contract address in example
echo ""
echo "3️⃣ Updating contract address in example..."
sed -i "s/const CONTRACT_ADDRESS = '0x[^']*'/const CONTRACT_ADDRESS = '$CONTRACT_ADDRESS'/" examples/node-js/index.js
echo "✅ Contract address updated"

# Run the example
echo ""
echo "4️⃣ Running Node.js example..."
echo ""
cd examples/node-js
node index.js

echo ""
echo "✅ Test complete!"
