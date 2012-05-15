// A half-baked implementation of evalScheem
var enableLogging = true;
var log = function(msg){
    if(enableLogging){
        if(console && console.log){
            console.log(msg);
        }
    }
};

var evalScheemString = function(src, env) {
    // Note: assumes SCHEEM is accessable 
    var ast, r;
    env = env || getInitEnv();
    log("src='"+src+"'");
    ast = SCHEEM.parse(src);
    log("ast=" + JSON.stringify(ast));
    r = evalScheem(ast, env);
    log("result="+r);
    return r;
};

var evalScheem = function (expr, env) {
    // Numbers evaluate to themselves
    var es, r, a, b, v, n, i, value, e, f, args, vars, body;
    var newEnv;
    var setEnv, defineVar, getExpressions;
    if(!env){
        env = getInitEnv();
    }
    //log("evalScheem("+JSON.stringify(expr)+", env="+JSON.stringify(env)+")");
    es = function(i){
        return evalScheem(expr[i], env);
    };
    setEnv = function(env, n, v){
        if(env.hasOwnProperty(n)){
            env[n]=v;
            return;
        }
        if(env.__proto__.__proto__===null){
            //p[n]=v;
            throw new Error("'"+n+"' is not defined!");
        }
        setEnv(env.__proto__, n, v);
    };
    defineVar = function(env, n, v){
        //while(env.__proto__.__proto__!==null){
        //    env = env.__proto__;
        //}
        env[n]=v;
    };
    getExpressions = function(){
        var args=[], i;
        for(i=1; i<expr.length; i+=1){
            args.push(evalScheem(expr[i], env));
        }
        return args;
    };
    
    if (typeof expr === 'number') {
        return expr;
    } else if (typeof expr === 'string') {
        if(expr.substr(0,1)==="'" && expr.substr(-1,1)==="'"){
            r = expr.substr(1, expr.length-2); 
        } else {
            r = env[expr];
        }
        return r;
    }
    // Look at head of list for operation
    switch (expr[0]) {
        case 'lambda':
            vars = expr[1];
            body = expr[2];
            f = function(){
                newEnv = {};
                newEnv.__proto__ = env;
                for(i=0; i<vars.length; i+=1){
                    newEnv[vars[i]] = arguments[i];
                }
                return evalScheem(body, newEnv);
            };
            return f;
        case 'define':
            n = expr[1];
            value = es(2);
            //env[n] = value;
            defineVar(env, n, value);
            return value;
        case 'set!':
            n = expr[1];
            if((typeof(env[n]))==="undefined"){
                throw new Error("'"+n+"' is not defined!!!");
            }
            value = es(2);
            setEnv(env, n, value); 
            return value;
        case 'quote':
            v = expr[1];
            log("quote");
            return v;
        case 'if':
            r = es(1);
            return r==="#t"?es(2):es(3);
        case 'begin':
            for(var i=1; i<expr.length; i++) r=es(i);
            return r;
        case 'let':
            // (let ((var expr) ...) body)
            newEnv = {};
            newEnv.__proto__ = env;
            expr[1].forEach(function(i){
                newEnv[i[0]] = evalScheem(i[1], newEnv);
            });
            return evalScheem(expr[2], newEnv);
        default:
            f = es(0);
            args = getExpressions();
            r = f.apply(null, args);
            return r;
    }
};

var getInitEnv = function(){
    var env, assertNums;
    assertNums = function(a, b){
        if(typeof(a)!=="number" || typeof(b)!=="number"){
            throw new Error("Expected numbers only");
        }
    };
    env = {
        "+":function(a, b) { assertNums(a, b); return a+b; },
        "-":function(a, b) { assertNums(a, b); return a-b; },
        "*":function(a, b) { assertNums(a, b); return a*b; },
        "/":function(a, b) { assertNums(a, b); return a/b; },
        "=":function(a, b) { return a===b?"#t":"#f"; },
        "<":function(a, b) { return a<b?"#t":"#f"; },
        ">":function(a, b) { return a>b?"#t":"#f"; },
        "!=":function(a, b) { return a!==b?"#t":"#f"; },
        cons:function(a, list) { var c=list.slice(0); 
                                    c.unshift(a);
                                    return c; },
        car:function(list) { return list[0]; },
        cdr:function(list) { return list.slice(1); },
        alert:function(msg) {   if(alert){
                                    alert(msg);
                                }else if(console && console.log){
                                    console.log(msg);
                                }
                                return msg; },
        log:function(msg) { if(log){log(msg);} },
        toJSON:function(obj) { return JSON.stringify(obj); },
        _end_:function(a, b) {}
    };
    return env;
};






