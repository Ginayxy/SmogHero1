/**
 * Created by yuxinyu on 4/13.
 */
var ShopLayer = cc.Layer.extend({
    _cloud1: null,
    _cloud2: null,
    _flag: 1,
    batman:null,
    superman:null,
    menu: null,

    ctor: function () {
        this._super();
        this.init();
        this.initEvent();
    },

    init: function () {
        size = cc.director.getWinSize();
        cc.spriteFrameCache.addSpriteFrames(res.MMBg_plist);
        cc.spriteFrameCache.addSpriteFrames(res.STBtn_plist);
        cc.spriteFrameCache.addSpriteFrames(res.Obj_plist);
        // 背景
        var bg = new cc.LayerGradient(cc.color(255, 252, 209), cc.color(172, 255, 250), cc.p(0, 1));
        bg.ignoreAnchorPointForPosition(false);
        bg.attr({x: size.width / 2, y: size.height / 2, anchorX: 0.5, anchorY: 0.5});
        bg.changeWidth(800);
        bg.changeHeight(1136);
        this.addChild(bg, 0);

        var title = new cc.Sprite('#title_store.png');
        title.setPosition(size.width / 2, 1000);
        this.addChild(title, 0);

        var buildings = new cc.Sprite('#buildings.png');
        buildings.attr({x: size.width / 2, y: -200, anchorX: 0.5, anchorY: 0});
        this.addChild(buildings, 0);

        this._cloud1 = new cc.Sprite('#bg_cloud1.png');
        this._cloud2 = new cc.Sprite('#bg_cloud2.png');
        this._cloud1.setPosition(size.width / 2 - 300, 780);
        this._cloud2.setPosition(size.width / 2 + 320, 640);
        this.addChild(this._cloud1);
        this.addChild(this._cloud2);
        this.schedule(function () {
            this._flag = -this._flag;
            this._cloud1.runAction(cc.moveBy(2, cc.p(50 * this._flag, 0)));
            this._cloud2.runAction(cc.moveBy(2, cc.p((-50) * this._flag, 0)));
        }, 2, cc.REPEAT_FOREVER, 1);


        var dropsBar = new cc.Sprite('#store_drops.png');
        dropsBar.setPosition(size.width / 2, 800);
        this.addChild(dropsBar);

        var drops = SH.TOTAL_DROP?SH.TOTAL_DROP:"0";
        var over_txt = new cc.LabelBMFont(drops, res.charmap_fnt);
        over_txt.attr({
            x: size.width / 2+50,
            y: 800,
            anchorX: 0.5,
            anchorY: 0.5,
            scale: 1,
            color: cc.color(139, 69, 19)
        });
        this.addChild(over_txt,1);

        var str1 = '#store_batman_n.png';
        var str2 = '#store_superman_buy.png';
        if(SH.ROLE == SH.ROLE_NAME.SUPERMAN){
            str1 = '#store_batman.png';
            str2 = '#store_superman_n.png';
        }else if(SH.BUYED){
            str2 = '#store_superman.png';
        }
        this.batman = new cc.Sprite(str1);
        this.superman = new cc.Sprite(str2);
        this.batman.setPosition(size.width / 2 - 150, 550);
        this.superman.setPosition(size.width / 2 + 150, 550);
        this.addChild(this.batman);
        this.addChild(this.superman);

        // 菜单
        var home_btn = new cc.MenuItemImage('#icon_home.png', '#icon_home_n.png', this.onBack, this);
        home_btn.setPosition(size.width - 100, 100);
        this.menu = new cc.Menu(home_btn);
        this.menu.setPosition(0, 0);
        this.addChild(this.menu, 10);

        return true;
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
                    cc.log("x:"+pos.x+" y:"+pos.y);
                    target.onSelect(target, pos);
                }
            }, this);
        } else {
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: function (event) {
                    var target = event.getCurrentTarget();
                    var pos = event.getLocation();
                    cc.log("x:"+pos.x+" y:"+pos.y);
                    target.onSelect(target, pos);
                }
            }, this);
        }
    },

    onSelect:function(target, pos){
        if (pos.y < 650 && pos.y > 450) {
            if (pos.x < size.width / 2 - 50 && pos.x > size.width / 2 - 250) {
                target.onPlayEffect();
                if(SH.ROLE == SH.ROLE_NAME.BATMAN){
                    target.addNewLayer(SH.SHOP.PLAY);
                }else{
                    SH.ROLE = SH.ROLE_NAME.BATMAN;
                    var frame = cc.spriteFrameCache.getSpriteFrame('store_batman_n.png');
                    this.batman.setSpriteFrame(frame);
                    frame = cc.spriteFrameCache.getSpriteFrame('store_superman.png');
                    this.superman.setSpriteFrame(frame);
                }
            } else if (pos.x > size.width / 2 + 50 && pos.x < size.width / 2 + 250) {
                target.onPlayEffect();
                if(SH.ROLE != SH.ROLE_NAME.SUPERMAN){
                    if(SH.BUYED){
                        SH.ROLE == SH.ROLE_NAME.SUPERMAN;
                        var frame = cc.spriteFrameCache.getSpriteFrame('store_superman_n.png');
                        this.superman.setSpriteFrame(frame);
                        var frame = cc.spriteFrameCache.getSpriteFrame('store_batman.png');
                        this.batman.setSpriteFrame(frame);
                    }else{
                        if(SH.TOTAL_DROP>499){
                            target.addNewLayer(SH.SHOP.BUY);
                        }else{
                            alert("您还没有足够的水滴~");
                        }
                    }
                }else{
                    this.addNewLayer(SH.SHOP.PLAY);
                }
            }
        }
    },
    onBack: function () {
        if(SH.SOUND){
            var audioEngine = cc.audioEngine;
            audioEngine.playEffect(sound_res.Click_eff);
        }
        var scene = new MainMenuScene();
        cc.director.runScene(new cc.TransitionFade(0.5,scene));
    },

    addNewLayer: function (type) {
        this.pause();
        this.menu.setEnabled(false);
        var layer = new ShopPopLayer(type);
        this.addChild(layer,11);
    },

    onPlayEffect: function(){
        var audioEngine = cc.audioEngine;
        if (SH.SOUND) {
            audioEngine.playEffect(sound_res.Click_eff);
        }
    },

    setMenuEnable: function(enable){
        this.menu.setEnabled(true);
    }
});

var ShopScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new ShopLayer();
        this.addChild(layer);
    }
});
