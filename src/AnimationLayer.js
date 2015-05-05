/**
 * Created by yuxinyu_91 on 4/24.
 */

var AnimationLayer = cc.Layer.extend({
    space: null,
    spriteSheet: null,
    _state: null,
    _hero_spr: null,
    _hero_body: null,
    _hero_shape: null,
    _hero_state: null,

    jumpUpAction: null,
    jumpDownAction: null,
    flyAction: null,

    ctor: function (space) {
        this._super();
        this.space = space;
        this.init();
        //开启chipmunk调试模式
        this._debugNode = new cc.PhysicsDebugNode(this.space);
        this._debugNode.setVisible(true);
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
        SH.HERO_START_X = size.width/2 - 100;

        // 角色 添加物理引擎
        this._hero_spr = new cc.PhysicsSprite("#role_" + SH.ROLE + "_0.png");
        var contentSize = this._hero_spr.getContentSize();
        // 初始化 body
        this._hero_body = new cp.Body(1, cp.momentForBox(1, contentSize.height, contentSize.height));
        this._hero_body.p = cc.p(SH.HERO_START_X, 508 + contentSize.height / 2);
        this.space.addBody(this._hero_body);
        // 初始化 shape
        this._hero_shape = new cp.BoxShape(this._hero_body, contentSize.height, contentSize.height);
        this._hero_shape.setCollisionType(SH.SPRITE_TAG.HERO);
        this.space.addShape(this._hero_shape);
        this._hero_spr.setBody(this._hero_body);
        // 加入至spriteSheet
        this.spriteSheet.addChild(this._hero_spr);
        this._hero_body.data = this._hero_spr;

        // 触摸监听事件 TOUCH_ONE_BY_ONE
        if( 'touches' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: this.onTouchBegan,
                onTouchEnded: this.onTouchEnded
            }, this);
        } else {
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: this.onTouchBegan,
                onMouseUp: this.onTouchEnded
            }, this);
        }

        // 计时器
        this.scheduleUpdate();
    },
    onExit: function () {
        this.jumpUpAction.release();
        this.jumpDownAction.release();
        this.flyAction.release();
        this._super();
    },
    onTouchBegan: function (event) {
        cc.log("onTouchBegan");
        event.getCurrentTarget().jump();
    },
    onTouchEnded: function (event) {
        cc.log("onTouchEnd");
        if (this._hero_state == SH.HERO_STATE.FLY) {
            this._hero_body.resetForces();
        }
    },

    initAction: function () {
        // 初始化动画 jumpUpAction setRestoreOriginalFrame默认false 所以不设置
        var animFrames = [];
        for (var i = 0; i < 3; i++) {
            var str = "role_" + SH.ROLE + "_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        var animation = new cc.Animation(animFrames, 0.1);
        this.jumpUpAction = new cc.Animate(animation);
        this.jumpUpAction.retain();

        // 初始化动画 jumpDownAction
        animFrames.reverse();   // 数组逆序
        animation = new cc.Animation(animFrames, 0.1);
        this.jumpDownAction = new cc.Animate(animation);
        this.jumpDownAction.retain();
    },
    jump: function () {
        // 跳跃 1.STOP状态下执行跳跃（向上冲力） 2.JUMP状态下浮空（向上浮力）
        if (this._hero_state == SH.HERO_STATE.STOP) {
            this._hero_body.applyImpulse(cp.v(150, 400), cp.v(0, 0));
            this._hero_state = SH.HERO_STATE.JUMP;
            this._hero_spr.stopAllActions();
            this._hero_spr.runAction(this.jumpUpAction);
            if (SH.SOUND) {
                cc.audioEngine.playEffect(sound_res.Jump_eff);
            }
        } else if (this._hero_state == SH.HERO_STATE.JUMP) {
            this._hero_state = SH.HERO_STATE.FLY;
            this._hero_body.applyForce(cp.v(0, 220), cp.v(0, 0));
        }
    },

    update: function (dt) {

        // 更新角色状态
        var vel = this._hero_body.getVel();
        if (this._hero_state == SH.HERO_STATE.JUMP || this._hero_state == SH.HERO_STATE.FLY) {
            if (vel.y == 0) {
                this._hero_state = SH.HERO_STATE.STOP;
                this._hero_spr.stopAllActions();
                this._hero_spr.runAction(this.jumpDownAction);
            }
        } else if (this._hero_state == SH.HERO_STATE.STOP) {
            this._hero_body.setVel(cp.v(0, 0));
            this._hero_body.resetForces();
        }
    },

    onPause: function () {

    },

    // 计算角色的偏移
    getEyeX: function () {
        return this._hero_spr.getPositionX() - SH.HERO_START_X;
    }
});