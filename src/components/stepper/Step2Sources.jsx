import { useAgentStore } from '../../store/agentStore'

const AVAILABLE_SOURCES = [
  { id: 'arxiv', label: 'arXiv', description: '물리·수학·CS 프리프린트' },
  { id: 'semantic-scholar', label: 'Semantic Scholar', description: 'AI 기반 학술 검색' },
  { id: 'pubmed', label: 'PubMed', description: '의생명 분야 논문' },
]

export default function Step2Sources() {
  const { agent, setAgent } = useAgentStore()

  function toggleSource(sourceId) {
    const current = agent.sources
    const next = current.includes(sourceId)
      ? current.filter((s) => s !== sourceId)
      : [...current, sourceId]
    setAgent({ sources: next })
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-1">수집 소스</h2>
      <p className="text-sm text-gray-500 mb-6">
        논문을 수집할 소스를 선택하세요. 최소 1개 이상 필요합니다.
      </p>

      <div className="space-y-3">
        {AVAILABLE_SOURCES.map((source) => {
          const selected = agent.sources.includes(source.id)
          return (
            <button
              key={source.id}
              onClick={() => toggleSource(source.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                selected
                  ? 'border-[#b85c6e] bg-[#b85c6e]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                  selected ? 'border-[#b85c6e] bg-[#b85c6e]' : 'border-gray-300'
                }`}
              >
                {selected && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${selected ? 'text-gray-900' : 'text-gray-700'}`}>
                  {source.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{source.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
