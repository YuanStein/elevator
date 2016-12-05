/**
 * Created by haha on 2016/12/5.
 */

var Elevator = function (index,high,basecoat,init){
    //上行最大位置
    this.up = new Array();
    //下行最大位置
    this.down = new Array();
    //当前位置
    this.dt = 1;
    //state 状态 静止：0 上行：1 下行：2
    this.state = 0;
    //电梯index
    this.index = index;
    //电梯作用范围 high:作用最高楼层 basecoat:作用最低楼层 init:初始楼层
    this.high = high;
    this.basecoat = basecoat;
    //保证只有一个time在运行
    this.controlWork = 0;
    this.moveControl;
};

Elevator.prototype = {
    //移动逻辑
    judge: function(){
        var self = this;
        this.up = new Array();
        this.down = new Array();
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
        if(this.controlWork == 0) {
            self.controlWork = 1;
            this.moveControl = setInterval(function () {
                self.move();
            }, 1000);
        }

    },

   move:function(){
       var self = this;
       console.log(this.up);
       console.log(this.down);
       if(this.state == 1){
           if(this.up.length == 0){
               //上行为空
               this.state = 0;
           }else{
               if(this.up[0] > this.dt){
                   //上行未走完
                   this.putUp();
               }else{
                   //上行走完
                   this.state = 0;
               }
           }
       }
       if(this.state == 2){
           if(this.down.length == 0){
               //下行为空
               this.state = 0;
           }else{
               if(this.down[this.down.length - 1] < this.dt){
                   //下行未走完
                   this.putUp();
               }else{
                   //下行走完
                   this.state = 0;
               }
           }
       }
        if(this.state == 0){
            if(this.up.length == 0 && this.down.length == 0){
                //所有行动结束
                clearInterval(this.moveControl);
                this.controlWork = 0;
                return false;
            }
            else{
                //不能判断是否上下行
                /*
                先判断上行，再判断下行
                上行就近
                 */
                //判断上行
                var up_state = self.dt;
                var up_state_d = self.dt;
                var down_state = self.dt;
                var down_state_u = self.dt;
                if(this.up.length != 0){
                    $.each(this.up,function(index){
                        if(this > up_state){
                            up_state = this;
                        }
                        else if(this < up_state_d){
                            up_state_d = this;
                        }
                    })
                }
                if(this.down.length != 0){
                    $.each(this.down,function(index){
                        if(this > down_state){
                            down_state = this;
                        }
                        else if(this < down_state_u){
                            down_state_u = this;
                        }
                    })
                }
                up_state = (up_state - this.dt) < (down_state_u - this.dt) ? (up_state - this.dt) : (down_state_u - this.dt);
                down_state = (this.dt + down_state) < (this.dt - up_state_d) ? (this.dt + down_state) : (this.dt - up_state_d);
                if(up_state < down_state){
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
   },

    putUp:function(){
        var dt = this.dt;
        $("li").each(function(){
            if($(this).data('tag') == dt){
                $(this).find('.dt-1').removeClass('glyphicon');
                $(this).find('.dt-1').removeClass('glyphicon-asterisk');
            }
            if($(this).data('tag') == (dt + 1)){
                $(this).find('.dt-1').addClass('glyphicon');
                $(this).find('.dt-1').addClass('glyphicon-asterisk');
                $(this).find('.btn-move').find('.put-up').removeClass('orange');
                $(this).find('.btn-move').find('.put-up').attr('data-type', '0');
                if((dt + 1) == 10){
                    $(this).find('.btn-move').find('.put-down').removeClass('orange');
                }
            }
        });
        this.dt = dt + 1;
        var self = this;
        $.each(this.up,function(index){
            if(this == (dt+1)){
                self.up.splice(index,1);
            }
        })
    },

    putDown:function(){
        var dt = this.dt;
        $("li").each(function(){
            if($(this).data('tag') == dt){
                $(this).find('.dt-1').removeClass('glyphicon');
                $(this).find('.dt-1').removeClass('glyphicon-asterisk');
            }
            if($(this).data('tag') == (dt - 1)){
                $(this).find('.dt-1').addClass('glyphicon');
                $(this).find('.dt-1').addClass('glyphicon-asterisk');
                $(this).find('.btn-move').find('.put-down').removeClass('orange');
                $(this).find('.btn-move').find('.put-down').attr('data-type', '0');
                if((dt - 1) == 1){
                    $(this).find('.btn-move').find('.put-up').removeClass('orange');
                }
            }
        });
        this.dt = dt - 1;
        var self = this;
        $.each(this.down,function(index){
            if(this == (dt+1)){
                self.down.splice(index,1);
            }
        })
    }
};