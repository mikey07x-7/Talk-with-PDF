import React, { useState, useRef, useEffect } from 'react';
import { ask } from '../api';

export default function ChatBox(){
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesRef = useRef(null);

  useEffect(()=>{ if(messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight; }, [messages]);

  const send = async ()=>{
    if(!input.trim()) return;
    const q = input;
    setMessages(m=>[...m, {sender: 'You', text: q}]);
    setInput('');
    // start streaming by calling /ask_stream and reading SSE
    try{
      const res = await fetch('http://127.0.0.1:8000/ask_stream', { method: 'POST', body: new URLSearchParams({question: q}) });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done=false; let partial='';
      while(!done){
        const {value, done: d} = await reader.read();
        done = d;
        if(value){
          const chunk = decoder.decode(value, {stream: true});
          partial += chunk;
          // parse SSE 'data: ...' lines and append text
          const parts = partial.split(/\n\n/);
          for(let i=0;i<parts.length-1;i++){
            const block = parts[i];
            const m = block.replace(/^data:\s*/,''); // crude
            if(m==='[DONE]') {
              setMessages(prev => [...prev, {sender: 'AI', text: ''}]); // ensure final
            } else {
              // append chunk to last AI message in state
              setMessages(prev=>{
                const last = prev[prev.length-1];
                if(last && last.sender==='AI'){
                  const updated = [...prev.slice(0,-1), {sender:'AI', text: last.text + m}];
                  return updated;
                } else {
                  return [...prev, {sender:'AI', text: m}];
                }
              });
            }
          }
          partial = parts[parts.length-1];
        }
      }
    }catch(e){
      // fallback to non-streaming /ask
      const js = await ask(q);
      setMessages(prev=>[...prev, {sender:'AI', text: js.answer || String(js)}]);
    }
  };

  return (<div>
    <div className="messages" ref={messagesRef}>
      {messages.map((m,i)=>(<div key={i}><strong>{m.sender}:</strong> {m.text}</div>))}
    </div>
    <div className="input-area">
      <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask about the PDF..." />
      <button onClick={send}>Send</button>
    </div>
  </div>);
}
