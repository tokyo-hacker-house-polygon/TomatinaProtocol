import { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const Cryptico = require('cryptico')

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
    soulbondAddress
} from "../config"

import Soulbond from '../artifacts/contracts/Soulbond.sol/Soulbond.json'

export default function Soulbonding () {
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
    const router = useRouter()

    async function onChange(e) {
        const file = e.target.files[0];
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
    }

    async function createSoul() {
        console.log(1)
        const descript = await encryptDesc(formInput.description, formInput.toAddr)
        console.log(descript)
        const name = formInput.name
        const description = descript.cipher
        const toAddr = formInput.toAddr
        console.log(description)
        if (!name || !description || !toAddr || !fileUrl) return
        const data = JSON.stringify({
            name, description, toAddr, image: fileUrl
        })
        console.log(3)
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
                <input 
                    type="file"
                    name="Asset"
                    className='my-4'
                    onChange={onChange}
                />
                {
                    fileUrl && (
                        <img className='rounded mt-4' width="350" src={fileUrl} />
                    )
                }
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