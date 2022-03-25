import React, {useState, useEffect }from 'react';
import { ethers } from "ethers";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import myEpicNFT from './utils/myEpicNFT.json';
// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {
  // Render Methods
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletConnected = async () => {
    const { ethereum } = window;

    if( !ethereum ){
      console.log("Make sure you are connected to MetaMask!");
      return ;
    }
    else{
      console.log("We have the ethereum object!");
    }

    const accounts = await ethereum.request({ method : 'eth_accounts' });

    if ( accounts.length === 0 ){
      console.log("You don't have any authorized account yet.");
    }
    else{
      const account = accounts[0];
      console.log("Found an ethereum account : ", account);
      setCurrentAccount(account);
    }
  }

  const connectWallet = async () => {
    try{
      const {ethereum} = window;

      if(!ethereum){
        alert("Get MetaMask!");
        return ;
      }

      const accounts = await ethereum.request({method : "eth_requestAccounts"});

      console.log("Connected.", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch(error){
      console.log(error);
    }
  }

  const setupEventListener = async () => {
    const CONTRACT_ADDRESS = "0xB90C5adCdF60a7f8b94ce736b0A0537950d5E25f";
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0x212Ed3B7537E6049aBbcEF97a2f2a8936C980b54";

    try {
      const { ethereum } = window;
      
      if( ethereum ){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNFT.abi, signer );

        console.log("Going to pop wallet now to pay gas!");
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("Mining! Please Wait!");
        await nftTxn.wait();
        
        console.log(`Mined! see Transaction at : https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        
      }
      else{
        console.log("Connect to MetaMask first!");
      }  
    }catch(error){
      console.log(error);
    }


    
  }


  
  const renderNotConnectedContainer = () => (
    <button onClick = {connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  useEffect( () => {
    checkIfWalletConnected();
  }, [])
  
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;