
suite('quote', function() {
    enableLogging = false;
    test('a number', function() {
        assert.deepEqual(
            evalScheem(['quote', 3]),
            3
        );
    });
    test('an atom', function() {
        assert.deepEqual(
            evalScheem(['quote', 'dog']),
            'dog'
        );
    });
    test('a list', function() {
        assert.deepEqual(
            evalScheem(['quote', [1, 2, 3]]),
            [1, 2, 3]
        );
    });
});

suite('add', function() {
    test('two numbers', function() {
        assert.deepEqual(
            evalScheem(['+', 3, 5]),
            8
        );
    });
    test('a number and an expression', function() {
        assert.deepEqual(
            evalScheem(['+', 3, ['+', 2, 2]]),
            7
        );
    });
    test('a dog and a cat', function() {
        expect(function(){
            evalScheem(['+', 'dog', 'cat']);
        }).to.throw();
    });
    test("a dog and a cat 2", function() {
        assert.throw(function(){
            evalScheem(['+', 'dog', 'cat']);
        });
    });
    test("2+2", function(){
        assert.deepEqual(
            evalScheem(['+', 2, 2]), 
            4
        );
    });
});

suite('cons', function(){
    test("cons 1 (quote (2 3))", function(){
        assert.deepEqual(evalScheem(['cons', 1, ['quote', [2,3]]]), [1,2,3]);
    });
});

suite('car', function(){
    test("car", function(){
        assert.deepEqual(evalScheem(["car", ["quote", [1,2,3]]]), 1);
    });
});

suite('cdr', function(){
    test("cdr", function(){
        assert.deepEqual(evalScheem(["cdr", ["quote", [1,2,3]]]), [2,3]);
    });
});

suite('=', function(){
    test("= #t", function(){
        assert.deepEqual(evalScheem(["=", 2, 2]), "#t");
    });
    test("= #f", function(){
        assert.deepEqual(evalScheem(["=", 2, 4]), "#f");
    });
});

suite('<', function(){
    test("1<2 #t", function(){
        assert.deepEqual(evalScheem(["<", 1, 2]), "#t");
    });
    test("2<1 #f", function(){
        assert.deepEqual(evalScheem(["<", 2, 1]), "#f");
    });
});

suite('if', function(){
    test("if (= 1 1) 1 2", function(){
        assert.deepEqual(evalScheem(["if", ['=', 1, 1], 1, 2]), 1);
    });
});

suite('begin', function(){
    test("?", function(){
        assert.deepEqual(evalScheem(['begin', ['+', 1, 4], ['quote', 5]]), 5);
    });
});

suite('var ref', function(){
    var env;
    test("(x)", function(){
        env = getInitEnv();
        env.x = 42;
        assert.deepEqual(evalScheem("x", env), 42);
    });
    test("(+ x y)", function(){
        env = getInitEnv();
        env.x = 3;
        env.y = 5;
        assert.deepEqual(evalScheem(["+", "x", "y"], env), 8);
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
    test('if else', function(){
        var src = "(if (= 5 4) 42 11)";
        assert.deepEqual(
            evalScheemString(src), 11
        );
    });
    test('begin', function(){
        var src = "(begin (+ 3 4) '(6 7) (+ 40 2))";
        assert.deepEqual(
            evalScheemString(src), 42
        );
    });
});

suite('evalScheemString 2', function(){
    var src;
    test('Define a function and call it', function(){
        src = "(begin (define fn (lambda (x) (+ 40 x))) (fn 2))";
        assert.deepEqual(
            evalScheemString(src), 42
        );
    });
    test('Calling an anonymous function', function(){
        src = "((lambda (x) (+ x 38)) 4)";
        assert.deepEqual(
            evalScheemString(src), 42
        );
    });
    test('Passing function as a value to another function', function(){
        src = "(begin (define fn (lambda (x) (+ x 2))) " +
              " ((lambda (fa) (fa 4)) fn))";
        assert.deepEqual(
            evalScheemString(src), 6
        );
    });
    test('Inner functiion uses values from enclosing function', function(){
        src = "((lambda (x) (begin (define y 2)"+
        "((lambda (z) (+ x (+ y z))) 22)"+
        ")) 18)";
        assert.deepEqual(
            evalScheemString(src), 42
        );
    });
    test('Argument to a function shadows a global var', function(){
        src = "(begin (define x 4) ((lambda (x) (+ x 0)) 42))";
        assert.deepEqual(
            evalScheemString(src), 42
        );
    });
    test('An inner function modifies a variable in the outer function', function(){
        src = "((lambda (x) (begin (define y 1)" +
                "((lambda (z) (set! x z)) 41) (+ x y))) 7)";
        assert.deepEqual(
            evalScheemString(src), 42
        );
    });
    test('An outer function returns an inner function', function(){
        src = "(((lambda (x) (lambda (z) (+ z x))) 2) 40)";
        assert.deepEqual(
            evalScheemString(src), 42
        );
    });
    test('An outer function returns an inner function (closure)', function(){
        src = "(((lambda (x) (lambda (z) (+ z x))) 2) 40)";
        assert.deepEqual(
            evalScheemString(src), 42
        );
    });
    test('A function in a define that calls itself recursively x times', function(){
        src = "(begin " +
              " (define fn (lambda (x)" + 
              "  (begin (if (= x 1) 1 (+ x (fn (- x 1)))))) ) " +
              " (fn 9))";
        assert.deepEqual(
            evalScheemString(src), 45
        );
    });
});

