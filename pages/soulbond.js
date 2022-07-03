import { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import Image from 'next/image'
import red from "../img/red.png";
import orange from "../img/orange.png";
import yellow from "../img/yellow.png";
import green from "../img/green.png";
import blue from "../img/blue.png";
import purple from "../img/purple.png";
import pink from "../img/pink.png";

const Cryptico = require('cryptico')

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
    soulbondAddress
} from "../config"

import Soulbond from '../artifacts/contracts/Soulbond.sol/Soulbond.json'

export default function Soulbonding () {
    const [color, setColor] = useState("")
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
    const router = useRouter()

    async function sendRed() {
        try {
            const url = `https://ipfs.io/ipfs/QmNprJwD6hnA9fnrWfPCposfBnoffXVq1gq8HQwbU6JN6g`
            setFileUrl(url)
            setColor("red")
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    async function sendOrange() {
        try {
            const url = `https://ipfs.io/ipfs/QmUVFTz7GYq4QBXGXQTG3iQehTU258oB8PFHMoBCahqVfR`
            setFileUrl(url)
            setColor("orange")
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    async function sendYellow() {
        try {
            const url = `https://ipfs.io/ipfs/QmNe9t1gbofE6Xf6hu6Pha3Pb5sejh998McHiMAG5GSRLm`
            setFileUrl(url)
            setColor("yellow")
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    async function sendGreen() {
        try {
            const url = `https://ipfs.io/ipfs/QmaLPUYv44Jxgihy3ueXVfNab7M5o7eRSZR4JMuJEvE1BU`
            setFileUrl(url)
            setColor("green")
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    async function sendBlue() {
        try {
            const url = `https://ipfs.io/ipfs/QmXqdhnjmmCNY4ZyACb3LmPW9pWwXgUWqSbt9VJbsvJUvS`
            setFileUrl(url)
            setColor("blue")
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    async function sendPurple() {
        try {
            const url = `https://ipfs.io/ipfs/QmQd6s3QLSdkgySUasFRdZbBmwhCW1wWLeLvV42kSJBV3x`
            setFileUrl(url)
            setColor("purple")
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    async function sendPink() {
        try {
            const url = `https://ipfs.io/ipfs/QmRZeTKGZ8yh518VnSS5yyuPAAwcZfmdPmmDWPs813y6z7`
            setFileUrl(url)
            setColor("pink")
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    async function createSoul() {
        const descript = await encryptDesc(formInput.description, formInput.toAddr)
        const name = formInput.name
        const description = descript.cipher
        const toAddr = formInput.toAddr
        if (!name || !description || !toAddr || !fileUrl) return
        const data = JSON.stringify({
            name, description, toAddr, image: fileUrl
        })
        try {
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            const to = toAddr
            soulBond(to, url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    async function soulBond(to, url) {
        console.log(111)
        console.log(to)
        console.log(url)
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        let contract = new ethers.Contract(soulbondAddress, Soulbond.abi, signer)
        let transaction = await contract.mint(to, url)
        await transaction.wait()
        router.push('/')
    }

    async function encryptDesc(descript, address){
        const web3Modal = new Web3Modal({
            cacheProvider: true,
          })
          
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const soulContract = new ethers.Contract(soulbondAddress, Soulbond.abi, signer)
        const data = await soulContract.getPubKey(address)
        const key = await Promise.all(data.map(async i => {
            let key = {
                keyId: i.keyId.toNumber(),
                owner: i.owner,
                publicKey: i.publicKey,
            }
            return key.publicKey
        }))
        console.log(key)

        const encrypting = await Cryptico.encrypt(descript, key[0])
        return encrypting

    }



    return (
        <div className='flex justify-center'>
            <div className='w-1/2 flex flex-col pb-12'>
                <input 
                    placeholder="Asset Name"
                    className='mt-2 border rounded p-4'
                    onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                />
                <textarea 
                    placeholder='Asset Description'
                    className='mt-2 border rounded p-4'
                    onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                />
                <input 
                    placeholder="To address"
                    className='mt-2 border rounded p-4'
                    onChange={e => updateFormInput({ ...formInput, toAddr: e.target.value })}
                />
                Choose your tomato!
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                <button
                    onClick={sendRed} 
                >
                    <Image
                        alt="red"
                        src={red}
                        width={300} 
                        height={150} 
                        objectFit="contain" 
                    />
                </button>
                
                <button
                    onClick={sendOrange} 
                >
                    <Image
                        alt="orange"
                        src={orange}
                        width={300} 
                        height={150} 
                        objectFit="contain" 
                    />
                </button>

                <button
                    onClick={sendYellow} 
                >
                    <Image
                        alt="yellow"
                        src={yellow}
                        width={300} 
                        height={150} 
                        objectFit="contain" 
                    />
                </button>

                <button
                    onClick={sendGreen} 
                >
                    <Image
                        alt="green"
                        src={green}
                        width={300} 
                        height={150} 
                        objectFit="contain" 
                    />
                </button>

                <button
                    onClick={sendBlue} 
                >
                    <Image
                        alt="blue"
                        src={blue}
                        width={300} 
                        height={150} 
                        objectFit="contain" 
                    />
                </button>

                <button
                    onClick={sendPurple} 
                >
                    <Image
                        alt="purple"
                        src={purple}
                        width={300} 
                        height={150} 
                        objectFit="contain" 
                    />
                </button>

                <button
                    onClick={sendPink} 
                >
                    <Image
                        alt="pink"
                        src={pink}
                        width={300} 
                        height={150} 
                        objectFit="contain" 
                    />
                </button>
                </div>
                <p>{color}</p>
                <button 
                    onClick={createSoul} 
                    className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
                >
                    Soulbond
                </button>
            </div>
        </div>
    )

}