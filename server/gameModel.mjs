function Round(meme, captions, answer1, answer2, name, imageId){
    this.imageId = imageId;
    this.meme = meme;
    this.captions = captions;
    this.answer1 = answer1;
    this.answer2 = answer2;
    this.name = name;
}

function Game(score, userId){
    this.score 
    this.userId = userId;
}   

function Meme(url, name, answer1, answer2, id){
    this.imageId = id;
    this.url = url;
    this.name = name;
    this.answer1 = answer1;
    this.answer2 = answer2;
}

function CaptionList(){
    this.captions = [];
}

export {Round, Meme, CaptionList};