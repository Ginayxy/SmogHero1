
cc.game.onStart = function(){
    cc.view.adjustViewPort(true);
    var policy = new cc.ResolutionPolicy(cc.ContainerStrategy.PROPORTION_TO_FRAME, cc.ContentStrategy.FIXED_HEIGHT);
    cc.view.setDesignResolutionSize(800, 1136, policy);
    cc.view.resizeWithBrowserSize(true);
    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new MainMenuScene());
    }, this);
};
cc.game.run();
