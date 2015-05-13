/**
 * Created by yuxinyu_91 on 4/24.
 */

var AnimationLayer = cc.Layer.extend({
    space: null,
    spriteSheet: null,
    _hero_spr: null,
    _hero_body: null,
    _hero_shape: null,
    _hero_state: null,

    jumpUpAction: null,
    jumpDownAction: null,
    colliSprite: null,


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
        SH.TMPSCORE = 0;
        SH.STATE = SH.GAME_STATE.PLAY;
        this._hero_state = SH.HERO_STATE.STOP;
        //SH.HERO_START_X = size.width / 2 - 200;

        // 角色 添加物理引擎
        this._hero_spr = new cc.PhysicsSprite("#role_" + SH.ROLE + "_0.png");
        var contentSize = this._hero_spr.getContentSize();
        // 初始化 body
        this._hero_body = new cp.Body(1, cp.momentForBox(1, contentSize.width - 40, contentSize.height));
        this._hero_body.p = cc.p(SH.HERO_START_X, 508 + contentSize.height / 2);
        this.space.addBody(this._hero_body);
        // 初始化 shape
        this._hero_shape = new cp.BoxShape(this._hero_body, contentSize.width - 40, contentSize.height);

        this._hero_shape.setCollisionType(SH.SPRITE_TAG.HERO);
        this._hero_shape.setFriction(0.99);
        this._hero_shape.setElasticity(0);
        this.space.addShape(this._hero_shape);
        this._hero_spr.setBody(this._hero_body);
        // 加入至spriteSheet
        this.spriteSheet.addChild(this._hero_spr);
        this._hero_body.data = this._hero_spr;

        // 触摸监听事件 TOUCH_ONE_BY_ONE
        if ('touches' in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    if (touch.getLocationX() > 140 || touch.getLocationY() < 1000) {
                        event.getCurrentTarget().jump();
                    } else {
                        return false;
                    }
                },
                onTouchEnded: function (touch, event) {
                    if (event.getCurrentTarget()._hero_state == SH.HERO_STATE.FLY) {
                        event.getCurrentTarget()._hero_body.resetForces();
                        event.getCurrentTarget()._hero_state = SH.HERO_STATE.JUMPDOWN;
                    }
                }
            }, this);
        } else {
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: function (event) {
                    if (event.getLocationX() > 140 || event.getLocationY() < 1000) {
                        event.getCurrentTarget().jump();
                    } else {
                        return false;
                    }
                },
                onMouseUp: function (event) {
                    //cc.log("onMouseUp, " + event.getCurrentTarget()._hero_state);
                    if (event.getCurrentTarget()._hero_state == SH.HERO_STATE.FLY) {
                        event.getCurrentTarget()._hero_body.resetForces();
                        event.getCurrentTarget()._hero_state = SH.HERO_STATE.JUMPDOWN;
                    }
                }
            }, this);
        }

        // 计时器
        this.scheduleUpdate();
    },
    onExit: function () {
        this.jumpUpAction.release();
        this.jumpDownAction.release();
        this._super();
    },

    initAction: function () {
        // 初始化动画 jumpUpAction setRestoreOriginalFrame默认false 所以不设置
        var animFrames1 = [];
        for (var i = 0; i < 3; i++) {
            var str1 = "role_" + SH.ROLE + "_" + i + ".png";
            var frame1 = cc.spriteFrameCache.getSpriteFrame(str1);
            animFrames1.push(frame1);
        }
        var animation1 = new cc.Animation(animFrames1, 0.1);
        this.jumpUpAction = new cc.Animate(animation1);
        this.jumpUpAction.retain();

        // 初始化动画 jumpDownAction
        var animFrames2 = [];
        for (var i = 1; i > -1; i--) {
            var str2 = "role_" + SH.ROLE + "_" + i + ".png";
            var frame2 = cc.spriteFrameCache.getSpriteFrame(str2);
            animFrames2.push(frame2);
        }
        var animation2 = new cc.Animation(animFrames2, 0.13);
        this.jumpDownAction = new cc.Animate(animation2);
        this.jumpDownAction.retain();
    },
    jump: function () {
        // 跳跃 1.STOP状态下执行跳跃（向上冲力） 2.JUMP状态下浮空（向上浮力）
        if (this._hero_state == SH.HERO_STATE.STOP) {
            this._hero_state = SH.HERO_STATE.JUMPUP;
            SH.HERO_STAND = false;
            this._hero_body.applyImpulse(cp.v(180, 850), cp.v(0, 0));
            this._hero_spr.stopAllActions();
            this._hero_spr.runAction(this.jumpUpAction);
            if (SH.SOUND) {
                cc.audioEngine.playEffect(sound_res.Jump_eff);
            }
        } else if (this._hero_state == SH.HERO_STATE.JUMPUP) {
            this._hero_state = SH.HERO_STATE.FLY;
            this._hero_body.applyForce(cp.v(0, 500), cp.v(0, 0));
        }
    },

    update: function (dt) {
        // 更新角色状态
        var vel = this._hero_body.getVel();
        this._hero_body.setAngle(0);
        this._hero_body.setAngVel(0);
        //if (vel.x != 0 || vel.y != 0)
        //    cc.log("x: " + vel.x + ", y: " + vel.y);
        if (this._hero_state == SH.HERO_STATE.JUMPUP || this._hero_state == SH.HERO_STATE.FLY) {
            if (vel.y < -1) {
                this._hero_state = SH.HERO_STATE.JUMPDOWN;
            }
        } else if (this._hero_state == SH.HERO_STATE.JUMPDOWN || this._hero_state == SH.HERO_STATE.FLY) {
            if (vel.y == 0 || SH.HERO_STAND) {
                this._hero_spr.stopAllActions();
                this._hero_spr.runAction(this.jumpDownAction);
                this._hero_body.resetForces();
                this._hero_state = SH.HERO_STATE.STOP;
            }
        } else if (this._hero_state == SH.HERO_STATE.STOP) {
            if (this.colliSprite&&SH.HERO_STAND){
                var p = this.colliSprite.getPosition();
                var h = this._hero_body.getPos();
                this._hero_body.setPos(cp.v(h.x, p.y+95));
            }
            this._hero_body.setVelX(0);
            this._hero_body.resetForces();
        }
    },

    // 计算角色的偏移
    getEyeX: function () {
        return this._hero_spr.getPositionX() - SH.HERO_START_X;
    },

    setColliSprite: function (sprite) {
        this.colliSprite = sprite;
    }
});