/**
 * Created by asus on 2015/4/23.
 */
var ObjectLayer = cc.Layer.extend({
    space: null,
    objects: [],
    spriteSheet: null,
    map: null,
    mapIndex: null,
    posX: 0,

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
            var drop_y = SH.BRICK_HEIGHT + 50;
            for (var i = 0; i < brick_length; i++) {
                brick_type = (i == brick_length - 1 ? 2 : Math.floor(Math.random() * 3));
                var brick = new Brick(this.spriteSheet, this.space, x, brick_type);
                // add drop
                if (brick_type == 2) {
                    var flag = Math.round(Math.random());
                    flag == 0 ? drop_y += SH.BRICK_MOVE.V : drop_y -= SH.BRICK_MOVE.V;
                }
                var drop = new Drop(this.spriteSheet, this.space, cc.p(x, drop_y));
                this.objects.push(brick);
                this.objects.push(drop);

                if (brick_type == 3) {
                    var brick_null = null;
                    this.objects.push(brick_null);
                    i++;
                }
            }
        } else if(map == SH.MAP_TYPE.FLAT){

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
    }

    //checkAndReload:function (eyeX) {
    //    var newMapIndex = parseInt(eyeX / this.mapWidth);
    //    if (this.mapIndex == newMapIndex) {
    //        return false;
    //    }
    //
    //    if (0 == newMapIndex % 2) {
    //        // change mapSecond
    //        this.map01.setPositionX(this.mapWidth * (newMapIndex + 1));
    //        this.loadObjects(this.map01, newMapIndex + 1);
    //
    //    } else {
    //        // change mapFirst
    //        this.map00.setPositionX(this.mapWidth * (newMapIndex + 1));
    //        this.loadObjects(this.map00, newMapIndex + 1);
    //
    //    }
    //
    //    this.removeObjects(newMapIndex - 1);
    //    this.mapIndex = newMapIndex;
    //
    //    return true;
    //},
    //
    //update:function (dt) {
    //    var animationLayer = this.getParent().getChildByTag(SH.LAYER_TAG.ANIMATION);
    //    var eyeX = animationLayer.getEyeX();
    //    this.checkAndReload(eyeX);
    //}
});