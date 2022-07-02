import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Cryptico from "cryptico"

import {
    soulbondAddress
  } from "../config"
  
import Soulbond from "../artifacts/contracts/Soulbond.sol/Soulbond.json"

export default function SoulsList({searchAddress,setSearchAddress}) {
    const [souls, setSouls] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    const [seedPhrase, setSeedPhrase] = useState("")
    const [dispDescription, setDispDescription] = useState([])
    const [nextAddress, setNextAddress] = useState(null)

    useEffect(() => {
        loadSouls()
    }, [])

    async function loadSouls() {
        console.log(1)
        const web3Modal = new Web3Modal({
            cacheProvider: true,
        })
        console.log(2)
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        console.log(3)
        const soulContract = new ethers.Contract(soulbondAddress, Soulbond.abi, signer)
        const data = await soulContract.fetchUserSouls(searchAddress)
        console.log(4)
        console.log(data)
        const souls = await Promise.all(data.map(async i => {
            console.log(5)
            const tokenUri = await soulContract.tokenURI(i.soulId)
            console.log(6)
            const meta = await axios.get(tokenUri)
            let soul = {
                soulId: i.soulId.toNumber(),
                sender: i.sender,
                owner: i.owner,
                image: meta.data.image,
                description: meta.data.description,
            }
            return soul
        }))
        const descriptions = await Promise.all(data.map(async i => {
            const tokenUri = await soulContract.tokenURI(i.soulId)
            const meta = await axios.get(tokenUri)
            let description = meta.data.description
            return description
        }))
        setSouls(souls)
        setDispDescription(descriptions)
        setLoadingState('loaded')


    }

    async function decrypt(i,passphrase){
        console.log(passphrase)
        const privatekey = Cryptico.generateRSAKey(passphrase, 512)
        console.log(dispDescription[i])
        console.log(privatekey)
        const A = Cryptico.publicKeyString(privatekey)
        console.log(A)
        const decriptionResult = await Cryptico.decrypt(dispDescription[i],privatekey)
        console.log("Start")
        console.log(decriptionResult)
        console.log(i)
        setDispDescription((prevState) => prevState.map((value,index)=>(index === i ? decriptionResult.plaintext : value)))

    }

    function goNext(address) {
        setSearchAddress(address)
        loadSouls()

    }

    if (loadingState === 'loaded' && !souls.length) return (
        <h1 className='py-10 px-20 text-3xl'>{searchAddress} dont have your soul yet</h1>
    )
    return (
        <div className='flex justify-center'>
            <div className='p-4'>
                <p>SearchAddress : {searchAddress}</p>
                
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
                {
                    souls.map((soul, i) => (
                        <div key={i} className="border shadow rounded-xl overflow-hidden bg-pink-300">
                            <img src={soul.image} className="rounded" />
                            <div className="p-1 border">
                                <p className='text-2xl text-black'>Description : </p>
                                <p className="text-lg text-black">{dispDescription[i]}</p>
                            </div>
                            <div className="p-1">
                                <p>seed phrase</p>
                                <input type="text" className='p-2 rounded-md' onChange={e => setSeedPhrase(e.target.value)}/>
                                <button 
                                    className='p-2 ml-3 text-white bg-black rounded-md'
                                    onClick={a => decrypt(i,seedPhrase)}
                                >
                                    go 
                                </button>
                            </div>
                            <div className="p-1">
                                <p className='text-2xl text-black'>From : </p>
                                <button 
                                    onClick={a => goNext(soul.sender)}
                                    className='bg-pink-800 text-white p-3 rounded-md'
                                >
                                    {soul.sender.slice(0, 10) + '...' + soul.sender.slice(32, 42)}
                                </button>
                                <Link href="/soulList">
                                    <button className='p-2 ml-3 text-white bg-black rounded-md'>go</button>
                                </Link>
                            </div>
                        </div>
                    ))
                }
                </div>
            </div>
        </div>
    )

}