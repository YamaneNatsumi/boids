// あらかじめ決めておくもの
var NUMBER = 50;//全体個数
var CENTER_PULL_FACTOR = 100;// 群れの中心に引き寄せられる強さ。小さいほど引き寄せられる
var DIST_THRESHOLD = 30; // どれくらいの距離までちかづいたら離れるか
var SPEED = 7; // 最大の移動速度
var FPS = 30;
var SCREEN_SIZE = 600;
var BOID_SIZE = 10;
var boids = [];
var canvas = document.getElementById('boidyamanatsu');
var ctx = canvas.getContext('2d');

// Birdクラス
class Boid{
	constructor(x,y,vx,vy,id){
		this.x = x;//Birdのxに引数のxを代入
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.id = id;
		// x,y:現在の位置 vx,vy:移動量 id:インスタンスを識別するid
	}	
	//①多くの個体がいる方向に動く
	move_center() {
		var center = {x:0,y:0}
	  for(var i = 0; i < boids.length; i++){
	    // idが一緒 = 同じ個体なのでスキップ
	    if(this.id == boids[i].id) continue;
	    // 全ての個体の値を足し合わせる
	    center.x += boids[i].x;//ここは何回かの繰り返しで順にどんどん値が足されていく？
	    center.y += boids[i].y;//ここは何回かの繰り返しで順にどんどん値が足されていく？
	  }

	  // 平均をとって、中心を求める
	  center.x /= (NUMBER - 1);
	  center.y /= (NUMBER - 1);

	  // 中心に近づく距離を計算　今の位置から中心の位置までの距離を計算÷ 群れの中心に引き寄せられる強さ←ここよくわからない
	  this.vx += (center.x - this.x) / CENTER_PULL_FACTOR
	  this.vy += (center.y - this.y) / CENTER_PULL_FACTOR
	};

	//②近くの個体と近づきすぎたらぶつからないように離れること
	move_avoid() {
	  for(var i = 0; i < boids.length; i++){
	    if(this.id == boids[i].id) continue;
	    //２点の距離を計算する関数
	    function distance(d1,d2){
	    	var dis_x = d1.x - d2.x;
	    	var dis_y = d1.y - d2.y;
	    	return Math.sqrt(dis_x * dis_x + dis_y * dis_y)
	    }
	    //dは特定の２点の距離
	    var d = distance(boids[i],this)
	    //dがDIST_THRESHOLDより小さければ
	    if( d < DIST_THRESHOLD) {
	      // 離れるために、逆方向に動く
	      this.vx -= (boids[i].x - this.x);
	      this.vy -= (boids[i].y - this.y);
	    }
	  }
	};

	//③近くのもの同士で動くスピードや方向を合わせる
	move_average() {
	  var average = {x:0,y:0}
	  for(var i = 0; i < boids.length; i++){
	    if(this.id == boids[i].id) continue;
	    average.x += boids[i].vx;
	    average.y += boids[i].vy;
	  }
	  // 平均ををとって、中心を求める
	  average.x /= (NUMBER - 1);
	  average.y /= (NUMBER - 1);

	  // 全体のベクトルの半分の移動速度にする
	  this.vx = (average.x - this.vx)/2;
	  this.vy = (average.y - this.vy)/2;
	};

	//④移動距離が一定以上になったら減速
	speed_down() {
	  // 距離を求める
	  var movement = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
	   // 移動距離が一定以上だったら
	  if(movement >= SPEED) {
	    // 減速させる
	    this.vx = (this.vx / movement) * SPEED;//意味はわかるけどなんでこの計算？
	    this.vy = (this.vy / movement) * SPEED;//意味はわかるけどなんでこの計算？
	  }
	}
	//⑤スクリーンの端にぶつかると方向をかえる
	change_direction(){
		if(this.x < 0 && this.vx < 0 || this.x > SCREEN_SIZE && this.vx > 0){
			this.vx *= -1
		}
		if(this.y < 0 && this.vy < 0 || this.y > SCREEN_SIZE && this.vy > 0) {
      		this.vy *= -1;
    	}
	}
	//①〜⑤の関数を実行＆移動量が決まったのでそれをもとの座標の値に加える
	check(){
	  this.move_center();
	  this.move_avoid();
	  this.move_average();
	  this.speed_down();
	  this.change_direction();
	  this.x += this.vx;
	  this.y += this.vy;
	}
}
// 読み込み終わりに実行される
  window.onload = function() {
    canvas.width = canvas.height = SCREEN_SIZE;
    ctx.fillStyle = "rgba(50, 200, 0, 0.8)";
    for (var i = 0; i < NUMBER; ++i) {
      boids.push(
        new Boid( Math.random() * SCREEN_SIZE, Math.random() * SCREEN_SIZE, 0, 0 ,i)//x,y,vx,vy,id
      )
    }
    setInterval(
      function() {
        ctx.clearRect(0, 0, SCREEN_SIZE, SCREEN_SIZE);
        for (var i = 0; i < boids.length; i++) {
          ctx.fillRect(boids[i].x - BOID_SIZE / 2, boids[i].y - BOID_SIZE / 2, BOID_SIZE, BOID_SIZE);
          boids[i].check();
        }
      },
      1000/FPS);
  }
