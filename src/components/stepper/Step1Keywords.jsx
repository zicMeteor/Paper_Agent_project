import { useState } from 'react'
import { useAgentStore } from '../../store/agentStore'

const MAX_KEYWORDS = 5

export default function Step1Keywords() {
  const { agent, setAgent } = useAgentStore()
  const [input, setInput] = useState('')

  function addKeyword(e) {
    e.preventDefault()
    const keyword = input.trim().toLowerCase()
    if (!keyword) return
    if (agent.keywords.length >= MAX_KEYWORDS) return
    if (agent.keywords.includes(keyword)) return

    setAgent({ keywords: [...agent.keywords, keyword] })
    setInput('')
  }

  function removeKeyword(target) {
    setAgent({ keywords: agent.keywords.filter((k) => k !== target) })
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-1">수집 키워드</h2>
      <p className="text-sm text-gray-500 mb-6">
        관심 있는 논문 키워드를 추가하세요. 최대 {MAX_KEYWORDS}개까지 가능합니다.
      </p>

      <form onSubmit={addKeyword} className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="예: transformer, reinforcement learning"
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#b85c6e] focus:ring-1 focus:ring-[#b85c6e]/20 transition-colors"
        />
        <button
          type="submit"
          disabled={agent.keywords.length >= MAX_KEYWORDS}
          className="px-4 py-2 text-sm rounded-lg bg-[#b85c6e] text-white font-medium hover:bg-[#a04e5f] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          추가
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {agent.keywords.map((keyword) => (
          <span
            key={keyword}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm bg-[#b85c6e]/10 text-[#b85c6e]"
          >
            {keyword}
            <button
              onClick={() => removeKeyword(keyword)}
              className="ml-1 text-[#b85c6e]/60 hover:text-[#b85c6e] transition-colors"
            >
              &times;
            </button>
          </span>
        ))}
      </div>

      {agent.keywords.length === 0 && (
        <p className="mt-4 text-sm text-gray-400">아직 키워드가 없습니다.</p>
      )}
    </div>
  )
}
