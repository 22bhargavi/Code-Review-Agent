import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Components ---

const Header = () => (
  <header className="bg-white border-b border-[#D4C8F0] sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-[0_1px_6px_rgba(123,79,187,0.08)]">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-[#7B4FBB] flex items-center justify-center shadow-lg shadow-[#7B4FBB]/20">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
      </div>
      <h1 className="text-2xl font-bold text-[#0D0B1A] tracking-tight">AI Reviewer</h1>
    </div>
    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F7F5FF] rounded-full border border-[#D4C8F0]">
      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse"></div>
      <span className="text-[10px] font-bold text-[#6B5F8A] uppercase tracking-widest">System Online</span>
    </div>
  </header>
);

const ReviewButton = ({ onClick, loading, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`relative px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-3 shadow-lg ${loading || disabled
      ? 'bg-[#EDE8F8] text-[#A98DD4] cursor-not-allowed border border-[#D4C8F0]'
      : 'bg-[#7B4FBB] hover:bg-[#5A348A] text-white shadow-[#7B4FBB]/20 hover:shadow-xl active:scale-95'
      }`}
  >
    {loading ? (
      <>
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        <span className="tracking-tight">Review Agent Running...</span>
      </>
    ) : (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
        <span className="tracking-tight">Run Intelligence Review</span>
      </>
    )}
  </button>
);

const SeverityBadge = ({ type, hideIcon = false }) => {
  const configs = {
    CRITICAL: { bg: '#FDE8E8', text: '#991111', border: '#FFAAAA' },
    MAJOR: { bg: '#FEF3E2', text: '#995500', border: '#FFCC88' },
    MINOR: { bg: '#E8EFFE', text: '#223399', border: '#AABBFF' },
    SUGGESTION: { bg: '#EDE8F8', text: '#5A348A', border: '#A98DD4' }
  };
  const config = configs[type] || configs.SUGGESTION;

  return (
    <span
      style={{ backgroundColor: config.bg, color: config.text, borderColor: config.border }}
      className="px-2.5 py-0.5 rounded border text-[11px] font-bold tracking-wider uppercase inline-flex items-center gap-1.5"
    >
      {!hideIcon && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.text }}></div>}
      {type}
    </span>
  );
};

const SummaryPanel = ({ summary }) => {
  if (!summary) return null;
  return (
    <div className="bg-white border border-[#D4C8F0] rounded-3xl p-10 mb-12 shadow-[0_4px_20px_rgba(123,79,187,0.05)] animate-in fade-in slide-in-from-top-8 duration-700">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-1.5 h-8 bg-[#7B4FBB] rounded-full"></div>
        <h3 className="text-xl font-bold text-[#0D0B1A] tracking-tight">Intelligence Summary</h3>
      </div>
      <div className="prose prose-zinc max-w-none text-[#2A2640] leading-relaxed text-lg 
        prose-headings:text-[#0D0B1A] prose-headings:font-bold prose-headings:tracking-tight
        prose-strong:text-[#0D0B1A] prose-strong:font-bold
        prose-code:bg-[#EDE8F8] prose-code:text-[#5A348A] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
      </div>
    </div>
  );
};

const CommentPanel = ({ comments }) => {
  const getSeverityType = (body) => {
    const b = body.toUpperCase();
    if (b.includes('[CRITICAL]')) return 'CRITICAL';
    if (b.includes('[MAJOR]')) return 'MAJOR';
    if (b.includes('[MINOR]')) return 'MINOR';
    return 'SUGGESTION';
  };

  // Sort comments by line number
  const sorted = [...comments].sort((a, b) => (a.line || 0) - (b.line || 0));

  return (
    <div className="split-pane flex flex-col gap-3 p-4 bg-[#FAF9FF]">
      <div className="flex items-center gap-2 mb-1 px-1">
        <div className="w-1 h-5 bg-[#7B4FBB] rounded-full"></div>
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B5F8A]">Review Insights</span>
        <span className="ml-auto bg-[#7B4FBB] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums">{comments.length}</span>
      </div>
      {sorted.map((comment, idx) => (
        <div key={idx} className="relative">
          {comment.line && (
            <div className="flex items-center gap-1.5 mb-1.5 px-1">
              <span className="text-[10px] font-mono font-bold text-[#7B4FBB] bg-[#EDE8F8] border border-[#D4C8F0] px-2 py-0.5 rounded">
                Line {comment.line}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${getSeverityType(comment.body) === 'CRITICAL' ? 'bg-[#CC3333]' :
                getSeverityType(comment.body) === 'MAJOR' ? 'bg-[#CC7700]' :
                  getSeverityType(comment.body) === 'MINOR' ? 'bg-[#4466CC]' : 'bg-[#7B4FBB]'
                }`}></span>
            </div>
          )}
          <CommentBlock comment={comment} isInline={false} />
        </div>
      ))}
    </div>
  );
};

const FileGroup = ({ path, comments, prLink }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [code, setCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isExpanded && !code && !loading) {
      fetchCode();
    }
  }, [isExpanded]);

  const fetchCode = async () => {
    setLoading(true);
    try {
      let rawUrl = null;
      if (prLink.includes('github.com')) {
        const parts = prLink.replace('https://github.com/', '').split('/');
        const owner = parts[0];
        const repo = parts[1];
        rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`;
      }

      if (rawUrl) {
        const resp = await fetch(rawUrl);
        if (resp.ok) {
          const text = await resp.text();
          setCode(text);
          return;
        }
      }

      throw new Error('Could not fetch file content. Showing comments only.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 border border-[#D4C8F0] bg-white rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(123,79,187,0.06)]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between px-6 py-4 transition-colors ${isExpanded ? 'bg-[#EDE8F8]' : 'bg-white hover:bg-[#F7F5FF]'}`}
      >
        <div className="flex items-center gap-4 overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 text-[#7B4FBB] transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          <div className="flex flex-col items-start gap-0.5 overflow-hidden">
            <span className="font-mono text-sm font-bold text-[#0D0B1A] truncate">{path.split('/').pop()}</span>
            <span className="text-[10px] font-mono text-[#6B5F8A] truncate lowercase opacity-70">{path}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-[#7B4FBB] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tabular-nums shadow-sm">
            {comments.length} {comments.length === 1 ? 'Insight' : 'Insights'}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="animate-in fade-in duration-500">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-4 text-[#6B5F8A] bg-[#FAF9FF]">
              <div className="w-6 h-6 border-2 border-[#7B4FBB]/20 border-t-[#7B4FBB] rounded-full animate-spin"></div>
              <p className="text-[10px] font-bold tracking-widest uppercase">Fetching Source...</p>
            </div>
          ) : code ? (
            <div className="flex flex-row border-t border-[#D4C8F0]">
              {/* Left Pane: Source Code */}
              <div className="w-[55%] border-r border-[#D4C8F0]">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#F7F5FF] border-b border-[#D4C8F0]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#7B4FBB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B5F8A]">Source</span>
                </div>
                <CodeView code={code} comments={comments} />
              </div>
              {/* Right Pane: Review Comments */}
              <div className="w-[45%]">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#F7F5FF] border-b border-[#D4C8F0]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#7B4FBB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B5F8A]">Review</span>
                </div>
                <CommentPanel comments={comments} />
              </div>
            </div>
          ) : (
            <div className="p-0 border-t border-[#D4C8F0]">
              {error && (
                <div className="px-6 py-3 bg-[#FEF3E2] border-b border-[#FFCC88] text-[#995500] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  {error}
                </div>
              )}
              {comments.map((comment, idx) => (
                <CommentBlock key={idx} comment={comment} isInline={false} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CommentBlock = ({ comment, isInline = true }) => {
  const getSeverityType = (body) => {
    const b = body.toUpperCase();
    if (b.includes('[CRITICAL]')) return 'CRITICAL';
    if (b.includes('[MAJOR]')) return 'MAJOR';
    if (b.includes('[MINOR]')) return 'MINOR';
    return 'SUGGESTION';
  };

  const severity = getSeverityType(comment.body);
  const borderColors = {
    CRITICAL: '#CC3333',
    MAJOR: '#CC7700',
    MINOR: '#4466CC',
    SUGGESTION: '#7B4FBB'
  };

  const cleanBody = comment.body
    .replace(/\[CRITICAL\]|\[MAJOR\]|\[MINOR\]|\[PRAISE\]|\[SUGGESTION\]/gi, '')
    .trim();

  // Split body into text and potential code suggestion
  const parts = cleanBody.split(/```javascript|```html|```css|```/);
  const textContent = parts[0].trim();
  const suggestion = parts.length > 1 ? parts[1].trim() : null;

  return (
    <div
      className={`bg-[#EDE8F8] p-4 shadow-[0_1px_4px_rgba(123,79,187,0.08)] ${isInline ? 'ml-12 border-l-[3px]' : 'border-b border-[#D4C8F0] border-l-[3px] last:border-b-0'}`}
      style={{ borderLeftColor: borderColors[severity] }}
    >
      <div className="flex items-center gap-3 mb-2">
        <SeverityBadge type={severity} hideIcon={true} />
        <span className="text-sm font-medium text-[#0D0B1A]">
          {textContent.split('\n')[0].length < 60 ? textContent.split('\n')[0] : 'Insight Detection'}
        </span>
      </div>
      <div className="w-full h-px bg-[#D4C8F0] mb-3 opacity-50"></div>
      <div className="prose prose-sm prose-zinc max-w-none text-[#2A2640] prose-code:bg-[#white] prose-code:text-[#5A348A] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-[12px] prose-code:before:content-none prose-code:after:content-none leading-relaxed">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{textContent}</ReactMarkdown>
      </div>
      {suggestion && (
        <div className="mt-4">
          <div className="text-[10px] text-[#7B4FBB] font-bold tracking-widest uppercase mb-2">Suggested Fix</div>
          <div className="bg-[#F0EEF8] border border-[#D4C8F0] border-l-[3px] border-l-[#7B4FBB] rounded-md p-4 overflow-x-auto">
            <pre className="font-mono text-[13px] text-[#3D2060]">
              <code>{suggestion}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
//react functional component
const CodeView = ({ code, comments }) => {
  const lines = code.split('\n');
  const commentMap = comments.reduce((acc, c) => {
    if (!acc[c.line]) acc[c.line] = [];
    acc[c.line].push(c);
    return acc;
  }, {});

  const getSeverityBg = (body) => {
    const b = body.toUpperCase();
    if (b.includes('[CRITICAL]')) return '#FFF0F0';
    if (b.includes('[MAJOR]')) return '#FFF8EE';
    if (b.includes('[MINOR]')) return '#F0F4FF';
    return '#F5F0FF';
  };

  return (
    <div className="split-pane font-mono text-[13px] leading-6 w-full bg-[#FAF9FF] overflow-hidden">
      {lines.map((line, idx) => {
        const lineNum = idx + 1;
        const lineComments = commentMap[lineNum];
        const hasComments = lineComments && lineComments.length > 0;
        const highlightBg = hasComments ? getSeverityBg(lineComments[0].body) : 'transparent';

        return (
          <div
            key={lineNum}
            data-line={lineNum}
            style={{ backgroundColor: hasComments ? highlightBg : undefined }}
            className={`flex group/line ${!hasComments && 'bg-[#F4F2FF]/50 hover:bg-[#EDE8F8]'} transition-colors`}
          >
            <div className="w-12 shrink-0 text-right pr-4 text-[#A98DD4] select-none border-r border-[#D4C8F0] font-medium tabular-nums text-[11px] py-0.5">
              {lineNum}
            </div>
            <pre className="px-4 flex-1 overflow-x-auto text-[#1A1530] py-0.5">
              <code>{line || ' '}</code>
            </pre>
            {hasComments && (
              <div className="shrink-0 w-2 h-2 rounded-full self-center mr-2" style={{ backgroundColor: getSeverityBg(lineComments[0].body) === '#FFF0F0' ? '#CC3333' : getSeverityBg(lineComments[0].body) === '#FFF8EE' ? '#CC7700' : getSeverityBg(lineComments[0].body) === '#F0F4FF' ? '#4466CC' : '#7B4FBB' }}></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [prLink, setPrLink] = useState('');

  const triggerReview = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://imworkflow.intermesh.net/webhook/review-mr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pr_link: prLink })
      });

      if (!response.ok) throw new Error(`API returned ${response.status}`);

      const text = await response.text();
      if (!text || text.trim() === '') {
        throw new Error('Analysis engine returned an empty response. Please check the n8n workflow.');
      }

      const result = JSON.parse(text);
      setData(result);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to trigger code review.');
    } finally {
      setLoading(false);
    }
  };

  // Group comments by file path
  const groupedComments = data?.comments?.reduce((acc, comment) => {
    const path = comment.path || 'Unknown File';
    if (!acc[path]) acc[path] = [];
    acc[path].push(comment);
    return acc;
  }, {}) || {};

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#7B4FBB]/10 font-sans bg-[#F7F5FF]">
      <Header />

      <main className="flex-1 max-w-[90rem] w-full mx-auto px-6 py-20">
        <div className="flex flex-col items-center mb-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#7B4FBB] flex items-center justify-center mb-8 shadow-xl shadow-[#7B4FBB]/20 ring-1 ring-[#7B4FBB]/30 group hover:scale-105 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
          </div>
          <h2 className="text-6xl font-black text-[#0D0B1A] mb-6 tracking-tight leading-[1.1]">
            Elevate Your <span className="text-[#7B4FBB]">Code Quality</span>
          </h2>
          <p className="text-[#6B5F8A] max-w-2xl mb-12 text-lg font-medium leading-relaxed">
            Unleash advanced AI generated code reviews on your PRs. We detect vulnerabilities, performance bottlenecks, and architectural anti-patterns in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl bg-white p-2 rounded-2xl border border-[#D4C8F0] shadow-[0_4px_20px_rgba(123,79,187,0.05)] focus-within:border-[#7B4FBB] transition-all duration-300">
            <input
              type="url"
              placeholder="Enter Pull Request URL..."
              value={prLink}
              onChange={(e) => setPrLink(e.target.value)}
              disabled={loading}
              className="flex-1 w-full bg-transparent text-[#0D0B1A] placeholder:text-[#A98DD4] px-6 py-3 rounded-xl focus:outline-none transition-all font-medium text-lg"
            />
            <ReviewButton onClick={triggerReview} loading={loading} disabled={!prLink} />
          </div>
        </div>

        {error && (
          <div className="bg-[#FDE8E8] border border-[#FFAAAA] rounded-2xl p-6 mb-12 flex items-center gap-4 text-[#991111] animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm leading-tight">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-0.5">Execution Error</p>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {data && (
          <div className="space-y-6 animate-in fade-in duration-1000">
            <SummaryPanel summary={data.summary} />

            <div className="flex items-center gap-4 mb-8 ml-2">
              <div className="w-1.5 h-6 bg-[#7B4FBB] rounded-full shadow-sm"></div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#0D0B1A]">Diagnostic Insights</h3>
            </div>

            {Object.keys(groupedComments).length > 0 ? (
              Object.entries(groupedComments).map(([path, comments]) => (
                <FileGroup key={path} path={path} comments={comments} prLink={prLink} />
              ))
            ) : !loading && data && !data.summary ? (
              <div className="text-center py-20 border border-[#D4C8F0] rounded-[2.5rem] bg-white shadow-sm">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                </div>
                <p className="text-[#0D0B1A] font-bold text-2xl tracking-tight">System Optimal</p>
                <p className="text-[#6B5F8A] mt-2 text-base">No vulnerabilities or architectural flaws detected.</p>
              </div>
            ) : null}
          </div>
        )}
      </main>

      <footer className="px-6 py-12 border-t border-[#D4C8F0] bg-white text-center">
        <p className="text-[#A98DD4] text-[10px] font-bold tracking-[0.4em] uppercase">
          &copy; 2026 AI CODE REVIEWER • Powered BY : n8n and Claude Sonnet 4.6
        </p>
      </footer>
    </div>
  );
}
