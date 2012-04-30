var assert, PEG, fs, log, pegData, parse, count, failed;
var tests = [
	["", undefined, "don't parse empty string"],
	["atom", "atom", "parse an atom"],
	["+", "+", "parse a + atom"],
	["(+ x 3)", ["+", "x", "3"], null],
	["(+ 1 (f x 3 y))", ["+", "1", ["f", "x", "3", "y"]], null],
	[" (  + 1 \n\n(\n  f x \n3  \t y   )  )", ["+", "1", ["f", "x", "3", "y"]], "accept whitespaces"],
	["'(1 2 3 'x)", ["quote", ["1", "2", "3", ["quote", "x"]]], "quote"], 
	[" atom ", "atom", "parse an atom with whitespaces"],
	["atom ;;test\n  ;;more\n", "atom", "comment"],
	[";;\n ( ;; test \na b);; test\n", ["a", "b"], "comments"]
];
fs = require("fs");
assert = require("assert");
PEG = require("pegjs");
log = console.log;

pegData = fs.readFileSync("scheem.peg", "utf-8");
parse = PEG.buildParser(pegData).parse;

log("--Testing--");
count = 0;
failed = 0;
tests.forEach(function(i){
  var input=i[0], expected=i[1], msg=i[2], result;
  if(!msg) { msg = "parse " + input; }
  count += 1;
  try{
    result = parse(input);
    assert.deepEqual(result, expected, msg);
    log("PASSED "+ msg);
  }catch(e){
    if(result===expected) {
      log("PASSED " + msg);
    } else {
      log("FAILED " + msg);
      log("  input: '" + input + "'");
      log("  expected: " + JSON.stringify(expected));
      log("       got: " + JSON.stringify(result));
      log("  error: " + e.message);
      failed += 1;
    }
  }
});
if(failed){
  log("***** %s out of %s tests FAILED! ****", failed, count);
} else {
  log("    SUCCESS - all %s tests passed ok!", count);
}



