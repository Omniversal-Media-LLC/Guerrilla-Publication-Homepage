import React, { useState, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";

// --- MCP INTEGRATION ---
const MCP_URL = "https://mcp.omniversal.vip/mcp/";
const CASE_NUMBER = "2023EM503094";

interface MCPDocument {
  key: string;
  name: string;
  size?: number;
  uploaded?: string;
}

async function mcpCall<T>(toolName: string, args: Record<string, unknown>): Promise<T> {
  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "tools/call",
      params: { name: toolName, arguments: args },
      id: Date.now(),
    }),
  });
  const data = await res.json();
  const text = data?.result?.content?.[0]?.text;
  if (!text) throw new Error("No content from MCP server");
  return JSON.parse(text) as T;
}

// --- CURATED DOCUMENT INDEX (real keys from MCP R2) ---
const CURATED_DOCUMENTS = [
  {
    id: "GJ-2026-001",
    title: "Petition for Writ of Mandamus — Signed",
    caseRef: "Bexar Co. 2023EM503094",
    type: "PETITION",
    key: "cases/2023EM503094/01__Import_Staging/BATCH__20260401-053736/01__Import_Staging/Jaimee-Collins-Cassandra-Wren/AcceptedFilings-Appeals/PetitionForWritOfMandamus-Signed.pdf",
  },
  {
    id: "GJ-2026-002",
    title: "Emergency Motion for Relief",
    caseRef: "TX 4th CoA 04-26-00210-CV",
    type: "MOTION",
    key: "cases/2023EM503094/01__Import_Staging/BATCH__20260401-053736/01__Import_Staging/Jaimee-Collins-Cassandra-Wren/AcceptedFilings-Appeals/EmergencyRelief.pdf",
  },
  {
    id: "GJ-2026-003",
    title: "ICWA Cross-Petition — PFR to OAG (Final)",
    caseRef: "Bexar Co. 2023EM503094",
    type: "PETITION",
    key: "cases/2023EM503094/01__Import_Staging/BATCH__20260401-053736/01__Import_Staging/Jaimee-Collins-Cassandra-Wren/AcceptedFilings-Appeals/ICWA Cross-Petition PFR OAG final.pdf",
  },
  {
    id: "GJ-2026-004",
    title: "Motion to Transfer Venue to Llano County",
    caseRef: "Bexar Co. 2023EM503094",
    type: "MOTION",
    key: "cases/2023EM503094/01__Import_Staging/BATCH__20260401-053736/01__Import_Staging/01_Motion_to_Transfer.pdf",
  },
  {
    id: "GJ-2026-005",
    title: "Final SAPCR Order — Llano County",
    caseRef: "Llano Co. 2023EM503094",
    type: "ORDER",
    key: "cases/2023EM503094/01__Import_Staging/BATCH__20260401-053736/01__Import_Staging/01_final_order_sapcr_llano_final.pdf",
  },
  {
    id: "GJ-2026-006",
    title: "Register of Actions — 03/23/2026",
    caseRef: "Bexar Co. 2023EM503094",
    type: "DOCKET",
    key: "cases/2023EM503094/01__Import_Staging/BATCH__20260401-053736/01__Import_Staging/Jaimee-Collins-Cassandra-Wren/AcceptedFilings-Appeals/registerofactions-3-23-2026.pdf",
  },
  {
    id: "GJ-2026-007",
    title: "Objections to Motion to Transfer Venue",
    caseRef: "Bexar Co. 2023EM503094",
    type: "RESPONSE",
    key: "cases/2023EM503094/01__Import_Staging/BATCH__20260401-053736/01__Import_Staging/Jaimee-Collins-Cassandra-Wren/AcceptedFilings-Appeals/Objections to Motion to Transfer Venue.pdf",
  },
  {
    id: "GJ-2026-008",
    title: "4th Court of Appeals — Order 03/16/2026",
    caseRef: "TX 4th CoA 04-26-00210-CV",
    type: "ORDER",
    key: "cases/2023EM503094/01__Import_Staging/BATCH__20260401-053736/01__Import_Staging/04-26-00210-CV_04-26-00210-CV Order 03162026.pdf",
  },
];

// --- STATIC DATA ARRAYS ---
const marqueeHeadlines = [
  "2023EM503094: SAPCR pending mandatory transfer — Bexar to Llano County",
  "4th CoA 04-26-00210-CV: Emergency relief motion filed — ruling pending",
  "ICWA cross-petition submitted to OAG — response outstanding",
  "Wheeler Law PLLC withdrawal at critical hearing stage — malpractice alleged",
  "Writ of Mandamus filed: Judge Jimenez ordered to compel transfer",
  "Register of Actions updated 03/23/2026 — multiple motions pending",
  "Adoption proceeding 26-150-DCFAM-23569 — related matter active",
];

const investigations = [
  {
    title: "The Transfer That Never Came: Bexar to Llano",
    deck: "Court record documents months of procedural delay on a mandatory venue transfer that should have been automatic under Texas Family Code.",
    location: "BEXAR & LLANO COUNTY, TX",
    status: "DEVELOPING",
  },
  {
    title: "Wheeler Law PLLC: Withdrawal at the Worst Moment",
    deck: "An attorney's sudden withdrawal mid-case left a pro se litigant facing complex family court proceedings without counsel — billing records obtained.",
    location: "BEXAR COUNTY, TX",
    status: "DEVELOPING",
  },
  {
    title: "ICWA and the OAG: A Cross-Petition in Limbo",
    deck: "The Indian Child Welfare Act cross-petition filed with the OAG has received no response. Examining what the law requires and what has been ignored.",
    location: "AUSTIN, TX",
    status: "DEVELOPING",
  },
  {
    title: "4th CoA 04-26-00210-CV: Emergency Relief Denied",
    deck: "The Texas Fourth Court of Appeals declined to grant emergency mandamus relief. The underlying procedural record raises serious questions.",
    location: "SAN ANTONIO, TX",
    status: "PUBLISHED",
  },
];

const courtDocuments = [
  {
    type: "PETITION",
    title: "Petition for Writ of Mandamus — Signed",
    case: "Bexar Co. 2023EM503094",
    date: "2026-03-18",
  },
  {
    type: "MOTION",
    title: "Emergency Motion for Relief",
    case: "4th CoA 04-26-00210-CV",
    date: "2026-03-18",
  },
  {
    type: "ORDER",
    title: "4th Court of Appeals Order",
    case: "04-26-00210-CV",
    date: "2026-03-16",
  },
  {
    type: "PETITION",
    title: "ICWA Cross-Petition — PFR to OAG",
    case: "Bexar Co. 2023EM503094",
    date: "2026-02-12",
  },
];

const liveUpdates = [
  { time: "09:14 CDT", day: "today", text: "MCP document index refreshed — 785 case files confirmed in repository." },
  { time: "Yesterday 16:40", day: "prev", text: "Register of Actions (03/23/2026) confirmed current. No new docket entries posted." },
  { time: "Yesterday 11:22", day: "prev", text: "4th CoA case 04-26-00210-CV: No new orders on file. Petition for mandamus still pending review." },
  { time: "06/20 14:55", day: "prev", text: "ICWA cross-petition status: OAG has not issued formal response. Deadline analysis underway." },
  { time: "06/18 09:30", day: "prev", text: "Venue transfer: Bexar County docket reflects no order on mandatory transfer. Delay now exceeds statutory threshold." },
];

// --- DOCUMENT VIEWER MODAL ---
interface DocViewerState {
  isOpen: boolean;
  doc: typeof CURATED_DOCUMENTS[0] | null;
  content: string;
  loading: boolean;
  error: string | null;
}

function DocumentViewerModal({
  state,
  onClose,
}: {
  state: DocViewerState;
  onClose: () => void;
}) {
  useEffect(() => {
    if (state.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [state.isOpen]);

  if (!state.isOpen || !state.doc) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        backgroundColor: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        overflowY: "auto",
        padding: "40px 16px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "860px",
          backgroundColor: "#0d0d0d",
          border: "1px solid rgba(240,237,232,0.12)",
          borderTop: "3px solid #b5352a",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid rgba(240,237,232,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.2em",
                color: "#c9953a",
                marginBottom: "6px",
              }}
            >
              {state.doc.id} — {state.doc.type}
            </div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "18px",
                color: "#f0ede8",
                lineHeight: 1.3,
              }}
            >
              {state.doc.title}
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "10px",
                color: "#4a4542",
                marginTop: "6px",
                letterSpacing: "0.15em",
              }}
            >
              {state.doc.caseRef}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#7a7570",
              cursor: "pointer",
              padding: "4px",
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Source key */}
        <div
          style={{
            padding: "8px 24px",
            borderBottom: "1px solid rgba(240,237,232,0.08)",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "9px",
            color: "#4a4542",
            letterSpacing: "0.1em",
            wordBreak: "break-all",
          }}
        >
          SOURCE: {state.doc.key}
        </div>

        {/* Modal Content */}
        <div
          style={{
            padding: "24px",
            minHeight: "300px",
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          {state.loading && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "200px",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#b5352a",
                  animation: "pulse-dot 1.5s infinite",
                }}
              />
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "11px",
                  color: "#7a7570",
                  letterSpacing: "0.15em",
                }}
              >
                RETRIEVING FROM DOCUMENT REPOSITORY...
              </div>
            </div>
          )}

          {state.error && (
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "12px",
                color: "#b5352a",
                padding: "16px",
                border: "1px solid rgba(181,53,42,0.3)",
                backgroundColor: "rgba(181,53,42,0.05)",
              }}
            >
              ERROR: {state.error}
              <div style={{ color: "#7a7570", fontSize: "10px", marginTop: "8px" }}>
                Document text extraction may not be available for this file type. Check the source key above.
              </div>
            </div>
          )}

          {!state.loading && !state.error && state.content && (
            <pre
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "12px",
                color: "#c8c5c0",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                margin: 0,
                backgroundColor: "transparent",
              }}
            >
              {state.content}
            </pre>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: "12px 24px",
            borderTop: "1px solid rgba(240,237,232,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "9px",
              color: "#4a4542",
              letterSpacing: "0.15em",
            }}
          >
            GUERRILLA JOURNALISM DOCUMENT REPOSITORY — CASE {CASE_NUMBER}
          </div>
          <button
            onClick={onClose}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "11px",
              color: "#7a7570",
              background: "none",
              border: "1px solid rgba(240,237,232,0.1)",
              padding: "6px 14px",
              cursor: "pointer",
              letterSpacing: "0.1em",
            }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

// --- LIVE DOCUMENT BROWSER (fetched from MCP) ---
function LiveDocumentBrowser() {
  const [docs, setDocs] = useState<MCPDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewerState, setViewerState] = useState<DocViewerState>({
    isOpen: false, doc: null, content: "", loading: false, error: null,
  });

  const loadDocs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await mcpCall<{ documents: MCPDocument[]; count: number }>(
        "list_documents",
        { case_number: CASE_NUMBER, limit: 200 }
      );
      const pdfs = result.documents.filter(
        (d) => d.name.endsWith(".pdf") || d.name.endsWith(".md") || d.name.endsWith(".txt")
      );
      setDocs(pdfs);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (expanded && docs.length === 0) {
      loadDocs();
    }
  }, [expanded, docs.length, loadDocs]);

  const openDoc = async (doc: MCPDocument) => {
    const fakeDoc = {
      id: "LIVE",
      title: doc.name.replace(/\.[^.]+$/, "").replace(/_/g, " "),
      caseRef: CASE_NUMBER,
      type: doc.name.endsWith(".pdf") ? "PDF" : "DOCUMENT",
      key: doc.key,
    };
    setViewerState({ isOpen: true, doc: fakeDoc, content: "", loading: true, error: null });
    try {
      const result = await mcpCall<{ text?: string; key: string }>(
        "get_document_by_name",
        { name: doc.key, case_number: CASE_NUMBER, max_chars: 60000 }
      );
      setViewerState((s) => ({ ...s, content: result.text || "(No text content extracted for this file)", loading: false }));
    } catch (e) {
      setViewerState((s) => ({ ...s, loading: false, error: String(e) }));
    }
  };

  const filtered = docs.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <DocumentViewerModal state={viewerState} onClose={() => setViewerState((s) => ({ ...s, isOpen: false }))} />
      <div style={{ marginTop: "24px", borderTop: "1px solid rgba(240,237,232,0.08)", paddingTop: "24px" }}>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "11px",
              letterSpacing: "0.2em",
              color: "#7a7570",
            }}
          >
            {expanded ? "COLLAPSE" : "BROWSE ALL CASE FILES"}
          </span>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10px",
              color: "#c9953a",
              backgroundColor: "rgba(201,149,58,0.1)",
              border: "1px solid rgba(201,149,58,0.2)",
              padding: "2px 8px",
            }}
          >
            LIVE — {CASE_NUMBER}
          </span>
          <span style={{ color: "#4a4542", fontSize: "14px" }}>{expanded ? "▲" : "▼"}</span>
        </button>

        {expanded && (
          <div style={{ marginTop: "16px" }}>
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                maxWidth: "400px",
                backgroundColor: "transparent",
                border: "1px solid rgba(240,237,232,0.15)",
                color: "#f0ede8",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "12px",
                padding: "8px 12px",
                outline: "none",
                marginBottom: "16px",
                boxSizing: "border-box",
              }}
            />

            {loading && (
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: "#7a7570", letterSpacing: "0.15em", padding: "16px 0" }}>
                LOADING FROM MCP REPOSITORY...
              </div>
            )}
            {error && (
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: "#b5352a", padding: "8px" }}>
                ERROR: {error}
              </div>
            )}

            {!loading && !error && (
              <div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#4a4542", letterSpacing: "0.15em", marginBottom: "12px" }}>
                  {filtered.length} DOCUMENTS INDEXED {searchTerm ? `(FILTERED FROM ${docs.length})` : ""}
                </div>
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {filtered.slice(0, 100).map((doc, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 4px",
                        borderBottom: "1px solid rgba(240,237,232,0.06)",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: "11px",
                          color: "#c8c5c0",
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={doc.key}
                      >
                        {doc.name}
                      </div>
                      {doc.uploaded && (
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "#4a4542", flexShrink: 0 }}>
                          {doc.uploaded.slice(0, 10)}
                        </div>
                      )}
                      <button
                        onClick={() => openDoc(doc)}
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: "10px",
                          color: "#b5352a",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          flexShrink: 0,
                          padding: "0 4px",
                        }}
                      >
                        VIEW →
                      </button>
                    </div>
                  ))}
                  {filtered.length > 100 && (
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#4a4542", padding: "12px 4px" }}>
                      Showing 100 of {filtered.length} — use search to narrow results.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// --- KEYWORD SEARCH ---
interface SearchHit {
  key: string;
  name: string;
  snippet: string;
}

function KeywordSearch({
  onOpenDoc,
}: {
  onOpenDoc: (key: string, name: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const runSearch = useCallback(async (term: string) => {
    if (!term.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    setQuery(term);
    try {
      const result = await mcpCall<{
        results: Array<{ key: string; name: string; snippet: string }>;
        count: number;
      }>("search_documents_by_keyword", {
        keyword: term,
        case_number: CASE_NUMBER,
        limit: 25,
        snippet_chars: 400,
      });
      setResults(result.results ?? []);
    } catch (e) {
      setError(String(e));
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") runSearch(inputValue);
  };

  return (
    <div
      style={{
        borderTop: "1px solid rgba(240,237,232,0.08)",
        paddingTop: "32px",
        marginTop: "32px",
      }}
    >
      {/* Search header */}
      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "11px",
            letterSpacing: "0.25em",
            color: "#7a7570",
            marginBottom: "6px",
          }}
        >
          FULL-TEXT DOCUMENT SEARCH
        </div>
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "9px",
            color: "#4a4542",
            letterSpacing: "0.1em",
          }}
        >
          Searches across all indexed case files — including documents you upload to the repository.
          Results update automatically as new files are added.
        </div>
      </div>

      {/* Search input */}
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0", marginBottom: "24px" }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search case documents — e.g. mandamus, transfer, ICWA, Wheeler..."
          style={{
            flex: 1,
            backgroundColor: "#111111",
            border: "1px solid rgba(240,237,232,0.15)",
            borderRight: "none",
            color: "#f0ede8",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "12px",
            padding: "12px 16px",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={loading || !inputValue.trim()}
          style={{
            backgroundColor: loading ? "#222" : "#b5352a",
            color: "#f0ede8",
            border: "1px solid rgba(240,237,232,0.15)",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "11px",
            letterSpacing: "0.15em",
            padding: "12px 20px",
            cursor: loading ? "wait" : "pointer",
            whiteSpace: "nowrap",
            transition: "background-color 0.15s",
          }}
        >
          {loading ? "SEARCHING..." : "SEARCH →"}
        </button>
      </form>

      {/* Quick suggestion pills */}
      {!searched && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
          {["mandamus", "transfer venue", "ICWA", "Wheeler Law", "Jimenez", "emergency relief", "Llano County", "malpractice"].map((term) => (
            <button
              key={term}
              onClick={() => { setInputValue(term); runSearch(term); }}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "10px",
                color: "#7a7570",
                backgroundColor: "transparent",
                border: "1px solid rgba(240,237,232,0.1)",
                padding: "4px 10px",
                cursor: "pointer",
                letterSpacing: "0.08em",
              }}
            >
              {term}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "11px",
            color: "#b5352a",
            padding: "12px",
            border: "1px solid rgba(181,53,42,0.2)",
            backgroundColor: "rgba(181,53,42,0.05)",
            marginBottom: "16px",
          }}
        >
          SEARCH ERROR: {error}
        </div>
      )}

      {/* Results */}
      {searched && !loading && !error && (
        <div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10px",
              color: "#4a4542",
              letterSpacing: "0.15em",
              marginBottom: "16px",
              paddingBottom: "12px",
              borderBottom: "1px solid rgba(240,237,232,0.06)",
            }}
          >
            {results.length === 0
              ? `NO RESULTS FOR "${query.toUpperCase()}" — try a different keyword`
              : `${results.length} RESULT${results.length !== 1 ? "S" : ""} FOR "${query.toUpperCase()}"`}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {results.map((hit, i) => (
              <div
                key={i}
                style={{
                  padding: "16px 0",
                  borderBottom: "1px solid rgba(240,237,232,0.06)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {/* File name + VIEW */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "12px",
                        color: "#c9953a",
                        marginBottom: "4px",
                        wordBreak: "break-word",
                      }}
                    >
                      {hit.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "9px",
                        color: "#4a4542",
                        wordBreak: "break-all",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {hit.key}
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenDoc(hit.key, hit.name)}
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "10px",
                      color: "#b5352a",
                      background: "none",
                      border: "1px solid rgba(181,53,42,0.25)",
                      padding: "4px 10px",
                      cursor: "pointer",
                      flexShrink: 0,
                      letterSpacing: "0.1em",
                    }}
                  >
                    VIEW →
                  </button>
                </div>

                {/* Snippet */}
                {hit.snippet && (
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "12px",
                      color: "#7a7570",
                      lineHeight: 1.6,
                      backgroundColor: "rgba(255,255,255,0.02)",
                      padding: "10px 12px",
                      borderLeft: "2px solid rgba(201,149,58,0.3)",
                    }}
                  >
                    {hit.snippet}
                  </div>
                )}
              </div>
            ))}
          </div>

          {results.length > 0 && (
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "9px",
                color: "#4a4542",
                marginTop: "16px",
                letterSpacing: "0.1em",
              }}
            >
              Showing top {results.length} matches — refine your search for more specific results.
              New documents uploaded to the repository will appear automatically.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- STYLES ---
const customStyles = `
  html { scroll-behavior: smooth; }
  body {
    background-color: #0a0a0a;
    color: #f0ede8;
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
  }
  
  .font-playfair { font-family: 'Playfair Display', serif; }
  .font-mono { font-family: 'IBM Plex Mono', monospace; }
  .font-inter { font-family: 'Inter', sans-serif; }

  .bg-base { background-color: #0a0a0a; }
  .bg-card { background-color: #111111; }
  .bg-document { background-color: #0d0d0d; }
  
  .text-primary { color: #b5352a; }
  .bg-primary { background-color: #b5352a; }
  
  .text-gold { color: #c9953a; }
  .bg-gold { background-color: #c9953a; }
  
  .text-white-warm { color: #f0ede8; }
  .text-muted { color: #7a7570; }
  .text-dim { color: #4a4542; }

  .border-subtle { border-color: rgba(240, 237, 232, 0.08); }
  
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-marquee {
    display: inline-block;
    white-space: nowrap;
    animation: marquee 40s linear infinite;
  }
  .marquee-container {
    overflow: hidden;
    white-space: nowrap;
    display: flex;
    flex-wrap: nowrap;
  }

  @keyframes pulse-dot {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(181, 53, 42, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 4px rgba(181, 53, 42, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(181, 53, 42, 0); }
  }
  .pulse-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #b5352a;
    display: inline-block;
    animation: pulse-dot 2s infinite;
  }

  .grid-bg {
    background-image: 
      repeating-linear-gradient(rgba(240, 237, 232, 0.03) 0 1px, transparent 1px 100%),
      repeating-linear-gradient(90deg, rgba(240, 237, 232, 0.03) 0 1px, transparent 1px 100%);
    background-size: 40px 40px;
  }
`;

// --- MAIN APP ---
export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [viewerState, setViewerState] = useState<DocViewerState>({
    isOpen: false,
    doc: null,
    content: "",
    loading: false,
    error: null,
  });

  const openCuratedDoc = async (doc: typeof CURATED_DOCUMENTS[0]) => {
    setViewerState({ isOpen: true, doc, content: "", loading: true, error: null });
    try {
      const result = await mcpCall<{ text?: string; key: string }>(
        "get_document_by_name",
        { name: doc.key, case_number: CASE_NUMBER, max_chars: 60000 }
      );
      setViewerState((s) => ({
        ...s,
        content: result.text || "(No text content extracted for this file. PDF text sidecar may not yet exist.)",
        loading: false,
      }));
    } catch (e) {
      setViewerState((s) => ({ ...s, loading: false, error: String(e) }));
    }
  };

  const openLiveDoc = async (key: string, name: string) => {
    const fakeDoc = {
      id: "SEARCH",
      title: name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      caseRef: CASE_NUMBER,
      type: key.endsWith(".pdf") ? "PDF" : "DOCUMENT",
      key,
    };
    setViewerState({ isOpen: true, doc: fakeDoc, content: "", loading: true, error: null });
    try {
      const result = await mcpCall<{ text?: string; key: string }>(
        "get_document_by_name",
        { name: key, case_number: CASE_NUMBER, max_chars: 60000 }
      );
      setViewerState((s) => ({
        ...s,
        content: result.text || "(No text content extracted for this file. PDF text sidecar may not yet exist.)",
        loading: false,
      }));
    } catch (e) {
      setViewerState((s) => ({ ...s, loading: false, error: String(e) }));
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <DocumentViewerModal
        state={viewerState}
        onClose={() => setViewerState((s) => ({ ...s, isOpen: false }))}
      />

      <div className="min-h-screen bg-base text-white-warm flex flex-col">

        {/* 1. TOP BAR */}
        <div
          className="bg-document border-b border-subtle py-2 px-4 md:px-8 flex justify-between items-center text-muted font-mono"
          style={{ fontSize: "10px", letterSpacing: "0.2em" }}
        >
          <div>OMNIVERSAL MEDIA NETWORK</div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white-warm transition-colors">𝕏</a>
            <a href="#" className="hover:text-white-warm transition-colors">S</a>
            <a href="#" className="hover:text-white-warm transition-colors">⊞</a>
          </div>
        </div>

        {/* 2. NAV */}
        <nav
          className="sticky top-0 z-50 border-b border-subtle backdrop-blur-md px-4 md:px-8 py-4 flex items-center justify-between"
          style={{ backgroundColor: "rgba(10,10,10,0.95)" }}
        >
          <div className="font-playfair font-bold text-[20px] whitespace-nowrap">
            <span className="text-white-warm">GUERRILLA</span>{" "}
            <span className="text-primary">JOURNALISM</span>
          </div>

          <div
            className="hidden md:flex space-x-8 items-center font-inter text-[12px] uppercase text-muted"
            style={{ letterSpacing: "0.15em" }}
          >
            <a href="#investigations" className="hover:text-white-warm transition-colors">Investigations</a>
            <a href="#documents" className="hover:text-white-warm transition-colors">Reports</a>
            <a href="#index" className="hover:text-white-warm transition-colors">Documents</a>
            <a href="#live" className="hover:text-white-warm transition-colors">Live Feed</a>
            <a href="#about" className="hover:text-white-warm transition-colors">About</a>
          </div>

          <div className="hidden md:block">
            <button
              className="bg-primary text-white-warm font-inter font-bold text-[11px] uppercase px-4 py-2 hover:opacity-90 transition-opacity"
              style={{ letterSpacing: "0.1em" }}
            >
              SUBSCRIBE
            </button>
          </div>

          <button
            className="md:hidden text-white-warm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden bg-card border-b border-subtle absolute top-full left-0 w-full z-40 p-4 flex flex-col space-y-4 font-inter text-[12px] uppercase text-muted"
            style={{ letterSpacing: "0.15em" }}
          >
            <a href="#investigations" onClick={() => setMobileMenuOpen(false)}>Investigations</a>
            <a href="#documents" onClick={() => setMobileMenuOpen(false)}>Reports</a>
            <a href="#index" onClick={() => setMobileMenuOpen(false)}>Documents</a>
            <a href="#live" onClick={() => setMobileMenuOpen(false)}>Live Feed</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
            <button className="bg-primary text-white-warm font-bold text-[11px] px-4 py-2 mt-4 self-start">
              SUBSCRIBE
            </button>
          </div>
        )}

        {/* 3. HERO */}
        <section className="relative w-full min-h-[100dvh] bg-base grid-bg flex flex-col justify-center px-4 md:px-8 py-20">
          <div
            className="absolute top-8 right-4 md:right-8 flex items-center space-x-2 px-3 py-1 border rounded-none"
            style={{ backgroundColor: "rgba(181,53,42,0.15)", borderColor: "rgba(181,53,42,0.3)" }}
          >
            <span className="pulse-dot"></span>
            <span className="font-mono text-[11px] text-primary">LIVE</span>
          </div>

          <div className="max-w-4xl">
            <h1 className="font-playfair text-[48px] md:text-[64px] lg:text-[80px] text-white-warm leading-tight mb-6">
              Where the Record Speaks for Itself
            </h1>
            <p className="font-inter text-[18px] text-muted max-w-[540px] mb-10 leading-relaxed">
              Independent investigative journalism. Court records. Public documents. The truth in its own words.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="#investigations"
                className="bg-primary text-white-warm font-inter text-sm px-6 py-3 hover:opacity-90 transition-opacity text-center"
              >
                Latest Investigation →
              </a>
              <a
                href="#index"
                className="bg-transparent border text-white-warm font-inter text-sm px-6 py-3 hover:bg-white/5 transition-colors text-center"
                style={{ borderColor: "rgba(240,237,232,0.2)" }}
              >
                Document Index →
              </a>
            </div>
          </div>
        </section>

        {/* 4. BREAKING/LIVE FEED STRIP */}
        <div id="live" className="w-full bg-gold py-2 flex items-center relative overflow-hidden">
          <div
            className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-3"
            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
          >
            <span className="font-mono font-bold text-[10px] text-white-warm">DEVELOPING</span>
          </div>
          <div className="marquee-container w-full ml-28">
            <div className="animate-marquee font-mono text-[12px] text-white-warm flex space-x-4">
              {marqueeHeadlines.map((h, i) => (
                <span key={i} className="flex items-center">
                  <span>{h}</span>
                  <span className="mx-4">◆</span>
                </span>
              ))}
              {marqueeHeadlines.map((h, i) => (
                <span key={`dup-${i}`} className="flex items-center">
                  <span>{h}</span>
                  <span className="mx-4">◆</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 5. FEATURED INVESTIGATION CARD */}
        <section id="investigations" className="w-full px-4 md:px-8 py-12 bg-base">
          <div
            className="bg-card w-full border-t-[3px] p-8 md:p-12 lg:p-16 relative"
            style={{ borderTopColor: "#b5352a" }}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8 space-y-4 md:space-y-0">
              <span
                className="font-mono text-[10px] text-muted uppercase"
                style={{ letterSpacing: "0.2em" }}
              >
                FEATURED INVESTIGATION
              </span>
              <div
                className="flex items-center space-x-2 px-3 py-1 border rounded-none"
                style={{ backgroundColor: "rgba(181,53,42,0.15)", borderColor: "rgba(181,53,42,0.3)" }}
              >
                <span className="pulse-dot"></span>
                <span className="font-mono text-[11px] text-primary">DEVELOPING</span>
              </div>
            </div>

            <h2 className="font-playfair italic text-[36px] md:text-[42px] lg:text-[52px] text-white-warm mb-6 leading-tight">
              The Court That Wouldn't Transfer
            </h2>

            <p className="font-inter text-[16px] text-muted max-w-[640px] mb-8 leading-relaxed">
              A multi-year investigation into procedural obstruction, attorney withdrawal, and venue manipulation
              in a Texas SAPCR case — Case No. 2023EM503094 — that should have transferred by law. Still active
              across Bexar County, Llano County, and the 4th Court of Appeals.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <div
                className="px-3 py-1 border font-mono text-[11px] text-gold flex space-x-2 items-center"
                style={{ backgroundColor: "rgba(201,149,58,0.15)", borderColor: "rgba(201,149,58,0.3)" }}
              >
                <span>Bexar Co. 2023EM503094</span>
                <span className="opacity-50">|</span>
                <span>SAPCR PENDING</span>
              </div>
              <div
                className="px-3 py-1 border font-mono text-[11px] text-gold flex space-x-2 items-center"
                style={{ backgroundColor: "rgba(201,149,58,0.15)", borderColor: "rgba(201,149,58,0.3)" }}
              >
                <span>4th CoA 04-26-00210-CV</span>
                <span className="opacity-50">|</span>
                <span>ACTIVE</span>
              </div>
              <div
                className="px-3 py-1 border font-mono text-[11px] text-gold flex space-x-2 items-center"
                style={{ backgroundColor: "rgba(201,149,58,0.15)", borderColor: "rgba(201,149,58,0.3)" }}
              >
                <span>Adoption 26-150-DCFAM-23569</span>
                <span className="opacity-50">|</span>
                <span>RELATED</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-subtle pt-6 mt-auto">
              <button
                onClick={() => openCuratedDoc(CURATED_DOCUMENTS[0])}
                className="font-inter text-primary text-sm font-medium hover:underline mb-4 sm:mb-0 text-left bg-transparent border-none cursor-pointer p-0"
              >
                Read Investigation — Open Writ of Mandamus →
              </button>
              <span
                className="font-mono text-[10px] text-dim uppercase"
                style={{ letterSpacing: "0.2em" }}
              >
                BEXAR & LLANO COUNTY, TX
              </span>
            </div>
          </div>
        </section>

        {/* 6. FEED GRID (3 columns) */}
        <section className="px-4 md:px-8 py-12 bg-base">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Col 1: INVESTIGATIONS */}
            <div>
              <div
                className="font-mono text-[11px] text-muted uppercase pb-3 border-b border-subtle relative mb-6"
                style={{ letterSpacing: "0.2em" }}
              >
                INVESTIGATIONS
                <div className="absolute bottom-[-1px] left-0 w-12 h-[1px] bg-primary"></div>
              </div>
              <div className="space-y-6">
                {investigations.map((item, idx) => (
                  <div key={idx} className="pb-6 border-b border-subtle last:border-0">
                    <h3 className="font-playfair text-[18px] text-white-warm mb-2">{item.title}</h3>
                    <p className="font-inter text-[13px] text-muted mb-4 line-clamp-2">{item.deck}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-dim">{item.location}</span>
                      <span className="font-mono text-[9px] px-2 py-0.5 border border-subtle text-muted">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Col 2: COURT DOCUMENTS */}
            <div id="documents">
              <div
                className="font-mono text-[11px] text-muted uppercase pb-3 border-b border-subtle relative mb-6"
                style={{ letterSpacing: "0.2em" }}
              >
                COURT DOCUMENTS
                <div className="absolute bottom-[-1px] left-0 w-12 h-[1px] bg-gold"></div>
              </div>
              <div className="space-y-4">
                {courtDocuments.map((doc, idx) => (
                  <button
                    key={idx}
                    onClick={() => openCuratedDoc(CURATED_DOCUMENTS[idx] ?? CURATED_DOCUMENTS[0])}
                    className="w-full text-left p-4 bg-card border-l-[2px] hover:bg-[#151515] transition-colors cursor-pointer"
                    style={{ borderLeftColor: "#c9953a", background: "none" }}
                  >
                    <div className="font-mono text-[10px] text-gold mb-2">{doc.type}</div>
                    <h4 className="font-inter text-[14px] text-white-warm mb-3">{doc.title}</h4>
                    <div className="flex justify-between items-center font-mono text-[10px] text-muted">
                      <span>{doc.case}</span>
                      <span>{doc.date}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Col 3: LIVE UPDATES */}
            <div>
              <div
                className="font-mono text-[11px] text-muted uppercase pb-3 border-b border-subtle relative mb-6"
                style={{ letterSpacing: "0.2em" }}
              >
                LIVE UPDATES
                <div className="absolute bottom-[-1px] left-0 w-12 h-[1px] bg-primary"></div>
              </div>
              <div className="space-y-0">
                {liveUpdates.map((update, idx) => (
                  <div
                    key={idx}
                    className="pb-4 pt-4 border-b border-subtle first:pt-0 last:border-0 flex flex-col space-y-2"
                  >
                    <div className="font-mono text-[10px] text-gold">[{update.time}]</div>
                    <div className="font-inter text-[13px] text-white-warm leading-relaxed">{update.text}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 7. DOCUMENT REPOSITORY SECTION */}
        <section id="index" className="w-full bg-document py-16 px-4 md:px-8 border-t border-subtle">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-subtle">
              <h2
                className="font-mono text-[14px] text-muted uppercase"
                style={{ letterSpacing: "0.3em" }}
              >
                DOCUMENT INDEX
              </h2>
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-[9px] text-gold px-2 py-1 border"
                  style={{ backgroundColor: "rgba(201,149,58,0.1)", borderColor: "rgba(201,149,58,0.25)" }}
                >
                  LIVE — MCP
                </span>
                <span className="font-mono text-[10px] text-dim px-2 py-1 border border-subtle">
                  {CASE_NUMBER}
                </span>
              </div>
            </div>

            <div
              className="font-mono text-[10px] text-dim mb-8"
              style={{ letterSpacing: "0.1em" }}
            >
              Documents retrieved in real time from the Omniversal Media legal document repository. Click VIEW to open and read any document.
            </div>

            <div className="flex flex-col">
              {CURATED_DOCUMENTS.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col md:flex-row md:items-center py-4 border-b border-subtle hover:bg-white/5 transition-colors px-2 -mx-2"
                >
                  <div className="font-mono text-[12px] text-gold w-32 shrink-0 mb-1 md:mb-0">
                    {doc.id}
                  </div>
                  <div
                    className="font-mono text-[11px] text-dim w-20 shrink-0 mb-1 md:mb-0 mr-4"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    [{doc.type}]
                  </div>
                  <div className="font-mono text-[13px] text-white-warm flex-grow mb-1 md:mb-0 pr-4">
                    {doc.title}
                  </div>
                  <div className="font-mono text-[11px] text-dim w-52 shrink-0 mb-2 md:mb-0">
                    {doc.caseRef}
                  </div>
                  <button
                    onClick={() => openCuratedDoc(doc)}
                    className="font-inter text-[11px] font-semibold text-primary hover:underline shrink-0 bg-transparent border-none cursor-pointer p-0"
                  >
                    VIEW →
                  </button>
                </div>
              ))}
            </div>

            {/* Live document browser — expands to show all MCP docs */}
            <LiveDocumentBrowser />
          </div>
        </section>

        {/* 8. PUBLICATION MISSION SECTION */}
        <section id="about" className="w-full bg-base py-16 px-4 md:px-8 flex justify-center">
          <div
            className="max-w-3xl w-full border-l-[4px] pl-6 md:pl-10"
            style={{ borderLeftColor: "#b5352a" }}
          >
            <h2 className="font-playfair italic text-[28px] md:text-[32px] text-white-warm mb-8">
              We Publish the Record. You Decide.
            </h2>
            <div className="font-inter text-[16px] text-muted leading-[1.8] space-y-6 mb-10">
              <p>
                Guerrilla Journalism exists because the public record is not always public. Court filings
                disappear. Documents get lost. Attorneys withdraw at the worst possible moment. Mandatory
                transfers do not happen. We obtain, preserve, and publish the primary source.
              </p>
              <p>
                Every investigation begins with a document. Every document is publicly available under the
                law. Our reporters do not rely on anonymous sources or leaked materials — we work from the
                record itself, as it was filed, stamped, and entered into the docket.
              </p>
              <p>
                This work is protected by the First Amendment. Our publication is independent. We accept no
                advertising. We are not affiliated with any political party, law firm, or government entity.
                Our allegiance is to the record.
              </p>
            </div>
            <div className="font-mono text-[10px] text-dim">
              First Amendment | Press Freedom | Public Records
            </div>
          </div>
        </section>

        {/* 9. SUBSCRIBE SECTION */}
        <section className="w-full bg-card py-16 px-4 md:px-8 border-t border-subtle flex flex-col items-center text-center">
          <h2 className="font-playfair text-[24px] md:text-[28px] text-white-warm mb-3">
            Get Investigations Delivered Before the Press Release
          </h2>
          <p className="font-inter text-[14px] text-muted mb-8 max-w-md">
            Substack newsletter. No ads. No paywalls on primary documents. Just the record.
          </p>

          <form
            className="flex w-full max-w-md mb-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Email address"
              className="flex-grow bg-transparent border text-white-warm px-4 py-3 font-inter outline-none focus:border-primary transition-colors"
              style={{ borderColor: "rgba(240,237,232,0.2)" }}
              required
            />
            <button
              type="submit"
              className="bg-primary text-white-warm font-mono text-[12px] px-6 py-3 hover:opacity-90 transition-opacity"
            >
              SUBSCRIBE
            </button>
          </form>

          <div className="font-inter text-[12px] text-dim">
            Published on Substack. Unsubscribe anytime.
          </div>
        </section>

        {/* 10. FOOTER */}
        <footer className="w-full bg-document py-12 px-4 md:px-8 border-t border-subtle">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10 md:gap-4 mb-12">

            <div className="flex flex-col space-y-2">
              <div className="font-playfair font-bold text-[18px]">
                <span className="text-white-warm">GUERRILLA</span>{" "}
                <span className="text-primary">JOURNALISM</span>
              </div>
              <div className="font-mono text-[11px] text-dim">An Omniversal Media Publication</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
              <div className="flex flex-col space-y-3 font-inter text-[13px] text-muted">
                <span className="font-mono text-[10px] text-dim mb-1">PUBLICATION</span>
                <a href="https://guerrillajournalism.com" className="hover:text-white-warm transition-colors">guerrillajournalism.com</a>
                <a href="https://omniversalmedia.press" className="hover:text-white-warm transition-colors">omniversalmedia.press</a>
              </div>
              <div className="flex flex-col space-y-3 font-inter text-[13px] text-muted">
                <span className="font-mono text-[10px] text-dim mb-1">LEGAL</span>
                <a href="mailto:legal@omniversalmedia.llc" className="hover:text-white-warm transition-colors">legal@omniversalmedia.llc</a>
              </div>
              <div className="flex flex-col space-y-3 font-inter text-[13px] text-muted">
                <span className="font-mono text-[10px] text-dim mb-1">EDITORIAL</span>
                <a href="#" className="hover:text-white-warm transition-colors">Submit a Tip</a>
                <a href="#" className="hover:text-white-warm transition-colors">Document Request</a>
                <a href="#" className="hover:text-white-warm transition-colors">Press Inquiry</a>
              </div>
            </div>

          </div>

          <div className="max-w-6xl mx-auto border-t border-subtle pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <p
              className="font-inter text-[12px] text-dim max-w-xl leading-relaxed"
            >
              Guerrilla Journalism is an independent publication of Omniversal Media LLC. All documents
              published herein are obtained through legal means including public records requests, court
              filings, and other publicly available sources. Nothing on this site constitutes legal advice.
              Omniversal Media LLC is not a law firm.
            </p>
            <div className="font-mono text-[10px] text-dim whitespace-nowrap">
              © 2026 Omniversal Media LLC. All rights reserved.
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
