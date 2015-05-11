/**
 * Created by asus on 2015/4/23.
 */
var ObjectLayer = cc.Layer.extend({
    space: null,
    objects: [],
    spriteSheet: null,
    map: null,
    mapIndex: 0,
    newMapIndex: 1,
    newPosX: 500,

    ctor: function (space) {
        this._super();
        this.space = space;
        this.objects = [];
        this.init();
    },

    init: function () {
        size = cc.director.getWinSize();

        // Obj BatchNode
        cc.spriteFrameCache.addSpriteFrames(res.Obj_plist);
        this.spriteSheet = new cc.SpriteBatchNode(res.Obj_png);
        this.addChild(this.spriteSheet);

        var start = new cc.Sprite("#floor_top.png");
        start.attr({x:0, y:0, anchorX:0, anchorY:0});
        this.spriteSheet.addChild(start);

        this.loadObjects(SH.MAP_TYPE.BRICKS, this.newMapIndex, 500);

        this.scheduleUpdate();
    },
    /** loadObjects
     * @param {Number SH.MAP_TYPE }
     * @param {cp.Space *}
     * @param {cc.p}
     * @param {number 0.沙块 1.土块 2.土块（上下移动）3.土块（左右移动）}
     */
    loadObjects: function (map, mapIndex, posX) {
        if (map == SH.MAP_TYPE.BRICKS) {
            // add bricks
            var brick_length = Math.floor(Math.random() * 5) + 6;
            var brick_type = Math.floor(Math.random() * 3);
            for (var i = 0; i < brick_length; i++) {
                brick_type = (i == brick_length - 1 ? 2 : Math.floor(Math.random() * 3));
                var brick = new Brick(this.spriteSheet, this.space, posX + i * 300, brick_type);
                var drop_y = SH.BRICK_HEIGHT + 100;
                // add drop
                if (brick_type == 2) {
                    var flag = Math.round(Math.random());
                    if(flag == 0 ){
                        drop_y = SH.BRICK_HEIGHT + 100 + SH.BRICK_MOVE.V;
                    }else{
                        drop_y = SH.BRICK_HEIGHT + 100 + SH.BRICK_MOVE.V;
                    }
                }
                var drop = new Drop(this.spriteSheet, this.space, cc.p(posX + i * 300, drop_y));
                brick.mapIndex = mapIndex;
                drop.mapIndex = mapIndex;
                this.objects.push(brick);
                this.objects.push(drop);

                if (brick_type == 3) {
                    var brick_null = null;
                    this.objects.push(brick_null);
                    i++;
                }
            }
            this.newPosX += brick_length * 300;

        } else if (map == SH.MAP_TYPE.FLAT) {


        }
    },

    removeObjects: function (mapIndex) {
        while ((function (obj, index) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].mapIndex == index) {
                    obj[i].removeFromParent();
                    obj.splice(i, 1);
                    return true;
                }
            }
            return false;
        })(this.objects, mapIndex));
    },

    removeObjectByShape: function (shape) {
        for (var i = 0; i < this.objects.length; i++) {
            if (this.objects[i].getShape() == shape) {
                this.objects[i].removeFromParent();
                this.objects.splice(i, 1);
                break;
            }
        }
    },

    dropObjectByShape: function(shape){
        for(var i=0; i<this.objects.length; i++){
            if(this.objects[i].getShape()==shape){

            }
        }
    },

    checkAndReload: function (eyeX) {
        cc.log(eyeX);
        if (eyeX >= this.newPosX) {
            this.newMapIndex++;
        }
        if (this.mapIndex == this.newMapIndex) {
            return false;
        }

        //if (0 == this.newMapIndex % 2) {
            //this.loadObjects(SH.MAP_TYPE.FLAT, this.newMapIndex, this.newPosX);

        //} else {
            this.loadObjects(SH.MAP_TYPE.BRICKS, this.newMapIndex, this.newPosX);
       // }

        this.removeObjects(this.newMapIndex - 1);
        this.mapIndex = this.newMapIndex;
        return true;
    },

    update: function (dt) {
        var animationLayer = this.getParent().getChildByTag(SH.LAYER_TAG.ANIMATION);
        var eyeX = animationLayer.getEyeX();
        this.checkAndReload(eyeX);
    }
});