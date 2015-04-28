var res = {

    //mainMenu

    MMBg_png: "res/bg_spr.png",
    MMBg_plist: "res/bg_spr.plist",
    MMTitle_png: "res/MMTitle.png",
    MMButtons_plist: "res/buttons.plist",
    MMButtons_png: "res/buttons.png",
    //gamePlay
    GPBuildingB_png: "res/GPBuildingB.png",
    GPBuildingF_png: "res/GPBuildingF.png",
    Obj_plist: "res/obj_spr.plist",
    Obj_png: "res/obj_spr.png",

    //setting
    STBtn_png: "res/setting_spr.png",
    STBtn_plist: "res/setting_spr.plist",

    //store
    Role_plist:"res/role_spr.plist",
    Role_png:"res/role_spr.png",

    //config
    charmap_fnt: "res/font.fnt",
    charmap_png: "res/font.png",

    // sound
    Click_ogg: "res/sound/click.ogg",
    Coin_ogg: "res/sound/coin.ogg",
    Drop_ogg: "res/sound/drop.ogg",
    Fly_ogg: "res/sound/fly.ogg",
    Over_ogg: "res/sound/over.ogg",
    Play_mp3: "res/sound/play.mp3"

};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
