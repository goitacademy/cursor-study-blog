import React from 'react'
import { Spin, Flex } from 'antd'
import './Loader.css'

function Loader() {
  return (
    <Flex justify="center" align="center" className="loader-container">
      <Spin size="large" />
    </Flex>
  )
}

export default Loader

