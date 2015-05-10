/**
 * Created by asus on 2015/4/3.
 */
var BackgroundLayer = cc.Layer.extend({

    objects: null,
    spriteSheet: null,
    buildingB: null,
    buildingB_tmp: null,
    buildingF: null,
    buildingF_tmp: null,
    ground:null,
    ground_tmp:null,
    countF: 1,
    countB: 1,
    countG: 1,

    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {
        // bg
        var bg = new cc.LayerGradient(cc.color(246, 237, 213), cc.color(196, 196, 196), cc.p(0, 1));
        bg.ignoreAnchorPointForPosition(false);
        bg.attr({x: size.width / 2, y: size.height / 2, anchorX: 0.5, anchorY: 0.5});
        bg.changeWidth(800);
        bg.changeHeight(1136);
        this.addChild(bg);

        // add buildingB buldingF
        this.buildingB = new cc.Sprite(res.GPBuildingB_png);
        this.buildingB_tmp = new cc.Sprite(res.GPBuildingB_png);
        this.buildingB.attr({x: 0, y: 0, anchorX: 0, anchorY: 0});
        this.buildingB_tmp.attr({x: SH.B_WIDTH, y: 0, anchorX: 0, anchorY: 0});
        this.buildingF = new cc.Sprite(res.GPBuildingF_png);
        this.buildingF_tmp = new cc.Sprite(res.GPBuildingF_png);
        this.buildingF.attr({x: 0, y: 0, anchorX: 0, anchorY: 0});
        this.buildingF_tmp.attr({x: SH.F_WIDTH, y: 0, anchorX: 0, anchorY: 0});
        this.ground = new cc.Sprite(res.GPGround_png);
        this.ground_tmp = new cc.Sprite(res.GPGround_png);
        this.ground.attr({x: 0, y: SH.G_Y, anchorX: 0, anchorY: 0});
        this.ground_tmp.attr({x: SH.G_WIDTH, y: SH.G_Y, anchorX: 0, anchorY: 0});
        this.addChild(this.buildingB, 1);
        this.addChild(this.buildingB_tmp, 1);
        this.addChild(this.buildingF, 2);
        this.addChild(this.buildingF_tmp, 2);
        this.addChild(this.ground, 3);
        this.addChild(this.ground_tmp, 3);

        this.scheduleUpdate();
    },

    update: function (dt) {
        var animationLayer = this.getParent().gameLayer.getChildByTag(SH.LAYER_TAG.ANIMATION);
        var eyeX = animationLayer.getEyeX();
        this.buildingF.setPosition(cc.p(-eyeX / 2 + (this.countF - 1) * SH.F_WIDTH, 0));
        this.buildingF_tmp.setPosition(cc.p(-eyeX / 2 + this.countF * SH.F_WIDTH, 0));
        this.buildingB.setPosition(cc.p(-eyeX / 3 + (this.countB - 1) * SH.B_WIDTH, 0));
        this.buildingB_tmp.setPosition(cc.p(-eyeX / 3 + this.countB * SH.B_WIDTH, 0));
        this.ground.setPosition(cc.p(-eyeX + (this.countG - 1) * SH.G_WIDTH, SH.G_Y));
        this.ground_tmp.setPosition(cc.p(-eyeX + this.countG * SH.G_WIDTH, SH.G_Y));
        //cc.log("F:"+this.buildingF.getPositionX()+", F_tmp:"+this.buildingF_tmp.getPositionX());

        // 背景1滚动拼接
        var f = -this.buildingF.getPositionX();
        if (f > SH.F_WIDTH) {
            var temp_f = null;
            this.countF += 1;
            temp_f = this.buildingF;
            this.buildingF = this.buildingF_tmp;
            this.buildingF_tmp = temp_f;
        }

        // 背景2滚动拼接
        var b = -this.buildingB.getPositionX();
        if (b > SH.B_WIDTH) {
            var temp_b = null;
            this.countB += 1;
            temp_b = this.buildingB;
            this.buildingB = this.buildingB_tmp;
            this.buildingB_tmp = temp_b;
        }

        // 背景3滚动拼接
        var g = -this.ground.getPositionX();
        if (g > SH.G_WIDTH) {
            var temp_g = null;
            this.countG += 1;
            temp_g = this.ground;
            this.ground = this.ground_tmp;
            this.ground_tmp = temp_g;
        }
    }

});