import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../App.css";

function FacultyStoredScripts(){
  const navigate = useNavigate();
  const [scripts, setScripts] = useState([]);

  useEffect(()=>{
    try{
      const raw = localStorage.getItem('answerScripts');
      if(raw){
        const arr = JSON.parse(raw);
        if(Array.isArray(arr) && arr.length>0){
          setScripts(arr);
          return;
        }
      }
    }catch(e){/* ignore */}
    setScripts([]);
  },[]);

  return (
    <div className="faculty-dashboard">
      <h1>Stored Answer Scripts</h1>

      {scripts.length===0 ? (
        <div>
          <p style={{color:'#b91c1c', fontWeight:700}}>Answer script does not exist.</p>
          <button className="secondary-btn" onClick={()=>navigate(-1)}>⬅ Back</button>
        </div>
      ) : (
        <div>
          <ul style={{listStyle:'none', padding:0}}>
            {scripts.map((s,idx)=> (
              <li key={idx} style={{background:'#fff', margin:'10px 0', padding:'12px', borderRadius:8, boxShadow:'0 2px 6px rgba(0,0,0,0.08)'}}>{s}</li>
            ))}
          </ul>
          <div style={{marginTop:20}}>
            <button className="main-upload-btn" onClick={()=>alert('Proceed to evaluation (not implemented)')}>Start Evaluation</button>
            <button className="secondary-btn" onClick={()=>navigate(-1)} style={{marginLeft:12}}>⬅ Back</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default FacultyStoredScripts;
