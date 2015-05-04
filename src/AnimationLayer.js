/**
 * Created by yuxinyu_91 on 4/24.
 */

var AnimationLayer = cc.Layer.extend({
    space:null,
    spriteSheet:null,
    _score_txt: null,
    _best_txt:null,
    _tmpScore: 0,
    _state: null,
    _hero_spr: null,
    _hero_body: null,
    _hero_shape: null,
    _hero_state:null,

    jumpAction:null,
    flyAction:null,

    ctor: function (space) {
        this._super();
        this.space = space;
        this.init();
        this._debugNode = new cc.PhysicsDebugNode(this.space);
        this._debugNode.setVisible(true);
        // Parallax ratio and offset
        this.addChild(this._debugNode, 10);
    },
    init: function () {
        size = cc.director.getWinSize();
        cc.spriteFrameCache.addSpriteFrames(res.Role_plist);
        cc.spriteFrameCache.addSpriteFrames(res.Obj_plist);
        // create sprite sheet
        this.spriteSheet = new cc.SpriteBatchNode(res.Role_png);
        this.addChild(this.spriteSheet);
        this.initAction();

        // 重置全局变量
        //SH.SCORE = 0;
        this._state = SH.GAME_STATE.PLAY;
        this._hero_state = SH.HERO_STATE.STOP;

        // 状态层
        var pause_btn = new cc.MenuItemImage('#icon_pause.png', '#icon_pause_n.png', this.onPause, this);
        pause_btn.attr({x: 100, y: SH.MUD_Y, scale: SH.SCALE});
        var pause_menu = new cc.Menu(pause_btn);
        pause_menu.setPosition(0, 0);
        this.addChild(pause_menu, 1000);
        var drop_icon = new cc.Sprite("#icon_drops_n.png");
        drop_icon.attr({x: size.width - 230, y: SH.MUD_Y, scale: SH.SCALE});
        this.addChild(drop_icon, 1000);
        this._score_txt = new cc.LabelBMFont("0", res.charmap_fnt);
        this._score_txt.attr({x: size.width - 75, y: SH.MUD_Y, anchorX:1, anchorY:0.1, scale: SH.SCALE, color:cc.color(255, 255, 255)});
        this.addChild(this._score_txt, 1000);
        this._best_txt = new cc.LabelBMFont("BEST: "+SH.SCORE, res.charmap_fnt);
        this._best_txt.attr({x: size.width - 75, y: SH.MUD_Y - 22, anchorX:1, anchorY:1, scale: 0.3, color:cc.color(255, 255, 255)});
        this.addChild(this._best_txt, 1000);

        // 角色 添加物理引擎
        this._hero_spr = new cc.PhysicsSprite("#role_"+SH.ROLE+"_0.png");
        var contentSize = this._hero_spr.getContentSize();
        // init body
        this._hero_body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height));
        this._hero_body.p = cc.p(SH.HERO_START_X - 100, 508 + contentSize.height / 2);
        //this._hero_body.applyImpulse(cp.v(150, 0), cp.v(0, 0));//run speed
        this.space.addBody(this._hero_body);
        //init shape
        this._hero_shape = new cp.BoxShape(this._hero_body, contentSize.width, contentSize.height);
        this.space.addShape(this._hero_shape);
        this._hero_spr.setBody(this._hero_body);
        //this._hero_spr.runAction(this.runningAction);

        this.spriteSheet.addChild(this._hero_spr);


        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan
        }, this);

        // 计时器
        this.scheduleUpdate();
    },
    onExit:function() {
        this.jumpAction.release();
        this.flyAction.release();
        this._super();
    },
    initAction:function () {
        // init runningAction
        var animFrames = [];
        // num equal to spriteSheet
        for (var i = 0; i < 3; i++) {
            var str = "role_"+SH.ROLE+"_"+ i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        //TODO: gai!!!
        var animation = new cc.Animation(animFrames, 0.1);
        this.runningAction = new cc.RepeatForever(new cc.Animate(animation));
        this.runningAction.retain();

        // init jumpUpAction
        animFrames = [];
        for (var i = 0; i < 4; i++) {
            var str = "runnerJumpUp" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }

        animation = new cc.Animation(animFrames, 0.2);
        this.jumpUpAction = new cc.Animate(animation);
        this.jumpUpAction.retain();

        // init jumpDownAction
        animFrames = [];
        for (var i = 0; i < 2; i++) {
            var str = "runnerJumpDown" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }

        animation = new cc.Animation(animFrames, 0.3);
        this.jumpDownAction = new cc.Animate(animation);
        this.jumpDownAction.retain();
    },


    onTouchBegan: function(){
        if(this._hero_state == SH.HERO_STATE.STOP){
            this._hero_state = SH.HERO_STATE.JUMP;
            //var jump1 =
            var jump2 = new cc.JumpBy(2, cc.p(300, 0), 50, 4);
            this._hero_spr.runAction(jump2);
        }else if(this._hero_state == SH.HERO_STATE.JUMP){
            this._hero_state = SH.HERO_STATE.FLY;
        }

    },

    update:function (dt) {
        if (this._state == SH.GAME_STATE.PLAY) {
            //this.checkIsCollide();
            //this.removeInactiveUnit(dt);
            //this.checkIsReborn();
            this.updateUI();
            //this._movingBackground(dt);
        }
    },

    onPause: function () {

    },

    updateUI:function () {
        if (this._tmpScore > SH.SCORE) {
            SH.SCORE += 1;
        }
        this._score_txt.setString(this._tmpScore);
        this._best_txt.setString("BEST: " + SH.SCORE);
    },

    // 计算角色的偏移
    getEyeX: function(){
        return this._hero_spr.getPositionX() - SH.HERO_START_X;
    }
});