import mqtt from 'mqtt'
import React, { MouseEvent } from 'react'
import { Button, message, Space } from 'antd'
import { useDisableSetter } from '../hooks/prop_hooks'
import { bindingPublishClient, bindingSubscribeClient, publishClient, subscribeClient } from '../store'

/**
 * Debug栏
 * */
const DebugComponent = () => {
  const [publishDisable, reversePublishDisable] = useDisableSetter()
  const [subscribeDisable, reverseSubscribeDisable] = useDisableSetter()

  const config: mqtt.IClientOptions = {
    clientId: '',
    username: 'emqx',
    password: 'public'
  }

  const handlePublishClick = (event: MouseEvent) => {
    event.preventDefault()
    config.clientId = 'publish client' + Date.parse(new Date().toString()).toString()
    bindingPublishClient(mqtt.connect('ws://39.105.110.28:8083/mqtt', config))
    publishClient.on('connect', () => {
      console.log(publishClient)
      message.success('发布用mqtt成功连接!')
      reversePublishDisable()
    })

    publishClient.on('error', (err: Error) => {
      message.error('发布用mqtt成功连接失败!原因：' + err.message)
    })
  }

  const handleSubscribeClick = (event: MouseEvent) => {
    event.preventDefault()
    config.clientId = 'subscribe client' + Date.parse(new Date().toString()).toString()
    bindingSubscribeClient(mqtt.connect('ws://39.105.110.28:8083/mqtt', config))
    subscribeClient.on('connect', () => {
      console.log(publishClient)
      message.success('订阅用mqtt成功连接!')
      reverseSubscribeDisable()
      subscribeClient.subscribe('test', (err: Error) => {
        if (!err) {
          message.success('订阅成功!')
        } else {
          message.error('订阅失败!原因：' + err.message)
        }
      })
    })

    subscribeClient.on('error', (err: Error) => {
      message.error('订阅用mqtt成功连接失败!原因：' + err.message)
    })

    subscribeClient.on('message', (topic: string, message: Buffer) => {
      console.log(topic + ':' + message.toString())
    })
  }

  const handlePublishMessageClick = (event: MouseEvent) => {
    event.preventDefault()
    console.log('发送信息')
    publishClient.publish('test', 'message')
    message.success('发送消息')
  }

  return (
    <Space direction={'vertical'}>
      <Space>
        <Button
          disabled={publishDisable}
          type='primary'
          onClick={handlePublishClick}>
                    发布用mqtt连接
        </Button>
        <Button
          disabled={subscribeDisable}
          type='primary'
          onClick={handleSubscribeClick}>
                    订阅用mqtt连接
        </Button>
      </Space>
      <Button
        type={'primary'}
        disabled={!(subscribeDisable && publishDisable)}
        onClick={handlePublishMessageClick}
      >
        发布信息
      </Button>
    </Space>
  )
}

export default DebugComponent
