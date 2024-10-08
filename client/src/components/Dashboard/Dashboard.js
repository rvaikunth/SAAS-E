import './normal.css'
import React from 'react'
import {useState, useEffect, useRef} from 'react'
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import FileProgress from '../PopUp/FileProgress';
import axios from 'axios';
import chatIcon from './70SheI01.svg'
import LinearProgressWithLabel from '../ProgressBar/LinearWithValueLabel'

export default function Dashboard({userName}) {
      //useEffect calls the method getFirstMessages as soon as the app loads
  useEffect(() => {
    getFirstMessages();
    getFileNames();
  }, [])

  const [chatlogs, setChatLogs] = useState({})
  const [input, setInput] = useState('')
  const [chatlog, setChatLog] = useState([{
    user: "ai",
    message: "How can I help you today?"
  }]);
  const [firstMessages, setfirstMessages] = useState([])
  const [popUp, setPopUp] = useState(false)
  const [fileNames, setFileNames] = useState([])

  async function getFileNames() {
    // await axios.put(process.env.REACT_APP_API_DU_ADDRESS + '/docNames', {
    //   userName
    // }).then(async(response) => {
    //   setFileNames(response.data)
    // })
  }

  async function getFirstMessages(){
    // const response = await axios.put(process.env.REACT_APP_API_PC_ADDRESS + '/chatLogs', {
    //   userName
    // });
    // const allChatlogs = response.data;
    
    // const arrayOfFirstMessages = (allChatlogs)? Object.keys(allChatlogs) : []
    // setfirstMessages(arrayOfFirstMessages)
    // setChatLogs(allChatlogs)
  }

  async function prevChatClick(chatName) {
    // const response = await axios.get('http://localhost:4001/chatLogs');
    // const prevChatlog = response.data //data comes in string form
    let newChatLog;

    if(chatlogs[chatName]){
      //this converts the string into the object array
      newChatLog = JSON.parse(chatlogs[chatName])
      // setChatLog(JSON.parse(prevChatlog[chatName]))
    }
    else {
      newChatLog = [{
        user: "ai",
        message: "How can I help you today?"
      }]
    }
    setChatLog(newChatLog)
  }

  async function newChatClick(e){
    e.preventDefault()
    if(chatlog.length > 1){

      // await axios.post(process.env.REACT_APP_API_EB_ADDRESS + '/events', {
      //   type: 'newChatLog',
      //   data: {
      //     userName: userName,
      //     firstQuestion: chatlog[1].message,
      //     chatLog: JSON.stringify(chatlog)
      //   }
      // })
    }
    setChatLog([{
      user: "ai",
      message: "How can I help you today?"
    }])
    getFirstMessages()
  }

  async function handleSubmit(e){
    e.preventDefault()

    let newChatLog = [...chatlog, { user: "me", message: `${input}`}]
    setChatLog([...newChatLog])
    setInput('')
    console.log("send message to endpoint")
    const payLoadBody = {
      "input_text": input
    };
    //process.env.REACT_APP_API_EB_ADDRESS + '/response'
    const response = await axios.post("https://singular-silkworm-destined.ngrok-free.app/generate_text", {
      payLoadBody
    }).catch((error) => {
      return undefined;
    });
    // console.log(response)
    // console.log("recieved message!")
    // console.log(response.data.generated_text)
    // console.log(response.data.generated_text.split('\n\n'))
    const llmAnswer = (response)? response.data.generated_text.split('\n\n'): "LLM is not availble right now!";
    // const chatResponse = (llmAnswer[0] === input)? llmAnswer.splice(1) : response.data.generated_text
    // const chatResponse = (llmAnswer)? llmAnswer : ""

    newChatLog = [...newChatLog, {user: "ai", message: `${llmAnswer}`}]
    setChatLog([...newChatLog])
    chatlogs[newChatLog[1].message] = newChatLog
  }

  const PrevoiusChats = ({previousChat}) => {
    return (
      <div className='prev-chat-space'>
        <div className='prev-chat' onClick={(e) => prevChatClick(previousChat)}>
         <img src = {chatIcon} alt='chatIcon'></img> {previousChat}
        </div>
      </div>
    )
  }
  const ChatMessage = ({message}) => {
    return (
      <div className = {`chat-message ${message.user === "ai" && "ai"}`}>
  
        <div className = "chat-message-center">
          <div className ={`avatar ${message.user === "ai" && "ai"}`}></div>
          <div className = "message">
            {message.message}
          </div>
          {message.user === "ai" &&
            <>
            <div className={`message-rating-container ${message.user === "ai" && "ai"}`}>
              <div className='rate-this-answer-label'>Rate this answer</div>
              <div className='ratings'>
                <ThumbUpAltOutlinedIcon className='thumbs-up'></ThumbUpAltOutlinedIcon>
                <ThumbDownAltOutlinedIcon className='thumbs-down'></ThumbDownAltOutlinedIcon>
              </div>
            </div></>
            }
        </div>            
      </div>
    );
  }

  const DocumentDisplay = ({docName}) => {
    return (
      <div className='document-name-container'>
        <div className='document-name'>
          {docName}
        </div>
        <div className='progress-bar'>
          <LinearProgressWithLabel className='progress-bar-percentage'/>
        </div>
      </div>
    )
  }

  //This is all for file upload
  const fileInputRef = useRef(null)

  async function uploadFile(){
    const files = fileInputRef.current.files;
    console.log(files)

    let fileNames = []
    if(files.length > 0){
      let formData = new FormData();

      for(let i = 0; i < files.length; ++i){
        formData.append("files", files[i])
        fileNames.push(files[i].name)
      }

      // try{
      //   await fetch(process.env.REACT_APP_API_DU_ADDRESS + '/uploadCloud', {
      //     method: 'POST',
      //     body: formData
      //   });
      //   alert('File(s) Uploaded')
      // } catch(error) {
      //   console.log(error)
      // }

      // await axios.post(process.env.REACT_APP_API_EB_ADDRESS + '/events', {
      //   type: 'newDocUpload',
      //   data: {
      //     userName: userName,
      //     fileNames
      //   }
      // }).then(async (e) => {
      //   await getFileNames()
      // })
    }
  }

    return(
        <div className="App">
        <aside className = "sidemenu">
  
          <div className = "side-menu-button" onClick={newChatClick}>
            <span>+</span>
             New Chat
          </div>
  
          <div className = "previous-chats-label">
            Previous Chats
          </div>
  
          <div className="previous-chats-container">
            {
              firstMessages.map((previousChat, index) => (
                <PrevoiusChats key = {index} previousChat={previousChat}/>
            ))}
          </div>
          <form className='document-upload-container'>
            <input type='file' className="document-upload" multiple ref={fileInputRef}></input>
            <div className="document-upload-button" onClick={uploadFile}>Upload File</div>
          </form>
          <div className="document-view-button" onClick={() => setPopUp(true)}>View File Progress</div>
        </aside>
        <section className = "chatbox">
          <div>
            <FileProgress trigger={popUp} setTrigger={setPopUp}>
              <h3>Uploaded Documents</h3>
              {fileNames.map((docName, index) => (
                <DocumentDisplay key={index} docName={docName}/>
              ))}
            </FileProgress>
          </div>
          <div className = "chat-log">
            {chatlog.map((message, index) => (
              <ChatMessage key = {index} message = {message}/>
            ))}
          </div>
        
          <div className = "chat-input-holder">
            <form onSubmit={handleSubmit}>
              <input
                rows = "1"
                className = "chat-input-textarea"
                value = {input}
                onChange={(e) => setInput(e.target.value)}
                placeholder = "Type your message here"
              ></input>
            </form>
          </div>
  
        </section>
      </div>
    );
  }
  