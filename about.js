let aboutMessage = 'Issue Tracker working  API v1 what is going on about working on environment virables ';
function setAboutMessage(_, {message}){
    return aboutMessage = message;
}

function getAboutMessage(){
    return aboutMessage;
}

module.exports = {setAboutMessage, getAboutMessage};