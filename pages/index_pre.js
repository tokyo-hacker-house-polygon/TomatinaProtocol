import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  soulbondAddress
} from "../config"

import Soulbond from "../artifacts/contracts/Soulbond.sol/Soulbond.json"

export default function Home() {
  const [souls, setSouls] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadSouls()
  }, [])

  async function loadSouls() {
    const provider = new ethers.providers.JsonRpcProvider()
    const soulContract = new ethers.Contract(soulbondAddress, Soulbond.abi, provider)
    const data = await soulContract.fetchYourSouls()

    const souls = await Promise.all(data.map(async i => {
      const tokenUri = await soulContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let soul = {
        tokenId: i.tokenId.toString(),
        sender: i.sender,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return soul
    }))
    setSouls(souls)
    setLoadingState('loaded')
  }

  if (loadingState === 'loaded' && !souls.length) return (
    <h1 className='px-20 py-10 text-3xl'>You dont have your soul yet</h1>
  )

  return (
    <div className='flex justify-center'>
      <div className='px-4' style={{ maxWidth: '1600px' }}>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
          {
            souls.map((soul, i) => (
              <div key={i} className= "border shadow rounded-xl overflow-hidden">
                <img src={soul.image} />
                <div className="p-4">
                  <p style={{ height: '64px' }} className="text-2xl font-semibold">{soul.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className='text-gray-400'>{soul.description}</p>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

/*
  let soul = {
        tokenId: i.tokenId.toString(),
        sender: i.sender,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
*/