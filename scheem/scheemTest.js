
suite('quote', function() {
    test('a number', function() {
        assert.deepEqual(
            evalScheem(['quote', 3], {}),
            3
        );
    });
    test('an atom', function() {
        assert.deepEqual(
            evalScheem(['quote', 'dog'], {}),
            'dog'
        );
    });
    test('a list', function() {
        assert.deepEqual(
            evalScheem(['quote', [1, 2, 3]], {}),
            [1, 2, 3]
        );
    });
});

suite('add', function() {
    test('two numbers', function() {
        assert.deepEqual(
            evalScheem(['+', 3, 5], {}),
            8
        );
    });
    test('a number and an expression', function() {
        assert.deepEqual(
            evalScheem(['+', 3, ['+', 2, 2]], {}),
            7
        );
    });
    test('a dog and a cat', function() {
        expect(function(){
            evalScheem(['+', 'dog', 'cat'], {});
        }).to.throw();
    });
    test("2+2", function(){
        assert.deepEqual(
            evalScheem(['+', 2, 2], {}), 
            4
        );
    });
});

suite('cons', function(){
    test("cons 1 (quote (2 3))", function(){
        assert.deepEqual(evalScheem(['cons', 1, ['quote', [2,3]]], {}), [1,2,3]);
    });
});

suite('car', function(){
    test("car", function(){
        assert.deepEqual(evalScheem(["car", ["quote", [1,2,3]]], {}), 1);
    });
});

suite('cdr', function(){
    test("cdr", function(){
        assert.deepEqual(evalScheem(["cdr", ["quote", [1,2,3]]], {}), [2,3]);
    });
});

suite('=', function(){
    test("= #t", function(){
        assert.deepEqual(evalScheem(["=", 2, 2], {}), "#t");
    });
    test("= #f", function(){
        assert.deepEqual(evalScheem(["=", 2, 4], {}), "#f");
    });
});

suite('<', function(){
    test("1<2 #t", function(){
        assert.deepEqual(evalScheem(["<", 1, 2], {}), "#t");
    });
    test("2<1 #f", function(){
        assert.deepEqual(evalScheem(["<", 2, 1], {}), "#f");
    });
});

suite('if', function(){
    test("if '#t' 1 2", function(){
        assert.deepEqual(evalScheem(["if", '#t', 1, 2], {}), 1);
    });
});

suite('begin', function(){
    test("?", function(){
        assert.deepEqual(evalScheem(['begin', [4], ['quote', 5]], {}), 5);
    });
});

suite('var ref', function(){
    test("(x)", function(){
        assert.deepEqual(evalScheem(['x'], {x:42}), 42);
    });
    test("(+ x y)", function(){
        assert.deepEqual(evalScheem(["+", "x", "y"], {x:3, y:5}), 8);
    });
});

