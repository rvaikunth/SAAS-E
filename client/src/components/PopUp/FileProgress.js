import React from 'react'
import './FileProgress.css'
import CloseIcon from '@mui/icons-material/Close';

function FileProgress(props) {
  return (props.trigger)? (
    <div className='popup'>
      <div className='popup-inner'>
        <CloseIcon className='close-btn' onClick={() => props.setTrigger(false)}></CloseIcon>
        {props.children}
      </div>
    </div>
  ) : "";
}

export default FileProgress
