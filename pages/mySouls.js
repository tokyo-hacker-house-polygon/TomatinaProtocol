import { ethers } from "ethers";
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
    soulbondAddress
} from '../config'

import Soulbond from '../artifacts/contracts/Soulbond.sol/Soulbond.json'

export default function MySouls() {
    const [souls, setSouls] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')

    useEffect(() => {
        loadSouls()
    }, [])

    async function loadSouls() {
        const web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: true,
        })
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const soulContract = new ethers.Contract(soulbondAddress, Soulbond.abi, signer)
        const data = await soulContract.fetchYourSouls()

        const souls = await Promise.all(data.map(async i => {
            const tokenUri = await soulContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let soul = {
                tokenId: i.tokenId.toNumber(),
                sender: i.sender,
                owner: i.owner,
                image: meta.data.image,
            }
            return soul
        }))
        setSouls(souls)
        setLoadingState('loaded')
    }
    if (loadingState === 'loaded' && !souls.length) return (
        <h1 className='py-10 px-20 text-3xl'>You dont have your soul yet</h1>
    )
    return (
        <div className='flex justify-center'>
            <div className='p-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
                {
                    souls.map((nft, i) => (
                        <div key={i} className="border shadow rounded-xl overflow-hidden">
                            <img src={soul.image} className="rounded" />
                        </div>
                    ))
                }
                </div>
            </div>
        </div>
    )
}