/**
 * Created by haha on 2016/12/5.
 */

var Elevator = function (index,high,basecoat){
    //上行数组
    this.up = new Array();
    //下行数组
    this.down = new Array();
    //电梯内数组
    this.wangto = new Array();
    //当前位置
    this.dt = 1;
    //state 状态 静止：0 上行：1 下行：2
    this.state = 0;
    //电梯index
    this.index = index;
    //电梯作用范围 high:作用最高楼层 basecoat:作用最低楼层
    this.high = high;
    this.basecoat = basecoat;
    //电梯停止时间
    this.sleep = 1000;
    //保证只有一个time在运行
    this.controlWork = 0;
    this.moveControl;
};

Elevator.prototype = {
    //移动逻辑
    judge: function(){
        var self = this;
        if(this.controlWork == 0) {
            self.controlWork = 1;
            this.moveControl = setTimeout(function () {
                self.move();
                var str = "dt:"+self.dt+",state:"+self.state;
                console.log(str);
            }, this.sleep);
        }
    },

   move:function(){
       var self = this;
       this.up = new Array();
       this.down = new Array();
       this.wangto = new Array();
       $(".dt li").each(function(){
           if($(this).find('.btn-move').find('.put-up').attr('data-type') == 1){
               var tag_up = $(this).data('tag');
               self.up.push(tag_up);
           }
           if($(this).find('.btn-move').find('.put-down').attr('data-type') == 1){
               var tag_down = $(this).data('tag');
               self.down.push(tag_down);
           }
       });
       $('.wangto li').each(function(){
          if($(this).find('.btn-wantto').attr('data-type') == 1){
              var wangto = parseInt($(this).find('.btn-wantto').attr('data-tag'));
              self.wangto.push(wangto);
          }
           if($(this).find('.to2').attr('data-type') == 1){
               var to2 = parseInt($(this).find('.to2').attr('data-tag'));
               self.wangto.push(to2);
           }
       });
       console.log(this.up);
       console.log(this.down);
       console.log(this.wangto);
       if(this.state == 1){
            var w_up = this.up.length>0 ? this.up[0] : 0;
            var w_down = this.down.length>0 ? this.down[0] : 0;
            var w_to = this.wangto.length>0 ? this.wangto[this.wangto.length - 1] : 0;
           var str = "上行、up:"+w_up+",down:"+w_down+",to:"+w_to;
           console.log(str);
            if(w_up < this.dt && w_down<this.dt && w_to < this.dt){
                //稳妥静止
                this.state = 0;
            }else{
                this.putUp();
            }
       }
       if(this.state == 2){
           var w_up = this.up.length>0 ? this.up[this.up.length - 1] : this.high;
           var w_down = this.down.length>0 ? this.down[this.down.length - 1] : this.high;
           var w_to = this.wangto.length>0 ? this.wangto[0] : this.high;
           var str = "下行、up:"+w_up+",down:"+w_down+",to:"+w_to;
           console.log(str);
           if(w_up > this.dt && w_down > this.dt && w_to > this.dt){
               //稳妥静止
               this.state = 0;
           }else{
               this.putDown();
           }
       }
       if(this.state == 0){
           if(this.up.length == 0 && this.down.length == 0 && this.wangto.length == 0){
               this.controlWork = 0;
               return false;
           }
           else{
               //分别获取上行和下行的最小距离，若都为1则上行
               var u_length = this.high;
               var d_length = this.high;
               $.each(this.up,function(){
                   if((this - self.dt) <= u_length && this > self.dt){
                       u_length = this - self.dt;
                   }
                   if((self.dt - this) <= d_length && this < self.dt){
                       d_length = self.dt - this;
                   }
               });
               $.each(this.down,function(){
                   if((this - self.dt) <= u_length && this > self.dt){
                       u_length = this-self.dt;
                   }
                   if((self.dt - this) <= d_length && this < self.dt){
                       d_length = self.dt - this;
                   }
               });
               $.each(this.wangto,function(){
                   if((this - self.dt) <= u_length && this > self.dt){
                       u_length = this-self.dt;
                   }
                   if((self.dt - this) <= d_length && this < self.dt){
                       d_length = self.dt - this;
                   }
               });
               str = "u_length:"+u_length+",d_length:"+d_length;
               console.log(str);
               if(u_length > d_length){
                   //下行
                   this.state = 2;
                   this.putDown();
               }else{
                   //上行
                   this.state = 1;
                   this.putUp();
               }
           }
       }
       if(this.controlWork == 1){
           this.moveControl = setTimeout(function () {
               self.move();
               var str = "dt:"+self.dt+",state:"+self.state;
               console.log(str);
           }, this.sleep);
           this.sleep = 1000;
       }
   },

    putUp:function(){
        var self = this;
        this.dt = this.dt + 1;
        $(".dt li").each(function(){
            if($(this).data('tag') == (self.dt - 1)){
                $(this).find('.dt-1').removeClass('glyphicon');
                $(this).find('.dt-1').removeClass('glyphicon-asterisk');
            }
            if($(this).data('tag') == self.dt){
                $(this).find('.dt-1').addClass('glyphicon');
                $(this).find('.dt-1').addClass('glyphicon-asterisk');
            }
        });
        //修改状态
        var wto = $.inArray(this.dt,this.wangto);
        var wup = $.inArray(this.dt,this.up);
        var wdn = $.inArray(this.dt,this.down);
        if(wto != -1){
            this.sleep = 3000;
            $('.wangto li').each(function(){
                if($(this).find('.to1').attr('data-tag') == self.dt){
                    $(this).find('.to1').attr('data-type',0);
                    $(this).find('.to1').removeClass('orange');
                }
                else if($(this).find('.to2').attr('data-tag') == self.dt){
                    $(this).find('.to2').attr('data-type',0);
                    $(this).find('.to2').removeClass('orange');
                }
            })
        }
        if(wup != -1){
            this.sleep = 3000;
            $('.dt li').each(function(){
                if($(this).attr('data-tag') == self.dt ){
                    $(this).find('.btn-move').find('.put-up').attr('data-type',0);
                    $(this).find('.btn-move').find('.put-up').removeClass('orange');
                }
            })
        }
        if(wto == -1 && wup == -1 && wdn != -1){
            if(this.down[0] == this.dt) {
                this.sleep = 3000;
                $('.dt li').each(function () {
                    if ($(this).attr('data-tag') == self.dt) {
                        $(this).find('.btn-move').find('.put-down').attr('data-type', 0);
                        $(this).find('.btn-move').find('.put-down').removeClass('orange');
                    }
                })
            }
        }
    },

    putDown:function(){
        var self = this;
        this.dt = this.dt - 1;
        $(".dt li").each(function(){
            if($(this).data('tag') == (self.dt + 1)){
                $(this).find('.dt-1').removeClass('glyphicon');
                $(this).find('.dt-1').removeClass('glyphicon-asterisk');
            }
            if($(this).data('tag') == self.dt){
                $(this).find('.dt-1').addClass('glyphicon');
                $(this).find('.dt-1').addClass('glyphicon-asterisk');
            }
        });
        var wto = $.inArray(this.dt,this.wangto);
        var wup = $.inArray(this.dt,this.up);
        var wdn = $.inArray(this.dt,this.down);
        if(wto != -1){
            this.sleep = 3000;
            $('.wangto li').each(function(){
                if($(this).find('.to1').attr('data-tag') == self.dt){
                    $(this).find('.to1').attr('data-type',0);
                    $(this).find('.to1').removeClass('orange');
                }
                else if($(this).find('.to2').attr('data-tag') == self.dt){
                    $(this).find('.to2').attr('data-type',0);
                    $(this).find('.to2').removeClass('orange');
                }
            })
        }
        if(wdn != -1){
            this.sleep = 3000;
            $('.dt li').each(function(){
                if($(this).attr('data-tag') == self.dt ){
                    $(this).find('.btn-move').find('.put-down').attr('data-type',0);
                    $(this).find('.btn-move').find('.put-down').removeClass('orange');
                }
            })
        }
        if(wto == -1 && wdn == -1 && wup != -1){
            if(this.up[0] == this.dt) {
                this.sleep = 3000;
                $('.dt li').each(function () {
                    if ($(this).attr('data-tag') == self.dt) {
                        $(this).find('.btn-move').find('.put-up').attr('data-type', 0);
                        $(this).find('.btn-move').find('.put-up').removeClass('orange');
                    }
                })
            }
        }
    }
};