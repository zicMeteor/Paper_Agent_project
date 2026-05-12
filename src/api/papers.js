// ── 논문 API ──────────────────────────────────────────
// 백엔드 연결 시 아래 TODO 주석을 실제 fetch 로 교체합니다.
// 반환 구조(shape)는 유지 — 컴포넌트 코드 변경 없음.

import { mockPapers, mockStats } from '../data/mock'

/**
 * 논문 목록 조회
 * @param {{ limit?: number, sort?: 'latest' | 'trending' }} options
 * @returns {Promise<Paper[]>}
 *
 * TODO: return await fetch(`/api/papers?sort=${sort}&limit=${limit}`).then((r) => r.json())
 */
export async function fetchPapers({ limit = 10, sort = 'latest' } = {}) {
  const sorted =
    sort === 'trending'
      ? [...mockPapers].sort((a, b) => b.growth - a.growth)
      : [...mockPapers].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  return sorted.slice(0, limit)
}

/**
 * KPI 통계 조회
 * @returns {Promise<Stats>}
 *
 * TODO: return await fetch('/api/stats').then((r) => r.json())
 */
export async function fetchStats() {
  return mockStats
}

/**
 * 트렌드 차트 데이터 조회
 * @param {'weekly' | 'monthly' | 'yearly'} period
 * @returns {Promise<{ data: number[], labels: string[] }>}
 *
 * TODO: return await fetch(`/api/stats/trend?period=${period}`).then((r) => r.json())
 */
export async function fetchTrend(period = 'weekly') {
  const map = {
    weekly:  { data: mockStats.trend,       labels: mockStats.trendLabels },
    monthly: { data: [45, 88, 120, 95, 140, 185, 210, 178, 240, 290, 265, 340], labels: ['7월','8월','9월','10월','11월','12월','1월','2월','3월','4월','5월','6월'] },
    yearly:  { data: [120, 340, 890, 1248], labels: ['2021','2022','2023','2024'] },
  }
  return map[period] ?? map.weekly
}
