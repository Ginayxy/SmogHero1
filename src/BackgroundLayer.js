/**
 * Created by asus on 2015/4/23.
 */
var BackgroundLayer = cc.Layer.extend({
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
        // bg
        var bg = new cc.LayerGradient(cc.color(246, 237, 213), cc.color(196, 196, 196), cc.p(0, 1));
        bg.ignoreAnchorPointForPosition(false);
        bg.attr({x: size.width / 2, y: size.height / 2, anchorX: 0.5, anchorY: 0.5});
        bg.changeWidth(800);
        bg.changeHeight(1136);
        this.addChild(bg);

        // add buildingB buldingF
        this.buildingB = new cc.Sprite(res.GPBuildingB_png);
        this.buildingF = new cc.Sprite(res.GPBuildingF_png);
        this.buildingB.attr({x: 0, y: 0, anchorX: 0, anchorY: 0});
        this.buildingF.attr({x: 0, y: 0, anchorX: 0, anchorY: 0});
        this.addChild(this.buildingB, 1);
        this.addChild(this.buildingF, 1);

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