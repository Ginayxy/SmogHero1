/**
 * Created by yuxinyu on 2015/5/2.
 */
var Drop = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,

    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor:function (spriteSheet, space, pos) {
        this.space = space;
        //初始化水滴
        this.sprite = new cc.PhysicsSprite("#obj_drop.png");

        // init physics
        var radius = 0.95 * this.sprite.getContentSize().width / 2;
        var body = new cp.StaticBody();
        body.setPos(pos);
        this.sprite.setBody(body);

        this.shape = new cp.CircleShape(body, radius, cp.vzero);
        this.shape.setCollisionType(SpriteTag.coin);
        //Sensors only call collision callbacks, and never generate real collisions
        this.shape.setSensor(true);

        this.space.addStaticShape(this.shape);

        // add sprite to sprite sheet
        this.sprite.runAction(action);
        spriteSheet.addChild(this.sprite, 1);
    },

    removeFromParent:function () {
        this.space.removeStaticShape(this.shape);
        this.shape = null;
        this.sprite.removeFromParent();
        this.sprite = null;
    },

    getShape:function () {
        return this.shape;
    }
});