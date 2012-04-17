
var endTime, compile, log;
log = console.log;

endTime = function(mus){
  var t, t2;
  if(mus.tag==="note"){
    t=mus.dur;
  }else if(mus.tag==="seq"){
    t=endTime(mus.left);
    t+=endTime(mus.right);
  }else if(mus.tag==="par"){
    t=endTime(mus.left);
    t2=endTime(mus.right);
    if(t2>t) { t=t2; }
  }
  return t;
};

compile = function(mus){
  var notes=[], compileT;
  compileT=function(mus, startTime){
    if(mus.tag==="note"){
      n={tag:"note", pitch:mus.pitch, start:startTime, dur:mus.dur};
      notes.push(n);
    }else if(mus.tag==="seq"){
      compileT(mus.left, startTime);
      startTime+=endTime(mus.left);
      compileT(mus.right, startTime);
    }else if(mus.tag==="par"){
      compileT(mus.left, startTime);
      compileT(mus.right, startTime);
    }
  }
  compileT(mus, 0);
  return notes;
};



var melody_mus = 
    { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

log(melody_mus);
log(compile(melody_mus));

