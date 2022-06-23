import '../styles/globals.css'
import Link from "next/link"

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className='border-b p-6'>
        <p className='text-4xl font-bold'>Soulbond Protocol</p>
        <div className='flex mt-4'>
          <Link href="/">
            <a className='mr-6 text-pink-500'>
              Home
            </a>
          </Link>
          <Link href="/soulbond">
            <a className='mr-6 text-pink-500'>
              Soulbond
            </a>
          </Link>
          <Link href="/my-assets">
            <a className='mr-6 text-pink-500'>
              My souls
            </a>
          </Link>
          <Link href="/my-assets">
            <a className='mr-6 text-pink-500'>
              Search
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
