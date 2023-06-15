import './navbar.scss';
import Link from 'next/link';

const Navbar = () => {
  return (
    <div className='navbar-container'>
        <div className='nav-logo'>
         <Link href="/">HiGrow.</Link> </div>
        <div className='nav-links'>
        <Link href="/contests">contests</Link>
        <Link href="/contests">workshops</Link>
        <Link href="/contests">about us</Link>
        </div>
        <div className='nav-buttons'>
          <Link className='organize-button' href="signup"> <button> Organize</button>   </Link>
          <Link className='signup-button' href="signup"> <button> Sign up</button> </Link>
        </div>
    </div>
  )
}

export default Navbar;