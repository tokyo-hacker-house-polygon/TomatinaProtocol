import Link from 'next/link'

const Navigation = ({web3Handler, account, publicKey}) => {
    return(
        <nav className="border-b p-6 bg-black">
        <p className="text-4xl font-bold text-pink-700">Soulbound Protocol</p>
        <div className='flex mt-4'>
          <Link href="/">
            <a className="p-1 mr-4 text-pink-500 rounded-md">
              Home
            </a>
          </Link>
          <Link href="/soulbond">
            <a className='p-1 mr-6 text-pink-500'>
              Soulbond
            </a>
          </Link>
          <Link href="/mySouls">
            <a className='p-1 mr-6 text-pink-500'>
              My souls
            </a>
          </Link>
          <Link href="/search">
          <a className='p-1 mr-6 text-pink-500'>
            Search
          </a>
          </Link>
          <a className='p-1 mr-6 text-pink-500'>
            {publicKey}
          </a>

          {account ? publicKey.length ?(
            <Link href = {`https://etherscan.io/address/${account}`}>
                <button className="font-bold ml-2 bg-pink-400 text-black rounded p-2">
                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                </button>
            </Link>

          ) : (
            <Link href="">
              <button className="font-bold ml-2 bg-pink-400 text-black rounded p-2">
                    create keys
                </button>
            </Link>
          ) : (
            <button onClick={web3Handler} className="font-bold ml-2 bg-pink-400 text-black rounded p-2">
                Connect Wallet
            </button>

          )

          }
        </div>
      </nav>
    )
}

export default Navigation;