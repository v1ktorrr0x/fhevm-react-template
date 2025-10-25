@echo off
REM Test Node.js Example Script (Windows)
REM This script helps you test the Node.js example

echo 🧪 Testing Node.js Example
echo.

REM Check if Hardhat node is running
echo 1️⃣ Checking if Hardhat node is running...
curl -s http://localhost:8545 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Hardhat node is running
) else (
    echo ❌ Hardhat node is NOT running
    echo    Please start it in another terminal: npx pnpm chain
    exit /b 1
)

REM Check if contracts are deployed
echo.
echo 2️⃣ Checking if contracts are deployed...
if exist "packages\hardhat\deployments\localhost\FHECounter.json" (
    echo ✅ Contracts are deployed
    
    REM Extract contract address (simplified for Windows)
    for /f "tokens=2 delims=:," %%a in ('findstr /C:"\"address\"" packages\hardhat\deployments\localhost\FHECounter.json') do (
        set CONTRACT_ADDRESS=%%a
    )
    set CONTRACT_ADDRESS=%CONTRACT_ADDRESS:"=%
    set CONTRACT_ADDRESS=%CONTRACT_ADDRESS: =%
    echo    Contract address: %CONTRACT_ADDRESS%
) else (
    echo ❌ Contracts are NOT deployed
    echo    Please deploy them: npx pnpm deploy:localhost
    exit /b 1
)

REM Run the example
echo.
echo 3️⃣ Running Node.js example...
echo    Note: Make sure CONTRACT_ADDRESS in examples/node-js/index.js matches: %CONTRACT_ADDRESS%
echo.
cd examples\node-js
node index.js

echo.
echo ✅ Test complete!
