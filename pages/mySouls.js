import { ethers } from "ethers";
import { useEffect, useState } from 'react'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import axios from 'axios'
import Web3Modal from "web3modal"
import Link from 'next/link'
import Cryptico from "cryptico"

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
    soulbondAddress
} from '../config'

import Soulbond from '../artifacts/contracts/Soulbond.sol/Soulbond.json'

export default function MySouls({searchAddress,setSearchAddress}) {
    const [souls, setSouls] = useState([])
    const [pubSouls, setPubSouls] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    const [seedPhrase, setSeedPhrase] = useState("")
    const [dispDescription, setDispDescription] = useState([])

    useEffect(() => {
        loadSouls()
    }, [])

    async function loadSouls() {
        const web3Modal = new Web3Modal({
            cacheProvider: true,
        })
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const soulContract = new ethers.Contract(soulbondAddress, Soulbond.abi, signer)
        const data = await soulContract.fetchYourSouls()
        const data2 = await soulContract.fetchYourPubSouls()

        const souls = await Promise.all(data.map(async i => {
            const tokenUri = await soulContract.tokenURI(i.soulId)
            const meta = await axios.get(tokenUri)
            console.log(typeof(i.sender))
            console.log(typeof(i.owner))
            let soul = {
                soulId: i.soulId.toNumber(),
                sender: i.sender,
                owner: i.owner,
                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description,
            }
            return soul
        }))
        const descriptions = await Promise.all(data.map(async i => {
            const tokenUri = await soulContract.tokenURI(i.soulId)
            const meta = await axios.get(tokenUri)
            let description = meta.data.description;
            return description
        }))

        const pubsouls = await Promise.all(data2.map(async i => {
            let soul = {
                soulId: i.soulId.toNumber(),
                sender: i.sender,
                owner: i.owner,
                image: i.img,
                name: i.name,
                description: i.description,
                valText: "aa",
            }
            return soul
        }))

        console.log(1111)
        console.log(pubsouls)

        setSouls(souls)
        setPubSouls(pubsouls)
        setDispDescription(descriptions)
        console.log(dispDescription)
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
        console.log(decriptionResult.plaintext)
        console.log(i)
        setDispDescription((prevState) => prevState.map((value,index)=>(index === i ? decriptionResult.plaintext : value)))
        console.log("hi", dispDescription[i])

    }

    async function publishSoul (i){
        const name = souls[i].name
        const description = dispDescription[i]
        const toAddr = souls[i].sender
        const file = souls[i].image

        console.log(name)
        console.log(description)
        console.log(toAddr)
        console.log(file)

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const soulContract = new ethers.Contract(soulbondAddress, Soulbond.abi, signer)

        console.log(4)
        await soulContract.setPubSoul(toAddr,file,description,name)
        console.log(5)
    }

    async function validate(i) {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const soulContract = new ethers.Contract(soulbondAddress, Soulbond.abi, signer)
        const data = await soulContract.getPubKey(pubSouls[i].sender)

        const key = await Promise.all(data.map(async i => {
            let key = {
                keyId: i.keyId.toNumber(),
                owner: i.owner,
                publicKey: i.publicKey,
            }
            return key.publicKey
        }))

        
        console.log(key[0])
        console.log(pubSouls[i].description)
        pubSouls[i].valText = Cryptico.encrypt(pubSouls[i].description, key[0]).cipher
        console.log(pubSouls[i].valText)
    }




    if (loadingState === 'loaded' && !souls.length) return (
        <h1 className='py-10 px-20 text-3xl'>You dont have your soul yet</h1>
    )
    return (
        <div className='flex justify-center'>
            <div className='p-4'>
            <p className="text-4xl">public</p>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
                {
                    pubSouls.map((soul, i) => (
                        <div key={i} className="border shadow rounded-xl overflow-hidden bg-pink-300">
                            <img src={soul.image} className="rounded" />
                            <div className="p-4">
                                <p className='text-2xl text-black'>Description : </p>
                                <p className="text-2xl text-black">{soul.description}</p>
                            </div>
                            

                            <div className="p-4">
                                <p className="text-2xl text-black">From :</p>
                                <button 
                                    onClick={a => setSearchAddress(soul.sender)}
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
                <p className="text-4xl">encrypt</p>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
                {
                    souls.map((soul, i) => (
                        <div key={i} className="border shadow rounded-xl overflow-hidden bg-pink-300">
                            <img src={soul.image} className="rounded" />
                            <div className="p-4">
                                <p className='text-2xl text-black'>Description : </p>
                                    <p className="text-2xl text-black">{dispDescription[i]}</p>
                                
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
                                <button 
                                    className='p-2 ml-3 text-white bg-black rounded-md'
                                    onClick={a => publishSoul(i)}
                                >
                                    go public
                                </button>
                            </div>
                            <div className="p-4">
                                <p className="text-2xl text-black">From :</p>
                                <button 
                                    onClick={a => setSearchAddress(soul.sender)}
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