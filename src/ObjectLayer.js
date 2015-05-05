/**
 * Created by asus on 2015/5/5.
 */
/**
 * Created by asus on 2015/4/23.
 */
var ObjectLayer = cc.Layer.extend({
    space:null,
    objects: null,
    spriteSheet: null,
    buildingB: null,
    buildingF: null,

    ctor: function (space) {
        this._super();
        this.space = space;
        this.objects = [];
        this.init();
    },

    init:function(){
        size = cc.director.getWinSize();

        // Obj BatchNode
        cc.spriteFrameCache.addSpriteFrames(res.Obj_plist);
        this.spriteSheet = new cc.SpriteBatchNode(res.Obj_png);
        this.addChild(this.spriteSheet);

        //this.scheduleUpdate();
    },

    loadObjects:function (map, mapIndex) {
        // add coins
        var coinGroup = map.getObjectGroup("coin");
        var coinArray = coinGroup.getObjects();
        for (var i = 0; i < coinArray.length; i++) {
            var coin = new Coin(this.spriteSheet,
                this.space,
                cc.p(coinArray[i]["x"] + this.mapWidth * mapIndex,coinArray[i]["y"]));
            coin.mapIndex = mapIndex;
            this.objects.push(coin);
        }

        // add rock
        var rockGroup = map.getObjectGroup("rock");
        var rockArray = rockGroup.getObjects();
        for (var i = 0; i < rockArray.length; i++) {
            var rock = new Rock(this.spriteSheet,
                this.space,
                rockArray[i]["x"] + this.mapWidth * mapIndex);
            rock.mapIndex = mapIndex;
            this.objects.push(rock);
        }
    },

    removeObjects:function (mapIndex) {
        while((function (obj, index) {
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

    removeObjectByShape:function (shape) {
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