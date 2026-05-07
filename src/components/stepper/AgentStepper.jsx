import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAgentStore } from '../../store/agentStore'
import { X, Check } from 'lucide-react'

const MAX_KEYWORDS = 5
const steps = ['키워드', '소스', '표시항목', '알림', '요약']

// 백엔드 연결 시 API로 대체될 소스 목록
const ALL_SOURCES = [
  { id: 'arxiv',    label: 'arXiv',          region: '해외' },
  { id: 'crossref', label: 'Crossref',        region: '해외' },
  { id: 'semantic', label: 'Semantic Scholar', region: '해외' },
  { id: 'core',     label: 'CORE',            region: '해외' },
]

// 추천 키워드 (백엔드 연결 시 인기 키워드 API로 대체)
const SUGGESTED_KEYWORDS = [
  'LLM', 'RAG', 'Transformer', 'Computer Vision',
  'Diffusion Model', 'Reinforcement Learning', 'NLP', 'GNN',
]

// summaryLength별 미리보기 텍스트 (백엔드 실제 요약 반환 전 mock)
const SUMMARY_PREVIEW = {
  short:  '트랜스포머의 어텐션 메커니즘이 자연어 처리 성능을 획기적으로 향상시킨 연구입니다.',
  medium: '트랜스포머 기반 어텐션 메커니즘이 자연어 처리 성능을 기존 RNN 대비 크게 향상시켰습니다. 멀티헤드 어텐션과 포지셔널 인코딩을 결합해 병렬 처리 효율을 극대화했으며, GPT·BERT 등 대형 언어모델의 토대가 됩니다.',
  full:   '트랜스포머는 순환 신경망(RNN)의 한계를 극복하기 위해 제안된 구조로, 셀프-어텐션 메커니즘을 통해 입력 시퀀스 전체를 동시에 처리합니다. 멀티헤드 어텐션은 다양한 표현 공간에서 정보를 병렬로 집계하며, 포지셔널 인코딩으로 순서 정보를 보완합니다. 이 설계는 학습 병렬화를 가능하게 해 훈련 속도를 대폭 높였고, GPT·BERT·T5 등 후속 대형 언어모델의 표준 아키텍처로 자리잡았습니다. 번역·요약·질의응답 등 거의 모든 NLP 태스크에서 기존 SOTA를 경신하며 딥러닝 패러다임을 전환한 역작입니다.',
}

export default function AgentStepper() {
  const navigate = useNavigate()
  const { agent, setAgent, connectNotification, disconnectNotification, testNotification } = useAgentStore()
  const [step, setStep] = useState(1)
  const [keywordInput, setKeywordInput] = useState('')
  const [error, setError] = useState('')
  const [sourceFilter, setSourceFilter] = useState('전체')   // step2 필터 상태

  const hasNotification = agent.notifications.discord.connected || agent.notifications.slack.connected

  const summaryLengthLabel = useMemo(() => {
    if (agent.summaryLength === 'short') return '초록만'
    if (agent.summaryLength === 'full') return '전체'
    return '본문'
  }, [agent.summaryLength])

  function addKeyword(event) {
    event.preventDefault()
    const next = keywordInput.trim()
    if (!next) return
    if (agent.keywords.length >= MAX_KEYWORDS) {
      setError('최대 5개까지 추가 가능합니다.')
      return
    }
    if (!agent.keywords.includes(next)) {
      setAgent({ keywords: [...agent.keywords, next] })
    }
    setKeywordInput('')
    setError('')
  }

  function addSuggestedKeyword(keyword) {
    if (agent.keywords.length >= MAX_KEYWORDS) {
      setError('최대 5개까지 추가 가능합니다.')
      return
    }
    if (!agent.keywords.includes(keyword)) {
      setAgent({ keywords: [...agent.keywords, keyword] })
    }
    setError('')
  }

  function removeKeyword(keyword) {
    setAgent({ keywords: agent.keywords.filter((item) => item !== keyword) })
    setError('')
  }

  function toggleSource(sourceId) {
    const next = agent.sources.includes(sourceId)
      ? agent.sources.filter((item) => item !== sourceId)
      : [...agent.sources, sourceId]
    setAgent({ sources: next })
  }

  // step2 필터에 따라 표시할 소스 목록
  const visibleSources = sourceFilter === '전체'
    ? ALL_SOURCES
    : ALL_SOURCES.filter((s) => s.region === sourceFilter)

  function validate() {
    if (step === 1 && agent.keywords.length === 0) {
      setError('키워드를 최소 1개 이상 추가해주세요.')
      return false
    }
    if (step === 2 && agent.sources.length === 0) {
      setError('수집 소스를 최소 1개 이상 선택해주세요.')
      return false
    }
    setError('')
    return true
  }

  function next() {
    if (!validate()) return
    setStep((v) => Math.min(v + 1, 5))
  }

  function back() {
    setError('')
    setStep((v) => Math.max(v - 1, 1))
  }

  function jumpTo(targetStep) {
    setError('')
    setStep(targetStep)
  }

  function save() {
    const configured = agent.keywords.length > 0 && agent.sources.length > 0
    setAgent({
      isConfigured: configured,
      isActive: configured && hasNotification,
    })
    navigate('/loading?next=/dashboard&message=에이전트 설정이 완료됐습니다.')
  }

  return (
    <div
      className="animate-fade-up mx-auto w-full max-w-4xl rounded-xl"
      style={{ background: 'var(--bg-card)', border: 'var(--border-width) solid var(--border)' }}
    >
      {/* Header — step indicator */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: 'var(--border-width) solid var(--border)' }}
      >
        <div className="flex items-center gap-1.5">
          {steps.map((label, index) => {
            const num     = index + 1
            const current = num === step
            const done    = num < step
            return (
              <span
                key={label}
                className="flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium"
                style={{
                  background: current
                    ? 'var(--bg-dark)'
                    : done
                      ? 'var(--bg-secondary)'
                      : 'transparent',
                  color: current
                    ? 'var(--text-on-dark)'
                    : done
                      ? 'var(--text-secondary)'
                      : 'var(--text-muted)',
                  border: current || done ? 'none' : 'var(--border-width) solid var(--border)',
                }}
              >
                {done ? <Check size={10} strokeWidth={2.5} /> : <span>{num}.</span>}
                {label}
              </span>
            )
          })}
        </div>
        <span
          className="rounded px-2 py-1 text-xs tabular-nums"
          style={{ background: 'var(--bg-dark)', color: 'var(--text-on-dark)' }}
        >
          {step} / 5
        </span>
      </div>

      {/* Body */}
      <div className="px-5 py-4">

        {/* ── Step 1: 키워드 ── */}
        {step === 1 && (
          <section className="animate-fade-up">
            <p className="mb-0.5 text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>step 1</p>
            <p className="mb-4 text-lg font-normal" style={{ letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              어떤 논문을 받을지 설정합니다
            </p>

            {/* 키워드 입력 */}
            <form onSubmit={addKeyword} className="mb-2">
              <input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="키워드 입력 후 Enter"
                className="w-full max-w-lg rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                style={{
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  background: 'var(--bg-primary)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
            </form>

            <p className="mb-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              키워드 ({agent.keywords.length}/{MAX_KEYWORDS}) · Enter로 추가
            </p>

            {/* 등록된 키워드 */}
            <div className="mb-4 flex flex-wrap gap-1.5">
              {agent.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium"
                  style={{ background: 'var(--bg-dark)', color: 'var(--text-on-dark)' }}
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    className="flex items-center opacity-50 hover:opacity-100"
                  >
                    <X size={10} strokeWidth={2.5} />
                  </button>
                </span>
              ))}
              {agent.keywords.length === 0 && (
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  아직 추가된 키워드가 없습니다.
                </span>
              )}
            </div>

            {/* 추천 키워드 */}
            <div>
              <p className="mb-1.5 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                추천 키워드
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_KEYWORDS.map((kw) => {
                  const already = agent.keywords.includes(kw)
                  return (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => !already && addSuggestedKeyword(kw)}
                      disabled={already}
                      className="rounded px-2.5 py-1 text-xs font-medium transition-colors"
                      style={{
                        background: already ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                        color: already ? 'var(--text-muted)' : 'var(--text-secondary)',
                        border: 'var(--border-width) solid var(--border)',
                        cursor: already ? 'default' : 'pointer',
                        opacity: already ? 0.5 : 1,
                      }}
                    >
                      {already ? <Check size={9} className="mr-1 inline" strokeWidth={2.5} /> : '+ '}
                      {kw}
                    </button>
                  )
                })}
              </div>
            </div>

            <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>최대 5개</p>
          </section>
        )}

        {/* ── Step 2: 소스 ── */}
        {step === 2 && (
          <section className="animate-fade-up">
            <p className="mb-0.5 text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>step 2</p>
            <p className="mb-4 text-lg font-normal" style={{ letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              어디서 수집할지 선택합니다
            </p>

            {/* 전체/국내/해외 필터 */}
            <div className="mb-3 flex gap-1.5">
              {['전체', '국내', '해외'].map((label) => (
                <button
                  key={label}
                  onClick={() => setSourceFilter(label)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                  style={{
                    background: sourceFilter === label ? 'var(--bg-dark)' : 'var(--bg-card)',
                    color: sourceFilter === label ? 'var(--text-on-dark)' : 'var(--text-secondary)',
                    border: sourceFilter === label ? 'none' : 'var(--border-width) solid var(--border)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 국내 소스 (준비중) */}
            {(sourceFilter === '전체' || sourceFilter === '국내') && (
              <div className="mb-4">
                <p className="mb-1.5 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>국내</p>
                <span
                  className="inline-block rounded px-2.5 py-1.5 text-xs"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
                >
                  준비중
                </span>
              </div>
            )}

            {/* 해외 소스 */}
            {(sourceFilter === '전체' || sourceFilter === '해외') && (
              <div className="mb-4">
                <p className="mb-1.5 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>해외</p>
                <div className="flex flex-wrap gap-1.5">
                  {visibleSources.map((source) => {
                    const active = agent.sources.includes(source.id)
                    return (
                      <button
                        key={source.id}
                        onClick={() => toggleSource(source.id)}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                        style={{
                          background: active ? 'var(--bg-dark)' : 'var(--bg-card)',
                          color: active ? 'var(--text-on-dark)' : 'var(--text-secondary)',
                          border: active ? 'none' : 'var(--border-width) solid var(--border)',
                        }}
                      >
                        {source.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 논문 언어 */}
            <p className="mb-1.5 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>논문 언어</p>
            <div className="flex gap-1.5">
              {[['ko', '한국어'], ['en', '영어'], ['all', '전체']].map(([value, label]) => {
                const active = agent.language === value
                return (
                  <button
                    key={value}
                    onClick={() => setAgent({ language: value })}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                    style={{
                      background: active ? 'var(--bg-dark)' : 'var(--bg-card)',
                      color: active ? 'var(--text-on-dark)' : 'var(--text-secondary)',
                      border: active ? 'none' : 'var(--border-width) solid var(--border)',
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* ── Step 3: 표시항목 ── */}
        {step === 3 && (
          <section className="animate-fade-up">
            <p className="mb-0.5 text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>step 3</p>
            <p className="mb-4 text-lg font-normal" style={{ letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              요약 길이와 방식을 정합니다
            </p>

            <p className="mb-1.5 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>요약 범위</p>
            <div className="mb-4 flex gap-1.5">
              {[['short', '초록만', '2줄'], ['medium', '본문', '4~5줄'], ['full', '전체', '5줄+']].map(([value, label, hint]) => {
                const active = agent.summaryLength === value
                return (
                  <button
                    key={value}
                    onClick={() => setAgent({ summaryLength: value })}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                    style={{
                      background: active ? 'var(--bg-dark)' : 'var(--bg-card)',
                      color: active ? 'var(--text-on-dark)' : 'var(--text-secondary)',
                      border: active ? 'none' : 'var(--border-width) solid var(--border)',
                    }}
                  >
                    {label}
                    <span
                      className="ml-1"
                      style={{ opacity: 0.6, fontSize: '10px' }}
                    >
                      ({hint})
                    </span>
                  </button>
                )
              })}
            </div>

            <p className="mb-3 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              기본 포함 항목: 논문 제목 · 저자 · 발행일 · 키워드 태그 · 저널명 · 논문요약 · 원문링크 · 수집날짜
            </p>

            {/* 미리보기 — summaryLength에 따라 요약 텍스트 변경 */}
            <div
              className="rounded-lg p-3"
              style={{ background: 'var(--bg-secondary)', border: 'var(--border-width) solid var(--border)' }}
            >
              <p className="mb-2 text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                미리보기 — 알림 메시지 샘플
              </p>
              <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                Attention Is All You Need: A Survey on Transformer Architectures
              </p>
              <p className="mt-0.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                Vaswani et al. · 2024.04.21 · LLM · Transformer · NEW
              </p>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {SUMMARY_PREVIEW[agent.summaryLength]}
              </p>
              <p className="mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                인용 1,204 · 수집 2024.04.22 · arXiv ↗
              </p>
              <p className="mt-1 text-xs font-medium" style={{ color: 'var(--accent)' }}>
                요약범위: {summaryLengthLabel}
              </p>
            </div>
          </section>
        )}

        {/* ── Step 4: 알림 ── */}
        {step === 4 && (
          <section className="animate-fade-up">
            <p className="mb-0.5 text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>step 4</p>
            <p className="mb-4 text-lg font-normal" style={{ letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              어디로 받을지 정합니다
            </p>

            {/* 연동 가이드 */}
            <div
              className="mb-4 rounded-lg p-3"
              style={{ background: 'var(--bg-secondary)', border: 'var(--border-width) solid var(--border)' }}
            >
              <p className="mb-2 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>연동 방법</p>
              <ol className="space-y-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                {[
                  <>아래 <strong>연결하기</strong> 버튼 클릭</>,
                  <>OAuth 창에서 <strong>허용(Authorize)</strong> 클릭</>,
                  <><strong>테스트 알림 전송</strong>으로 수신 확인</>,
                ].map((content, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span
                      className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded text-white"
                      style={{ background: 'var(--bg-dark)', fontSize: '10px', fontWeight: 600 }}
                    >
                      {i + 1}
                    </span>
                    {content}
                  </li>
                ))}
              </ol>
              {/* TODO: 백엔드 연결 후 이 안내 문구 제거 */}
              <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                현재는 mock 동작 — 백엔드 구현 후 활성화됩니다.
              </p>
            </div>

            {/* 채널 카드 */}
            <div className="mb-4 space-y-2">
              {[
                { id: 'discord', label: 'Discord', desc: '서버 채널로 알림을 받습니다.' },
                { id: 'slack',   label: 'Slack',   desc: '워크스페이스 채널로 알림을 받습니다.' },
              ].map(({ id, label, desc }) => {
                const ch = agent.notifications[id]
                return (
                  <div
                    key={id}
                    className="rounded-lg p-3 transition-colors"
                    style={{
                      border: ch.connected
                        ? '1px solid rgba(34,197,94,0.4)'
                        : 'var(--border-width) solid var(--border)',
                      background: ch.connected ? 'rgba(34,197,94,0.04)' : 'var(--bg-card)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                        {ch.connected && ch.lastTestStatus === 'success' && (
                          <p className="mt-1 text-xs font-medium" style={{ color: 'var(--status-active)' }}>
                            ✓ 테스트 알림 전송됨
                          </p>
                        )}
                        {ch.connected && ch.lastTestStatus === 'fail' && (
                          <p className="mt-1 text-xs font-medium" style={{ color: 'var(--status-error)' }}>
                            전송 오류 — 다시 시도해주세요.
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        {/* TODO: 백엔드 연결 시 connectNotification(id) → OAuth 팝업 트리거로 교체 */}
                        <button
                          onClick={() => connectNotification(id)}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                          style={
                            ch.connected
                              ? { background: 'var(--status-active)', color: '#fff' }
                              : { background: 'var(--bg-card)', color: 'var(--text-secondary)', border: 'var(--border-width) solid var(--border)' }
                          }
                        >
                          {ch.connected ? '연결됨 ✓' : '연결하기'}
                        </button>
                        {ch.connected && (
                          <button
                            onClick={() => testNotification(id)}
                            className="text-xs font-medium underline transition-colors"
                            style={{ color: 'var(--text-muted)' }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                          >
                            테스트 알림 전송
                          </button>
                        )}
                        {ch.connected && (
                          <button
                            onClick={() => disconnectNotification(id)}
                            className="text-xs underline transition-colors"
                            style={{ color: 'var(--status-error)', opacity: 0.6 }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
                          >
                            연결 끊기
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 수집 옵션 */}
            <div className="grid grid-cols-2 gap-3">
              <OptionGroup
                title="수집 주기"
                items={[['daily', '매일'], ['3days', '3일'], ['weekly', '주간']]}
                value={agent.frequency}
                onSelect={(v) => setAgent({ frequency: v })}
              />
              <div>
                <OptionGroup
                  title="수집 수"
                  items={[1, 3, 5, 10].map((v) => [v, String(v)])}
                  value={agent.collectCount}
                  onSelect={(v) => setAgent({ collectCount: v })}
                />
                <p className="mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>기본값: 1개</p>
              </div>
            </div>
          </section>
        )}

        {/* ── Step 5: 요약 ── */}
        {step === 5 && (
          <section className="animate-fade-up">
            <p className="mb-0.5 text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>step 5</p>
            <p className="mb-4 text-lg font-normal" style={{ letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              설정 요약
            </p>
            <div className="rounded-lg" style={{ border: 'var(--border-width) solid var(--border)', overflow: 'hidden' }}>
              {[
                { label: '키워드',   value: agent.keywords.join(', ') || '—',                         edit: 1 },
                // P2-4: 내부 ID → 표시명으로 변환 (예: 'semantic' → 'Semantic Scholar')
                { label: '사이트',   value: agent.sources.map((id) => ALL_SOURCES.find((s) => s.id === id)?.label ?? id).join(', ') || '—', edit: 2 },
                { label: '언어',     value: agent.language === 'ko' ? '한국어' : agent.language === 'en' ? '영어' : '전체', edit: 2 },
                { label: '알림',     value: [agent.notifications.discord.connected && 'Discord', agent.notifications.slack.connected && 'Slack'].filter(Boolean).join(' · ') + (hasNotification ? ' 연결됨' : '') || '미연결', edit: 4 },
                { label: '수집 주기', value: agent.frequency === 'daily' ? '매일' : agent.frequency === '3days' ? '3일' : '주간', edit: 4 },
                { label: '수집 수',  value: `${agent.collectCount}개`,                                 edit: 4 },
                { label: '요약 범위', value: summaryLengthLabel,                                       edit: 3 },
              ].map(({ label, value, edit }, i) => (
                <div
                  key={label}
                  className="flex items-center gap-3 px-3 py-2.5"
                  style={{ borderTop: i === 0 ? 'none' : 'var(--border-width) solid var(--border)' }}
                >
                  <span className="w-20 shrink-0 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {label}
                  </span>
                  <span className="flex-1 text-sm" style={{ color: 'var(--text-primary)' }}>{value}</span>
                  <button
                    onClick={() => jumpTo(edit)}
                    className="text-xs font-medium underline transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    수정
                  </button>
                </div>
              ))}
            </div>
            {!hasNotification && (
              <p className="mt-3 text-xs" style={{ color: 'var(--status-warning)' }}>
                알림이 연결되지 않았습니다. 저장 시 에이전트가 일시정지 상태가 됩니다.
              </p>
            )}
          </section>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mx-5 mb-1">
          <p className="text-xs font-medium" style={{ color: 'var(--status-error)' }}>{error}</p>
        </div>
      )}
      {step === 4 && !hasNotification && (
        <div className="mx-5 mb-1">
          <p className="text-xs" style={{ color: 'var(--status-warning)' }}>
            알림이 연결되지 않으면 에이전트가 일시정지 상태가 됩니다.
          </p>
        </div>
      )}

      {/* Footer */}
      <div
        className="flex items-center justify-end gap-2 px-5 py-3"
        style={{ borderTop: 'var(--border-width) solid var(--border)' }}
      >
        {step > 1 && (
          <button
            onClick={back}
            className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
            style={{ border: 'var(--border-width) solid var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            이전
          </button>
        )}
        <button
          onClick={() => navigate('/dashboard')}
          className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
          style={{ border: 'var(--border-width) solid var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          취소
        </button>
        {step < 5 ? (
          <button
            onClick={next}
            className="rounded-lg px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-85"
            style={{ background: 'var(--bg-dark)' }}
          >
            다음
          </button>
        ) : (
          <button
            onClick={save}
            className="rounded-lg px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-85"
            style={{ background: 'var(--accent)' }}
          >
            저장하기
          </button>
        )}
      </div>
    </div>
  )
}

function OptionGroup({ title, items, value, onSelect }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map(([itemValue, label]) => {
          const active = value === itemValue
          return (
            <button
              key={itemValue}
              onClick={() => onSelect(itemValue)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                background: active ? 'var(--bg-dark)' : 'var(--bg-card)',
                color: active ? 'var(--text-on-dark)' : 'var(--text-secondary)',
                border: active ? 'none' : 'var(--border-width) solid var(--border)',
              }}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
