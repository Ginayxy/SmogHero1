/**
 * Created by yuxinyu_91 on 4/24.
 */

var GamePlayLayer = cc.Layer.extend({

    ctor: function () {
        this._super();
        this.init();
    },
    init: function(){
        var bg = new cc.LayerGradient(cc.color(246, 237, 213), cc.color(196, 196, 196), cc.p(0, 1));
        bg.ignoreAnchorPointForPosition(false);
        bg.attr({x: size.width / 2, y: size.height / 2, anchorX: 0.5, anchorY: 0.5});
        bg.changeWidth(800);
        bg.changeHeight(1136);
        this.addChild(bg);
        cc.container

    }
});

var GamePlayScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new MainMenuLayer();
        this.addChild(layer);
    }
});