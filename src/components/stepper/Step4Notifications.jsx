import { useAgentStore } from '../../store/agentStore'

const CHANNELS = [
  {
    id: 'discord',
    label: 'Discord',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
      </svg>
    ),
  },
  {
    id: 'slack',
    label: 'Slack',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zm-1.27 0a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.163 0a2.528 2.528 0 012.523 2.522v6.312zM15.163 18.956a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.163 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zm0-1.27a2.527 2.527 0 01-2.52-2.523 2.527 2.527 0 012.52-2.52h6.315A2.528 2.528 0 0124 15.163a2.528 2.528 0 01-2.522 2.523h-6.315z" />
      </svg>
    ),
  },
]

const FREQUENCIES = [
  { value: 'daily', label: '매일' },
  { value: '3days', label: '3일마다' },
  { value: 'weekly', label: '매주' },
]

export default function Step4Notifications() {
  const { agent, setAgent, connectNotification, disconnectNotification } = useAgentStore()

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-1">알림 설정</h2>
      <p className="text-sm text-gray-500 mb-6">
        수집된 논문을 받을 채널을 연결하세요. 선택사항입니다.
      </p>

      {/* Channels */}
      <div className="space-y-3 mb-8">
        {CHANNELS.map((channel) => {
          const state = agent.notifications[channel.id]
          return (
            <div
              key={channel.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                state.connected
                  ? 'border-green-200 bg-green-50/50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={state.connected ? 'text-green-600' : 'text-gray-400'}>
                  {channel.icon}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{channel.label}</p>
                  {state.connected && (
                    <p className="text-xs text-green-600 mt-0.5">연결됨</p>
                  )}
                </div>
              </div>

              {state.connected ? (
                <button
                  onClick={() => disconnectNotification(channel.id)}
                  className="px-3 py-1.5 text-xs rounded-md border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 transition-colors"
                >
                  해제
                </button>
              ) : (
                <button
                  onClick={() => connectNotification(channel.id)}
                  className="px-3 py-1.5 text-xs rounded-md bg-[#b85c6e] text-white font-medium hover:bg-[#a04e5f] transition-colors"
                >
                  연결
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Frequency */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">수집 주기</label>
        <div className="flex gap-2">
          {FREQUENCIES.map((freq) => (
            <button
              key={freq.value}
              onClick={() => setAgent({ frequency: freq.value })}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                agent.frequency === freq.value
                  ? 'border-[#b85c6e] bg-[#b85c6e]/5 text-[#b85c6e] font-medium'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {freq.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
