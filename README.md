## Project Title
Udacity Blockchain Nanodegree - Project4

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

## Prerequisites
* node-js
* npm
* crypto-js
* level-db
* express-js
* hex2ascii
* bitcoinjs-message
* bitcoinjs-lib

## Installing
A step by step series of examples that tell you how to get a development env running:
- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```
- Install crypto-js with --save flag to save dependency to our package.json file
```
npm install crypto-js --save
```
- Install level with --save flag
```
npm install level --save
```
- Install express with --save flag
```
npm install express --save
```
- Install hex2ascii with --save flag
```
npm install hex2ascii --save
```
- Install bitcoinjs-message with --save flag
```
npm install bitcoinjs-message --save
```
- Install bitcoinjs-lib with --save flag
```
npm install bitcoinjs-lib --save
```

## Testing

To test code:
1: Open a command prompt or shell terminal after install node.js.
2: Enter a node session, also known as REPL (Read-Evaluate-Print-Loop).
3: Run app.js
```
node app.js
```

Running the tests
Blocks can be added by POST localhost:8000/block and JSON in body, holding a an address and a star key - "data", 
with a string value for block's data.

## Endpoints

### POST Validation request to the mempool
- Post a new validation request
```
#### Parameters
```
{ 
    "address": <New star's wallet address>
}
```
http://localhost:8000/requestValidation
```
### POST Perform validation on existing request
- Perform validation of an existing request
```
#### Parameters
```
{
    "address": <New star's wallet address>
    "signature": <A signature for the message delivered by the service in response to validation registration>
}
```
http://localhost:8000/message-signature/validate
```
### POST Endpoints
- Post a new block to the chain
```
http://localhost:8000/block
```
#### Parameters
```
{
    "body": 
        "address": <New star's wallet address>
        "star": <New Star Data>
}
```
### GET Endpoints by height
- Get an existing block by index 
```
http://localhost:8000/block/<Block_Index>
```
### GET Endpoints by hash
- Get an existing block by hash
```
http://localhost:8000/block/hash/<Block_Hash>
```
### GET Endpoints by wallet address
- Get an existing block by wallet address
```
http://localhost:8000/block/address/<Block_Wallet_Address>
```


## Authors
Yevgeni Mumblat.
