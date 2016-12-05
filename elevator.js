/**
 * Created by haha on 2016/12/5.
 */

var Elevator = function (index,high,basecoat,init){
    //上行最大位置
    this.up = new Array();
    //下行最大位置
    this.down = new Array();
    //目标位置
    this.target = 0;
    //新目标
    this.newTarget = 0;
    //当前位置
    this.dt = 1;
    //state 状态 静止：0 上行：1 下行：2
    this.state = 4;
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
        if(this.state == 0){

        }else if(this.state == 1){

        }else if(this.state == 2){

        }

        if(this.controlWork == 0) {
            var self = this;
            this.moveControl = setInterval(function () {
                self.move();
                this.controlWork = 1;
            }, 1000);
        }
    },

   move:function(){
       var str = "target:" + this.target + ",newTarget:" + this.newTarget + ",dt:" + this.dt + ",state:"+this.state;
       console.log(str);
       if(this.target == this.dt || this.target == 0){
           //到达目标，判断下一目标
           if(this.newTarget == 0){
               //无下一目标
               clearInterval(this.moveControl);
               this.controlWork = 0;
               return false;
           }
           else{
               //更新目标
               this.target = this.newTarget;
               this.newTarget = 0;
           }
       }

       if((this.target - this.dt) == 0){
           //bug
           alert(this.target);
       }
       else if((this.target - this.dt) > 0){
           //上行
           this.state = 1;
           this.putUp();
       }
       else if((this.target - this.dt) < 0){
           //下行
           this.state = 2;
           this.putDown();
       }




       //if(this.state == 0){
       //    if(this.target == 0 || this.target == this.dt){
       //        clearInterval(this.moveControl);
       //        this.state = 4;
       //        return false;
       //    }
       //}
       //
       //if(this.state == 0){
       //    if(this.up == this.down == this.dt || (this.up == 0 && this.down == 0)){
       //        this.state = 0;
       //        clearInterval(this.moveControl);
       //        this.state = 4;
       //        return false;
       //    }
       //    else if(this.up != this.dt || this.down != this.dt){
       //         if(this.up == 0){
       //             //下行
       //             this.state = 2;
       //             this.putDown();
       //         }else if(this.down == 0){
       //             //上行
       //             this.state = 1;
       //             this.putUp();
       //         }else{
       //             var goup = this.up - this.dt;
       //             var godown = this.dt - this.down;
       //             if((goup - godown) > 0){
       //                 //下行
       //                 this.state = 2;
       //                 this.putDown();
       //             }else{
       //                 //上行
       //                 this.state = 1;
       //                 this.putUp();
       //             }
       //         }
       //    }
       //    else{
       //        clearInterval(this.moveControl);
       //        var str = "up:" + this.up + ",down:" + this.down + ",dt:" + this.dt + ",state:"+this.state;
       //        alert(str);
       //        return false;
       //    }
       //}
       //else if(this.state == 1){
       //    if(this.up == this.dt){
       //        //上行结束
       //        this.state = 0;
       //        this.up = 0;
       //    }
       //    else{
       //        //上行未结束，继续上行
       //        this.putUp();
       //    }
       //}
       //else if(this.state == 2){
       //    if(this.down == this.dt){
       //        //下行结束
       //        this.state = 0;
       //        this.down = 0;
       //    }
       //    else{
       //        //下行未结束,继续下行
       //        this.putDown();
       //    }
       //}
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
                if((dt + 1) == 10){
                    $(this).find('.btn-move').find('.put-down').removeClass('orange');
                }
            }
        });
        this.dt = dt + 1;
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
                if((dt - 1) == 1){
                    $(this).find('.btn-move').find('.put-up').removeClass('orange');
                }
            }
        });
        this.dt = dt - 1;
    }
};