import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function LoadingPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const message  = params.get('message') || '논문 요약하러 가는중'
  const next     = params.get('next') || '/dashboard'

  useEffect(() => {
    const t = window.setTimeout(() => navigate(next, { replace: true }), 3000)
    return () => window.clearTimeout(t)
  }, [navigate, next])

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: 'var(--bg-dark)' }}
    >
      <div className="animate-fade-up text-center">
        {/* Spinner */}
        <div className="mx-auto mb-8 h-10 w-10">
          <svg className="animate-spin" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
            <path
              d="M20 4 a16 16 0 0 1 16 16"
              stroke="var(--accent)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p
          className="text-xl font-medium"
          style={{ color: 'var(--text-on-dark)', letterSpacing: '-0.01em' }}
        >
          {message}
        </p>
        <p className="mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
          잠시만 기다려주세요
        </p>
      </div>
    </div>
  )
}
