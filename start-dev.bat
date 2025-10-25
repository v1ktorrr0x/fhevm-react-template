@echo off
echo Starting FHEVM Development Environment...
echo.
echo This will open 3 terminal windows:
echo   1. Hardhat Node (blockchain)
echo   2. Contract Deployment
echo   3. Next.js Frontend
echo.
echo Press any key to continue...
pause > nul

echo Opening Terminal 1: Hardhat Node...
start cmd /k "title Hardhat Node && npx pnpm chain"

echo Waiting 5 seconds for Hardhat to start...
timeout /t 5 /nobreak > nul

echo Opening Terminal 2: Deploy Contracts...
start cmd /k "title Deploy Contracts && npx pnpm deploy:localhost && echo. && echo Deployment complete! && echo You can close this window or keep it open. && pause"

echo Waiting 10 seconds for deployment...
timeout /t 10 /nobreak > nul

echo Opening Terminal 3: Next.js App...
start cmd /k "title Next.js App && npx pnpm start"

echo.
echo All terminals started!
echo.
echo Terminal 1: Hardhat Node (keep running)
echo Terminal 2: Deploy Contracts (will finish, can close)
echo Terminal 3: Next.js App (keep running)
echo.
echo Open http://localhost:3000 in your browser
echo.
pause
