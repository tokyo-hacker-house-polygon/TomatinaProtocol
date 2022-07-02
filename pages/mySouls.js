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
    const [loadingState, setLoadingState] = useState('not-loaded')
    const [seedPhrase, setSeedPhrase] = useState("")
    const [dispDescription, setDispDescription] = useState([])
    const [fileUrl, setFileUrl] = useState(null)

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
        console.log(data)
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

    async function publishSoul (i){
        const name = souls[i].name
        const description = dispDescription[i]
        const toAddr = souls[i].sender
        const file = souls[i].image

        try {
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }
            )
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            setFileUrl(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
        console.log(name)
        console.log(description)
        console.log(toAddr)
        console.log(fileUrl)

        if (!name || !description || !toAddr || !fileUrl) return
        const data = JSON.stringify({
            name, description, toAddr, image: fileUrl
        })

        console.log(1)
        try {
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            const to = toAddr
            pubSoulBond(to, url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }

    }

    async function pubSoulBond(to, url) {
        console.log(2)
        console.log(url)
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        let contract = new ethers.Contract(soulbondAddress, Soulbond.abi, signer)
        console.log(3)
        let transaction = await contract.mint(to, url)
        console.log(4)
        await transaction.wait()
        
    }


    if (loadingState === 'loaded' && !souls.length) return (
        <h1 className='py-10 px-20 text-3xl'>You dont have your soul yet</h1>
    )
    return (
        <div className='flex justify-center'>
            <div className='p-4'>
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
                                <p>seed phrase</p>
                                <input type="text" className='p-2 rounded-md' onChange={e => setSeedPhrase(e.target.value)}/>
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