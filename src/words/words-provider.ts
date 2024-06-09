export interface Word {
    id: string;
    polish: string;
    english: string;
    lastSeen?: Date;
    score: number;
}

interface Buckets {
    newWords: Word[];
    firstLevel: Word[];
    secondLevel: Word[];
    thirdLevel: Word[];
    fourthLevel: Word[];
}

function divideWordsIntoBuckets(words: Word[]): Buckets {
    const newWords = [];
    const firstLevel = [];
    const secondLevel = [];
    const thirdLevel = [];
    const fourthLevel = [];

    for (const word of words) {
        if (!word.lastSeen) {
            newWords.push(word);
        } else if (word.score < 3) {
            firstLevel.push(word);
        } else if (word.score >= 3) {
            secondLevel.push(word);
        } else if (word.score >= 6) {
            thirdLevel.push(word);
        } else if (word.score >= 12) {
            fourthLevel.push(word);
        }
    }

    return {
        newWords,
        firstLevel,
        secondLevel,
        thirdLevel,
        fourthLevel
    };
}

function calculateProbabilities(buckets: Buckets): number[] {
    const probabilities: number[] = [];
    probabilities.push(buckets.firstLevel.length + 50);
    probabilities.push(buckets.secondLevel.length + 25);
    probabilities.push(buckets.thirdLevel.length + 15);
    probabilities.push(buckets.fourthLevel.length + 10);
    return probabilities;
}

function sumProbabilities(probabilities: number[]): number {
    return probabilities.reduce((acc, val) => acc + val, 0);
}

function getBucketByIndex(buckets: Buckets, index: number): Word[] {
    switch (index) {
        case 0:
            return buckets.firstLevel;
        case 1:
            return buckets.secondLevel;
        case 2:
            return buckets.thirdLevel;
        case 3:
            return buckets.fourthLevel;
        default:
            return [];
    }
}
function getRandomBucket(buckets: Buckets): Word[] {
    const probabilities = calculateProbabilities(buckets);
    const sum = sumProbabilities(probabilities);
    const random = Math.random() * sum;

    let current = 0;
    for (let i = 0; i < probabilities.length; i++) {
        current += probabilities[i];
        if (random < current) {
            const bucket = getBucketByIndex(buckets, i);
            if (bucket.length > 0) {
                return bucket;
            }
        }
    }

    return buckets.firstLevel;
}

export const getNextWord = (words: Word[]): Word => {
    const minWordsInFirstBucket = 3;
    const buckets = divideWordsIntoBuckets(words);

    console.log(buckets);

    if (buckets.firstLevel.length < minWordsInFirstBucket) {
        if (buckets.newWords.length > 0) {
            const neededWords = minWordsInFirstBucket - buckets.firstLevel.length;
            for (let i = 0; i < Math.min(neededWords, buckets.newWords.length); i++) {
                const newWord = buckets.newWords.shift() as Word;
                newWord.lastSeen = new Date();
                buckets.firstLevel.push(newWord);
            }
        }
    }

    const bucket = getRandomBucket(buckets);
    return bucket[Math.floor(Math.random() * bucket.length)];
}

export const addPointToWord = (word: Word) => {
    word.score++;
    word.lastSeen = new Date();
}

export const removePointFromWord = (word: Word) => {
    word.score--;
    if (word.score < 0) {
        word.score = 0;
    }
    word.lastSeen = new Date();
}