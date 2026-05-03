import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './HomePage.css'

const PREVIEW_PAPERS = [
  {
    title: 'Attention Is All You Need',
    authors: 'Vaswani, A., Shazeer, N., Parmar, N. et al.',
    year: 2017,
    summary: 'Self-attention 메커니즘만을 사용하는 Transformer 아키텍처를 제안합니다. 기존 RNN/CNN 기반 시퀀스 모델의 한계를 극복하여 병렬 처리가 가능합니다.',
  },
  {
    title: 'BERT: Pre-training of Deep Bidirectional Transformers',
    authors: 'Devlin, J., Chang, M., Lee, K., Toutanova, K.',
    year: 2019,
    summary: '양방향 Transformer를 활용한 사전 학습 언어 모델을 제안합니다. 11개 NLP 벤치마크에서 최고 성능을 달성했습니다.',
  },
]

function HomePage() {
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState('')
  const [keywords, setKeywords] = useState([])
  const [resultCount, setResultCount] = useState(5)
  const [summaryMode, setSummaryMode] = useState('abstract')
  const [isSearching, setIsSearching] = useState(false)
  const [discordConnected, setDiscordConnected] = useState(false)
  const [testingDiscord, setTestingDiscord] = useState(false)
  const [connectingDiscord, setConnectingDiscord] = useState(false)

  const addKeyword = (text) => {
    const trimmed = text.trim()
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed])
    }
    setInputValue('')
  }

  const removeKeyword = (target) => {
    setKeywords(keywords.filter((k) => k !== target))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addKeyword(inputValue)
    }
    if (e.key === 'Backspace' && !inputValue && keywords.length > 0) {
      setKeywords(keywords.slice(0, -1))
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (inputValue.trim()) addKeyword(inputValue)
    const allKeywords = inputValue.trim()
      ? [...keywords, inputValue.trim()]
      : keywords
    if (allKeywords.length === 0) return

    setIsSearching(true)
    setTimeout(() => {
      navigate('/results', {
        state: { keyword: allKeywords.join(', '), resultCount, summaryMode }
      })
    }, 800)
  }

  const countOptions = [3, 5, 10]

  return (
    <div className="home-page">
      <main className="home-main">
        <div className="hero-section">
          <h1 className="hero-title">
            논문을 검색하고<br />
            <span className="highlight">AI로 요약</span>하세요
          </h1>
          <p className="hero-desc">
            키워드를 입력하면 관련 논문을 찾아 핵심 내용을 요약해드립니다
          </p>
        </div>

        <form className="search-card" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <div className="keyword-input-area">
              {keywords.map((kw) => (
                <span key={kw} className="keyword-chip">
                  {kw}
                  <button
                    type="button"
                    className="chip-remove"
                    onClick={() => removeKeyword(kw)}
                    aria-label={`${kw} 제거`}
                  >
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="text"
                className="search-input"
                placeholder={keywords.length === 0 ? '논문 키워드를 입력하세요 (Enter로 추가)' : '키워드 추가...'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <div className="options-row">
            <div className="option-group">
              <label className="option-label">결과 수</label>
              <div className="count-selector">
                {countOptions.map((count) => (
                  <button
                    key={count}
                    type="button"
                    className={`count-btn ${resultCount === count ? 'active' : ''}`}
                    onClick={() => setResultCount(count)}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div className="option-group">
              <label className="option-label">AI 요약</label>
              <div className="summary-selector">
                {[
                  { value: 'body', label: '본문' },
                  { value: 'abstract', label: '초록' },
                  { value: 'full', label: '전체' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    className={`summary-btn ${summaryMode === value ? 'active' : ''}`}
                    onClick={() => setSummaryMode(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
            <div className="alarm-group">
              <div className="alarm-top">
                <div className="alarm-title-row">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" className="discord-icon">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                  </svg>
                  <span className="alarm-label">Discord 알람</span>
                  <span className={`discord-status ${discordConnected ? 'connected' : 'disconnected'}`}>
                    <span className="status-dot" />
                    {discordConnected ? '연결됨' : '연결 안됨'}
                  </span>
                </div>
                <div className="alarm-actions">
                {!discordConnected ? (
                  <button
                    type="button"
                    className={`discord-connect-btn ${connectingDiscord ? 'loading' : ''}`}
                    onClick={() => {
                      setConnectingDiscord(true)

                      // 디스코드 mock 제거
                      setTimeout(() => {
                        setDiscordConnected(true)
                        setConnectingDiscord(false)
                      }, 1500)
                    }}
                    disabled={connectingDiscord}
                  >
                    {connectingDiscord ? (
                      <>
                        <span className="discord-spinner" />
                        연결 중...
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                        </svg>
                        Discord 연결하기
                      </>
                    )}
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className={`discord-test-btn ${testingDiscord ? 'testing' : ''}`}
                      onClick={() => {
                        setTestingDiscord(true)

                        // 실제로 Discord에 메시지를 보내지 않고 전송 완료된 것처럼 보이는 mock
                        setTimeout(() => setTestingDiscord(false), 1500)
                      }}
                      disabled={testingDiscord}
                    >
                      {testingDiscord ? (
                        <>
                          <span className="discord-spinner test" />
                          전송 중...
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <path d="M22 2 11 13" /><path d="m22 2-7 20-4-9-9-4 20-7z" />
                          </svg>
                          테스트 알림
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="discord-disconnect-btn"
                      onClick={() => setDiscordConnected(false)}
                    >
                      연결 해제
                    </button>
                  </>
                )}
                </div>
              </div>
            </div>

          <button
            type="submit"
            className={`search-btn ${isSearching ? 'loading' : ''}`}
            disabled={keywords.length === 0 && !inputValue.trim() || isSearching}
          >
            {isSearching ? (
              <span className="spinner" />
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                논문 검색
              </>
            )}
          </button>
        </form>

        <div className="tags-section">
          <span className="tags-label">인기 키워드</span>
          {['LLM', 'Transformer', 'Diffusion Model', 'RAG', 'Fine-tuning'].map((tag) => (
            <button
              key={tag}
              className="tag"
              onClick={() => addKeyword(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <section className="preview-section">
          <div className="preview-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            예시 결과 미리보기
          </div>
          <p className="preview-desc">
            검색 결과는 아래와 같은 형태로 표시됩니다
          </p>
          <div className="preview-cards">
            {PREVIEW_PAPERS.map((paper, i) => (
              <div key={i} className="preview-card">
                <div className="preview-card-top">
                  <span className="preview-index">{String(i + 1).padStart(2, '0')}</span>
                  <span className="preview-year">{paper.year}</span>
                </div>
                <h3 className="preview-title">{paper.title}</h3>
                <p className="preview-authors">{paper.authors}</p>
                <div className="preview-summary">
                  <span className="preview-summary-label">
                    {summaryMode === 'body' ? '본문 요약' : summaryMode === 'abstract' ? '초록' : '전체 요약'}
                  </span>
                  <p className="preview-summary-text">{paper.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomePage
