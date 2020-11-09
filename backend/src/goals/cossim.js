/*
 * Accepts a string whose unique words are counted, and a tally object is returned
 * @param   str is the string to be analyzed
 * @return  key-value object with keys = unique words in argument, and values = 
 *          count of unique word occurrences in argument
 */
function makeWordTally(str) {

    let words_in_str = str                  // must occur in this order
        .replace(/[.,?!;()"'-]/g, " ")  // replace punctuation
        .replace(/\s+/g, " ")           // make uniform white space usage
        .toLowerCase()                  // make uniform case for comparison
        .split(" ");                    // use space as splitter

    let word_tally = {};                // create tally to return
    words_in_str.forEach(element => {
        // if word_tally does not already have word, add it, then initialize its count to 0
        if (!(Object.prototype.hasOwnProperty.call(word_tally, element))) {
            word_tally[element] = 0;
        }
        // every time a word is seen in argument string, add 1 to its count
        word_tally[element]++;
    });

    return word_tally;
}

/*
 * Accepts an key-value object and returns copy with all values = 0
 * @param   tally   key-value object to be copied and have values made 0
 * @return  tally_  key-value object that is copy of tally, but with all values = 0
 * @modifies nothing
 */
function makeAllValuesZero(tally) {

    let tally_ = Object.assign({}, tally); // make copy, since pass by reference

    for (let key in tally_) {
        if (Object.prototype.hasOwnProperty.call(tally_, key)) {
            tally_[key] = 0;
        }
    }

    return tally_;
}

/*
 * Accepts 2 numeric vectors and calculates their cosine similarity
 * @param   V1        1st vector
 * @param   V2        2nd vector
 * @return  cossim    cosine similarity score
 */
function calccossim(V1,V2){

    let denominator1=0;
    let denominator2=0;
    let numerator=0;

    for(let i = 0; i < V2.length; i++){ 
        denominator1 += V1[i]*V1[i];
        denominator2 += V2[i]*V2[i];
        numerator    += V1[i]*V2[i];
    }
    
    denominator1 = Math.sqrt(denominator1);
    denominator2 = Math.sqrt(denominator2);
    var cossim = (numerator)/((denominator1)*(denominator2));
    return cossim;
}

/*
 * Accepts 2 strings and calculates their cosine similarity
 * @param   str1        1st string; it is compared with str2
 * @param   str2        2nd string; it is compared with str1
 * @return  cosine_sim  number variable that is the cosine similarity score
 */
function getCosSim(str1,str2) {

    let x = makeWordTally(str1);
    let y = makeWordTally(str2);

    // to each object, add the keys that don't exist in it, but with their value being 0
    let x2 = Object.assign( {}, makeAllValuesZero(y), x );
    let y2 = Object.assign( {}, makeAllValuesZero(x), y );

    // sort alphabetically
    x2 = Object.fromEntries(Object.entries(x2).sort());
    y2 = Object.fromEntries(Object.entries(y2).sort());

    // transfer values into arrays, in same order
    let vec1 = Object.values(x2);
    let vec2 = Object.values(y2);
 
    let cosine_sim = calccossim(vec1, vec2);
    return cosine_sim;
}


module.exports = { getCosSim };
