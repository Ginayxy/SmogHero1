/**
 * Created by asus on 2015/5/17.
 */
var ShopPopLayer = cc.Layer.extend({
    option: null,
    button: null,
    str1: null,
    str2: null,
    flag: false,

    ctor: function (option) {
        this._super();
        this.option = option;
        this.init();
        this.initEvent();
    },

    init: function () {
        size = cc.director.getWinSize();
        // bg
        var mask = new cc.LayerColor(cc.color(0, 0, 0, 100), 800, 1136);
        mask.ignoreAnchorPointForPosition(false);
        mask.attr({x: size.width / 2, y: size.height / 2, anchorX: 0.5, anchorY: 0.5});
        this.addChild(mask);
        // button
        if (this.option == SH.SHOP.BUY) {
            this.str1 = 'store_get.png';
            this.str2 = 'store_get_n.png';
        } else {
            this.str1 = 'store_play.png';
            this.str2 = 'store_play_n.png';
        }
        this.button = new cc.Sprite('#'+this.str1);
        this.button.setPosition(size.width / 2, size.height / 2);
        this.addChild(this.button, 10);
    },

    initEvent: function () {
        // 触摸监听事件 TOUCH_ONE_BY_ONE
        if ('touches' in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    var target = event.getCurrentTarget();
                    var pos = touch.getLocation();
                    target.onClick(target, pos);
                },
                onTouchEnded: function (touch, event) {
                    var target = event.getCurrentTarget();
                    var pos = touch.getLocation();
                    target.onClickEnd(target, pos);
                }
            }, this);
        } else {
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: function (event) {
                    var target = event.getCurrentTarget();
                    var pos = event.getLocation();
                    target.onClick(target, pos);
                },
                onMouseUp: function (event) {
                    var target = event.getCurrentTarget();
                    var pos = event.getLocation();
                    target.onClickEnd(target, pos);
                }
            }, this);
        }
    },

    onClick: function (target, pos) {
        var audioEngine = cc.audioEngine;
        if (SH.SOUND) {
            audioEngine.playEffect(sound_res.Click_eff);
        }
        target.flag = true;
        if (pos.x < size.width / 2 + 192 && pos.x > size.width / 2 - 192 && pos.y > size.height / 2 - 50 && pos.y < size.height / 2 + 50) {
            var frame = cc.spriteFrameCache.getSpriteFrame(target.str2);
            target.button.setSpriteFrame(frame);
            if ('touches' in cc.sys.capabilities){
                    this.onClickEnd(target, pos);
            }
        } else {
            target.getParent().resume();
            target.getParent().setMenuEnable(true);
            target.removeFromParent();
        }
    },

    onClickEnd: function (target, pos) {
        if (!target.flag){
            return false;
        }
        if (pos.x < size.width / 2 + 192 && pos.x > size.width / 2 - 192 && pos.y > size.height / 2 - 50 && pos.y < size.height / 2 + 50) {
            if (target.option == SH.SHOP.BUY) {
                SH.BUYED = true;
                SH.ROLE = SH.ROLE_NAME.SUPERMAN;
                var scene = new ShopScene();
                cc.director.runScene(scene);
            } else {
                var gameplay = new GamePlayScene();
                cc.director.runScene(gameplay);
            }
        }else{
            var frame = cc.spriteFrameCache.getSpriteFrame(target.str1);
            target.button.setSpriteFrame(frame);
        }
    }
});