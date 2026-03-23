import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Components ---

const Header = () => (
  <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10 px-6 py-4 flex justify-between items-center">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
      </div>
      <h1 className="text-xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">AI Reviewer</h1>
    </div>
    <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 uppercase tracking-widest">
      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span> System Active</span>
    </div>
  </header>
);

const ReviewButton = ({ onClick, loading, disabled }) => (
  <button
    disabled={disabled || loading}
    onClick={onClick}
    className={`
      group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300
      ${disabled || loading
        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
        : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/25 active:scale-95'}
    `}
  >
    <div className="flex items-center gap-2">
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Reviewing...
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
          Run Code Review
        </>
      )}
    </div>
  </button>
);

const SummaryPanel = ({ summary }) => {
  if (!summary) return null;
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-8 duration-500">
      <h2 className="text-zinc-400 text-xs font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
        AI Summary
      </h2>
      <div className="prose prose-invert prose-zinc max-w-none prose-headings:font-bold prose-a:text-indigo-400 prose-table:border-collapse prose-th:border prose-th:border-zinc-700 prose-td:border prose-td:border-zinc-800 prose-th:bg-zinc-800/50 prose-th:p-2 prose-td:p-2">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
      </div>
    </div>
  );
};

const FileGroup = ({ path, comments }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-4 border border-zinc-800 bg-zinc-900/30 rounded-xl overflow-hidden duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 text-zinc-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-zinc-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
          <span className="font-mono text-sm text-zinc-300 truncate">{path}</span>
        </div>
        <span className="bg-zinc-800 text-zinc-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tabular-nums">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </span>
      </button>

      {isExpanded && (
        <div className="p-2 space-y-2 border-t border-zinc-800/50">
          {comments.map((comment, idx) => (
            <div key={idx} className="p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-lg hover:border-zinc-700 transition-colors group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 group-hover:text-indigo-400 group-hover:border-indigo-400/30 transition-colors">
                    L{comment.line}
                  </span>
                </div>
              </div>
              <div className="text-zinc-300 text-sm leading-relaxed font-sans">
                {comment.body}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [prLink, setPrLink] = useState('');

  const triggerReview = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://confidently-uninvoiced-christine.ngrok-free.dev/webhook-test/review-mr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ pr_link: prLink })
      });

      if (!response.ok) throw new Error(`API returned ${response.status}`);

      const result = await response.json();
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
    <div className="min-h-screen flex flex-col selection:bg-indigo-500/30">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Code Integrity Check</h2>
          <p className="text-zinc-400 max-w-lg mb-8 text-lg">
            Trigger a deep AI analysis of your merge request. We scan for bugs, security issues, and style improvements.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xl mb-4">
            <input
              type="url"
              placeholder="Paste PR or Repository URL here..."
              value={prLink}
              onChange={(e) => setPrLink(e.target.value)}
              disabled={loading}
              className="flex-1 w-full bg-zinc-900/80 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-sans"
            />
            <ReviewButton onClick={triggerReview} loading={loading} disabled={!prLink} />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 flex items-center gap-3 text-red-400 duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {data && (
          <div className="space-y-2">
            <SummaryPanel summary={data.summary} />

            <div className="flex items-center gap-2 mb-6 text-zinc-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              <h3 className="text-xs font-mono uppercase tracking-widest">Review Comments</h3>
            </div>

            {Object.keys(groupedComments).length > 0 ? (
              Object.entries(groupedComments).map(([path, comments]) => (
                <FileGroup key={path} path={path} comments={comments} />
              ))
            ) : !loading && data && !data.summary ? (
              <div className="text-center py-12 border border-zinc-800 rounded-2xl bg-zinc-900/20">
                <p className="text-zinc-500 italic">No specific comments found. Code looks great!</p>
              </div>
            ) : null}
          </div>
        )}
      </main>

      <footer className="px-6 py-8 border-t border-zinc-900 bg-zinc-950 text-center">
        <p className="text-zinc-600 text-xs font-mono">
          &copy; 2026 AI CODE REVIEWER • POWERED BY N8N & LLM
        </p>
      </footer>
    </div>
  );
}
