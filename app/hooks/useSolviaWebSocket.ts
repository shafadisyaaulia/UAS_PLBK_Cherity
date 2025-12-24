'use client'

/**
 * SOLVIA WebSocket Hook
 * Custom React hook for connecting to SOLVIA backend via WebSocket
 */

import { useEffect, useRef, useState, useCallback } from 'react'

interface HandData {
  hands_detected: boolean
  landmarks: any[]
  gesture: string
  pointer_position?: { x: number; y: number }
}

interface MixtureState {
  components: any[]
  total_volume: number
  current_pH: number
  current_color: [number, number, number]
  reaction_name: string
  description: string
  timestamp: string
}

interface WebSocketData {
  frame: string
  hand_data: HandData
  mixture_state: MixtureState
  safety_status: string
  timestamp: string
}

interface UseSolviaWebSocketOptions {
  url?: string
  autoConnect?: boolean
  reconnectInterval?: number
  onError?: (error: Event) => void
}

export function useSolviaWebSocket(options: UseSolviaWebSocketOptions = {}) {
  const {
    url = 'ws://localhost:8000/ws/camera',
    autoConnect = true,
    reconnectInterval = 3000,
    onError
  } = options

  const [isConnected, setIsConnected] = useState(false)
  const [frame, setFrame] = useState<string>('')
  const [handData, setHandData] = useState<HandData | null>(null)
  const [mixtureState, setMixtureState] = useState<MixtureState | null>(null)
  const [safetyStatus, setSafetyStatus] = useState<string>('safe')
  const [error, setError] = useState<string | null>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url)

      ws.onopen = () => {
        console.log('✅ Connected to SOLVIA backend')
        setIsConnected(true)
        setError(null)
      }

      ws.onmessage = (event) => {
        try {
          const data: WebSocketData = JSON.parse(event.data)
          
          if (data.frame) {
            setFrame(data.frame)
          }
          
          if (data.hand_data) {
            setHandData(data.hand_data)
          }
          
          if (data.mixture_state) {
            setMixtureState(data.mixture_state)
          }
          
          if (data.safety_status) {
            setSafetyStatus(data.safety_status)
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err)
        }
      }

      ws.onerror = (event) => {
        console.error('❌ WebSocket error:', event)
        setError('WebSocket connection error')
        if (onError) {
          onError(event)
        }
      }

      ws.onclose = () => {
        console.log('🔌 Disconnected from SOLVIA backend')
        setIsConnected(false)
        
        // Attempt reconnection
        if (autoConnect) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('🔄 Attempting to reconnect...')
            connect()
          }, reconnectInterval)
        }
      }

      wsRef.current = ws
    } catch (err) {
      console.error('Failed to create WebSocket connection:', err)
      setError('Failed to connect to backend')
    }
  }, [url, autoConnect, reconnectInterval, onError])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [autoConnect, connect, disconnect])

  return {
    isConnected,
    frame,
    handData,
    mixtureState,
    safetyStatus,
    error,
    connect,
    disconnect
  }
}

// REST API functions
const API_BASE_URL = 'http://localhost:8000'

export async function getChemicals() {
  const response = await fetch(`${API_BASE_URL}/api/chemicals`)
  return response.json()
}

export async function addChemical(
  chemicalId: string, 
  volume: number = 10, 
  molarity: number = 1.0
) {
  const response = await fetch(`${API_BASE_URL}/api/mixture/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chemical_id: chemicalId,
      volume,
      molarity
    })
  })
  return response.json()
}

export async function getMixtureState() {
  const response = await fetch(`${API_BASE_URL}/api/mixture/state`)
  return response.json()
}

export async function resetMixture() {
  const response = await fetch(`${API_BASE_URL}/api/mixture/reset`, {
    method: 'POST'
  })
  return response.json()
}

export async function getSafetyStatus() {
  const response = await fetch(`${API_BASE_URL}/api/safety/status`)
  return response.json()
}
