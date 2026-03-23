import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Components ---

const Header = () => (
  <header className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50 px-6 py-4 flex justify-between items-center transition-all duration-300">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/40 ring-1 ring-violet-400/50">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
      </div>
      <h1 className="text-2xl font-black bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent tracking-tight">AI Reviewer</h1>
    </div>
    <div className="flex items-center gap-4 text-[10px] font-bold text-violet-400/60 uppercase tracking-[0.2em]">
      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50"></span> System Online</span>
    </div>
  </header>
);

const ReviewButton = ({ onClick, loading, disabled }) => (
  <button
    disabled={disabled || loading}
    onClick={onClick}
    className={`
      group relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-500 overflow-hidden
      ${disabled || loading
        ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'
        : 'bg-violet-600 text-white hover:bg-violet-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] active:scale-[0.98] border border-violet-400/30'}
    `}
  >
    <div className="relative flex items-center justify-center gap-3">
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="animate-pulse">Analyzing...</span>
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-y-[-2px] transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
          <span>Run Intelligence Review</span>
        </>
      )}
    </div>
    {!disabled && !loading && (
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
    )}
  </button>
);

const SummaryPanel = ({ summary }) => {
  if (!summary) return null;
  return (
    <div className="bg-white/[0.03] border border-white/10 backdrop-blur-md rounded-3xl p-8 mb-10 shadow-2xl transition-all duration-500 hover:border-violet-500/30 group">
      <h2 className="text-violet-400 text-xs font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 group-hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
        </div>
        Intelligence Summary
      </h2>
      <div className="prose prose-invert prose-violet max-w-none prose-headings:font-black prose-a:text-violet-400 prose-table:border-collapse prose-th:border prose-th:border-white/10 prose-td:border prose-td:border-white/5 prose-th:bg-white/5 prose-th:p-3 prose-td:p-3 prose-strong:text-violet-200">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
      </div>
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
      // Logic to get raw file content from GitHub if possible
      // Example: https://github.com/user/repo/pull/1/files -> raw content
      // For now, we'll try a generic approach if prLink is github
      let rawUrl = null;
      if (prLink.includes('github.com')) {
        const parts = prLink.replace('https://github.com/', '').split('/');
        const owner = parts[0];
        const repo = parts[1];
        // We need the branch or commit, which is tricky from a PR link alone without API
        // But let's assume we can try to find it or use a proxy
        // For this demo, we'll use a placeholder or try to fetch if we have enough info
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
    <div className="mb-8 border border-white/5 bg-white/[0.02] rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-violet-500/20 shadow-xl">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-6 py-5 bg-white/5 hover:bg-white/10 transition-colors border-b border-white/5"
      >
        <div className="flex items-center gap-4 overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 text-violet-400/60 transition-transform duration-500 ${isExpanded ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          <div className="flex flex-col items-start gap-0.5">
            <span className="font-mono text-sm font-black text-white truncate px-2 py-0.5 bg-violet-500/10 rounded border border-violet-500/20 group-hover:border-violet-500/50 transition-colors uppercase tracking-tight">{path.split('/').pop()}</span>
            <span className="text-[10px] font-mono text-zinc-500 truncate lowercase opacity-60 ml-2">{path}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-violet-600 shadow-lg shadow-violet-600/20 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tabular-nums">
            {comments.length} {comments.length === 1 ? 'Insight' : 'Insights'}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-500">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-4 text-zinc-500 bg-black/20">
              <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase">Loading source data...</p>
            </div>
          ) : code ? (
            <CodeView code={code} comments={comments} />
          ) : (
            <div className="p-4 space-y-3">
              {error && (
                <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  {error}
                </div>
              )}
              {comments.map((comment, idx) => (
                <div key={idx} className="p-5 bg-black/40 border border-white/5 rounded-xl hover:border-violet-400/40 transition-all group/item shadow-inner">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-violet-300 bg-violet-500/20 px-3 py-1 rounded-lg border border-violet-500/30 group-hover/item:bg-violet-500 group-hover/item:text-white transition-all duration-300">
                        LINE {comment.line}
                      </span>
                    </div>
                  </div>
                  <div className="text-zinc-300 text-[15px] leading-relaxed font-medium">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{comment.body}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CodeView = ({ code, comments }) => {
  const lines = code.split('\n');
  const commentMap = comments.reduce((acc, c) => {
    if (!acc[c.line]) acc[c.line] = [];
    acc[c.line].push(c);
    return acc;
  }, {});

  return (
    <div className="font-mono text-[13px] leading-6 w-full bg-[#0d1117] rounded-b-2xl border-t border-white/5 overflow-hidden ring-1 ring-inset ring-white/5">
      {lines.map((line, idx) => {
        const lineNum = idx + 1;
        const lineComments = commentMap[lineNum];
        const hasComments = lineComments && lineComments.length > 0;

        return (
          <React.Fragment key={lineNum}>
            <div className={`flex group/line ${hasComments ? 'bg-violet-500/10' : 'hover:bg-white/5'} transition-colors`}>
              <div className="w-12 shrink-0 text-right pr-4 text-zinc-600 select-none border-r border-white/5 bg-black/20 font-bold tabular-nums">
                {lineNum}
              </div>
              <pre className="px-4 flex-1 overflow-x-auto text-zinc-300">
                <code>{line || ' '}</code>
              </pre>
            </div>
            {hasComments && lineComments.map((comment, cIdx) => (
              <div key={cIdx} className="pl-12 pr-6 py-4 bg-violet-600/20 border-y border-violet-500/30 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shadow-[0_0_8px_rgba(167,139,250,0.8)]"></div>
                  <div className="text-sm text-violet-100 font-sans leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{comment.body}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
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
      const response = await fetch('https://confidently-uninvoiced-christine.ngrok-free.dev/webhook/review-mr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
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
    <div className="min-h-screen flex flex-col selection:bg-violet-500/30 font-sans">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-24">
        <div className="flex flex-col items-center mb-24 text-center">
          <div className="w-24 h-24 rounded-3xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-10 shadow-[0_0_60px_rgba(139,92,246,0.2)] ring-1 ring-violet-400/20 group hover:scale-110 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-violet-400 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
          </div>
          <h2 className="text-7xl font-black text-white mb-8 tracking-tighter leading-[1.1]">
            Elevate Your <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">Code Quality</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mb-14 text-xl font-medium leading-relaxed opacity-80">
            Unleash advanced AI diagnostics on your pull requests. We detect vulnerabilities, performance bottlenecks, and architectural anti-patterns in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full max-w-2xl mb-4 bg-white/[0.03] p-2.5 rounded-[2.5rem] border border-white/10 backdrop-blur-xl shadow-2xl focus-within:border-violet-500/50 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all duration-500">
            <input
              type="url"
              placeholder="Enter Pull Request URL..."
              value={prLink}
              onChange={(e) => setPrLink(e.target.value)}
              disabled={loading}
              className="flex-1 w-full bg-transparent text-white placeholder:text-zinc-600 px-8 py-4 rounded-2xl focus:outline-none transition-all font-bold text-xl"
            />
            <ReviewButton onClick={triggerReview} loading={loading} disabled={!prLink} />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 mb-12 flex items-center gap-6 text-red-400 animate-in fade-in slide-in-from-top-6 duration-700">
            <div className="p-3 bg-red-500/20 rounded-xl shadow-lg ring-1 ring-red-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </div>
            <div>
              <p className="text-xs font-black tracking-[0.2em] uppercase mb-1 opacity-70">Analysis Failure</p>
              <p className="text-lg font-bold text-red-400/90">{error}</p>
            </div>
          </div>
        )}

        {data && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <SummaryPanel summary={data.summary} />

            <div className="flex items-center gap-4 mb-10 ml-4">
              <div className="w-2 h-8 bg-violet-600 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.6)]"></div>
              <h3 className="text-base font-black uppercase tracking-[0.4em] text-violet-400/70">Diagnostic Insights</h3>
            </div>

            {Object.keys(groupedComments).length > 0 ? (
              Object.entries(groupedComments).map(([path, comments]) => (
                <FileGroup key={path} path={path} comments={comments} prLink={prLink} />
              ))
            ) : !loading && data && !data.summary ? (
              <div className="text-center py-24 border border-white/5 rounded-[3rem] bg-white/[0.02] backdrop-blur-md shadow-inner">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(52,211,153,0.1)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                </div>
                <p className="text-white font-black text-3xl tracking-tight">System Optimal</p>
                <p className="text-zinc-500 mt-3 text-lg font-medium">No critical vulnerabilities or architectural flaws detected.</p>
              </div>
            ) : null}
          </div>
        )}
      </main>

      <footer className="px-6 py-16 border-t border-white/5 bg-black/40 backdrop-blur-2xl text-center">
        <p className="text-violet-500/30 text-[10px] font-black tracking-[0.6em] uppercase">
          &copy; 2026 AI CODE REVIEWER • QUANTUM ANALYTICS ENGINE
        </p>
      </footer>
    </div>
  );
}
