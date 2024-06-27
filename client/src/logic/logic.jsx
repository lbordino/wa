import { createContext } from "react";
import API from "../request";

function Logic() {
    this.maxRounds = 1;
    let api = new API();
    this.roundNumber = 0;
    this.currentRound = new Round();
    this.result = 0;
    this.game = [];
    this.skipRound = () => {
        this.currentRound.skipped = true;
    };
    this.handleSkipped = () => {
        if (this.currentRound.skipped) {
            this.currentRound.correct = undefined;
            this.game = [...this.game, this.currentRound.clone()];
            this.roundNumber++;
        }
    }
    this.getResults = () => {
        return this.result;
    };
    this.getMemeAndCaption = async () => {
        let r = await api.getRound(this.game.map((r) => r.imageId));
        if (r) {
            this.currentRound.imageId = r.imageId;
            this.currentRound.meme = r.meme;
            this.currentRound.captions = r.captions;
            this.currentRound.answer1 = r.answer1;
            this.currentRound.answer2 = r.answer2;
            this.currentRound.name = r.name;
            this.currentRound.time = r.time;
            this.currentRound.correct = false;
            this.currentRound.skipped = false;
            return this.currentRound;
        }
    };
    this.getRound = async () => {
        if (this.roundNumber < this.maxRounds) {
            let r = await this.getMemeAndCaption();

            r.captions = r.captions.sort((a, b) => a.length - b.length);
            return r;
        }
        return undefined;
    };
    this.setAnswer = async  (answer) => {
        if (!this.currentRound.skipped) {
            const res = await api.validateAnswer(this.currentRound.imageId, answer);
            this.currentRound.answer = answer;
            this.currentRound.answer1 = res.answer1;
            this.currentRound.answer2 = res.answer2;
            if (res.valid === true) {
                this.currentRound.correct = true;
                this.result += 5;
            }
            this.roundNumber++;
            
        } else {
            this.roundNumber++;
        }
        this.game = [...this.game, this.currentRound.clone()];
        return this.currentRound.correct;
    }

this.saveGame = async () => {
    let game = {
        score: this.result,
        rounds: this.game,
    };
    await api.saveGame(game);
};

this.reset = () => {
    this.roundNumber = 0;
    this.currentRound = new Round();
    this.result = 0;
    this.game = [];
};
}

function Round() {
    this.imageId = '';
    this.meme = '';
    this.captions = [];
    this.answer1 = '';
    this.answer2 = '';
    this.name = '';
    this.skipped = false;
    this.correct = false;
    this.answer = '';

    this.clone = () => {
        let r = new Round();
        r.imageId = this.imageId;
        r.meme = this.meme;
        r.captions = this.captions;
        r.answer1 = this.answer1;
        r.answer2 = this.answer2;
        r.name = this.name;
        r.skipped = this.skipped;
        r.correct = this.correct;
        r.answer = this.answer;
        return r;

    }
}
export const GameLogic = createContext(new Logic());