import { Link } from 'react-router-dom'
import { useAgentStore } from '../store/agentStore'
import { getAgentStatus } from '../utils/agentStatus'

// 소스 ID → 표시명 변환 (AgentStepper의 ALL_SOURCES와 동기화)
const SOURCE_LABELS = {
  arxiv:    'arXiv',
  crossref: 'Crossref',
  semantic: 'Semantic Scholar',
  core:     'CORE',
}

// 백엔드 연결 시 이 데이터는 API 응답으로 대체됩니다
const LAST_COLLECTED = '2024.06.10 오전 09:00'

const STATUS_CFG = {
  unset:  { label: '미설정',   text: 'var(--status-neutral)', dot: 'var(--status-neutral-dot)', bg: 'var(--status-neutral-bg)' },
  active: { label: '활성화',   text: 'var(--status-active)',  dot: 'var(--status-active-dot)',  bg: 'var(--status-active-bg)' },
  paused: { label: '일시정지', text: 'var(--status-error)',   dot: 'var(--status-error-dot)',   bg: 'var(--status-error-bg)' },
}

export default function AgentStatusPage() {
  const { agent } = useAgentStore()
  const status = getAgentStatus(agent)
  const cfg = STATUS_CFG[status]

  const hasDiscord = agent.notifications.discord.connected
  const hasSlack   = agent.notifications.slack.connected

  const statusDesc =
    status === 'active'
      ? `수집과 알림이 정상 작동 중입니다. 마지막 수집: ${LAST_COLLECTED}`
      : status === 'paused'
        ? (!hasDiscord && !hasSlack
            ? '알림 채널이 미연결 상태로 수집이 중단되었습니다.'
            : '에이전트가 비활성화 상태입니다.')
        : null  // unset: 인라인 링크를 포함하므로 별도 처리

  const rows = [
    { label: '키워드',   value: agent.keywords.length > 0 ? agent.keywords.join(', ') : '—' },
    { label: '소스',     value: agent.sources.length > 0 ? agent.sources.map((id) => SOURCE_LABELS[id] ?? id).join(', ') : '—' },
    { label: '언어',     value: agent.language === 'ko' ? '한국어' : agent.language === 'en' ? '영어' : '전체' },
    { label: '수집 주기', value: agent.frequency === 'daily' ? '매일' : agent.frequency === '3days' ? '3일마다' : '주간' },
    { label: '수집 수',  value: `${agent.collectCount}개` },
    { label: '요약 범위', value: agent.summaryLength === 'short' ? '초록만' : agent.summaryLength === 'full' ? '전체' : '본문' },
  ]

  return (
    <main className="flex-1 p-4">
      <div className="animate-fade-up mx-auto max-w-2xl space-y-3">

        {/* 상태 카드 — 헤더 + 큰 상태 텍스트 + 설명 */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'var(--bg-card)', border: 'var(--border-width) solid var(--border)' }}
        >
          {/* 카드 헤더 행 */}
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>현재 상태</span>
            <Link
              to="/agent"
              className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                background: 'var(--bg-card)',
                color: 'var(--text-secondary)',
                border: 'var(--border-width) solid var(--border)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              설정 수정
            </Link>
          </div>

          {/* 큰 상태 텍스트 */}
          <p
            className="text-2xl font-medium"
            style={{ letterSpacing: '-0.02em', color: cfg.text, lineHeight: 1.2 }}
          >
            {cfg.label}
          </p>

          {/* 설명 */}
          <p className="mt-1.5 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {status === 'unset' ? (
              <>
                아직 에이전트가 설정되지 않았습니다.{' '}
                <Link to="/agent" className="font-medium underline" style={{ color: 'var(--accent)' }}>
                  지금 설정하기
                </Link>
              </>
            ) : statusDesc}
          </p>
        </div>

        {/* 설정 요약 */}
        {status !== 'unset' && (
          <div
            className="overflow-hidden rounded-xl"
            style={{ background: 'var(--bg-card)', border: 'var(--border-width) solid var(--border)' }}
          >
            <div
              className="px-4 py-3"
              style={{ borderBottom: 'var(--border-width) solid var(--border)' }}
            >
              <h2 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>설정 요약</h2>
            </div>
            {rows.map(({ label, value }, i) => (
              <div
                key={label}
                className="flex items-center gap-3 px-4 py-2.5"
                style={{ borderTop: i === 0 ? 'none' : 'var(--border-width) solid var(--border)' }}
              >
                <span className="w-20 shrink-0 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {label}
                </span>
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* 알림 채널 상태 */}
        {status !== 'unset' && (
          <div
            className="overflow-hidden rounded-xl"
            style={{ background: 'var(--bg-card)', border: 'var(--border-width) solid var(--border)' }}
          >
            <div
              className="px-4 py-3"
              style={{ borderBottom: 'var(--border-width) solid var(--border)' }}
            >
              <h2 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>알림 채널</h2>
            </div>
            {[
              { label: 'Discord', active: hasDiscord },
              { label: 'Slack',   active: hasSlack },
            ].map(({ label, active }, i) => (
              <div
                key={label}
                className="flex items-center justify-between px-4 py-2.5"
                style={{ borderTop: i === 0 ? 'none' : 'var(--border-width) solid var(--border)' }}
              >
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{label}</span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: active ? 'var(--status-active-dot)' : 'var(--status-error-dot)' }}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ color: active ? 'var(--status-active)' : 'var(--status-error)' }}
                  >
                    {active ? '연결됨' : '미연결'}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
