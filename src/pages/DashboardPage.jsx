import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAgentStore } from '../store/agentStore'
import { useBookmarkStore } from '../store/bookmarkStore'
import { getAgentStatus } from '../utils/agentStatus'
import { mockPapers, mockStats } from '../data/mock'
import { ArrowUpRight, ExternalLink, TrendingUp, BookOpen, Bookmark } from 'lucide-react'

// P2-1: 기간별 차트 mock 데이터 — 백엔드 연결 시 API 파라미터로 교체
const TREND_SETS = {
  '주별': {
    data:   mockStats.trend,
    labels: mockStats.trendLabels,
  },
  '월별': {
    data:   [45, 88, 120, 95, 140, 185, 210, 178, 240, 290, 265, 340],
    labels: ['7월', '8월', '9월', '10월', '11월', '12월', '1월', '2월', '3월', '4월', '5월', '6월'],
  },
  '년별': {
    data:   [120, 340, 890, 1248],
    labels: ['2021', '2022', '2023', '2024'],
  },
}

export default function DashboardPage() {
  const [params]   = useSearchParams()
  const tab        = params.get('tab') || 'total'
  const { agent }  = useAgentStore()
  const status     = getAgentStatus(agent)

  if (status === 'unset') return <EmptyState />

  return (
    <main className="flex-1 p-4">
      {tab === 'popular' && <PopularPage />}
      {tab === 'archive' && <ArchivePage />}
      {tab !== 'popular' && tab !== 'archive' && <TotalPage agent={agent} />}
    </main>
  )
}

/* ── Empty state ─────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div
        className="animate-fade-up w-full max-w-sm rounded-2xl p-8 text-center"
        style={{ background: 'var(--bg-card)', border: 'var(--border-width) solid var(--border)' }}
      >
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ background: 'var(--accent-light)' }}
        >
          <BookOpen size={20} style={{ color: 'var(--accent)' }} />
        </div>
        <h2
          className="mb-1.5 text-base font-medium"
          style={{ letterSpacing: '-0.01em', color: 'var(--text-primary)' }}
        >
          아직 수집된 콘텐츠가 없습니다
        </h2>
        <p className="mb-6 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          에이전트를 설정하면 키워드에 맞는 논문을 자동으로 수집합니다.
        </p>
        <Link
          to="/agent"
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-85"
          style={{ background: 'var(--accent)' }}
        >
          에이전트 설정
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  )
}

/* ── Skeleton primitives ─────────────────────────────── */
function SkeletonKpi() {
  return (
    <div
      className="rounded-xl p-3"
      style={{ background: 'var(--bg-card)', border: 'var(--border-width) solid var(--border)' }}
    >
      <div className="skeleton-shimmer mb-2 h-3 w-16 rounded" />
      <div className="skeleton-shimmer mb-1.5 h-6 w-20 rounded" />
      <div className="skeleton-shimmer h-3 w-28 rounded" />
    </div>
  )
}

function SkeletonSection({ height = 100, label = true }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: 'var(--bg-card)', border: 'var(--border-width) solid var(--border)' }}
    >
      {label && <div className="skeleton-shimmer mb-3 h-3.5 w-20 rounded" />}
      <div className="skeleton-shimmer rounded-lg" style={{ height }} />
    </div>
  )
}

function SkeletonPaperRow({ first = false }) {
  return (
    <div
      className="flex items-start gap-3 px-4 py-3"
      style={{ borderTop: first ? 'none' : 'var(--border-width) solid var(--border)' }}
    >
      <div className="flex-1 space-y-1.5">
        <div className="skeleton-shimmer h-3.5 w-3/4 rounded" />
        <div className="skeleton-shimmer h-3 w-1/2 rounded" />
        <div className="skeleton-shimmer h-3 w-1/3 rounded" />
      </div>
    </div>
  )
}

/* ── Total tab ──────────────────────────────────────── */
function TotalPage({ agent }) {
  const [trendPeriod, setTrendPeriod] = useState('주별')
  const [isLoading, setIsLoading]     = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  if (isLoading) {
    return (
      <div className="animate-fade-up space-y-2">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonKpi /><SkeletonKpi /><SkeletonKpi />
        </div>
        <SkeletonSection height={120} />
        <div
          className="overflow-hidden rounded-xl"
          style={{ background: 'var(--bg-card)', border: 'var(--border-width) solid var(--border)' }}
        >
          <div
            className="px-4 py-3"
            style={{ borderBottom: 'var(--border-width) solid var(--border)' }}
          >
            <div className="skeleton-shimmer h-3.5 w-20 rounded" />
          </div>
          {[...Array(5)].map((_, i) => <SkeletonPaperRow key={i} first={i === 0} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2 animate-fade-up">
      {/* KPI row */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          label="총 수집"
          value={mockStats.totalPapers.toLocaleString()}
          caption={`이번주 ${mockStats.weeklyAdded}개 추가`}
        />
        <KpiCard
          label="이번주 신규"
          value={mockStats.weeklyAdded}
          caption={`지난주 대비 ${mockStats.weeklyGrowth}`}
          positive
        />
        <div
          className="rounded-xl p-3 transition-shadow duration-200 hover:shadow-sm"
          style={{ background: 'var(--bg-card)', border: 'var(--border-width) solid var(--border)' }}
        >
          <p className="mb-2 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            인기 키워드 TOP3
            <span className="ml-1.5" style={{ color: 'var(--text-muted)' }}>이번 주</span>
          </p>
          <div className="space-y-1.5">
            {mockStats.topKeywords.map((item, i) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm">
                  <span className="mr-1.5 font-medium" style={{ color: 'var(--accent)' }}>{i + 1}</span>
                  <span style={{ color: 'var(--text-primary)' }}>{item.label}</span>
                </span>
                <span className="text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend chart */}
      <section
        className="rounded-xl p-4 transition-shadow duration-200 hover:shadow-sm"
        style={{ background: 'var(--bg-card)', border: 'var(--border-width) solid var(--border)' }}
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>수집 트렌드</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {trendPeriod === '주별' ? '최근 12주' : trendPeriod === '월별' ? '최근 12개월' : '연도별'} 논문 수집 추이
            </p>
          </div>
          <div className="flex gap-1">
            {['주별', '월별', '년별'].map((l) => (
              <button
                key={l}
                onClick={() => setTrendPeriod(l)}
                className="rounded-lg px-2.5 py-1 text-xs font-medium transition-colors"
                style={{
                  background: trendPeriod === l ? 'var(--bg-dark)' : 'transparent',
                  color: trendPeriod === l ? 'var(--text-on-dark)' : 'var(--text-muted)',
                  border: trendPeriod === l ? 'none' : 'var(--border-width) solid var(--border)',
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <TrendChart period={trendPeriod} />
      </section>

      {/* Latest papers */}
      <section
        className="rounded-xl transition-shadow duration-200 hover:shadow-sm"
        style={{ background: 'var(--bg-card)', border: 'var(--border-width) solid var(--border)' }}
      >
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: 'var(--border-width) solid var(--border)' }}
        >
          <div>
            <h2 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>최신 논문</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              날짜 기준 최신 {agent.collectCount || 5}개
            </p>
          </div>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{mockStats.updatedAt}</span>
        </div>
        <PaperList papers={mockPapers.slice(0, agent.collectCount || 5)} showSummary />
      </section>
    </div>
  )
}

/* ── Popular tab ─────────────────────────────────────── */
function PopularPage() {
  const [newPeriod, setNewPeriod] = useState('7일')

  const rising = [...mockPapers].sort((a, b) => b.growth - a.growth).slice(0, 3)

  const periodMap = { '1일': 1, '3일': 3, '7일': 7 }
  const filteredNew = mockPapers.filter((p) => p.daysAgo <= periodMap[newPeriod])

  return (
    <div className="animate-fade-up space-y-2">
      {/* 급상승 */}
      <section
        className="rounded-xl transition-shadow duration-200 hover:shadow-sm"
        style={{ background: 'var(--bg-card)', border: 'var(--border-width) solid var(--border)' }}
      >
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ borderBottom: 'var(--border-width) solid var(--border)' }}
        >
          <TrendingUp size={14} style={{ color: 'var(--accent)' }} />
          <div>
            <h2 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>이번주 급상승</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>7일 기준 수집 증가율 높은 논문 3개</p>
          </div>
        </div>
        <PaperList papers={rising} />
      </section>

      {/* 신규 수집 */}
      <section
        className="rounded-xl transition-shadow duration-200 hover:shadow-sm"
        style={{ background: 'var(--bg-card)', border: 'var(--border-width) solid var(--border)' }}
      >
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: 'var(--border-width) solid var(--border)' }}
        >
          <div>
            <h2 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>신규 수집</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              최근 {newPeriod} 이내 수집 {filteredNew.length}개
            </p>
          </div>
          <div className="flex gap-1">
            {['1일', '3일', '7일'].map((l) => (
              <button
                key={l}
                onClick={() => setNewPeriod(l)}
                className="rounded-lg px-2.5 py-1 text-xs font-medium transition-colors"
                style={{
                  background: newPeriod === l ? 'var(--bg-dark)' : 'transparent',
                  color: newPeriod === l ? 'var(--text-on-dark)' : 'var(--text-muted)',
                  border: newPeriod === l ? 'none' : 'var(--border-width) solid var(--border)',
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        {filteredNew.length > 0 ? (
          <PaperList papers={filteredNew} />
        ) : (
          <p className="px-4 py-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            해당 기간 내 수집된 논문이 없습니다.
          </p>
        )}
      </section>
    </div>
  )
}

/* ── Archive tab ─────────────────────────────────────── */
function ArchivePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy]       = useState('최신순')
  const { bookmarks }             = useBookmarkStore()

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  const bookmarkedPapers = mockPapers.filter((p) => bookmarks.includes(p.id))

  const sortedPapers = [...bookmarkedPapers].sort((a, b) => {
    if (sortBy === '인용순') {
      return (
        parseInt(b.citations.replace(/,/g, ''), 10) -
        parseInt(a.citations.replace(/,/g, ''), 10)
      )
    }
    // 최신순 — 'YYYY.MM.DD' 형식은 사전순 내림차순으로 날짜 비교 가능
    return b.publishedAt.localeCompare(a.publishedAt)
  })

  if (isLoading) {
    return (
      <div className="animate-fade-up">
        <div
          className="overflow-hidden rounded-xl"
          style={{ background: 'var(--bg-card)', border: 'var(--border-width) solid var(--border)' }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: 'var(--border-width) solid var(--border)' }}
          >
            <div className="skeleton-shimmer h-3.5 w-20 rounded" />
            <div className="skeleton-shimmer h-6 w-24 rounded-lg" />
          </div>
          {[...Array(5)].map((_, i) => <SkeletonPaperRow key={i} first={i === 0} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-up">
      <section
        className="overflow-hidden rounded-xl transition-shadow duration-200 hover:shadow-sm"
        style={{ background: 'var(--bg-card)', border: 'var(--border-width) solid var(--border)' }}
      >
        {/* 헤더 */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: 'var(--border-width) solid var(--border)' }}
        >
          <div>
            <h2 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>내 보관함</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              저장된 논문 {sortedPapers.length}개
            </p>
          </div>

          {/* 정렬 버튼 — 북마크 있을 때만 표시 */}
          {sortedPapers.length > 0 && (
            <div className="flex gap-1">
              {['최신순', '인용순'].map((l) => (
                <button
                  key={l}
                  onClick={() => setSortBy(l)}
                  className="rounded-lg px-2.5 py-1 text-xs font-medium transition-colors"
                  style={{
                    background: sortBy === l ? 'var(--bg-dark)' : 'transparent',
                    color: sortBy === l ? 'var(--text-on-dark)' : 'var(--text-muted)',
                    border: sortBy === l ? 'none' : 'var(--border-width) solid var(--border)',
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 빈 상태 */}
        {sortedPapers.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
            <div
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: 'var(--accent-light)' }}
            >
              <Bookmark size={18} style={{ color: 'var(--accent)' }} />
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              아직 저장된 논문이 없어요
            </p>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              논문 목록에서 북마크 아이콘을 눌러<br />보관함에 추가해보세요.
            </p>
          </div>
        ) : (
          <PaperList papers={sortedPapers} showSummary />
        )}
      </section>
    </div>
  )
}

/* ── Sub-components ──────────────────────────────────── */
function KpiCard({ label, value, caption, positive }) {
  return (
    <div
      className="rounded-xl p-3 transition-shadow duration-200 hover:shadow-sm"
      style={{ background: 'var(--bg-card)', border: 'var(--border-width) solid var(--border)' }}
    >
      <p className="mb-2 text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      <p
        className="tabular-nums font-medium"
        style={{
          fontSize: 'clamp(20px, 2.2vw, 24px)',
          letterSpacing: '-0.02em',
          color: positive ? 'var(--status-active)' : 'var(--text-primary)',
          lineHeight: 1.1,
        }}
      >
        {value}
      </p>
      <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>{caption}</p>
    </div>
  )
}

function TrendChart({ period }) {
  const { data, labels } = TREND_SETS[period] ?? TREND_SETS['주별']

  const VW = 560
  const VH = 160
  const PT = 12
  const PB = 24
  const PX = 4

  const CH  = VH - PT - PB
  const CW  = VW - PX * 2
  const max = Math.max(...data)
  const min = 0

  const toX = (i) => PX + (i / (data.length - 1)) * CW
  const toY = (v) => PT + CH - ((v - min) / (max - min)) * CH

  const linePoints = data.map((v, i) => `${toX(i)},${toY(v)}`).join(' ')
  const areaPoints = `${linePoints} ${toX(data.length - 1)},${PT + CH} ${toX(0)},${PT + CH}`

  const shownLabels = labels.length > 6
    ? labels.filter((_, i) => i % 2 === 0)
    : labels

  return (
    <div className="overflow-hidden rounded-lg" style={{ background: 'var(--bg-primary)' }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className="w-full"
        style={{ height: VH }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--accent)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((pct) => (
          <line
            key={pct}
            x1={PX} y1={PT + CH * (1 - pct)}
            x2={PX + CW} y2={PT + CH * (1 - pct)}
            stroke="rgba(0,0,0,0.06)"
            strokeWidth="0.5"
            strokeDasharray="3,3"
          />
        ))}

        <polygon points={areaPoints} fill="url(#trendGrad)" />

        <polyline
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={linePoints}
        />

        {data.map((v, i) => {
          const isLast = i === data.length - 1
          if (!isLast && i % 2 !== 0) return null
          return (
            <circle
              key={i}
              cx={toX(i)}
              cy={toY(v)}
              r={isLast ? 4.5 : 3}
              fill="var(--accent)"
              fillOpacity={isLast ? 1 : 0.65}
            />
          )
        })}

        {shownLabels.map((label, idx) => {
          const origIdx = labels.length > 6 ? idx * 2 : idx
          return (
            <text
              key={label}
              x={toX(origIdx)}
              y={VH - 4}
              textAnchor="middle"
              fontSize="8"
              fill="rgba(113,113,122,0.8)"
              fontFamily="Pretendard, sans-serif"
            >
              {label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

/* PaperList — 북마크 토글 버튼 포함 */
function PaperList({ papers, showSummary = false }) {
  const { toggleBookmark, bookmarks } = useBookmarkStore()

  return (
    <div>
      {papers.map((paper, i) => {
        const isBookmarked = bookmarks.includes(paper.id)
        return (
          /* group div: hover 상태 공유 + 북마크 버튼을 <a> 밖에 배치 */
          <div
            key={paper.id}
            className="group relative"
            style={{ borderTop: i === 0 ? 'none' : 'var(--border-width) solid var(--border)' }}
          >
            <a
              href={paper.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 px-4 py-3 pr-9 transition-colors hover:bg-gray-50/60"
            >
              <div className="flex-1 min-w-0">
                <h3
                  className="mb-0.5 text-sm font-medium leading-snug transition-colors group-hover:text-[var(--accent)]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {paper.title}
                </h3>
                {showSummary && (
                  <p className="mb-1 text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                    {paper.summary}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {paper.authors.join(', ')} · {paper.publishedAt}
                  </span>
                  {paper.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="rounded px-1.5 py-0.5 text-xs font-medium"
                      style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
                <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {paper.journal} · 인용 {paper.citations}
                </p>
              </div>
              <ExternalLink
                size={12}
                className="mt-0.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-40"
                style={{ color: 'var(--text-muted)' }}
              />
            </a>

            {/* 북마크 버튼 — <a> 밖에 위치시켜 클릭 시 링크 이동 없음 */}
            <button
              type="button"
              onClick={() => toggleBookmark(paper.id)}
              className={`absolute right-3 top-3 rounded p-0.5 transition-all duration-150 ${
                isBookmarked
                  ? 'opacity-100'
                  : 'opacity-0 group-hover:opacity-50 hover:!opacity-100'
              }`}
              style={{ color: isBookmarked ? 'var(--accent)' : 'var(--text-muted)' }}
              title={isBookmarked ? '보관함에서 제거' : '보관함에 추가'}
            >
              <Bookmark
                size={13}
                fill={isBookmarked ? 'var(--accent)' : 'none'}
                strokeWidth={1.5}
              />
            </button>
          </div>
        )
      })}
    </div>
  )
}
