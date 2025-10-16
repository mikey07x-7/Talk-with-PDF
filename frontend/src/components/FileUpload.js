import React, { useState } from 'react';
import { uploadPDF } from '../api';

export default function FileUpload({ onUploaded }){
  const [file, setFile] = useState(null);
  const handle = async ()=>{
    if(!file) return alert('Select a PDF');
    const res = await uploadPDF(file);
    alert(res.message || JSON.stringify(res));
    onUploaded();
  }
  return (<div>
    <input type="file" accept="application/pdf" onChange={e=>setFile(e.target.files[0])} />
    <button onClick={handle}>Upload PDF</button>
  </div>);
}
