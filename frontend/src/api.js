const API_URL = "http://127.0.0.1:8000";

export async function uploadPDF(file){
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${API_URL}/upload`, { method: 'POST', body: fd });
  return res.json();
}

export async function ask(question){
  const fd = new FormData();
  fd.append('question', question);
  const res = await fetch(`${API_URL}/ask`, { method: 'POST', body: fd });
  return res.json();
}

// streaming endpoint
export function askStream(question, onChunk){
  const fd = new FormData();
  fd.append('question', question);
  const es = new EventSourcePolyfill(); // we'll provide fallback in code
}        