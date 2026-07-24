import { useNavigate } from "react-router-dom";
import "./../App.css";

function FacultyEvaluate() {
  const navigate = useNavigate();

  return (
    <div className="faculty-dashboard">
      <h1>AI Evaluation Options</h1>

      <div className="action-buttons evaluate-actions">
            <button
              className="main-upload-btn"
              onClick={() => {
                try{
                  const raw = localStorage.getItem('answerScripts');
                  if(raw){
                    const arr = JSON.parse(raw);
                    if(Array.isArray(arr) && arr.length>0){
                      navigate('/faculty-stored-scripts');
                      return;
                    }
                  }
                }catch(e){}
                alert('Answer script does not exist.');
              }}
            >
              📝 Evaluate Student Answer Scripts
            </button>

            <button
              className="optional-btn"
              onClick={() => {
                try{
                  const key = localStorage.getItem('answerKey');
                  const raw = localStorage.getItem('answerScripts');
                  if(key && raw){
                    const arr = JSON.parse(raw);
                    if(Array.isArray(arr) && arr.length>0){
                      navigate('/faculty-stored-scripts');
                      return;
                    }
                  }
                }catch(e){}
                alert('Answer script does not exist or answer key is missing.');
              }}
            >
              🧠 Evaluate with Uploaded Answer Key
            </button>

        <button
          className="secondary-btn"
          onClick={() => navigate("/")}
        >
          ⬅ Back to Login
        </button>
      </div>
    </div>
  );
}

export default FacultyEvaluate;
