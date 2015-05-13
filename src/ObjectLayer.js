/**
 * Created by asus on 2015/4/23.
 */
var ObjectLayer = cc.Layer.extend({
    space: null,
    objects: [],
    spriteSheet: null,
    map: null,
    mapIndex: 0,
    newMapIndex: 0,
    posX: 500,
    newPosX : 0,

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
        var start_body = new cp.StaticBody();
        start_body.setPos(cc.p(start.getContentSize().width / 2, 380 + SH.GROUND_HEIGHT));
        start.attr({x: 0, y: 0, anchorX: 0, anchorY: 0});
        var start_shape = new cp.BoxShape(start_body, start.getContentSize().width, 1);
        start_shape.setFriction(0.99);
        this.space.addShape(start_shape);

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
            var brick_length = Math.floor(Math.random() * 5) + 6;   //砖块数量随机
            var brick_type = 0;     //砖块类型
            //var newPosX = ( mapIndex == 0 ? 500 : posX + brick_length * SH.BRICK_WIDTH); //设置新地图的X
            var newPosX = posX;
            for (var i = 0; i < brick_length; i++) {
                brick_type = (i == brick_length - 1 ? 2 : Math.floor(Math.random() * 3)); //最后一个为2，其余随机
                var brick = new Brick(this.spriteSheet, this.space, newPosX + i * SH.BRICK_WIDTH, brick_type);
                var drop_y = SH.BRICK_HEIGHT + 100;
                // add drop
                if (brick_type == 2) {
                    var flag = Math.round(Math.random());
                    if (flag == 0) {
                        drop_y = SH.BRICK_HEIGHT + 100 + SH.BRICK_MOVE.V;
                    } else {
                        drop_y = SH.BRICK_HEIGHT + 100 - SH.BRICK_MOVE.V;
                    }
                }
                var drop = new Drop(this.spriteSheet, this.space, cc.p(newPosX + i * SH.BRICK_WIDTH, drop_y));
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
            this.posX = newPosX;
            this.newPosX = newPosX + brick_length * SH.BRICK_WIDTH;

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

    dropObjectByShape: function (shape) {
        for (var i = 0; i < this.objects.length; i++) {
            if (this.objects[i].getShape() == shape) {

            }
        }
    },

    checkAndReload: function (eyeX) {
        //cc.log(eyeX);
        if (eyeX >= this.posX) {
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
        if (this.newMapIndex > 1)
            this.removeObjects(this.newMapIndex - 2);
        this.mapIndex = this.newMapIndex;
        return true;
    },

    update: function (dt) {
        var animationLayer = this.getParent().getChildByTag(SH.LAYER_TAG.ANIMATION);
        var eyeX = animationLayer.getEyeX();
        this.checkAndReload(eyeX);
    }
});