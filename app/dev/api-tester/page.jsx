"use client";

import { useState, useCallback } from "react";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const METHOD_COLORS = {
  GET: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
  POST: "text-blue-400 border-blue-500/40 bg-blue-500/10",
  PUT: "text-amber-400 border-amber-500/40 bg-amber-500/10",
  PATCH: "text-purple-400 border-purple-500/40 bg-purple-500/10",
  DELETE: "text-red-400 border-red-500/40 bg-red-500/10",
};

const STATUS_COLOR = (status) => {
  if (status >= 500) return "text-red-400";
  if (status >= 400) return "text-amber-400";
  if (status >= 300) return "text-blue-400";
  return "text-emerald-400";
};

function formatJson(raw) {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

function HeadersEditor({ headers, onChange }) {
  const add = () => onChange([...headers, { key: "", value: "" }]);
  const remove = (i) => onChange(headers.filter((_, idx) => idx !== i));
  const update = (i, field, val) =>
    onChange(headers.map((h, idx) => (idx === i ? { ...h, [field]: val } : h)));

  return (
    <div className="space-y-2">
      {headers.map((h, i) => (
        <div key={i} className="flex gap-2">
          <input
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
            placeholder="Header name"
            value={h.key}
            onChange={(e) => update(i, "key", e.target.value)}
          />
          <input
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
            placeholder="Value"
            value={h.value}
            onChange={(e) => update(i, "value", e.target.value)}
          />
          <button
            onClick={() => remove(i)}
            className="px-2 text-zinc-500 hover:text-red-400 transition-colors"
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        + Add header
      </button>
    </div>
  );
}

function ResponsePanel({ response }) {
  const [tab, setTab] = useState("body");

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      {/* Meta bar */}
      <div className="flex items-center gap-4 px-4 py-2.5 border-b border-zinc-800">
        <span className={`text-sm font-semibold ${STATUS_COLOR(response.status)}`}>
          {response.status} {response.statusText}
        </span>
        <span className="text-xs text-zinc-500">{response.time}ms</span>
        {response.ok ? (
          <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full">OK</span>
        ) : (
          <span className="text-[10px] bg-red-500/10 border border-red-500/30 text-red-400 px-2 py-0.5 rounded-full">Error</span>
        )}
        <span className="ml-auto text-[10px] text-zinc-600 truncate max-w-65">{response.url}</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800">
        {["body", "headers"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs capitalize transition-colors ${
              tab === t
                ? "text-zinc-100 border-b-2 border-zinc-100 -mb-px"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t}
            {t === "headers" && (
              <span className="ml-1.5 text-zinc-600">
                ({Object.keys(response.resHeaders).length})
              </span>
            )}
          </button>
        ))}
        <button
          onClick={() => navigator.clipboard.writeText(
            tab === "body" ? formatJson(response.data) : JSON.stringify(response.resHeaders, null, 2)
          )}
          className="ml-auto px-4 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Copy
        </button>
      </div>

      {/* Body */}
      {tab === "body" && (
        <pre className="p-4 text-xs text-zinc-300 overflow-auto max-h-120 leading-relaxed whitespace-pre-wrap wrap-break-word">
          {response.data.trim() === ""
            ? <span className="text-zinc-600 italic">empty body</span>
            : formatJson(response.data)}
        </pre>
      )}

      {/* Response headers */}
      {tab === "headers" && (
        <div className="p-4 space-y-1.5 overflow-auto max-h-120">
          {Object.entries(response.resHeaders).map(([k, v]) => (
            <div key={k} className="flex gap-3 text-xs">
              <span className="text-zinc-500 min-w-45 shrink-0">{k}</span>
              <span className="text-zinc-300 break-all">{v}</span>
            </div>
          ))}
          {Object.keys(response.resHeaders).length === 0 && (
            <p className="text-zinc-600 italic text-xs">No headers returned</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ApiTesterPage() {
  const [method, setMethod] = useState("GET");
  const [path, setPath] = useState("/designs");
  const [body, setBody] = useState("");
  const [headers, setHeaders] = useState([]);
  const [activeTab, setActiveTab] = useState("body"); // body | headers

  const [response, setResponse] = useState(null); // { status, statusText, data, time, ok }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const send = useCallback(async () => {
    const trimmedPath = path.startsWith("/") ? path : `/${path}`;
    const url = `/api/proxy/v1${trimmedPath}`;

    setLoading(true);
    setResponse(null);
    setError(null);

    const reqHeaders = { "Content-Type": "application/json" };
    for (const { key, value } of headers) {
      if (key.trim()) reqHeaders[key.trim()] = value;
    }

    const init = {
      method,
      credentials: "include",
      headers: reqHeaders,
    };

    if (!["GET", "HEAD"].includes(method) && body.trim()) {
      init.body = body;
    }

    const start = Date.now();
    try {
      const res = await fetch(url, init);
      const elapsed = Date.now() - start;
      const text = await res.text();

      // Capture all response headers
      const resHeaders = {};
      res.headers.forEach((value, key) => { resHeaders[key] = value; });

      setResponse({
        status: res.status,
        statusText: res.statusText,
        data: text,
        time: elapsed,
        ok: res.ok,
        url,
        resHeaders,
      });
    } catch (err) {
      // Network-level failure — surface exactly as-is
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [method, path, body, headers]);

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") send();
  };

  const hasBody = !["GET", "HEAD"].includes(method);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 font-mono">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">API Tester</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Requests proxied through <span className="text-zinc-400">/api/proxy/v1</span>
          </p>
        </div>

        {/* Request bar */}
        <div className="flex gap-2">
          {/* Method selector */}
          <div className="relative">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className={`appearance-none bg-zinc-900 border rounded px-3 py-2 text-sm font-semibold cursor-pointer focus:outline-none ${METHOD_COLORS[method]}`}
            >
              {METHODS.map((m) => (
                <option key={m} value={m} className="bg-zinc-900 text-zinc-100">
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Path input */}
          <div className="flex-1 flex items-center bg-zinc-900 border border-zinc-700 rounded px-3 gap-1 focus-within:border-zinc-500 transition-colors">
            <span className="text-zinc-600 text-sm select-none">/api/v1</span>
            <input
              className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none py-2"
              placeholder="/designs"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
            />
          </div>

          {/* Send button */}
          <button
            onClick={send}
            disabled={loading}
            className="px-5 py-2 bg-zinc-100 text-zinc-900 text-sm font-semibold rounded hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>

        {/* Request options tabs */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="flex border-b border-zinc-800">
            {(hasBody ? ["body", "headers"] : ["headers"]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs capitalize transition-colors ${
                  activeTab === tab
                    ? "text-zinc-100 border-b-2 border-zinc-100 -mb-px"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab}
                {tab === "headers" && headers.filter((h) => h.key).length > 0 && (
                  <span className="ml-1.5 bg-zinc-700 text-zinc-300 text-[10px] px-1.5 py-0.5 rounded-full">
                    {headers.filter((h) => h.key).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-4">
            {activeTab === "body" && hasBody && (
              <textarea
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 resize-none font-mono"
                rows={8}
                placeholder={'{\n  "key": "value"\n}'}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                spellCheck={false}
              />
            )}
            {activeTab === "headers" && (
              <HeadersEditor headers={headers} onChange={setHeaders} />
            )}
            {activeTab === "body" && !hasBody && (
              <p className="text-zinc-600 text-xs">GET requests have no body.</p>
            )}
          </div>
        </div>

        {/* Keyboard hint */}
        <p className="text-[11px] text-zinc-600">
          Press <kbd className="bg-zinc-800 border border-zinc-700 rounded px-1">Ctrl</kbd> +{" "}
          <kbd className="bg-zinc-800 border border-zinc-700 rounded px-1">Enter</kbd> to send
        </p>

        {/* Response */}
        {error && (
          <div className="bg-red-950/40 border border-red-800/50 rounded-lg p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {response && <ResponsePanel response={response} />}
      </div>
    </div>
  );
}
