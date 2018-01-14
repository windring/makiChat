class reza2{
  cav=0;
  painter=0;
  bufferCvs=0;
  bufferCtx=0;
  x=0;
  y=0;
  val={
    particles:[],
    gravities:[],
  };
  resize(){
    $(this.cav).attr({"width":window.innerWidth,"height":window.innerHeight});
    $(this.bufferCvs).attr({"width":window.innerWidth,"height":window.innerHeight});
    this.painter=this.cav.getContext("2d");
    this.bufferCtx=this.bufferCvs.getContext("2d");
  }
  init(){
    this.cav=document.querySelector("#cav");
    this.bufferCvs=document.createElement('canvas');
    this.resize();
    for(var i=0;i<100;i++)
      this.val.particles.push(Particle.random());
    this.val.gravities.push(new Graviticle(3*window.innerWidth/4,3*window.innerHeight/4,0.1));
    //requestAnimationFrame(this.loop);
    this.loop();
    return 0;
  }
  loop(){
    this.painter.save();
    this.painter.beginPath();
    this.painter.clearRect(0,0,window.innerWidth,window.innerHeight);
    this.painter.closePath();
    this.painter.restore();

    this.bufferCtx.save();
    this.bufferCtx.beginPath();
    this.bufferCtx.globalCompositeOperation = 'destination-out';
    this.bufferCtx.globalAlpha = 0.1;
    this.bufferCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    this.bufferCtx.closePath();
    this.bufferCtx.restore();

    this.bufferCtx.save();
    this.bufferCtx.lineWidth=2;
    this.bufferCtx.strokeStyle="#6cf";
    this.bufferCtx.lineCap = this.bufferCtx.lineJoin = 'round';
    this.bufferCtx.beginPath();
    for(var p in this.val.particles){
      p=this.val.particles[p];
      for(var g in this.val.gravities){
        g=this.val.gravities[g];
        p.akm.addSpeed(Vector.sub(g,p));
      }
      p.akm.update(1);
      this.bufferCtx.moveTo(~~p.x,~~p.y);
      this.bufferCtx.lineTo(~~p.lx,~~p.ly);
    }
    this.bufferCtx.stroke();
    this.bufferCtx.closePath();

    this.bufferCtx.fillStyle="#6cf";
    this.bufferCtx.lineWidth=0;
    this.bufferCtx.beginPath();
    for(var p in this.val.particles){
      p=this.val.particles[p];
      this.bufferCtx.moveTo(~~p.x,~~p.y);
      this.bufferCtx.arc(~~p.x,~~p.y,1,0,Math.PI*2,false);
    }
    this.bufferCtx.fill();
    this.bufferCtx.closePath();
    this.bufferCtx.restore();
    this.painter.beginPath();
    this.painter.drawImage(this.bufferCvs,0,0);
    this.painter.closePath();
    //requestAnimationFrame("reza.loop");
    setTimeout("reza2.loop()",10);
  }
};
function Vector(x,y){
  this.x=x;
  this.y=y;
  return this;
}
Vector.sub=function(g,p){
  var x=g.x-p.x;
  var y=g.y-p.y;
  var m=Math.sqrt(x*x+y*y);
  if(m){
    [x,y]=[x/m,y/m];
  }
  [x,y]=[x*g.mass,y*g.mass];
  return new Vector(x,y);
}
Particle=function(x,y,vx,vy,mass){
  this.x=x;
  this.y=y;
  this.vx=vx;
  this.vy=vy;
  this.mass=mass;
  this.t=0;
  this.akm=new AKM(this);
};
Particle.random=function(){
  return new Particle(
    window.innerWidth*Math.random()/2+window.innerWidth/4,
    window.innerHeight*Math.random()/2+window.innerHeight/4,
    Math.random()*2-1,
    Math.random()*2-1,
    1
  );
}
Particle.prototype.shm=function(dt){
  this.t+=dt;
  this.x=Math.sin(this.t)*400+window.innerWidth/2;
  this.y=Math.cos(this.t)*400+window.innerHeight/2;
};
Particle.prototype.add=function(ax,ay,t){
  var dvx=ax*t;
  this.vx+=dvx;
  var dvy=ay*t;
  this.vy+=dvy;
  this.x=this.x+this.vx*t;
  this.y=this.y+this.vy*t;
};
class AKM{
  constructor(_r){
    this.k=_r;
  }
  log(){
  }
  addxy(t){
    [this.k.lx,this.k.ly]=[this.k.x,this.k.y];
    this.k.x+=this.k.vx*t;
    this.k.y+=this.k.vy*t;
  }
  addSpeed(v){
    this.k.vx+=v.x;
    this.k.vy+=v.y;
  }
  scale(s){
    this.k.vx*=s;
    this.k.vy*=s;
  }
  normalize(){
    var m=Math.sqrt(this.k.vx*this.k.vx+this.k.vy*this.k.vy);
    if(m){
      this.k.vx/=m;
      this.k.vy/=m;
    }
  }
  v(){
    return Math.sqrt(this.k.vx*this.k.vx+this.k.vy+this.k.vy);
  }
  update(t){
    if(this.v()>12){
      this.normalize();
      this.scale(12);
    }
    this.addxy(t);
  }
};
Graviticle=function(x,y,mass){
  [this.x,this.y,this.mass]=[x,y,mass];
}
window.reza2=new reza2();
