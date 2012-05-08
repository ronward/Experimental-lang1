
suite('quote', function() {
    test("mocha test", function(){
        assert.deepEqual(1,1);
    });
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
    test("a dog and a cat 2", function() {
        assert.throw(function(){
            evalScheem(['+', 'dog', 'cat'], {});
        });
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

suite('parse', function(){
    test('a number', function(){
        assert.deepEqual(
            SCHEEM.parse('42'), 42
        );
    });
    test('a variable', function(){
        assert.deepEqual(
            SCHEEM.parse('x'), 'x'
        );
    });
});

suite('evalScheemString', function(){
    test('1', function(){
        assert.deepEqual(
            evalScheemString('1'), 1
        );
    });
    test('(+ 4 5)', function(){
        assert.deepEqual(
            evalScheemString("(+ 4 5)"), 9
        );
    });
    test('(* 4 6)', function(){
        assert.deepEqual(
            evalScheemString('(* 4 6)'), 24
        );
    });
    test('(* 2 (+ 4 5))', function(){
        assert.deepEqual(
            evalScheemString('(* 2 (+ 4 5))'), 18
        );
    });
    test("(cons 3 '(6 8))", function(){
        assert.deepEqual(
            evalScheemString("(cons 3 '(6 8))"), [3,6,8]
        );
    });
    test("(car '(1 2 3))", function(){
        assert.deepEqual(
            evalScheemString("(car '(1 2 3))"), 1
        );
    });
    test("(cdr '(1 2 3))", function(){
        assert.deepEqual(
            evalScheemString("(cdr '(1 2 3))"), [2,3]
        );
    });
    test('=', function(){
        var src = "(= 5 5)";
        assert.deepEqual(
            evalScheemString(src), "#t"
        );
        src = "(= 5 4)";
        assert.deepEqual(
            evalScheemString(src), "#f"
        );
    });
    test('if', function(){
        var src = "(if (= 5 5) 42 11)";
        assert.deepEqual(
            evalScheemString(src), 42
        );
    });
    test('begin', function(){
        var src = "(begin (+ 3 4) '(6 7) (+ 40 2))";
        assert.deepEqual(
            evalScheemString(src), 42
        );
    });
});


