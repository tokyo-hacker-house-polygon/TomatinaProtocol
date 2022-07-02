import { useState } from 'react'
import { ethers } from 'ethers'
import Link from 'next/link'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'


const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
    soulbondAddress
  } from "../config"
  
import Soulbond from "../artifacts/contracts/Soulbond.sol/Soulbond.json"
import SoulsList from './soulList'
import Home from './index'
  

export default function SearchItem({searchAddress,setSearchAddress}) {
    const [word, setWord] = useState("")
    const [searchWord, setSearchWord] = useState("")
    const [nowAddress, setNowAddress] = useState("")

    function set() {
        setSearchAddress(word)
    }


    async function set2equal(){
        setNowAddress(searchAddress)
    }

    return(
        <div className="flex  flex-col items-center">
            <p>{searchAddress}</p>
            <p>{nowAddress}</p>
            <Link href="/soulList">
                aaa
            </Link>
            <div className="p-5 bg-slate-600 w-1/2 flex flex-col pb-12" >
                serach :
                <input
                    type="text"
                    className="ml-1"
                    onChange={e => setWord(e.target.value)}
                />
                <button onClick={set} className = "text-white bg-black rounded-md ">
                    GO!

                </button>
            
            </div>

            <div className=''>
                {nowAddress === searchAddress ? searchAddress ===""? (
                    <p> input publicKey 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC</p>
                ) : (
                    <SoulsList searchAddress={searchAddress} setSearchAddress={setSearchAddress} />
                ) : (
                    <div>
                        {setNowAddress(searchAddress)}
                    </div>
                )
                }
                
            </div>
            
            
        </div>
    )
}