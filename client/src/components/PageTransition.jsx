import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import './PageTransition.css'

const PageTransition = ({ children }) => {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [animating, setAnimating] = useState(false)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (displayLocation.pathname !== location.pathname) {
      setAnimating(true)
      
      // Wait for beams to cover the screen before swapping the page content
      const swapTimer = setTimeout(() => {
        setDisplayLocation(location)
        window.scrollTo(0, 0)
      }, 400) // Approx halfway through the 860ms total animation

      // End animation
      const endTimer = setTimeout(() => {
        setAnimating(false)
      }, 950)

      return () => {
        clearTimeout(swapTimer)
        clearTimeout(endTimer)
      }
    }
  }, [location, displayLocation.pathname])

  return (
    <>
      {React.cloneElement(children, { location: displayLocation, key: displayLocation.pathname })}
      {animating && (
        <div className="page-transition" aria-hidden="true" key={location.key}>
          <div className="page-transition__beam page-transition__beam--1" />
          <div className="page-transition__beam page-transition__beam--2" />
          <div className="page-transition__beam page-transition__beam--3" />
        </div>
      )}
    </>
  )
}

export default PageTransition
