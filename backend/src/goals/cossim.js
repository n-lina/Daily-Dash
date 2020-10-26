var similarity = require('compute-cosine-similarity');  // used to compute cosine similarity between 2 vectors


/*
 * Accepts a string whose unique words are counted, and a tally object is returned
 * @param   str is the string to be analyzed
 * @return  key-value object with keys = unique words in argument, and values = 
 *          count of unique word occurrences in argument
 */
function makeWordTally(str) {

    words_in_str = str                  // must occur in this order
        .replace(/[.,?!;()"'-]/g, " ")  // replace punctuation
        .replace(/\s+/g, " ")           // make uniform white space usage
        .toLowerCase()                  // make uniform case for comparison
        .split(" ");                    // use space as splitter

    var word_tally = {};                // create tally to return
    words_in_str.forEach(element => {
        // if word_tally does not already have word, add it, then initialize its count to 0
        if (!(word_tally.hasOwnProperty(element))) {
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

    tally_ = Object.assign({}, tally); // make copy, since pass by reference

    for (key in tally_) {
        if (tally_.hasOwnProperty(key)) {
            tally_[key] = 0;
        }
    }

    return tally_;
}

/*
 * Accepts 2 strings and calculates their cosine similarity
 * @param   str1        1st string; it is compared with str2
 * @param   str2        2nd string; it is compared with str1
 * @return  cosine_sim  number variable that is the cosine similarity score
 */
function getCosSim(str1,str2) {
    
    var x = makeWordTally(str1);
    var y = makeWordTally(str2);

    // to each object, add the keys that don't exist in it, but with their value being 0
    var x2 = Object.assign( {}, makeAllValuesZero(y), x );
    var y2 = Object.assign( {}, makeAllValuesZero(x), y );
    
    // sort alphabetically
    x2 = Object.fromEntries(Object.entries(x2).sort());
    y2 = Object.fromEntries(Object.entries(y2).sort());
    
    // transfer values into arrays, in same order
    vec1 = Object.values(x2);
    vec2 = Object.values(y2);

    cosine_sim = similarity(vec1, vec2);
    return cosine_sim;
}


module.exports = { getCosSim };