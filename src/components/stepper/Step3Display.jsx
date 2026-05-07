import { useAgentStore } from '../../store/agentStore'

const LANGUAGES = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: '영어' },
  { value: 'all', label: '전체' },
]

const SUMMARY_LENGTHS = [
  { value: 'short', label: '짧게', desc: '1~2문장 핵심만' },
  { value: 'medium', label: '보통', desc: '3~5문장 요약' },
  { value: 'full', label: '상세', desc: '전체 구조 포함' },
]

const COLLECT_COUNTS = [1, 3, 5, 10]

export default function Step3Display() {
  const { agent, setAgent } = useAgentStore()

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-1">표시 설정</h2>
      <p className="text-sm text-gray-500 mb-6">
        요약 언어, 길이, 수집 수를 설정하세요. 기본값이 적용되어 있습니다.
      </p>

      {/* Language */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-2">요약 언어</label>
        <div className="flex gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              onClick={() => setAgent({ language: lang.value })}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                agent.language === lang.value
                  ? 'border-[#b85c6e] bg-[#b85c6e]/5 text-[#b85c6e] font-medium'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary length */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-2">요약 길이</label>
        <div className="flex gap-2">
          {SUMMARY_LENGTHS.map((len) => (
            <button
              key={len.value}
              onClick={() => setAgent({ summaryLength: len.value })}
              className={`flex-1 px-3 py-2.5 text-left rounded-lg border transition-colors ${
                agent.summaryLength === len.value
                  ? 'border-[#b85c6e] bg-[#b85c6e]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className={`text-sm font-medium ${agent.summaryLength === len.value ? 'text-[#b85c6e]' : 'text-gray-700'}`}>
                {len.label}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{len.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Collect count */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">회당 수집 수</label>
        <div className="flex gap-2">
          {COLLECT_COUNTS.map((count) => (
            <button
              key={count}
              onClick={() => setAgent({ collectCount: count })}
              className={`w-14 h-10 text-sm rounded-lg border transition-colors ${
                agent.collectCount === count
                  ? 'border-[#b85c6e] bg-[#b85c6e]/5 text-[#b85c6e] font-medium'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {count}편
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
