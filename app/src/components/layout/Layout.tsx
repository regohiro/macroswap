import React from 'react'
import MainNavigation from './MainNavigation'

const Layout: React.FC = ({children}) => {
  return (
    <>
      <MainNavigation/>
      <main>{children}</main>
    </>
  )
}

export default Layout