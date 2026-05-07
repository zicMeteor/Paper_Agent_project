import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Settings2,
  Activity,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/dashboard',    icon: LayoutDashboard, label: '대시보드' },
  { to: '/agent',        icon: Settings2,       label: '에이전트' },
  { to: '/agent/status', icon: Activity,        label: '에이전트 현황' },
  { to: '/profile',      icon: User,            label: '내 정보' },
]

export default function Sidebar({ isOpen, onToggle }) {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('ppa_logged_in')
    navigate('/login')
  }

  return (
    <aside
      className="fixed left-0 top-0 z-30 flex h-screen flex-col transition-[width] duration-200"
      style={{
        width: isOpen ? 'var(--sidebar-width)' : 'var(--sidebar-width-collapsed)',
        background: 'var(--bg-card)',
        borderRight: 'var(--border-width) solid var(--border)',
        overflow: 'hidden',
      }}
    >
      {/* 로고 + 토글 */}
      <div
        className="flex shrink-0 items-center px-3"
        style={{
          justifyContent: isOpen ? 'space-between' : 'center',
          height: 'var(--topbar-height)',
          borderBottom: 'var(--border-width) solid var(--border)',
        }}
      >
        {isOpen && (
          <span
            className="text-sm font-medium"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          >
            PPA
          </span>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded transition-colors duration-150"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          title={isOpen ? '사이드바 닫기' : '사이드바 열기'}
        >
          {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {/* 메인 네비게이션 */}
      <nav className="flex-1 space-y-0.5 px-2 py-3">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className="flex items-center rounded-lg py-2 text-sm transition-all duration-150"
            style={({ isActive }) => ({
              background: isActive ? 'var(--bg-secondary)' : 'transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: isActive ? '500' : '400',
              gap: '10px',
              paddingLeft: isOpen ? '12px' : '0',
              paddingRight: isOpen ? '12px' : '0',
              justifyContent: isOpen ? 'flex-start' : 'center',
            })}
            title={!isOpen ? label : undefined}
          >
            <Icon size={16} strokeWidth={1.75} />
            {isOpen && label}
          </NavLink>
        ))}
      </nav>

      {/* 로그아웃 */}
      <div
        className="px-2 pb-3"
        style={{ borderTop: 'var(--border-width) solid var(--border)', paddingTop: '8px' }}
      >
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center rounded-lg py-2 text-sm transition-colors duration-150"
          style={{
            gap: '10px',
            color: 'var(--text-secondary)',
            paddingLeft: isOpen ? '12px' : '0',
            paddingRight: isOpen ? '12px' : '0',
            justifyContent: isOpen ? 'flex-start' : 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--status-error)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          title={!isOpen ? '로그아웃' : undefined}
        >
          <LogOut size={16} strokeWidth={1.75} />
          {isOpen && '로그아웃'}
        </button>
      </div>
    </aside>
  )
}
