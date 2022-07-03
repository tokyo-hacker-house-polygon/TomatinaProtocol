import '../styles/globals.css'

import { ethers } from "ethers";
import Navigation from './Navbar'
import GenerateKey from './generateKey'

import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Web3Modal from "web3modal"

import {
  soulbondAddress
} from '../config'

import { GET_DEFAULT_PROFILES, GET_DEFAULT_PROFILES_FROM_ADDRESS } from "./api/api"
import Image from 'next/image'
import { apolloClient } from '../apollo-client';
import { gql } from '@apollo/client'

import Soulbond from '../artifacts/contracts/Soulbond.sol/Soulbond.json'


function MyApp({ Component, pageProps }) {
  const [account, setAccount] = useState(null)
  const [profile, setProfile] = useState("")
  const [loading, setLoading] = useState(true)
  const [searchAddress, setSearchAddress] = useState("")
  const [publicKey, setPublicKey] = useState("")

  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await web3Handler()
    })
    
    const web3Modal = new Web3Modal({
      cacheProvider: true,
    })
    
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    
    const soulContract = new ethers.Contract(soulbondAddress, Soulbond.abi, signer)
    const data = await soulContract.getPubKey(accounts[0])
    const key = await Promise.all(data.map(async i => {
      let key = {
          keyId: i.keyId.toNumber(),
          owner: i.owner,
          publicKey: i.publicKey,
      }
      return key.publicKey
    }))
    console.log(accounts[0])
    let name
      try {
        const response = await  apolloClient.query({
            query: gql(GET_DEFAULT_PROFILES),
            variables: {
                request: 
                    { ethereumAddress: accounts[0]}
            },
          })
        console.log("response", response)
        name = response.data.defaultProfile.handle.toString()
        console.log(name)
        console.log(typeof(name))
    } catch (err) {
        console.log("error fetching profile...", err)
    }
    setProfile(name)
    setPublicKey(key)
    setLoading(false)
  }

  return (
    <div>
      <>
        <Navigation web3Handler={web3Handler} account={account} profile={profile} publicKey={publicKey}/>
      </>

      {!loading ? publicKey.length ?(
        <Component {...pageProps} searchAddress={searchAddress} setSearchAddress={setSearchAddress}/>
      ) : (
        <GenerateKey />
      ) : (
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
        </div>
      )

      }
    </div>
  )
}

export default MyApp

/*<Component {...pageProps}/>*/
