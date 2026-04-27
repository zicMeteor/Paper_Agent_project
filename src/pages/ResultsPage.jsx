import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './ResultsPage.css'

// mock 가짜 논문 데이터
const MOCK_PAPERS = [
  {
    id: 1,
    title: 'Attention Is All You Need',
    authors: [
      { name: 'Ashish Vaswani', affiliation: 'Google Brain' },
      { name: 'Noam Shazeer', affiliation: 'Google Brain' },
      { name: 'Niki Parmar', affiliation: 'Google Research' },
      { name: 'Jakob Uszkoreit', affiliation: 'Google Research' }
    ],
    year: 2017,
    source: { type: 'conference', name: 'NeurIPS', year: 2017, url: 'https://arxiv.org/abs/1706.03762' },
    citations: 95000,
    summary: 'Self-attention 메커니즘만을 사용하는 Transformer 아키텍처를 제안합니다.',
    keywords: ['Transformer', 'Attention', 'NLP']
  },
  {
    id: 2,
    title: 'BERT: Pre-training of Deep Bidirectional Transformers',
    authors: [
      { name: 'Jacob Devlin', affiliation: 'Google AI' },
      { name: 'Ming-Wei Chang', affiliation: 'Google AI' },
      { name: 'Kenton Lee', affiliation: 'Google AI' },
      { name: 'Kristina Toutanova', affiliation: 'Google AI' }
    ],
    year: 2018,
    source: { type: 'conference', name: 'NAACL', year: 2018, url: 'https://arxiv.org/abs/1810.04805' },
    citations: 80000,
    summary: 'BERT는 양방향 Transformer를 활용한 사전학습 모델로 NLP 다양한 태스크에서 우수한 성능을 보입니다.',
    keywords: ['BERT', 'Transformer', 'NLP']
  },
  {
    id: 3,
    title: 'GPT: Improving Language Understanding',
    authors: [
      { name: 'Alec Radford', affiliation: 'OpenAI' },
      { name: 'Karthik Narasimhan', affiliation: 'OpenAI' },
      { name: 'Tim Salimans', affiliation: 'OpenAI' },
      { name: 'Ilya Sutskever', affiliation: 'OpenAI' }
    ],
    year: 2018,
    source: { type: 'conference', name: 'OpenAI Blog', year: 2018, url: 'https://openai.com/research/' },
    citations: 65000,
    summary: 'Generative Pre-trained Transformer로 NLP 언어 모델 성능 향상.',
    keywords: ['GPT', 'Language Model', 'NLP']
  },
  {
    id: 4,
    title: 'RoBERTa: A Robustly Optimized BERT Pretraining Approach',
    authors: [
      { name: 'Yinhan Liu', affiliation: 'Facebook AI' },
      { name: 'Myle Ott', affiliation: 'Facebook AI' },
      { name: 'Naman Goyal', affiliation: 'Facebook AI' },
      { name: 'Jacques Welbl', affiliation: 'Facebook AI' }
    ],
    year: 2019,
    source: { type: 'conference', name: 'arXiv', year: 2019, url: 'https://arxiv.org/abs/1907.11692' },
    citations: 40000,
    summary: 'BERT를 최적화하여 사전학습 성능을 개선한 RoBERTa 모델.',
    keywords: ['RoBERTa', 'BERT', 'NLP']
  },
  {
    id: 5,
    title: 'XLNet: Generalized Autoregressive Pretraining',
    authors: [
      { name: 'Zhilin Yang', affiliation: 'CMU' },
      { name: 'Zihang Dai', affiliation: 'Google Brain' },
      { name: 'Yiming Yang', affiliation: 'CMU' },
      { name: 'William W. Cohen', affiliation: 'CMU' }
    ],
    year: 2019,
    source: { type: 'conference', name: 'NeurIPS', year: 2019, url: 'https://arxiv.org/abs/1906.08237' },
    citations: 35000,
    summary: 'XLNet은 BERT 한계를 극복한 일반화된 오토리그레시브 사전학습 모델입니다.',
    keywords: ['XLNet', 'Transformer', 'NLP']
  },
  {
    id: 6,
    title: 'T5: Exploring the Limits of Transfer Learning',
    authors: [
      { name: 'Colin Raffel', affiliation: 'Google Research' },
      { name: 'Noam Shazeer', affiliation: 'Google Research' },
      { name: 'Adam Roberts', affiliation: 'Google Research' },
      { name: 'Katherine Lee', affiliation: 'Google Research' }
    ],
    year: 2020,
    source: { type: 'conference', name: 'JMLR', year: 2020, url: 'https://arxiv.org/abs/1910.10683' },
    citations: 25000,
    summary: 'Text-to-Text Transfer Transformer로 다양한 NLP 태스크에 통합 접근.',
    keywords: ['T5', 'Transfer Learning', 'NLP']
  },
  {
    id: 7,
    title: 'ALBERT: A Lite BERT for Self-supervised Learning',
    authors: [
      { name: 'Zhenzhong Lan', affiliation: 'Google Research' },
      { name: 'Mingda Chen', affiliation: 'Google Research' },
      { name: 'Sebastian Goodman', affiliation: 'Google Research' },
      { name: 'Kevin Gimpel', affiliation: 'Toyota Technological Institute' }
    ],
    year: 2019,
    source: { type: 'conference', name: 'ICLR', year: 2019, url: 'https://arxiv.org/abs/1909.11942' },
    citations: 20000,
    summary: 'BERT를 경량화하여 메모리 효율과 학습 속도를 개선.',
    keywords: ['ALBERT', 'BERT', 'NLP']
  },
  {
    id: 8,
    title: 'ELECTRA: Pre-training Text Encoders',
    authors: [
      { name: 'Kevin Clark', affiliation: 'Google Research' },
      { name: 'Minh-Thang Luong', affiliation: 'Google Research' },
      { name: 'Quoc V. Le', affiliation: 'Google Research' }
    ],
    year: 2020,
    source: { type: 'conference', name: 'ICLR', year: 2020, url: 'https://arxiv.org/abs/2003.10555' },
    citations: 18000,
    summary: 'Discriminator를 활용하여 효율적인 사전학습 텍스트 인코더 제안.',
    keywords: ['ELECTRA', 'Pretraining', 'NLP']
  },
  {
    id: 9,
    title: 'DistilBERT: A Distilled Version of BERT',
    authors: [
      { name: 'Victor Sanh', affiliation: 'Hugging Face' },
      { name: 'Lysandre Debut', affiliation: 'Hugging Face' },
      { name: 'Julien Chaumond', affiliation: 'Hugging Face' }
    ],
    year: 2019,
    source: { type: 'conference', name: 'NeurIPS', year: 2019, url: 'https://arxiv.org/abs/1910.01108' },
    citations: 15000,
    summary: 'BERT 모델을 압축하여 연산량과 메모리 사용 감소.',
    keywords: ['DistilBERT', 'BERT', 'NLP']
  },
  {
    id: 10,
    title: 'Transformer-XL: Attentive Language Models',
    authors: [
      { name: 'Zihang Dai', affiliation: 'CMU' },
      { name: 'Zhilin Yang', affiliation: 'CMU' },
      { name: 'Yiming Yang', affiliation: 'CMU' }
    ],
    year: 2019,
    source: { type: 'conference', name: 'ACL', year: 2019, url: 'https://arxiv.org/abs/1901.02860' },
    citations: 22000,
    summary: '장기 의존성을 처리할 수 있는 Transformer 기반 언어 모델.',
    keywords: ['Transformer-XL', 'Language Model', 'NLP']
  }
]

function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { keyword, resultCount, summaryMode } = location.state || {}
  const [expandedId, setExpandedId] = useState(null)
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!keyword) {
      navigate('/')
      return
    }

    // 검색 버튼을 누르면 가짜 논문 데이터를 불러오는 mock 로직
    const timer = setTimeout(() => {
      const shuffled = [...MOCK_PAPERS].sort(() => Math.random() - 0.5)
      setPapers(shuffled.slice(0, resultCount || 5))
      setLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [keyword, resultCount, navigate])

  if (loading) {
    return (
      <div className="results-page">
        <main className="results-main">
          <div className="loading-state">
            <div className="loading-spinner" />
            <p className="loading-text">
              논문을 검색하고 있습니다...
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="results-page">
      <header className="results-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path d="m15 18-6-6 6-6" />
          </svg>
          뒤로
        </button>
      </header>

      <main className="results-main">
        <div className="results-info">
          <h1 className="results-title">
            &ldquo;<span className="keyword">{keyword}</span>&rdquo; 검색 결과
          </h1>
          <div className="results-meta">
            <span className="meta-badge">{papers.length}개 논문</span>
            <span className="meta-badge">
              AI 요약 · {summaryMode === 'body' ? '본문' : summaryMode === 'abstract' ? '초록' : '전체'}
            </span>
          </div>
        </div>

        <div className="papers-list">
          {papers.map((paper, index) => (
            <article
              key={paper.id}
              className={`paper-card ${expandedId === paper.id ? 'expanded' : ''}`}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="paper-top">
                <span className="paper-index">{String(index + 1).padStart(2, '0')}</span>
                <div className="paper-badges">
                  <span className="badge year">{paper.year}</span>
                  <span className="badge journal">{paper.source.name}</span>
                </div>
              </div>

              <h2
                className="paper-title"
                onClick={() => setExpandedId(expandedId === paper.id ? null : paper.id)}
              >
                {paper.title}
              </h2>

              <p className="paper-authors">
                {Array.isArray(paper.authors)
                  ? `저자 : ${paper.authors.map(a => a.name).join(', ')}`
                  : `저자 : ${paper.authors}`}
              </p>

              <div className="paper-stats">
                <span className="stat">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                    <path d="M3 21l1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
                  </svg>
                  {paper.citations.toLocaleString()} citations
                </span>
              </div>

              {summaryMode && (
                <div className={`paper-summary ${expandedId === paper.id ? 'show' : ''}`}>
                  <div className="summary-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
                    </svg>
                    {summaryMode === 'body' ? '본문 요약' : summaryMode === 'abstract' ? '초록' : '전체 요약'}
                  </div>
                  <p className="summary-text">{paper.summary}</p>
                  {summaryMode === 'full' && paper.keywords?.length > 0 && (
                    <div className="summary-keywords">
                      {paper.keywords.map(kw => (
                        <span key={kw} className="summary-keyword-chip">{kw}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                className="expand-btn"
                onClick={() => setExpandedId(expandedId === paper.id ? null : paper.id)}
              >
                {expandedId === paper.id ? '접기' : '요약 보기'}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="16"
                  height="16"
                  className={expandedId === paper.id ? 'rotate' : ''}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}

export default ResultsPage