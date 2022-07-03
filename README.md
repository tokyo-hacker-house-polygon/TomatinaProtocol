## Project Name
Tomatina Protocol
## About this project
You get your reputation from other people in encrypted way and you can make that public if you like it.

Throught our protocol, they can make a chain of thier reputation. The reliability of that reputation depends on the person giving the reputaion, and the reliability of that person depends on the reputaion they have.

## What we want to solve
Through this protocol, we want to solve these problems below
- Centralized reputation system
   - You can refer what kind of reputation they have in their wallet and also source of that reputation
   - Any indivisual, organization, or institution can throw their reputation to any kind of wallet, but it depends on you which source of reputation you will trust
- Avoid evaluation based on a single axis of evaluation
   - We currently don't implement quantitative evaluation criteria. This is because, we don't like a single evaluation axis
   - Then, what we need to verify how they are trustable is their reputation from other people written in their own words
- More visualize of the relationship between wallet addresses
   - We can only see following and followed on lens protocol, but this protocol can add p2p relationship with verbal evaluation
- And also visualize of the identity of that wallet address
   - Of course, the reputation is one of their identity
   - You can refer when you try to hire him/her
## Technologies
- IPFS
   - URL: https://ipfs.io/
- RSA algorithm (Currently we are using cryptico, but it could be replaced by other algorithm)
   - URL: https://github.com/phpmycoder/cryptico-node
- Lens Protocol API
   - URL: https://github.com/aave/lens-protocol
- figma, hardhat, next js, react...
## Polygon scan link
https://mumbai.polygonscan.com/address/0x51073b7514F31faFd1F08EAc2DD36353a4f46837
## Challenges that we are faced
To their reputation being secured, we used public key encryption

They generate their key pairs for encryption and decryption and it will be used to hide thier reputation from other people

