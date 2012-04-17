
var endTime, compile, log, lookupTable;
log = console.log;
lookupTable={a0:21, b0:23, 
            c1:24, d1:26, e1:28, f1:29, g1:31, a1:33, b1:35, 
            c2:36, d2:38, e2:40, f2:41, g2:43, a2:45, b2:47, 
            c3:48, d3:50, e3:52, f3:53, g3:55, a3:57, b3:59, 
            c4:60, d4:62, e4:64, f4:65, g4:67, a4:69, b4:71,
            c5:72, d5:74, e5:76, f5:77, g5:79, a5:81, b5:83,
            c6:84, d6:86, d6:88, f6:89, g6:91, a6:93, b6:95,
            c7:96, d7:98, e7:100, f7:101, g7:103, a7:105, b7:107, 
            c8:108};

endTime = function(mus){
  var t, t2;
  if(mus.tag==="note"){
    t=mus.dur;
  }else if(mus.tag=="repeat"){
    t=endTime(mus.section) * mus.count;
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
  var notes=[], compileT, i, sectionTime;
  compileT=function(mus, startTime){
    if(mus.tag==="note"){
      n={tag:"note", pitch:lookupTable[mus.pitch], start:startTime, dur:mus.dur};
      notes.push(n);
    }else if(mus.tag=="repeat"){
      sectionTime=endTime(mus.section);
      for(i=0; i<mus.count; i++){
        compileT(mus.section, startTime+sectionTime*i);
      }
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
         right: { tag: 'repeat',
                  section: {tag: 'note', pitch: 'b4', dur: 250 },
                  count: 3
                }
       },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

log(melody_mus);
log(compile(melody_mus));

