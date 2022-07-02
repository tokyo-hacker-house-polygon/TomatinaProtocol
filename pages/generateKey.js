import NodeRSA from "node-rsa"
import Cryptico from "cryptico"
import { ethers } from "ethers";

import { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'


import {
  soulbondAddress
} from '../config'

import Soulbond from '../artifacts/contracts/Soulbond.sol/Soulbond.json'

export default function generateKey({searchAddress,setSearchAddress}) {
    const [genPubKey, setGenPubKey] = useState("122")
    const [seedWord, setSeedWord] = useState("aa")    
    
    const generate = async() => {

        const key = Cryptico.generateRSAKey(seedWord, 512)

        const web3Modal = new Web3Modal({
            cacheProvider: true,
        })

        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
    
        const soulContract = new ethers.Contract(soulbondAddress, Soulbond.abi, signer)
        await soulContract.setPubKey(Cryptico.publicKeyString(key))
        setGenPubKey(Cryptico.publicKeyString(key))
        
    }


    return(
        <div className="flex  flex-col items-center">
            <div className="p-5 bg-slate-600 w-1/2 flex flex-col pb-12" >
                <p className="text-white text-lg">Set seed Phrase :</p>
                <input
                    type="text"
                    className="ml-1 p-2"
                    onChange={e => setSeedWord(e.target.value)}
                />
                <p className="text-white">{seedWord}</p>
            
            </div>
            <button 
                className="p-3 my-3 rounded bg-slate-500 text-white"
                onClick={generate}
            >
                Generate!
            </button>
            <p>your public key : {genPubKey}</p>
            <p>your seed phrase : {seedWord}</p>
            
        </div>
        
    )

}