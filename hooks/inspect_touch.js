Java.perform(function() {
    console.log("[*] Checking InteractiveDrawableContainer touch handling...");

    var containerCls = Java.use("com.instagram.ui.widget.interactive.InteractiveDrawableContainer");
    var methods = containerCls.class.getDeclaredMethods();
    for (var i = 0; i < methods.length; i++) {
        var m = methods[i];
        var mName = m.getName();
        if (mName.toLowerCase().indexOf("touch") !== -1 ||
            mName.toLowerCase().indexOf("drag") !== -1 ||
            mName.toLowerCase().indexOf("gesture") !== -1 ||
            mName.toLowerCase().indexOf("target") !== -1 ||
            mName.toLowerCase().indexOf("lock") !== -1 ||
            mName.toLowerCase().indexOf("pin") !== -1) {
            console.log("  " + mName + " : " + m.getReturnType().getName());
        }
    }
});
