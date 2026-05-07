import { Link, useSearchParams, useLocation } from 'react-router-dom'
import { useAgentStore } from '../../store/agentStore'
import { getAgentStatus } from '../../utils/agentStatus'

const STATUS = {
  unset:  { label: '미설정',   dot: 'var(--status-neutral-dot)', bg: 'var(--status-neutral-bg)', text: 'var(--status-neutral)' },
  active: { label: '활성화',   dot: 'var(--status-active-dot)',  bg: 'var(--status-active-bg)',  text: 'var(--status-active)' },
  paused: { label: '일시정지', dot: 'var(--status-error-dot)',   bg: 'var(--status-error-bg)',   text: 'var(--status-error)' },
}

// 대시보드가 아닌 라우트의 페이지 제목
const PAGE_TITLES = {
  '/agent':        '에이전트 설정',
  '/agent/status': '에이전트 현황',
  '/profile':      '내 정보',
}

export default function Topbar() {
  const [params]   = useSearchParams()
  const location   = useLocation()
  const { agent }  = useAgentStore()
  const status     = getAgentStatus(agent)
  const tab        = params.get('tab') || 'total'
  const cfg        = STATUS[status]
  const hasDiscord = agent.notifications.discord.connected
  const hasSlack   = agent.notifications.slack.connected

  const isDashboard  = location.pathname === '/dashboard'
  const pageTitle    = PAGE_TITLES[location.pathname]

  return (
    <header
      className="sticky top-0 z-20 flex shrink-0 items-center justify-between backdrop-blur-sm"
      style={{
        height: 'var(--topbar-height)',
        borderBottom: 'var(--border-width) solid var(--border)',
        // P1-1: 두 style 병합 (이전 버전은 두 개의 style prop으로 분리돼 있어 첫 번째가 무시됨)
        background: 'color-mix(in srgb, var(--bg-card) 95%, transparent)',
      }}
    >
      {/* P1-3: 대시보드에서만 탭 표시, 다른 페이지에서는 제목 표시 */}
      {isDashboard ? (
        <nav className="flex h-full items-stretch">
          {[
            { to: '/dashboard',             key: 'total',   label: '통합' },
            { to: '/dashboard?tab=popular', key: 'popular', label: '인기/신규' },
            { to: '/dashboard?tab=archive', key: 'archive', label: '내보관함' },
          ].map(({ to, key, label }) => (
            <Link
              key={key}
              to={to}
              className="flex items-center px-4 text-sm font-medium transition-colors duration-150"
              style={{
                color: tab === key ? 'var(--text-primary)' : 'var(--text-muted)',
                borderBottom: tab === key
                  ? '2px solid var(--text-primary)'
                  : '2px solid transparent',
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
      ) : (
        <div className="flex h-full items-center px-4">
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {pageTitle}
          </span>
        </div>
      )}

      {/* Agent status pill */}
      <div className="group relative mr-4">
        <button
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-all duration-150"
          style={{ background: cfg.bg, color: cfg.text }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: cfg.dot }} />
          에이전트 {cfg.label}
        </button>

        {/* Hover popover — §13 elevated card: shadow 허용 */}
        <div
          className="pointer-events-none absolute right-0 top-full mt-2 w-56 rounded-xl p-4 opacity-0 shadow-lg transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100"
          style={{
            // P1-2: bg-white → var(--bg-card) (§4/§13: 순수 흰색 금지)
            background: 'var(--bg-card)',
            border: 'var(--border-width) solid var(--border)',
          }}
        >
          <p className="mb-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            에이전트 {cfg.label}
          </p>
          {status === 'unset'  && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>아직 설정되지 않았습니다.</p>}
          {status === 'active' && <p className="text-xs" style={{ color: 'var(--status-active)' }}>수집과 알림이 정상 작동 중입니다.</p>}
          {status === 'paused' && <p className="text-xs" style={{ color: 'var(--status-error)' }}>수집이 중단된 상태입니다.</p>}

          {status !== 'unset' && (
            <div className="mt-3 space-y-2 pt-3" style={{ borderTop: 'var(--border-width) solid var(--border)' }}>
              <StatusRow label="Discord" active={hasDiscord} />
              <StatusRow label="Slack"   active={hasSlack} />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function StatusRow({ label, active }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span className="flex items-center gap-1.5">
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: active ? 'var(--status-active-dot)' : 'var(--status-error-dot)' }}
        />
        <span className="text-xs font-medium" style={{ color: active ? 'var(--status-active)' : 'var(--status-error)' }}>
          {active ? '연결됨' : '미연결'}
        </span>
      </span>
    </div>
  )
}
