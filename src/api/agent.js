// ── 에이전트 API ───────────────────────────────────────
// 백엔드 연결 시 아래 TODO 주석을 실제 fetch 로 교체합니다.

/**
 * 에이전트 설정 저장
 * TODO: return await fetch('/api/agent', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }).then((r) => r.json())
 */
export async function saveAgentConfig(data) {
  void data
  return { ok: true }
}

/**
 * 에이전트 설정 불러오기 (로그인 후 초기화)
 * TODO: return await fetch('/api/agent').then((r) => r.json())
 */
export async function loadAgentConfig() {
  return null
}

/**
 * 알림 채널 OAuth 연결
 * 백엔드 연결 시: OAuth 팝업 → callback → { connected, lastTestStatus, lastTestAt }
 * TODO: open OAuth popup window, await postMessage callback
 */
export async function connectChannel(channel) {
  void channel
  return { connected: true, lastTestStatus: 'success', lastTestAt: Date.now() }
}

/**
 * 테스트 알림 전송
 * TODO: return await fetch(`/api/agent/notifications/${channel}/test`, { method: 'POST' }).then((r) => r.json())
 */
export async function testChannel(channel) {
  void channel
  return { success: true }
}
