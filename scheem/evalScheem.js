// A half-baked implementation of evalScheem
var evalScheem = function (expr, env) {
    // Numbers evaluate to themselves
    var es, r, a, b;
    es = function(i){
        return evalScheem(expr[i], env);
    }
    if (typeof expr === 'number') {
        return expr;
    }
    // Look at head of list for operation
    switch (expr[0]) {
        case '+':
            a = es(1);
            b = es(2);
            if(typeof(a)!=="number" || typeof(b)!=="number"){
                throw new Error("Expected number!");
            }
            return a+b;
        case 'quote':
            return expr[1];
        case '=':
            return es(1)===es(2)?"#t":"#f";
        case '<':
            return es(1)<es(2)?"#t":"#f";
        case 'cons':
            r = es(2);
            r.unshift(es(1));
            return r;
        case 'car':
            r = es(1);
            return r[0];
        case 'cdr':
            r = es(1);
            r.shift();
            return r;
        case 'if':
            r = expr[1];
            return r==="#t"?es(2):es(3);
        case 'begin':
            for(var i=1; i<expr.length; i++) r=es(i);
            return r;
        default:
            r = env[expr[0]];
            if(typeof(r)==="undefined") return expr[0];
            return r;
    }
};
