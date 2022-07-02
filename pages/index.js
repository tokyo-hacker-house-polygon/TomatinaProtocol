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

  return (
    <div className='flex justify-center'>
      <div className='px-4' style={{ maxWidth: '1600px' }}>
        <h>
          yey

        </h>
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