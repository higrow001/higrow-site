import Card from '@/components/card/card'
import Link from 'next/link'
import React from 'react'
import './workshops.scss'
import { categories } from '@/lib/utils/organize-workshop'

const Workshops = () => {
  return (
    <div className='workshops-container'>
        <div className="wc-header">
            <div className='header-container'>
            <div className='header-up'>
                <div className='hu-logo'>
                    <Link href="/">HiGrow.</Link>
                </div>
                <div className='hu-search'>
                    <input type="text" placeholder='Search for Workshops' />
                </div>
            </div>
            <div className='header-tags'>
                {categories.map((categories)=>(
                    <button className='categories'>{categories}</button>
                ))}
            </div>
            </div>
            
        </div>
        <div className="wc-cards">
            <Card />
            <Card />
        </div>
    </div>
  )
}

export default Workshops