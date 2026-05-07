import { useNavigate } from 'react-router-dom'
import { User, Mail, Calendar, LogOut } from 'lucide-react'

// 백엔드 연결 시 이 데이터는 /auth/me API 응답으로 대체됩니다
const MOCK_USER = {
  name:      '유저이름',
  email:     '123@gmail.com',
  joinedAt:  '2024년 1월',
  provider:  'Google',
}

export default function ProfilePage() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('ppa_logged_in')
    navigate('/login')
  }

  return (
    <main className="flex-1 p-4">
      <div className="animate-fade-up mx-auto max-w-sm space-y-3">

        {/* 프로필 카드 */}
        <div
          className="rounded-xl p-5 text-center"
          style={{ background: 'var(--bg-card)', border: 'var(--border-width) solid var(--border)' }}
        >
          {/* Avatar */}
          <div
            className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full text-xl font-medium text-white"
            style={{ background: 'var(--accent)' }}
          >
            {MOCK_USER.name.charAt(0)}
          </div>
          <p className="text-base font-medium" style={{ letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
            {MOCK_USER.name}
          </p>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            {MOCK_USER.email}
          </p>
        </div>

        {/* 계정 정보 */}
        <div
          className="overflow-hidden rounded-xl"
          style={{ background: 'var(--bg-card)', border: 'var(--border-width) solid var(--border)' }}
        >
          <div
            className="px-4 py-3"
            style={{ borderBottom: 'var(--border-width) solid var(--border)' }}
          >
            <h2 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>계정 정보</h2>
          </div>

          {[
            { icon: User,     label: '이름',      value: MOCK_USER.name },
            { icon: Mail,     label: '이메일',    value: MOCK_USER.email },
            { icon: Calendar, label: '가입일',    value: MOCK_USER.joinedAt },
          ].map(({ icon: Icon, label, value }, i) => (
            <div
              key={label}
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderTop: i === 0 ? 'none' : 'var(--border-width) solid var(--border)' }}
            >
              <Icon size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <span className="w-16 shrink-0 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                {label}
              </span>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* 연동 정보 */}
        <div
          className="rounded-xl px-4 py-3"
          style={{ background: 'var(--bg-card)', border: 'var(--border-width) solid var(--border)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              {/* P3-3: MOCK_USER.provider 활용 (백엔드 연결 시 자동으로 올바른 provider 표시) */}
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{MOCK_USER.provider} 계정 연동</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{MOCK_USER.email}</p>
            </div>
            <span
              className="rounded-full px-2.5 py-1 text-xs font-medium"
              style={{ background: 'var(--status-active-bg)', color: 'var(--status-active)' }}
            >
              연결됨
            </span>
          </div>
        </div>

        {/* 로그아웃 */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-colors"
          style={{
            background: 'var(--bg-card)',
            border: 'var(--border-width) solid var(--border)',
            color: 'var(--status-error)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-card)')}
        >
          <LogOut size={14} />
          로그아웃
        </button>
      </div>
    </main>
  )
}
