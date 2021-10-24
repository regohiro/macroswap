import React from 'react'
import EventListener from '../EventListener'
import MainNavigation from './MainNavigation'

const Layout: React.FC = ({children}) => {
  return (
    <>
      <MainNavigation/>
      <main>{children}</main>
      <EventListener/>
    </>
  )
}

export default Layout