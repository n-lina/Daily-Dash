function getCosSimMock(val1, val2) {
  expectedstr1 = "Julie loves me more than Linda loves me";
  expectedstr2 = "Jane likes me more than Julie loves me";

  if ( val1 === expectedstr1 && val2 === expectedstr2) {
    return 0.822;
  }
  else {
    return "Error";
  }
}

module.exports = { getCosSimMock };