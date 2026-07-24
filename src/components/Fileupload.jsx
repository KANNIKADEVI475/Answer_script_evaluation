import { useState } from "react";
import MarksTable from "./MarksTable";
import { evaluateAnswers } from "../services/api";

function FileUpload(){

const [questionPaper, setQuestionPaper] = useState(null);
const [answerKey, setAnswerKey] = useState(null);
const [results, setResults] = useState([]);
const [loading, setLoading] = useState(false);

const handleEvaluate = async () => {

  if(!questionPaper || !answerKey){
    alert("Please upload files");
    return;
  }

  setLoading(true);

  const data = await evaluateAnswers();

  setResults([{
    studentId: 1,
    studentName: "John Doe",
    marks: data.marks,
    similarity: data.similarity,
    feedback: data.feedback,
    status: "Completed"
  }]);

  setLoading(false);
};

return(
<div>

<h1>📄 Upload Files</h1>

<input type="file" onChange={(e)=>setQuestionPaper(e.target.files[0])}/>
<br/><br/>

<input type="file" onChange={(e)=>setAnswerKey(e.target.files[0])}/>
<br/><br/>

<button onClick={handleEvaluate}>
🤖 Evaluate AI
</button>

{loading && <p>⏳ Evaluating...</p>}

<br/><br/>

{results.length > 0 && <MarksTable results={results}/>}

</div>
);
}

export default FileUpload;