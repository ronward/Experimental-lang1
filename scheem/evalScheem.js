// A half-baked implementation of evalScheem
var log = function(msg){
    if(console && console.log){
        console.log(msg);
    }
};

var evalScheemString = function(src, env) {
    // Note: assumes SCHEEM is accessable 
    var ast, r;
    env = env || {};
    log("src='"+src+"'");
    ast = SCHEEM.parse(src);
    log("ast=" + JSON.stringify(ast));
    r = evalScheem(ast, env);
    log("result="+r);
    return r;
};

var evalScheem = function (expr, env) {
    // Numbers evaluate to themselves
    var es, r, a, b, v, value, e;
    //log("evalScheem("+JSON.stringify(expr)+", env="+JSON.stringify(env)+")");
    es = function(i){
        return evalScheem(expr[i], env);
    }
    if (typeof expr === 'number') {
        return expr;
    }
    // Look at head of list for operation
    switch (expr[0]) {
        case 'let-one':
            v = expr[1];
            value = es(2);
            e = {};
            e.__proto__ = env;
            e[v]=value;
            r = evalScheem(expr[3], e);
            return r;
        case 'define':
            v = expr[1];
            value = ex(2);
            env[v] = value;
            return value;
        case 'set!':
            v = expr[1];
            if(typeof(env[v])==="undefined"){
                throw new Error("'"+v+"' is not defined!");
            }
            value = value;
            env[v] = value;
            return value;
        case '+':
            a = es(1);
            b = es(2);
            if(typeof(a)!=="number" || typeof(b)!=="number"){
                throw new Error("Expected number!");
            }
            return a+b;
        case '*':
            a = es(1); b = es(2);
            if(typeof(a)!=="number" || typeof(b)!=="number"){
                throw new Error("Expected number!");
            }
            return a*b;
        case '-':
            a = es(1); b = es(2);
            if(typeof(a)!=="number" || typeof(b)!=="number"){
                throw new Error("Expected number!");
            }
            return a-b;
        case '/':
            a = es(1); b = es(2);
            if(typeof(a)!=="number" || typeof(b)!=="number"){
                throw new Error("Expected number!");
            }
            return a/b;
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
            r = es(1);
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
